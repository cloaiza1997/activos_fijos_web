/* eslint-disable import/prefer-default-export */

/**
 * Crea objeto con la estructura del useForm en el méoto handleChange
 * @param {string} name Nombre del campo en el formulario
 * @param {any} value Valor del campo
 */
export const getHandleChange = (name, value) => ({
	persist: () => undefined,
	target: { name, value }
});

export const roundNumber = (number, decimals = 2) =>
	Math.round((number + Number.EPSILON) * 10 ** decimals) / 10 ** decimals;
