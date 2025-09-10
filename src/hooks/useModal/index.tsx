import React, { useState } from "react";
import { isType } from "@/utils/util";
import CommonDialog from "./dialog";
import type { IDialogProps } from "./type";

export const MyDialog = (props: IDialogProps) => {
  const { children, ...rest } = props;

  return <CommonDialog {...rest}>{children}</CommonDialog>;
};

export const useDialog = (props?: IDialogProps) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [tempProps, setTempProps] = useState<IDialogProps>();

  const finalProps: IDialogProps = {
    ...props,
    ...tempProps,
    onClose: (...args) => {
      props?.onClose?.(...args);
      tempProps?.onClose?.(...args);
    },
  };
  const dialogNode = <MyDialog {...finalProps} open={visible} />;
  const openDialog = (openProps?: IDialogProps) => {
    setTempProps(openProps);
    setVisible(true);
  };

  const closeDialog = (cb?: () => void) => {
    setVisible(false);
    if (cb && isType(cb, "Function")) {
      cb?.();
    }
  };

  return {
    openDialog,
    closeDialog,
    dialogNode,
  };
};
