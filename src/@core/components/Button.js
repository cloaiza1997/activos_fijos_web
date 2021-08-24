import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import ButtonMaterial from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import clsx from 'clsx';
import React, { useState } from 'react';

/**
 * @function Button
 * @brief Botón con loader
 * @details
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
function Button(props) {
	const { loading, disabled, className, children, onClick, confirm, ...rest } = props;

	const [open, setOpen] = useState(false);

	return (
		<>
			<ButtonMaterial
				className={clsx('relative', className)}
				disabled={loading || disabled}
				onClick={confirm ? () => setOpen(true) : onClick}
				{...rest}
			>
				{children}

				{loading && <CircularProgress className="absolute" size={24} />}
			</ButtonMaterial>

			{open && (
				<DialogConfirm
					title={confirm.title}
					message={confirm.message}
					open={open}
					onClose={() => setOpen(false)}
					onConfirm={onClick}
				/>
			)}
		</>
	);
}

export default Button;

function DialogConfirm({ title, message, open, onClose, onConfirm = () => undefined }) {
	return (
		<Dialog open={open}>
			<DialogTitle>{title}</DialogTitle>

			<DialogContent className="flex flex-col">{message}</DialogContent>

			<DialogActions>
				<Button variant="contained" color="primary" onClick={onClose} className="bg-red-400 hover:bg-red-600">
					Cancelar
				</Button>

				<Button
					variant="contained"
					color="primary"
					onClick={() => {
						onConfirm();
						onClose();
					}}
					className="bg-green-400 hover:bg-green-600"
				>
					Aceptar
				</Button>
			</DialogActions>
		</Dialog>
	);
}
