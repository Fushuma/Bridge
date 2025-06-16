import { ToastContainer } from '@callisto-enterprise/soy-uikit2';
import React from 'react';
import useToast from '~/app/hooks/useToast';

const ToastListener = () => {
  const { toasts, remove } = useToast();

  const handleRemove = (id: string) => remove(id);

  return <ToastContainer toasts={toasts} onRemove={handleRemove} />;
};

export default ToastListener;
