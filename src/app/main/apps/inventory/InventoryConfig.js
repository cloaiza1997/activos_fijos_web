import { authRoles } from 'app/auth';
import React from 'react';
import { INVENTORY_PAGE_CREATE, INVENTORY_PAGE_LIST } from './InventoryConst';

const InventoryConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			auth: authRoles.admin,
			path: INVENTORY_PAGE_CREATE,
			component: React.lazy(() => import('./page/InventoryCreate'))
		},
		{
			auth: authRoles.admin,
			path: INVENTORY_PAGE_LIST,
			component: React.lazy(() => import('./page/InventoryList'))
		}
		// {
		// 	auth: authRoles.user,
		// 	path: `${REVALUATION_PAGE_VIEW}/:id`,
		// 	component: React.lazy(() => import('./page/RevaluationEdit'))
		// }
	]
};

export default InventoryConfig;
