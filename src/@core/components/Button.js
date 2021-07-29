import ButtonMaterial from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import clsx from 'clsx';
import React from 'react';

/**
 * @function Button
 * @brief Botón con loader
 * @details
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
function Button(props) {
	const { loading, disabled, className, children, ...rest } = props;

	return (
		<ButtonMaterial className={clsx('relative', className)} disabled={loading || disabled} {...rest}>
			{children}

			{loading && <CircularProgress className="absolute" size={24} />}
		</ButtonMaterial>
	);
}

export default Button;
