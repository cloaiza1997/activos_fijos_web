import { darken } from '@material-ui/core/styles/colorManipulator';
import { Icon, InputAdornment, TextField } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { recoveryPassword } from 'app/auth/store/loginSlice';
import { useForm } from '@fuse/hooks';
import Button from '@core/components/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import clsx from 'clsx';
import FuseAnimate from '@fuse/core/FuseAnimate';
import history from '@history';
import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
// Components
import { LOGIN_INDEX } from '../LoginConsts';

const useStyles = makeStyles(theme => ({
	root: {
		background: `linear-gradient(to left, ${theme.palette.primary.dark} 0%, ${darken(
			theme.palette.primary.dark,
			0.5
		)} 100%)`,
		color: theme.palette.primary.contrastText
	},
	leftSection: {},
	rightSection: {
		background: `linear-gradient(to right, ${theme.palette.primary.dark} 0%, ${darken(
			theme.palette.primary.dark,
			0.5
		)} 100%)`,
		color: theme.palette.primary.contrastText
	}
}));

/**
 * @function RecoveryPassword
 * @brief Formulario de recuperación de contraseña
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
function RecoveryPassword() {
	const classes = useStyles();

	const { form, handleChange } = useForm({ email: '' });
	const [loading, setLoading] = useState(false);

	const onSubmit = () => {
		setLoading(true);

		const success = () => history.push(LOGIN_INDEX);
		const error = () => setLoading(false);

		recoveryPassword({ form, success, error });
	};

	return (
		<div
			className={clsx(
				classes.root,
				'flex flex-col flex-auto items-center justify-center flex-shrink-0 p-16 md:p-24'
			)}
		>
			<FuseAnimate animation="transition.expandIn">
				<div className="flex rounded-12 shadow-2xl overflow-hidden">
					<Card
						className={clsx(
							classes.leftSection,
							'flex flex-col w-full max-w-sm items-center justify-center shadow-0'
						)}
						square
					>
						<CardContent className="flex flex-col items-center justify-center w-full py-96 max-w-320">
							<FuseAnimate delay={300}>
								<div className="flex items-center mb-20">
									<img
										className="logo-icon w-48"
										src="assets/images/logos/logo_small_text.png"
										alt="logo"
									/>

									<div className="border-l-1 mr-4 w-1 h-40" />

									<div>
										<Typography className="text-24 font-800 logo-text" color="inherit">
											Recuperación de contraseña
										</Typography>
									</div>
								</div>
							</FuseAnimate>

							<div className="flex flex-col justify-center w-full">
								<p className="text-justify mb-20">
									Para recuperar la contraseña ingrese el usuario y presione el botón "Enviar correo"
									para que se envíe un mensaje al email registrado con las instrucciones.
								</p>

								<TextField
									className="mb-16"
									type="text"
									name="email"
									label="Usuario"
									value={form.email}
									onChange={handleChange}
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												<Icon className="text-20" color="action">
													email
												</Icon>
											</InputAdornment>
										)
									}}
									variant="outlined"
									required
									autoFocus
								/>

								<Button
									type="submit"
									variant="contained"
									color="primary"
									className="w-full mx-auto mt-16"
									aria-label="LOG IN"
									disabled={!form.email}
									value="legacy"
									onClick={onSubmit}
									loading={loading}
								>
									Enviar correo
								</Button>
							</div>
						</CardContent>

						<div className="flex flex-col items-center justify-center pb-32">
							<div>
								<Link className="font-normal" to={LOGIN_INDEX}>
									Ir al inicio de sesión
								</Link>
							</div>
						</div>
					</Card>
				</div>
			</FuseAnimate>
		</div>
	);
}

export default RecoveryPassword;
