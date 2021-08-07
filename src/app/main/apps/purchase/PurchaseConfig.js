import { authRoles } from 'app/auth';
import React from 'react';
import {
	PURCHASE_PAGE_CREATE,
	PURCHASE_PAGE_LIST,
	PURCHASE_PAGE_LIST_APPROVE,
	PURCHASE_PAGE_VIEW
} from './PurchaseConst';

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
			auth: authRoles.user,
			path: `${PURCHASE_PAGE_VIEW}/:id`,
			component: React.lazy(() => import('./page/PurchaseEdit'))
		},
		{
			auth: authRoles.admin,
			path: PURCHASE_PAGE_LIST,
			component: React.lazy(() => import('./page/PurchaseList'))
		},
		{
			auth: authRoles.approver,
			path: PURCHASE_PAGE_LIST_APPROVE,
			component: React.lazy(() => import('./page/PurchaseListApprove'))
		}
	]
};

export default PurchaseConfig;
