import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Muestra notificación de error
 * @param {string} message Mensaje a mostrar
 */
export function showNotifyError(message) {
	toast.error(message);
}

/**
 * Muestra notificación de éxito
 * @param {string} message Mensaje a mostrar
 */
export function showNotifySuccess(message) {
	toast.success(message);
}
