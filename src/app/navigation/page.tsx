"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Site } from "@/types/sites";
import type { Group } from "@/types/groups";
import type { GroupWithSites } from "@/types/type";
import ThemeToggle from "@/components/ThemeToggle";
import GroupCard from "@/components/GroupCard";
import UserAuthHeader from "@/components/UserAuthHeader";
import "./page.css";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableGroupItem from "@/components/SortableGroupItem";
// Material UI 导入
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Stack,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import AppNotificationHandler from "@/components/Notification";
import GitHubPager from "./githubPager";
import { useSnackbar } from "@/hooks/useSnackbar";
import { useDialog } from "@/hooks/useModal";
import ImportData from "./importData";
import SiteSettings from "./siteSettings";
import AddSites from "./addSites";
import AddGroups from "./addGroups";
import { SortMode, DEFAULT_CONFIGS } from "@/constant/const";
import { useTheme } from "@/hooks/useTheme";
import api from "@/app/services/api";

let appNotificationHandler: AppNotificationHandler | null = null;

function getNotificationHandler() {
  if (typeof window !== "undefined" && !appNotificationHandler) {
    appNotificationHandler = new AppNotificationHandler();
    appNotificationHandler.requestPermission();
  }
  return appNotificationHandler;
}

function App() {
  const router = useRouter();
  const { openDialog, closeDialog, dialogNode } = useDialog({
    maxWidth: "sm",
    fullWidth: true,
    PaperProps: {
      sx: {
        m: { xs: 2, sm: "auto" },
        width: { xs: "calc(100% - 32px)", sm: "auto" },
      },
    },
    onClose: () => closeDialog(),
  });

  const { openSnackbar, closeSnackbar, snackbarNode } = useSnackbar({
    autoHideDuration: 6000,
    anchorOrigin: { vertical: "top", horizontal: "center" },
    onClose: () => closeSnackbar(),
  });

  const { darkMode, theme, themeNode } = useTheme();

  const [groups, setGroups] = useState<GroupWithSites[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [sortMode, setSortMode] = useState<SortMode>(SortMode.None);
  const [currentSortingGroupId, setCurrentSortingGroupId] = useState<
    number | null
  >(null);

  // 配置状态
  const [configs, setConfigs] =
    useState<Record<string, string>>(DEFAULT_CONFIGS);

  // 认证检查
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.log("🔐 未检测到token，重定向到首页");
      router.push("/");
    } else {
      // 在后台加载数据，不阻塞UI
      fetchData(true);
    }
  }, [router]);

  // 配置传感器，支持鼠标、触摸和键盘操作
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1, // 降低激活阈值，使拖拽更敏感
        delay: 0, // 移除延迟
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100, // 降低触摸延迟
        tolerance: 3, // 降低容忍值
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 新增菜单状态
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(menuAnchorEl);

  const [isAuthRequired, setIsAuthRequired] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 处理错误的函数
  const handleError = (message: string) => {
    openSnackbar({
      children: (
        <Alert
          onClose={() => closeSnackbar()}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      ),
    });
  };

  // 处理正确的函数
  const handleSuccess = (message: string) => {
    openSnackbar({
      children: (
        <Alert
          onClose={() => closeSnackbar()}
          severity="success"
          variant="filled"
          sx={{
            width: "100%",
            whiteSpace: "pre-line",
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "#2e7d32" : undefined,
            color: (theme) =>
              theme.palette.mode === "dark" ? "#fff" : undefined,
            "& .MuiAlert-icon": {
              color: (theme) =>
                theme.palette.mode === "dark" ? "#fff" : undefined,
            },
          }}
        >
          {message}
        </Alert>
      ),
    });
  };

  // 菜单打开关闭
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // 登出功能
  const handleLogout = () => {
    api.logout();
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setGroups([]);
    handleMenuClose();
    handleError("已退出登录，正在跳转...");
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  // 加载配置
  const fetchConfigs = async () => {
    try {
      const configsData = await api.getConfigs();
      setConfigs({
        ...DEFAULT_CONFIGS,
        ...configsData,
      });
    } catch (error) {
      console.error("加载配置失败:", error);
      // 使用默认配置
    }
  };

  useEffect(() => {
    // 确保初始化时重置排序状态
    setSortMode(SortMode.None);
    setCurrentSortingGroupId(null);
  }, []);

  // 设置文档标题
  useEffect(() => {
    document.title = configs["site.title"] || "导航站";
  }, [configs]);

  // 应用自定义CSS
  useEffect(() => {
    const customCss = configs["site.customCss"];
    let styleElement = document.getElementById("custom-style");

    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = "custom-style";
      document.head.appendChild(styleElement);
    }

    // 添加安全过滤，防止CSS注入攻击
    const sanitizedCss = sanitizeCSS(customCss || "");
    styleElement.textContent = sanitizedCss;
  }, [configs]);

  // CSS安全过滤函数
  const sanitizeCSS = (css: string): string => {
    if (!css) return "";

    // 移除可能导致XSS的内容
    return (
      css
        // 移除包含javascript:的URL
        .replace(/url\s*\(\s*(['"]?)javascript:/gi, "url($1invalid:")
        // 移除expression
        .replace(/expression\s*\(/gi, "invalid(")
        // 移除import
        .replace(/@import/gi, "/* @import */")
        // 移除behavior
        .replace(/behavior\s*:/gi, "/* behavior: */")
        // 过滤content属性中的不安全内容
        .replace(
          /content\s*:\s*(['"]?).*?url\s*\(\s*(['"]?)javascript:/gi,
          "content: $1"
        )
    );
  };

  // 同步HTML的class以保持与现有CSS兼容
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const fetchData = async (isInitial: boolean = false) => {
    try {
      if (!isInitial) {
        setLoading(true);
      }
      const groupsData = await api.getGroups();

      // 获取每个分组的站点并确保id存在
      const groupsWithSites = await Promise.all(
        groupsData
          .filter((group) => group.id !== undefined) // 过滤掉没有id的分组
          .map(async (group) => {
            const sites = await api.getSites(group.id as number);
            return {
              ...group,
              id: group.id as number, // 确保id不为undefined
              sites,
            } as GroupWithSites;
          })
      );

      setGroups(groupsWithSites);
      if (isInitial) {
        setIsInitialLoad(false);
      }
    } catch (error) {
      console.error("加载数据失败:", error);
      handleError(
        "加载数据失败: " + (error instanceof Error ? error.message : "未知错误")
      );

      // 如果因为认证问题导致加载失败，处理认证状态
      if (error instanceof Error && error.message.includes("认证")) {
        setIsAuthRequired(true);
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  };

  // 更新站点
  const handleSiteUpdate = async (updatedSite: Site) => {
    try {
      if (updatedSite.id) {
        await api.updateSite(updatedSite.id, updatedSite);
        await fetchData(); // 重新加载数据
      }
    } catch (error) {
      console.error("更新站点失败:", error);
      handleError("更新站点失败: " + (error as Error).message);
    }
  };

  // 删除站点
  const handleSiteDelete = async (siteId: number) => {
    try {
      await api.deleteSite(siteId);
      await fetchData(); // 重新加载数据
    } catch (error) {
      console.error("删除站点失败:", error);
      handleError("删除站点失败: " + (error as Error).message);
    }
  };

  // 保存分组排序
  const handleSaveGroupOrder = async () => {
    try {
      console.log("保存分组顺序", groups);
      // 构造需要更新的分组顺序数据
      const groupOrders = groups.map((group, index) => ({
        id: group.id as number, // 断言id为number类型
        order_num: index,
      }));

      // 调用API更新分组顺序
      await api.updateGroupOrder(groupOrders);

      console.log("分组排序更新成功");
      // 重新获取最新数据
      await fetchData();

      setSortMode(SortMode.None);
      setCurrentSortingGroupId(null);
    } catch (error) {
      console.error("更新分组排序失败:", error);
      handleError("更新分组排序失败: " + (error as Error).message);
    }
  };

  // 保存站点排序
  const handleSaveSiteOrder = async (groupId: number, sites: Site[]) => {
    try {
      console.log("保存站点排序", groupId, sites);

      // 构造需要更新的站点顺序数据
      const siteOrders = sites.map((site, index) => ({
        id: site.id as number,
        order_num: index,
      }));

      // 调用API更新站点顺序
      await api.updateSiteOrder(siteOrders);

      console.log("站点排序更新成功");
      // 重新获取最新数据
      await fetchData();

      setSortMode(SortMode.None);
      setCurrentSortingGroupId(null);
    } catch (error) {
      console.error("更新站点排序失败:", error);
      handleError("更新站点排序失败: " + (error as Error).message);
    }
  };

  // 启动分组排序
  const startGroupSort = () => {
    console.log("开始分组排序");
    setSortMode(SortMode.GroupSort);
    setCurrentSortingGroupId(null);
  };

  // 启动站点排序
  const startSiteSort = (groupId: number) => {
    console.log("开始站点排序");
    setSortMode(SortMode.SiteSort);
    setCurrentSortingGroupId(groupId);
  };

  // 取消排序
  const cancelSort = () => {
    setSortMode(SortMode.None);
    setCurrentSortingGroupId(null);
  };

  // 处理拖拽结束事件
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = groups.findIndex(
        (group) => group.id.toString() === active.id
      );
      const newIndex = groups.findIndex(
        (group) => group.id.toString() === over.id
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        setGroups(arrayMove(groups, oldIndex, newIndex));
      }
    }
  };

  // 新增分组相关函数
  const handleOpenAddGroup = () => {
    openDialog({
      children: (
        <AddGroups
          handleClose={closeDialog}
          addGroupsSuccess={async () => {
            await fetchData();
          }}
          showSnackbarFail={(message: string) => {
            handleError(message);
          }}
          groups={groups}
        />
      ),
    });
  };

  // 新增站点相关函数
  const handleOpenAddSite = (groupId: number) => {
    openDialog({
      children: (
        <AddSites
          handleClose={closeDialog}
          addSitesSuccess={async () => {
            await fetchData();
          }}
          showSnackbarFail={(message: string) => {
            handleError(message);
          }}
          groupId={groupId}
        />
      ),
    });
  };

  // 配置相关函数
  const handleOpenConfig = () => {
    openDialog({
      PaperProps: {
        sx: {
          m: { xs: 2, sm: 3, md: 4 },
          width: {
            xs: "calc(100% - 32px)",
            sm: "80%",
            md: "70%",
            lg: "60%",
          },
          maxWidth: { sm: "600px" },
        },
      },
      children: (
        <SiteSettings
          handleClose={closeDialog}
          settingSuccess={async () => {
            // 刷新数据
            await fetchData();
            await fetchConfigs();
          }}
          showSnackbarMsg={(message: string) => {
            handleError(message);
          }}
        />
      ),
    });
  };

  // 处理导出数据
  const handleExportData = async () => {
    try {
      setLoading(true);

      // 提取所有站点数据为单独的数组
      const allSites: Site[] = [];
      groups.forEach((group) => {
        if (group.sites && group.sites.length > 0) {
          allSites.push(...group.sites);
        }
      });

      const exportData = {
        // 只导出分组基本信息，不包含站点
        groups: groups.map((group) => ({
          id: group.id,
          name: group.name,
          order_num: group.order_num,
        })),
        // 站点数据作为单独的顶级数组
        sites: allSites,
        configs: configs,
        // 添加版本和导出日期
        version: "1.0",
        exportDate: new Date().toISOString(),
      };

      // 创建并下载JSON文件
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

      const exportFileName = `导航站备份_${new Date()
        .toISOString()
        .slice(0, 10)}.json`;

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileName);
      linkElement.click();
    } catch (error) {
      console.error("导出数据失败:", error);
      handleError(
        "导出数据失败: " + (error instanceof Error ? error.message : "未知错误")
      );
    } finally {
      setLoading(false);
    }
  };

  // 处理导入对话框
  const handleOpenImport = () => {
    handleMenuClose();
    openDialog({
      children: (
        <ImportData
          handleClose={closeDialog}
          importSuccess={async () => {
            // 刷新数据
            await fetchData();
            await fetchConfigs();
          }}
          showSnackbarSuccess={(message: string) => {
            handleSuccess(message);
          }}
          showSnackbarFail={(message: string) => {
            handleError(message);
          }}
        />
      ),
    });
  };

  // 更新分组
  const handleGroupUpdate = async (updatedGroup: Group) => {
    try {
      if (updatedGroup.id) {
        await api.updateGroup(updatedGroup.id, updatedGroup);
        await fetchData(); // 重新加载数据
      }
    } catch (error) {
      console.error("更新分组失败:", error);
      handleError("更新分组失败: " + (error as Error).message);
    }
  };

  // 删除分组
  const handleGroupDelete = async (groupId: number) => {
    try {
      await api.deleteGroup(groupId);
      await fetchData(); // 重新加载数据
    } catch (error) {
      console.error("删除分组失败:", error);
      handleError("删除分组失败: " + (error as Error).message);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          color: "text.primary",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            py: 4,
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 5,
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 2, sm: 0 },
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              fontWeight="900"
              sx={{
                fontSize: { xs: "1.75rem", sm: "2.125rem", md: "3rem" },
                textAlign: { xs: "center", sm: "left" },
                color: "text.primary",
                textShadow: (theme) =>
                  theme.palette.mode === "dark"
                    ? "0 2px 4px rgba(0, 0, 0, 0.3)"
                    : "0 1px 2px rgba(0, 0, 0, 0.1)",
                letterSpacing: "-0.5px",
              }}
            >
              {configs["site.name"]}
            </Typography>
            
            {/* 右侧容器 - 确保主题切换按钮永远在最右边 */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: { xs: "100%", sm: "auto" },
                gap: { xs: 1, sm: 2 },
              }}
            >
              {/* 中间按钮容器 */}
              <Stack
                direction={{ xs: "row", sm: "row" }}
                spacing={{ xs: 1, sm: 2 }}
                alignItems="center"
                sx={{ 
                  flex: 1,
                  justifyContent: { xs: "center", sm: "flex-end" },
                  flexWrap: "wrap",
                  gap: { xs: 1, sm: 2 },
                }}
              >
                {sortMode !== SortMode.None ? (
                  <>
                    {sortMode === SortMode.GroupSort && (
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        onClick={handleSaveGroupOrder}
                        size="small"
                        sx={{
                          minWidth: "auto",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        }}
                      >
                        保存分组顺序
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      color="inherit"
                      startIcon={<CancelIcon />}
                      onClick={cancelSort}
                      size="small"
                      sx={{
                        minWidth: "auto",
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      }}
                    >
                      取消编辑
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={handleOpenAddGroup}
                      size="small"
                      sx={{
                        minWidth: "auto",
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      }}
                    >
                      新增分组
                    </Button>

                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<MenuIcon />}
                      onClick={handleMenuOpen}
                      aria-controls={openMenu ? "navigation-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={openMenu ? "true" : undefined}
                      size="small"
                      sx={{
                        minWidth: "auto",
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      }}
                    >
                      更多选项
                    </Button>
                    <Menu
                      id="navigation-menu"
                      anchorEl={menuAnchorEl}
                    open={openMenu}
                    onClose={handleMenuClose}
                    MenuListProps={{
                      "aria-labelledby": "navigation-button",
                    }}
                  >
                    <MenuItem onClick={startGroupSort}>
                      <ListItemIcon>
                        <SortIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>编辑排序</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleOpenConfig}>
                      <ListItemIcon>
                        <SettingsIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>网站设置</ListItemText>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleExportData}>
                      <ListItemIcon>
                        <FileDownloadIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>导出数据</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleOpenImport}>
                      <ListItemIcon>
                        <FileUploadIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>导入数据</ListItemText>
                    </MenuItem>
                    {isAuthenticated && (
                      <>
                        <Divider />
                        <MenuItem
                          onClick={handleLogout}
                          sx={{ color: "error.main" }}
                        >
                          <ListItemIcon sx={{ color: "error.main" }}>
                            <LogoutIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText>退出登录</ListItemText>
                        </MenuItem>
                      </>
                    )}
                  </Menu>
                </>
              )}
              
              {/* 用户信息显示 */}
              <UserAuthHeader 
                onLogout={() => {
                  setGroups([]);
                  handleError("已退出登录，正在跳转...");
                  setTimeout(() => {
                    router.push("/");
                  }, 1500);
                }}
              />

             
            </Stack>

            {/* 主题切换按钮 - 永远在最右边 */}
            {themeNode}
            </Box>
          </Box>

          {loading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
              }}
            >
              <CircularProgress size={60} thickness={4} />
            </Box>
          )}

          {!isInitialLoad && (
            <Box
              sx={{
                "& > *": { mb: 5 },
                minHeight: "100px",
              }}
            >
              {groups.length === 0 ? (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 8,
                    color: "text.secondary",
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    还没有分组，点击"新增分组"开始创建
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAddGroup}
                  >
                    新增分组
                  </Button>
                </Box>
              ) : sortMode === SortMode.GroupSort ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={groups.map((group) => group.id.toString())}
                    strategy={verticalListSortingStrategy}
                  >
                    <Stack
                      spacing={2}
                      sx={{
                        "& > *": {
                          transition: "none",
                        },
                      }}
                    >
                      {groups.map((group) => (
                        <SortableGroupItem
                          key={group.id}
                          id={group.id.toString()}
                          group={group}
                        />
                      ))}
                    </Stack>
                  </SortableContext>
                </DndContext>
              ) : (
                <Stack spacing={5}>
                  {groups.map((group) => (
                    <GroupCard
                      key={`group-${group.id}`}
                      group={group}
                      sortMode={
                        sortMode === SortMode.None ? "None" : "SiteSort"
                      }
                      currentSortingGroupId={currentSortingGroupId}
                      onUpdate={handleSiteUpdate}
                      onDelete={handleSiteDelete}
                      onSaveSiteOrder={handleSaveSiteOrder}
                      onStartSiteSort={startSiteSort}
                      onAddSite={handleOpenAddSite}
                      onUpdateGroup={handleGroupUpdate}
                      onDeleteGroup={handleGroupDelete}
                    />
                  ))}
                </Stack>
              )}
            </Box>
          )}

          {/* GitHub角标 - 在移动端调整位置 */}
          <GitHubPager url="https://github.com/zqq-nuli/Navihive" />
        </Container>
      </Box>
      {dialogNode}
      {snackbarNode}
    </ThemeProvider>
  );
}

export default App;
