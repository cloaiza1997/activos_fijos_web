import CircularProgress from '@material-ui/core/CircularProgress';
import React from 'react';

/**
 * @function Loading
 * @brief Carga de progreso
 * @details
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
function Loading() {
	return (
		<div className="flex items-center justify-center h-full w-full">
			<CircularProgress className="" size={40} />
		</div>
	);
}

export default Loading;
