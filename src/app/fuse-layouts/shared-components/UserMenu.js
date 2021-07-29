import { Link } from 'react-router-dom';
import { logoutUser } from 'app/auth/store/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
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
				<MenuItem component={Link} to="/pages/profile" onClick={userMenuClose} role="button">
					<ListItemIcon className="min-w-40">
						<Icon>account_circle</Icon>
					</ListItemIcon>

					<ListItemText primary="Mi perfil" />
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
		</>
	);
}

export default UserMenu;
