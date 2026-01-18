"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Button,
  Typography,
  CssBaseline,
  ThemeProvider,
  AppBar,
  Toolbar,
  Stack,
  Card,
} from "@mui/material";
import { useTheme } from "@/hooks/useTheme";
import UserAuthHeader from "@/components/UserAuthHeader";

export default function Home() {
  const router = useRouter();
  const { theme, themeNode } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 检查用户是否已登录
    const userStr = localStorage.getItem("user");
    setIsLoggedIn(!!userStr);
  }, []);

  const handleGoToNavigation = () => {
    router.push("/navigation");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* 顶部导航栏 */}
        <AppBar position="static" elevation={0} sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
          <Toolbar>
            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
                fontWeight: "bold",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                cursor: "pointer",
              }}
              onClick={() => router.push("/")}
            >
              导航站
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center">
              <UserAuthHeader 
                showNavigationButton={true}
                onNavigationClick={handleGoToNavigation}
              />
              {themeNode}
            </Stack>
          </Toolbar>
        </AppBar>

        {/* 主要内容 */}
        <Box
          sx={{
            flex: 1,
            background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 4,
                alignItems: "center",
              }}
            >
              {/* 左侧文本 */}
              <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: "bold",
                    mb: 2,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  快捷导航站
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: "text.secondary",
                    mb: 3,
                    fontWeight: 300,
                  }}
                >
                  整理你的网络世界，一站式访问所有常用网站
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "text.secondary",
                    mb: 4,
                    lineHeight: 1.8,
                  }}
                >
                  创建分类、添加网站、快速访问。让你的浏览体验更高效、更舒适。
                </Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  {isLoggedIn ? (
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleGoToNavigation}
                      sx={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                      }}
                    >
                      进入导航站
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        size="large"
                        onClick={() => router.push("/login?type=register")}
                        sx={{
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          px: 4,
                          py: 1.5,
                          borderRadius: 2,
                        }}
                      >
                        立即开始
                      </Button>
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={() => router.push("/login")}
                        sx={{
                          px: 4,
                          py: 1.5,
                          borderRadius: 2,
                        }}
                      >
                        登录账号
                      </Button>
                    </>
                  )}
                </Stack>
              </Box>

              {/* 右侧特性卡片 */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2,
                }}
              >
                {[
                  {
                    icon: "📚",
                    title: "分类管理",
                    desc: "按需创建分类，组织你的网站",
                  },
                  {
                    icon: "⚡",
                    title: "快速访问",
                    desc: "一键访问常用网站，提高效率",
                  },
                  {
                    icon: "🎨",
                    title: "美观界面",
                    desc: "简洁大气的设计，舒适的体验",
                  },
                  {
                    icon: "🔒",
                    title: "安全可靠",
                    desc: "你的数据安全存储，随时访问",
                  },
                ].map((feature, index) => (
                  <Card
                    key={index}
                    sx={{
                      p: 3,
                      textAlign: "center",
                      border: "1px solid",
                      borderColor: "divider",
                      transition: "all 0.3s",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 24px rgba(102, 126, 234, 0.15)",
                        borderColor: "primary.main",
                      },
                    }}
                  >
                    <Typography variant="h4" sx={{ mb: 1 }}>
                      {feature.icon}
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.desc}
                    </Typography>
                  </Card>
                ))}
              </Box>
            </Box>
          </Container>
        </Box>

        {/* 页脚 */}
        <Box
          sx={{
            py: 4,
            textAlign: "center",
            borderTop: "1px solid",
            borderColor: "divider",
            color: "text.secondary",
          }}
        >
          <Typography variant="body2">
            © 2026 快捷导航站. 让网络更简单.
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
