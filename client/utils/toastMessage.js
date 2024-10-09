import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const success = (message) => {
    return toast(message, {
        position: 'top-center',
        hideProgressBar: false,
        autoClose: 2000,
        type: 'success',
    });
};

export const warning = (message) => {
    return toast(message, {
        position: 'top-center',
        hideProgressBar: false,
        autoClose: 2000,
        type: 'warning',
    });
};

export const error = (message) => {
    return toast(message, {
        position: 'top-center',
        hideProgressBar: false,
        autoClose: 2000,
        type: 'error',
    });
};
