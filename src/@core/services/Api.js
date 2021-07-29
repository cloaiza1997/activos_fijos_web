import Axios from 'axios';
import { showNotifyError, showNotifySuccess } from '@core/utils/notify';
import { URL_API } from '@core/consts/consts';
import { LS_TOKEN } from 'app/auth/AuthConsts';

/**
 * Función para realizar llamados al api
 * @param {string} url Url de la petición
 * @param {string} method POST, GET, PUT, DELETE
 * @param {object} params Body de la petición
 * @param {function} success
 * @param {function} error
 * @returns {promise}
 */
export const axios = ({ url = '', method = '', params = {}, success = () => undefined, error = () => undefined }) => {
	const token = localStorage.getItem(LS_TOKEN);

	return Axios({
		url: URL_API + url,
		method,
		params,
		headers: {
			client: 'WEB',
			Authorization: token ? `Bearer ${token}` : undefined
		}
	})
		.then(response => {
			const { message } = response.data;

			if (message) {
				showNotifySuccess(message);
			}

			success(response.data);
		})
		.catch(e => {
			console.error(e);

			const { message } = e.response.data;

			if (message) {
				showNotifyError(message);
			}

			error(e);
		});
};

export function setToken() {
	return null;
}
