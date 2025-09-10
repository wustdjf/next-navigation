import { PropsWithChildren } from "react";
import React from "react";
import { Snackbar } from "@mui/material";
import type { ISnackbarProps } from "./type";

const CommonSnackbar = (props: PropsWithChildren<ISnackbarProps>) => {
  const { open = false, children, ...rest } = props || {};

  return (
    <Snackbar open={open} {...rest}>
      {children}
    </Snackbar>
  );
};

export default CommonSnackbar;
