import { toast } from 'react-toastify';

export const notifySuccess = (message: string) =>
  toast.success(message, { position: 'top-right', autoClose: 2800 });

export const notifyError = (message: string) =>
  toast.error(message, { position: 'top-right', autoClose: 3600 });
