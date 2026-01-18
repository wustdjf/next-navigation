import { useEffect, useState } from "react";
import type { Group } from "@/types/groups";
import {
  Button,
  TextField,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import api from "@/app/services/api";

export interface IAddGroupsProps {
  handleClose?: () => void;
  addGroupsSuccess?: () => void;
  showSnackbarFail?: (message: string) => void;
  groups?: Group[];
}

function AddGroups(props: IAddGroupsProps) {
  const { handleClose, addGroupsSuccess, showSnackbarFail, groups = [] } = props;

  const [newGroup, setNewGroup] = useState<Partial<Group>>({
    name: "",
    order_num: groups.length,
  });

  useEffect(() => {
    // 自动计算下一个order_num
    setNewGroup((prev) => ({
      ...prev,
      order_num: groups.length,
    }));
  }, [groups.length]);

  const handleGroupInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewGroup({
      ...newGroup,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateGroup = async () => {
    try {
      if (!newGroup.name) {
        showSnackbarFail?.("分组名称不能为空");
        return;
      }

      await api.createGroup(newGroup as Group);
      addGroupsSuccess?.(); // 重新加载数据
      handleClose?.();
      setNewGroup({ name: "", order_num: groups.length }); // 重置表单
    } catch (error) {
      console.error("创建分组失败:", error);
      showSnackbarFail?.("创建分组失败: " + (error as Error).message);
    }
  };

  return (
    <>
      <DialogTitle>
        新增分组
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
        <DialogContentText sx={{ mb: 2 }}>请输入新分组的信息</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="group-name"
          name="name"
          label="分组名称"
          type="text"
          fullWidth
          variant="outlined"
          value={newGroup.name}
          onChange={handleGroupInputChange}
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={() => handleClose?.()} variant="outlined">
          取消
        </Button>
        <Button onClick={handleCreateGroup} variant="contained" color="primary">
          创建
        </Button>
      </DialogActions>
    </>
  );
}

export default AddGroups;
