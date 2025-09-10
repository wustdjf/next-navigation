import { PropsWithChildren } from "react";
import React from "react";
import { Dialog } from "@mui/material";
import type { IDialogProps } from "./type";

const CommonDialog = (props: PropsWithChildren<IDialogProps>) => {
  const { open = false, children, ...rest } = props || {};

  return (
    <Dialog open={open} {...rest}>
      {children}
    </Dialog>
  );
};

export default CommonDialog;
