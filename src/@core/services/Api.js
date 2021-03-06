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
export const axios = ({
	url = '',
	method = '',
	data = {},
	params = {},
	success = () => undefined,
	error = () => undefined,
	...rest
}) => {
	const token = localStorage.getItem(LS_TOKEN);

	return Axios({
		url: URL_API + url,
		method,
		data,
		params,
		headers: {
			client: 'WEB',
			Authorization: token ? `Bearer ${token}` : undefined
		},
		...rest
	})
		.then(response => {
			const { message } = response.data;

			if (message) {
				showNotifySuccess(message);
			}

			success(response.data);

			return response.data;
		})
		.catch(e => {
			console.error(e);

			const { message, error: _error } = e?.response?.data || {};

			if (message || _error) {
				let text = _error ? 'Error de validación de datos: ' : message;

				if (_error) {
					Object.values(_error).forEach(value => {
						value.forEach(v => {
							text += ` • ${v}`;
						});
					});
				}

				showNotifyError(text);
			}

			error(e);

			return e;
		});
};

export function setToken() {
	return null;
}
