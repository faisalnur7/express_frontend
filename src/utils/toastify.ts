import { toast } from 'react-toastify';

export const fireToast = (type: 'info' | 'success' | 'warn' | 'error', message: string) => {
  toast[type](message, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored'
  });
};
