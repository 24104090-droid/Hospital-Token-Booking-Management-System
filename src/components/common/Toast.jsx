import React from 'react';
import toast from 'react-hot-toast';

export const showToast = {
  success: (msg) => toast.success(msg),
  error: (msg) => toast.error(msg),
  info: (msg) => toast(msg, { icon: 'ℹ️' }),
  warning: (msg) => toast(msg, { icon: '⚠️' })
};

const Toast = () => null;
export default Toast;
