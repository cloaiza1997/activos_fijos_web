import history from '@history';
import moment from 'moment';

const pathToRegexp = require('path-to-regexp');

/**
 * Crea objeto con la estructura del useForm en el méoto handleChange
 * @param {string} name Nombre del campo en el formulario
 * @param {any} value Valor del campo
 */
export const getHandleChange = (name, value) => ({
	persist: () => undefined,
	target: { name, value }
});

/**
 * Redondea un número
 * @param {number} number Número a redondear
 * @param {number} decimals Cantidad de decimales
 * @return {number} Número redondeado
 */
export const roundNumber = (number, decimals = 2) =>
	Math.round((number + Number.EPSILON) * 10 ** decimals) / 10 ** decimals;

/**
 * Procesa una url y reemplaza los parámetros que tengan :
 * @param {string} url
 * @param {object} params Los nombres de las propiedades deben de ser igual a los :params de la url
 * @returns {string} Url con sus respectivos parámetros
 */
export function getPathByParams(url, params) {
	// Se agrega el path que se desea procesar, ej: /ruta/:param1/:param2/:param3?
	const toPath = pathToRegexp.compile(url);
	// Al ejecutar toPath, se pasa un objeto con los parámetros { param1: 'valor-1', param2: 'valor-2' }
	// la función retorna un string /ruta/valor-1/valor-2
	return toPath(params);
}

/**
 * Formatea una fecha
 * @param {object|string} date Fecha a formatear
 * @param {string} format Formato a aplicar
 * @returns {string} Fecha formateada
 */
export const formatDate = (date, format = 'YYYY-MM-DD') => moment(date).format(format);

/**
 * Redirecciona a una url
 * @param {string} url Url a direccionar. Por defecto retorna al home
 * @param {object} state Parámetros a pasar
 * @param {string} search Query params en la url
 */
export function redirect(url = '/', state = {}, search = '') {
	history.push({
		pathname: url,
		state,
		search
	});
}

export function redirectGoBack() {
	history.goBack();
}
