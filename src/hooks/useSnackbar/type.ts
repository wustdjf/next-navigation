import type { SnackbarProps } from "@mui/material";

export interface ISnackbarProps extends Partial<SnackbarProps> {
  maskClose?: () => void;
}
