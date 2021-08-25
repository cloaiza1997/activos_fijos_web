import { authRoles } from 'app/auth';
import React from 'react';
import { DEPRECATION_PAGE_CREATE, DEPRECATION_PAGE_LIST, DEPRECATION_PAGE_VIEW } from './DeprecationConst';

const DeprecationConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			auth: authRoles.admin,
			path: DEPRECATION_PAGE_CREATE,
			component: React.lazy(() => import('./page/DeprecationCreate'))
		},
		{
			auth: authRoles.admin,
			path: DEPRECATION_PAGE_LIST,
			component: React.lazy(() => import('./page/DeprecationList'))
		},
		{
			auth: authRoles.user,
			path: `${DEPRECATION_PAGE_VIEW}/:id`,
			component: React.lazy(() => import('./page/DeprecationView'))
		}
	]
};

export default DeprecationConfig;
