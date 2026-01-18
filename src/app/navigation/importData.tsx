import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import api from "@/app/services/api";

export interface ImportDataProps {
  handleClose?: () => void;
  importSuccess?: () => void;
  showSnackbarFail?: (message: string) => void;
  showSnackbarSuccess?: (message: string) => void;
}
function ImportData(props: ImportDataProps) {
  const { handleClose, importSuccess, showSnackbarFail, showSnackbarSuccess } =
    props;

  const [importFile, setImportFile] = useState<File | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importLoading, setImportLoading] = useState(false);

  useEffect(() => {
    setImportFile(null);
    setImportError(null);
  }, []);

  // 处理文件选择
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportFile(e.target.files[0]);
      setImportError(null);
    }
  };

  // 处理导入数据
  const handleImportData = async () => {
    if (!importFile) {
      showSnackbarFail?.("请选择要导入的文件");
      return;
    }

    try {
      setImportLoading(true);
      setImportError(null);

      const fileReader = new FileReader();
      fileReader.readAsText(importFile, "UTF-8");

      fileReader.onload = async (e) => {
        try {
          if (!e.target?.result) {
            throw new Error("读取文件失败");
          }

          const importData = JSON.parse(e.target.result as string);

          // 验证导入数据格式
          if (!importData.groups || !Array.isArray(importData.groups)) {
            throw new Error("导入文件格式错误：缺少分组数据");
          }

          if (!importData.sites || !Array.isArray(importData.sites)) {
            throw new Error("导入文件格式错误：缺少站点数据");
          }

          if (!importData.configs || typeof importData.configs !== "object") {
            throw new Error("导入文件格式错误：缺少配置数据");
          }

          // 调用API导入数据
          const result = await api.importData(importData);

          // 显示导入结果统计
          if (result && typeof result === "object") {
            const summary = [
              `导入成功！`,
              `分组：${result.groupsCount}个`,
              `站点：${result.sitesCount}个`,
              `配置：${result.configsCount}个`,
            ].join("\n");

            showSnackbarSuccess?.(summary);
          }

          importSuccess?.();
          handleClose?.();
        } catch (error) {
          console.error("解析导入数据失败:", error);
          showSnackbarFail?.(
            "解析导入数据失败: " +
              (error instanceof Error ? error.message : "未知错误")
          );
        } finally {
          setImportLoading(false);
        }
      };

      fileReader.onerror = () => {
        showSnackbarFail?.("读取文件失败");
        setImportLoading(false);
      };
    } catch (error) {
      console.error("导入数据失败:", error);
      showSnackbarFail?.(
        "导入数据失败: " + (error instanceof Error ? error.message : "未知错误")
      );
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <>
      <DialogTitle>
        导入数据
        <IconButton
          aria-label="close"
          onClick={handleClose}
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
          请选择要导入的JSON文件，导入将覆盖现有数据。
        </DialogContentText>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<FileUploadIcon />}
            sx={{ mb: 2 }}
          >
            选择文件
            <input
              type="file"
              hidden
              accept=".json"
              onChange={handleFileSelect}
            />
          </Button>
          {importFile && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              已选择: {importFile.name}
            </Typography>
          )}
        </Box>
        {importError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {importError}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} variant="outlined">
          取消
        </Button>
        <Button
          onClick={handleImportData}
          variant="contained"
          color="primary"
          disabled={!importFile || importLoading}
          startIcon={
            importLoading ? <CircularProgress size={20} /> : <FileUploadIcon />
          }
        >
          {importLoading ? "导入中..." : "导入"}
        </Button>
      </DialogActions>
    </>
  );
}

export default ImportData;
