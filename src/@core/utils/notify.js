import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function showNotifyError(message) {
	toast.error(message);
}

export function showNotifySuccess(message) {
	toast.success(message);
}
