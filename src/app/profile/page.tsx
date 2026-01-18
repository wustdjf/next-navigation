"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Button,
  TextField,
  Avatar,
  Stack,
  Typography,
  Alert,
  CircularProgress,
  CssBaseline,
  ThemeProvider,
  Card,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTheme } from "@/hooks/useTheme";
import { useSnackbar } from "@/hooks/useSnackbar";
import api from "@/app/services/api";

interface User {
  id: string;
  username: string;
  nickname: string;
  avatar?: string;
  email?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { theme, themeNode } = useTheme();
  const { openSnackbar, closeSnackbar, snackbarNode } = useSnackbar({
    autoHideDuration: 6000,
    anchorOrigin: { vertical: "top", horizontal: "center" },
    onClose: () => closeSnackbar(),
  });

  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // 加载用户信息
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/");
      return;
    }

    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setFormData(userData);
      } catch (e) {
        console.error("Failed to parse user:", e);
        router.push("/");
      }
    } else {
      router.push("/");
    }
    setLoading(false);
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // 验证必填字段
      if (!formData.nickname || !formData.nickname.trim()) {
        openSnackbar({
          children: (
            <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
              昵称不能为空
            </Alert>
          ),
        });
        return;
      }

      // 调用API更新用户信息
      const updatedUser = await api.updateUserProfile({
        nickname: formData.nickname,
        email: formData.email,
        avatar: formData.avatar,
      });

      // 更新localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setFormData(updatedUser);
      setHasChanges(false);

      openSnackbar({
        children: (
          <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
            个人资料已更新
          </Alert>
        ),
      });
    } catch (error) {
      console.error("更新用户信息失败:", error);
      openSnackbar({
        children: (
          <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
            更新失败: {error instanceof Error ? error.message : "未知错误"}
          </Alert>
        ),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(user || {});
    setHasChanges(false);
  };

  const handleBack = () => {
    if (hasChanges) {
      if (window.confirm("您有未保存的更改，确定要离开吗？")) {
        router.back();
      }
    } else {
      router.back();
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
        <Container maxWidth="sm">
          <Stack spacing={3}>
            {/* 返回按钮 */}
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              variant="outlined"
              sx={{ alignSelf: "flex-start" }}
            >
              返回
            </Button>

            {/* 标题 */}
            <Typography variant="h4" fontWeight="bold">
              个人资料
            </Typography>

            {/* 用户信息卡片 */}
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                {/* 头像 */}
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Avatar
                    src={formData.avatar}
                    alt={formData.nickname}
                    sx={{
                      width: 100,
                      height: 100,
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      fontSize: "2rem",
                    }}
                  >
                    {formData.nickname?.charAt(0) || "U"}
                  </Avatar>
                </Box>

                {/* 用户名（只读） */}
                <TextField
                  label="用户名"
                  value={formData.username || ""}
                  disabled
                  fullWidth
                  variant="outlined"
                  helperText="用户名不可修改"
                />

                {/* 昵称 */}
                <TextField
                  label="昵称"
                  name="nickname"
                  value={formData.nickname || ""}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  placeholder="请输入昵称"
                />

                {/* 邮箱 */}
                <TextField
                  label="邮箱"
                  name="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  placeholder="请输入邮箱地址"
                />

                {/* 头像URL */}
                <TextField
                  label="头像URL"
                  name="avatar"
                  value={formData.avatar || ""}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  placeholder="请输入头像URL"
                  helperText="输入图片URL地址作为头像"
                />

                {/* 操作按钮 */}
                <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={!hasChanges || saving}
                    fullWidth
                  >
                    {saving ? "保存中..." : "保存"}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={!hasChanges || saving}
                    fullWidth
                  >
                    取消
                  </Button>
                </Stack>
              </Stack>
            </Card>
          </Stack>
        </Container>
      </Box>
      {themeNode}
      {snackbarNode}
    </ThemeProvider>
  );
}
