"use client";
import { useState } from "react";
import {
  Box,
  Alert,
  CssBaseline,
  ThemeProvider,
  CircularProgress,
  Container,
  Stack,
} from "@mui/material";
import LoginForm from "@/components/LoginForm";
import { useSnackbar } from "@/hooks/useSnackbar";
import { createUser } from "@/app/services/api_user";
import { useTheme } from "@/hooks/useTheme";
import "./page.css";

export default function Login() {
  const { openSnackbar, closeSnackbar, snackbarNode } = useSnackbar({
    autoHideDuration: 6000,
    anchorOrigin: { vertical: "top", horizontal: "center" },
    onClose: () => closeSnackbar(),
  });

  const { theme, themeNode } = useTheme();

  // 新增认证状态
  const [isAuthChecking, setIsAuthChecking] = useState(false);
  const [isAuthRequired, setIsAuthRequired] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // 处理错误的函数
  const handleError = (errorMessage: string) => {
    openSnackbar({
      children: (
        <Alert
          onClose={() => closeSnackbar()}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      ),
    });
  };

  // 登录功能
  const handleLogin = async (username: string, password: string) => {
    try {
      setLoginLoading(true);
      setLoginError(null);

      // 调用登录接口
      const res = await createUser({ username, password });

      if (res && res.code === 0) {
        // 登录成功
        setIsAuthenticated(true);
        setIsAuthRequired(false);
        localStorage.setItem("access_token", res.data.token);
        // 加载数据
        // await fetchData();
        // await fetchConfigs();
      } else {
        // 登录失败
        handleError("用户名或密码错误");
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("登录失败:", error);
      handleError(
        "登录失败: " + (error instanceof Error ? error.message : "未知错误")
      );
      setIsAuthenticated(false);
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {isAuthChecking && (
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "background.default",
          }}
        >
          <CircularProgress size={60} thickness={4} />
        </Box>
      )}
      <CssBaseline />

      <Box
        sx={{
          bgcolor: "background.default",
          color: "text.primary",
          transition: "all 0.3s ease-in-out",
          position: "absolute",
          right: 0,
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
            <Stack
              direction={{ xs: "row", sm: "row" }}
              spacing={{ xs: 1, sm: 2 }}
              alignItems="center"
              width={{ xs: "100%", sm: "auto" }}
              justifyContent={{ xs: "center", sm: "flex-end" }}
              flexWrap="wrap"
              sx={{ gap: { xs: 1, sm: 2 }, py: { xs: 1, sm: 0 } }}
            >
              {themeNode}
            </Stack>
          </Box>
        </Container>
      </Box>

      {isAuthRequired &&
        !isAuthenticated && ( // 如果需要认证但未认证，显示登录界面
          <Box
            sx={{
              height: "100vh",
              width: "100vw",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "background.default",
            }}
          >
            <LoginForm
              onLogin={handleLogin}
              loading={loginLoading}
              error={loginError}
            />
            {snackbarNode}
          </Box>
        )}
    </ThemeProvider>
  );
}
