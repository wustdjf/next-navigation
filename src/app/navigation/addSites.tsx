import { useState } from "react";
import type { Site } from "@/types/sites";
import {
  Box,
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

export interface IAddSitesProps {
  handleClose?: () => void;
  addSitesSuccess?: () => void;
  showSnackbarFail?: (message: string) => void;
}

function AddSites(props: IAddSitesProps) {
  const { handleClose, addSitesSuccess, showSnackbarFail } = props;

  const [newSite, setNewSite] = useState<Partial<Site>>({
    name: "",
    url: "",
    icon: "",
    description: "",
    notes: "",
    order_num: 0,
    group_id: 0,
  });

  const handleSiteInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewSite({
      ...newSite,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateSite = async () => {
    try {
      if (!newSite.name || !newSite.url) {
        showSnackbarFail?.("站点名称和URL不能为空");
        return;
      }

      await api.createSite(newSite as Site);
      addSitesSuccess?.();
      handleClose?.();
    } catch (error) {
      console.error("创建站点失败:", error);
      showSnackbarFail?.("创建站点失败: " + (error as Error).message);
    }
  };

  return (
    <>
      <DialogTitle>
        新增站点
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
        <DialogContentText sx={{ mb: 2 }}>请输入新站点的信息</DialogContentText>
        <Stack spacing={2}>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Box sx={{ flex: 1 }}>
              <TextField
                autoFocus
                margin="dense"
                id="site-name"
                name="name"
                label="站点名称"
                type="text"
                fullWidth
                variant="outlined"
                value={newSite.name}
                onChange={handleSiteInputChange}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <TextField
                margin="dense"
                id="site-url"
                name="url"
                label="站点URL"
                type="url"
                fullWidth
                variant="outlined"
                value={newSite.url}
                onChange={handleSiteInputChange}
              />
            </Box>
          </Box>
          <TextField
            margin="dense"
            id="site-icon"
            name="icon"
            label="图标URL"
            type="url"
            fullWidth
            variant="outlined"
            value={newSite.icon}
            onChange={handleSiteInputChange}
          />
          <TextField
            margin="dense"
            id="site-description"
            name="description"
            label="站点描述"
            type="text"
            fullWidth
            variant="outlined"
            value={newSite.description}
            onChange={handleSiteInputChange}
          />
          <TextField
            margin="dense"
            id="site-notes"
            name="notes"
            label="备注"
            type="text"
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            value={newSite.notes}
            onChange={handleSiteInputChange}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={() => handleClose?.()} variant="outlined">
          取消
        </Button>
        <Button onClick={handleCreateSite} variant="contained" color="primary">
          创建
        </Button>
      </DialogActions>
    </>
  );
}

export default AddSites;
