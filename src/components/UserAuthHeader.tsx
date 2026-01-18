"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Stack,
  Divider,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import api from "@/app/services/api";

interface User {
  id: string;
  username: string;
  nickname: string;
  avatar?: string;
}

interface UserAuthHeaderProps {
  onLogout?: () => void;
  showNavigationButton?: boolean;
  onNavigationClick?: () => void;
}

export default function UserAuthHeader({ 
  onLogout, 
  showNavigationButton = false,
  onNavigationClick 
}: UserAuthHeaderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  // 加载用户信息
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Failed to parse user:", e);
      }
    }
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleGoToProfile = () => {
    handleMenuClose();
    router.push("/profile");
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      setUser(null);
      setAnchorEl(null);
      
      // 调用父组件的onLogout回调
      if (onLogout) {
        onLogout();
      } else {
        // 默认重定向到首页
        router.push("/");
      }
    }
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      {user && showNavigationButton && (
        <Button
          variant="contained"
          size="small"
          onClick={onNavigationClick}
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          进入导航
        </Button>
      )}
      {user ? (
        <>
          {/* 用户已登录 - 显示头像和用户名 */}
          <Box
            onClick={handleMenuOpen}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: "20px",
              transition: "all 0.3s",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.05)",
              },
            }}
          >
            <Avatar
              src={user.avatar}
              alt={user.nickname}
              sx={{
                width: 36,
                height: 36,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                cursor: "pointer",
              }}
            >
              {user.nickname.charAt(0)}
            </Avatar>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                display: { xs: "none", sm: "block" },
                cursor: "pointer",
              }}
            >
              {user.nickname}
            </Typography>
          </Box>

          {/* 用户菜单 */}
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
          >
            <MenuItem disabled>
              <Typography variant="body2">
                用户名: {user.username}
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleGoToProfile}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>个人资料</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
              <ListItemIcon sx={{ color: "error.main" }}>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>退出登录</ListItemText>
            </MenuItem>
          </Menu>
        </>
      ) : (
        <>
          {/* 用户未登录 - 显示登录和注册按钮 */}
          <Button
            variant="outlined"
            size="small"
            startIcon={<LoginIcon />}
            onClick={() => router.push("/login")}
          >
            登录
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<AppRegistrationIcon />}
            onClick={() => router.push("/login?type=register")}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            注册
          </Button>
        </>
      )}
    </Stack>
  );
}
