import React, { useState } from "react";
import { isType } from "@/utils/util";
import CommonSnackbar from "./snackbar";
import type { ISnackbarProps } from "./type";

export const MySnackbar = (props: ISnackbarProps) => {
  const { children, ...rest } = props;

  return <CommonSnackbar {...rest}>{children}</CommonSnackbar>;
};

export const useSnackbar = (props?: ISnackbarProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [tempProps, setTempProps] = useState<ISnackbarProps>();

  const finalProps: ISnackbarProps = {
    ...props,
    ...tempProps,
    onClose: (...args) => {
      props?.onClose?.(...args);
      tempProps?.onClose?.(...args);
    },
  };
  const snackbarNode = <MySnackbar {...finalProps} open={visible} />;
  const openSnackbar = (openProps?: ISnackbarProps) => {
    setTempProps(openProps);
    setVisible(true);
  };

  const closeSnackbar = (cb?: () => void) => {
    setVisible(false);
    if (cb && isType(cb, "Function")) {
      cb?.();
    }
  };

  return {
    openSnackbar,
    closeSnackbar,
    snackbarNode,
  };
};
