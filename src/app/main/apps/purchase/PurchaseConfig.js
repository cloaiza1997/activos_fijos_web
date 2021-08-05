import { authRoles } from 'app/auth';
import React from 'react';
import { PURCHASE_PAGE_CREATE, PURCHASE_PAGE_EDIT } from './PurchaseConst';

const PurchaseConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			auth: authRoles.admin,
			path: PURCHASE_PAGE_CREATE,
			component: React.lazy(() => import('./page/PurchaseCreate'))
		},
		{
			auth: authRoles.admin,
			path: `${PURCHASE_PAGE_EDIT}/:id`,
			component: React.lazy(() => import('./page/PurchaseEdit'))
		}
	]
};

export default PurchaseConfig;
