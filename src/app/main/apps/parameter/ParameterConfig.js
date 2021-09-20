import { authRoles } from 'app/auth';
import React from 'react';
import { PARAMETER_PAGE_CREATE, PARAMETER_PAGE_LIST, PARAMETER_PAGE_VIEW } from './ParameterConst';

const ParameterConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			auth: authRoles.admin,
			path: PARAMETER_PAGE_CREATE,
			component: React.lazy(() => import('./page/ParameterCreate'))
		},
		{
			auth: authRoles.admin,
			path: PARAMETER_PAGE_LIST,
			component: React.lazy(() => import('./page/ParameterList'))
		},
		{
			auth: authRoles.admin,
			path: `${PARAMETER_PAGE_VIEW}/:id`,
			component: React.lazy(() => import('./page/ParameterView'))
		}
	]
};

export default ParameterConfig;
