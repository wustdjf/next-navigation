import type { DialogProps } from "@mui/material";

export interface IDialogProps extends Partial<DialogProps> {
  maskClose?: () => void;
}
