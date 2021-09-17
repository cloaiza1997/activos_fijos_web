import { authRoles } from 'app/auth';
import React from 'react';
import { MAINTENANCE_PAGE_CREATE, MAINTENANCE_PAGE_LIST, MAINTENANCE_PAGE_VIEW } from './MaintenanceConst';

const MaintenanceConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			auth: authRoles.admin,
			path: MAINTENANCE_PAGE_CREATE,
			component: React.lazy(() => import('./page/MaintenanceCreate'))
		},
		{
			auth: authRoles.admin,
			path: MAINTENANCE_PAGE_LIST,
			component: React.lazy(() => import('./page/MaintenanceList'))
		},
		{
			auth: authRoles.user,
			path: `${MAINTENANCE_PAGE_VIEW}/:id`,
			component: React.lazy(() => import('./page/MaintenanceView'))
		}
	]
};

export default MaintenanceConfig;
