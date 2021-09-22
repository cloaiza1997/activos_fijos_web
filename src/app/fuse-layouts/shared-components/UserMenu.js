import { axios } from '@core/services/Api';
import { logoutUser, setUser } from 'app/auth/store/userSlice';
import { TextField } from '@material-ui/core';
import { LS_USER, URL_UPDATE_PASSWORD } from 'app/auth/AuthConsts';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from '@fuse/hooks';
import Avatar from '@material-ui/core/Avatar';
import Button from '@core/components/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Icon from '@material-ui/core/Icon';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';

function UserMenu(props) {
	const dispatch = useDispatch();
	const user = useSelector(({ auth }) => auth.user);

	const [userMenu, setUserMenu] = useState(null);
	const [open, setOpen] = useState(!!user?.must_change_password);

	const userMenuClick = event => {
		setUserMenu(event.currentTarget);
	};

	const userMenuClose = () => {
		setUserMenu(null);
	};

	return (
		<>
			<Button className="min-h-40 min-w-40 px-0 md:px-16 py-0 md:py-6" onClick={userMenuClick}>
				<div className="hidden md:flex flex-col mx-4 items-end">
					<Typography component="span" className="font-bold flex">
						{user.display_name}
					</Typography>

					<Typography className="text-11 capitalize" color="textSecondary">
						{user.role}
					</Typography>
				</div>

				<Avatar className="md:mx-4">{user.display_name && user.display_name[0]}</Avatar>
			</Button>

			<Popover
				open={Boolean(userMenu)}
				anchorEl={userMenu}
				onClose={userMenuClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center'
				}}
				classes={{
					paper: 'py-8'
				}}
			>
				<MenuItem
					onClick={() => {
						userMenuClose();
						setOpen(true);
					}}
				>
					<ListItemIcon className="min-w-40">
						<Icon>vpn_key</Icon>
					</ListItemIcon>

					<ListItemText primary="Actualizar contraseña" />
				</MenuItem>

				<MenuItem
					onClick={() => {
						dispatch(logoutUser());
						userMenuClose();
					}}
				>
					<ListItemIcon className="min-w-40">
						<Icon>exit_to_app</Icon>
					</ListItemIcon>

					<ListItemText primary="Cerrar sesión" />
				</MenuItem>
			</Popover>

			<UpdatePassword open={open} onClose={() => setOpen(false)} />
		</>
	);
}

export default UserMenu;

function UpdatePassword({ open, onClose }) {
	const dispatch = useDispatch();

	const { form, handleChange, resetForm } = useForm({ password: '', password_confirm: '' });

	const [loading, setLoading] = useState(false);

	const onUpdatePassword = () => {
		setLoading(true);

		axios({
			url: URL_UPDATE_PASSWORD,
			method: 'POST',
			data: form,
			success: () => {
				const user = JSON.parse(localStorage.getItem(LS_USER));
				user.must_change_password = 0;

				localStorage.setItem(LS_USER, JSON.stringify(user));
				dispatch(setUser(user));

				onClose();
				resetForm();
				setLoading(false);
			},
			error: () => setLoading(false)
		});
	};

	return (
		<Dialog open={open}>
			<DialogTitle>Actualizar contraseña</DialogTitle>

			<DialogContent className="flex flex-col">
				<p className="mb-10">
					La contraseña debe de tener mínimo 8 caracteres que incluyan por lo menos una letra mayúscula y
					minúscula, un número y un carácter especial.
				</p>

				<TextField
					type="password"
					name="password"
					label="Contraseña"
					value={form.password}
					onChange={handleChange}
					className="mb-10"
					autoFocus
					required
				/>

				<TextField
					type="password"
					name="password_confirm"
					label="Confirmar contraseña"
					value={form.password_confirm}
					onChange={handleChange}
					required
				/>
			</DialogContent>

			<DialogActions>
				<Button variant="contained" color="secondary" onClick={onClose}>
					Cancelar
				</Button>

				<Button variant="contained" color="primary" loading={loading} onClick={onUpdatePassword}>
					Actualizar
				</Button>
			</DialogActions>
		</Dialog>
	);
}
