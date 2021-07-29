import { authRoles } from 'app/auth';
import Login from './components/Login';
import RecoveryPassword from './components/RecoveryPassword';
import { LOGIN_INDEX, LOGIN_RECOVERY_PASSWORD } from './LoginConsts';

const LoginConfig = {
	settings: {
		layout: {
			config: {
				navbar: {
					display: false
				},
				toolbar: {
					display: false
				},
				footer: {
					display: false
				},
				leftSidePanel: {
					display: false
				},
				rightSidePanel: {
					display: false
				}
			}
		}
	},
	auth: authRoles.onlyGuest,
	routes: [
		{
			path: LOGIN_INDEX,
			component: Login
		},
		{
			path: LOGIN_RECOVERY_PASSWORD,
			component: RecoveryPassword
		}
	]
};

export default LoginConfig;
