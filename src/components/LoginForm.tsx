import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Link,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useForm } from "react-hook-form";
import {
  FormContainer,
  PasswordElement,
  PasswordRepeatElement,
  TextFieldElement,
  FieldError,
} from "react-hook-form-mui";

export interface UserSettings {
  username: string;
  password: string;
  confirmPassword?: string;
}

interface LoginFormProps {
  loading?: boolean;
  error?: string | null;
  onLogin?: (username: string, password: string) => void;
  onRegister?: (username: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  loading = false,
  error = null,
  onLogin,
  onRegister,
}) => {
  const formContext = useForm<UserSettings>({
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
    mode: "all", // 验证模式切换为all
  });

  const [action, setAction] = useState<"login" | "register">("login");

  const onSubmit = (data: UserSettings) => {
    console.log(data);
  };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (action === "login") {
  //     onLogin?.(username, password);
  //   } else {
  //     onRegister?.(username, password, confirmPassword);
  //   }
  // };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: "100%",
        p: { xs: 2, sm: 4 },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 2,
          width: "100%",
          maxWidth: { xs: "90%", sm: 400 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box
            sx={{
              mb: 2,
              width: 56,
              height: 56,
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "primary.main",
              color: "white",
            }}
          >
            <LockOutlinedIcon fontSize="large" />
          </Box>
          <Typography
            component="h1"
            variant="h5"
            fontWeight="bold"
            textAlign="center"
          >
            {`导航站${action === "login" ? "登录" : "注册"}`}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <FormContainer onSuccess={onSubmit}>
          <TextFieldElement
            name="username"
            label="用户名"
            margin="normal"
            required
            fullWidth
            parseError={(error: FieldError) => {
              console.log(error);
              return "必填";
            }}
          />
          <PasswordElement
            name="password"
            label="密码"
            margin="normal"
            required
            fullWidth
          />
          <PasswordRepeatElement
            name="confirmPassword"
            label="确认密码"
            passwordFieldName={"password"}
            customInvalidFieldMessage={"确认密码和密码不同"}
            margin="normal"
            required
            fullWidth
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{
              py: 1.5,
              mt: 2,
              mb: 2,
              borderRadius: 2,
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : action === "login" ? (
              "登录"
            ) : (
              "注册"
            )}
          </Button>

          <Link
            component="button"
            underline="none"
            onClick={() => {
              setAction(() => {
                return action === "login" ? "register" : "login";
              });
            }}
          >
            {`${action === "login" ? "没有账号，去注册" : "有账号，去登录"}`}
          </Link>
        </FormContainer>
      </Paper>
    </Box>
  );
};

export default LoginForm;
