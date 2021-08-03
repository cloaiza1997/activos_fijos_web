import { authRoles } from 'app/auth';
import React from 'react';
import { PURCHASE_PAGE_CREATE } from './PurchaseConst';

const PurchaseConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			auth: authRoles.admin,
			path: PURCHASE_PAGE_CREATE,
			component: React.lazy(() => import('./pages/PurchaseCreate'))
		}
	]
};

export default PurchaseConfig;
