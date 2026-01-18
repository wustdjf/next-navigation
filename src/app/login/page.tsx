"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Alert,
  CssBaseline,
  ThemeProvider,
  Container,
  Stack,
} from "@mui/material";
import LoginForm from "@/components/LoginForm";
import { useSnackbar } from "@/hooks/useSnackbar";
import { useTheme } from "@/hooks/useTheme";
import api from "@/app/services/api";
import "./page.css";

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openSnackbar, closeSnackbar, snackbarNode } = useSnackbar({
    autoHideDuration: 6000,
    anchorOrigin: { vertical: "top", horizontal: "center" },
    onClose: () => closeSnackbar(),
  });

  const { theme, themeNode } = useTheme();

  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [initialMode, setInitialMode] = useState<"login" | "register">("login");

  // 检查URL参数，确定初始模式
  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "register") {
      setInitialMode("register");
    } else {
      setInitialMode("login");
    }
  }, [searchParams]);

  // 处理错误的函数
  const handleError = (errorMessage: string) => {
    setLoginError(errorMessage);
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

  // 处理成功的函数
  const handleSuccess = (message: string) => {
    openSnackbar({
      children: (
        <Alert
          onClose={() => closeSnackbar()}
          severity="success"
          variant="filled"
          sx={{
            width: "100%",
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

  // 登录功能
  const handleLogin = async (username: string, password: string) => {
    try {
      setLoginLoading(true);
      setLoginError(null);

      // 调用登录接口
      const result = await api.login(username, password);

      if (result && result.user && result.token) {
        // 登录成功
        handleSuccess("登录成功，正在跳转...");
        localStorage.setItem("access_token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));

        // 延迟跳转到导航页面
        setTimeout(() => {
          router.push("/navigation");
        }, 1500);
      } else {
        handleError("登录失败，请重试");
      }
    } catch (error) {
      console.error("登录失败:", error);
      const errorMessage =
        error instanceof Error ? error.message : "未知错误";
      handleError("登录失败: " + errorMessage);
    } finally {
      setLoginLoading(false);
    }
  };

  // 注册功能
   const handleRegister = async (
     username: string,
     password: string,
     confirmPassword?: string
   ) => {
     console.log("handleRegister called with:", { username, password, confirmPassword });
     try {
       setLoginLoading(true);
      setLoginError(null);
 
       // 验证密码
       if (!password || password.length < 6) {
         handleError("密码长度至少为6位");
         return;
       }
 
       if (password !== confirmPassword) {
         handleError("两次输入的密码不一致");
         return;
       }
 
       console.log("Calling api.register...");
       // 调用注册接口
       const result = await api.register(username, password);
 
       console.log("Register result:", result);
       if (result && result.user && result.token) {
         // 注册成功
         handleSuccess("注册成功，正在跳转...");
         localStorage.setItem("access_token", result.token);
         localStorage.setItem("user", JSON.stringify(result.user));
 
         // 延迟跳转到导航页面
         setTimeout(() => {
           router.push("/navigation");
         }, 1500);
       } else {
         handleError("注册失败，请重试");
       }
     } catch (error) {
       console.error("注册失败:", error);
       const errorMessage =
         error instanceof Error ? error.message : "未知错误";
       handleError("注册失败: " + errorMessage);
     } finally {
       setLoginLoading(false);
     }
   };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box
        sx={{
          bgcolor: "background.default",
          color: "text.primary",
          transition: "all 0.3s ease-in-out",
          position: "absolute",
          right: 0,
          top: 0,
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
          mode={initialMode}
          onLogin={handleLogin}
          onRegister={handleRegister}
          loading={loginLoading}
          error={loginError}
        />
        {snackbarNode}
      </Box>
    </ThemeProvider>
  );
}
