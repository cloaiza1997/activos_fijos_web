import { authRoles } from 'app/auth';
import React from 'react';
import { LOG_PAGE_LIST } from './LogConst';

const LogConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			auth: authRoles.admin,
			path: LOG_PAGE_LIST,
			component: React.lazy(() => import('./page/LogList'))
		}
	]
};

export default LogConfig;
