import { authRoles } from 'app/auth';
import React from 'react';
import { USER_PAGE_CREATE, USER_PAGE_LIST, USER_PAGE_VIEW } from './UsersConst';

const UserConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			auth: authRoles.admin,
			path: USER_PAGE_CREATE,
			component: React.lazy(() => import('./page/UserCreate'))
		},
		{
			auth: authRoles.admin,
			path: USER_PAGE_LIST,
			component: React.lazy(() => import('./page/UserList'))
		},
		{
			auth: authRoles.admin,
			path: `${USER_PAGE_VIEW}/:id`,
			component: React.lazy(() => import('./page/UserView'))
		}
	]
};

export default UserConfig;
