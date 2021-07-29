import { axios } from '@core/services/Api';
import { createSlice } from '@reduxjs/toolkit';
import { showMessage } from 'app/store/fuse/messageSlice';
import firebaseService from 'app/services/firebaseService';

import { setUserData } from './userSlice';
import { LS_TOKEN, LS_USER, URL_LOGIN, URL_RECOVERY_PASSWORD } from '../AuthConsts';

/**
 * Realiza el inicio de sesión
 */
export const submitLogin =
	({ form: { email, password }, success = () => undefined, error }) =>
	async dispatch => {
		axios({
			url: URL_LOGIN,
			method: 'POST',
			params: {
				email,
				password
			},
			success: ({ user, token }) => {
				success();

				localStorage.setItem(LS_TOKEN, token);
				localStorage.setItem(LS_USER, JSON.stringify(user));

				dispatch(setUserData(user));
				dispatch(loginSuccess());
			},
			error
		});
	};

/**
 * Envá la solicitud de cambio de contraseña
 */
export const recoveryPassword = ({ form, success, error }) => {
	axios({
		url: URL_RECOVERY_PASSWORD,
		method: 'POST',
		params: form,
		success,
		error
	});
};

export const submitLoginWithFireBase =
	({ username, password }) =>
	async dispatch => {
		if (!firebaseService.auth) {
			console.warn("Firebase Service didn't initialize, check your configuration");

			return () => false;
		}
		return firebaseService.auth
			.signInWithEmailAndPassword(username, password)
			.then(() => {
				return dispatch(loginSuccess());
			})
			.catch(error => {
				const usernameErrorCodes = [
					'auth/email-already-in-use',
					'auth/invalid-email',
					'auth/operation-not-allowed',
					'auth/user-not-found',
					'auth/user-disabled'
				];
				const passwordErrorCodes = ['auth/weak-password', 'auth/wrong-password'];

				const response = {
					username: usernameErrorCodes.includes(error.code) ? error.message : null,
					password: passwordErrorCodes.includes(error.code) ? error.message : null
				};

				if (error.code === 'auth/invalid-api-key') {
					dispatch(showMessage({ message: error.message }));
				}

				return dispatch(loginError(response));
			});
	};

const initialState = {
	success: false,
	error: {
		username: null,
		password: null
	}
};

const loginSlice = createSlice({
	name: 'auth/login',
	initialState,
	reducers: {
		loginSuccess: (state, action) => {
			state.success = true;
		},
		loginError: (state, action) => {
			state.success = false;
			state.error = action.payload;
		}
	},
	extraReducers: {}
});

export const { loginSuccess, loginError } = loginSlice.actions;

export default loginSlice.reducer;
