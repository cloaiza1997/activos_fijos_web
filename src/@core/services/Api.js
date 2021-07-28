/* eslint-disable import/prefer-default-export */
import { URL_API } from '@core/consts/consts';
import { showNotifyError, showNotifySuccess } from '@core/utils/notify';
import _axios from 'axios';

export function axios({ url = '', method = '', params = {}, success = () => undefined, error = () => undefined }) {
	return _axios({
		url: URL_API + url,
		method,
		params,
		headers: {
			client: 'WEB'
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
}
