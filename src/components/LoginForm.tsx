import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Link,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useForm, Controller } from "react-hook-form";

export interface UserSettings {
  username: string;
  password: string;
  confirmPassword?: string;
}

interface LoginFormProps {
  loading?: boolean;
  error?: string | null;
  onLogin?: (username: string, password: string) => void;
  onRegister?: (username: string, password: string, confirmPassword?: string) => void;
}

interface LoginFormPropsWithMode extends LoginFormProps {
  mode?: "login" | "register";
}

const LoginForm: React.FC<LoginFormPropsWithMode> = ({
  loading = false,
  error = null,
  onLogin,
  onRegister,
  mode = "login",
}) => {
  const { control, watch, handleSubmit, reset, formState } = useForm<UserSettings>({
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const [action, setAction] = useState<"login" | "register">(mode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordValue = watch("password");

  // Sync action state with mode prop when it changes
  useEffect(() => {
    setAction(mode);
    reset();
  }, [mode, reset]);

  const handleActionChange = () => {
    const newAction = action === "login" ? "register" : "login";
    setAction(newAction);
    reset();
  };

  const onSubmit = (data: UserSettings) => {
    console.log("Form submitted with data:", data);
    console.log("Current action:", action);
    console.log("Form errors:", formState.errors);

    if (action === "login") {
      console.log("Calling onLogin");
      onLogin?.(data.username, data.password);
    } else {
      console.log("Calling onRegister");
      onRegister?.(data.username, data.password, data.confirmPassword);
    }
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

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Controller
            name="username"
            control={control}
            rules={{
              required: "用户名为必填项",
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="用户名"
                margin="normal"
                required
                fullWidth
                error={!!error}
                helperText={error?.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            rules={{
              required: "密码为必填项",
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="密码"
                type={showPassword ? "text" : "password"}
                margin="normal"
                required
                fullWidth
                error={!!error}
                helperText={error?.message}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />

          {action === "register" && (
            <Controller
              name="confirmPassword"
              control={control}
              shouldUnregister={false}
              rules={{
                required: "确认密码为必填项",
                validate: (value) => {
                  if (!value) return "确认密码为必填项";
                  if (value !== passwordValue) return "确认密码和密码不同";
                  return true;
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="确认密码"
                  type={showConfirmPassword ? "text" : "password"}
                  margin="normal"
                  required
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            />
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            onClick={() => {
              console.log("Button clicked!");
              console.log("Current action:", action);
              console.log("Form state:", formState);
            }}
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
            type="button"
            underline="none"
            onClick={(e) => {
              e.preventDefault();
              handleActionChange();
            }}
          >
            {`${action === "login" ? "没有账号，去注册" : "有账号，去登录"}`}
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginForm;
