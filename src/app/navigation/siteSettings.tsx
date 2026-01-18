import { useEffect, useState } from "react";
import {
  Button,
  Stack,
  TextField,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DEFAULT_CONFIGS } from "@/constant/const";
import api from "@/app/services/api";

export interface SiteSettingsProps {
  handleClose?: () => void;
  settingSuccess?: () => void;
  showSnackbarMsg?: (message: string) => void;
}
function SiteSettings(props: SiteSettingsProps) {
  const { handleClose, settingSuccess, showSnackbarMsg } = props;

  // 配置状态
  const [configs, setConfigs] =
    useState<Record<string, string>>(DEFAULT_CONFIGS);
  const [tempConfigs, setTempConfigs] =
    useState<Record<string, string>>(DEFAULT_CONFIGS);

  useEffect(() => {
    // 加载配置
    const fetchConfigs = async () => {
      try {
        const configsData = await api.getConfigs();
        const newConfig = { ...DEFAULT_CONFIGS, ...configsData };
        setConfigs(newConfig);
        setTempConfigs(newConfig);
      } catch (error) {
        console.error("加载配置失败:", error);
        // 使用默认配置
      }
    };

    fetchConfigs();
  }, []);

  const handleConfigInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempConfigs({
      ...tempConfigs,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveConfig = async () => {
    try {
      // 保存所有配置
      for (const [key, value] of Object.entries(tempConfigs)) {
        if (configs[key] !== value) {
          await api.setConfigByKey(key, value);
        }
      }

      // 更新配置状态
      setConfigs({ ...tempConfigs });
      settingSuccess?.();
      handleClose?.();
    } catch (error) {
      console.error("保存配置失败:", error);
      showSnackbarMsg?.("保存配置失败: " + (error as Error).message);
    }
  };

  return (
    <>
      <DialogTitle>
        网站设置
        <IconButton
          aria-label="close"
          onClick={() => handleClose?.()}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          配置网站的基本信息和外观
        </DialogContentText>
        <Stack spacing={2}>
          <TextField
            margin="dense"
            id="site-title"
            name="site.title"
            label="网站标题 (浏览器标签)"
            type="text"
            fullWidth
            variant="outlined"
            value={tempConfigs["site.title"]}
            onChange={handleConfigInputChange}
          />
          <TextField
            margin="dense"
            id="site-name"
            name="site.name"
            label="网站名称 (显示在页面中)"
            type="text"
            fullWidth
            variant="outlined"
            value={tempConfigs["site.name"]}
            onChange={handleConfigInputChange}
          />
          <TextField
            margin="dense"
            id="site-custom-css"
            name="site.customCss"
            label="自定义CSS"
            type="text"
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            value={tempConfigs["site.customCss"]}
            onChange={handleConfigInputChange}
            placeholder="/* 自定义样式 */\nbody { }"
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={() => handleClose?.()} variant="outlined">
          取消
        </Button>
        <Button onClick={handleSaveConfig} variant="contained" color="primary">
          保存设置
        </Button>
      </DialogActions>
    </>
  );
}

export default SiteSettings;
