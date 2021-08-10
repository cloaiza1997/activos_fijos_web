import { authRoles } from 'app/auth';
import React from 'react';
import { ASSET_PAGE_CREATE, ASSET_PAGE_VIEW } from './AssetConst';

const AssetConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			auth: authRoles.admin,
			path: ASSET_PAGE_CREATE,
			component: React.lazy(() => import('./page/AssetCreate'))
		},
		{
			auth: authRoles.admin,
			path: `${ASSET_PAGE_VIEW}/:id`,
			component: React.lazy(() => import('./page/AssetEdit'))
		}
		// {
		// 	auth: authRoles.user,
		// 	path: `${PURCHASE_PAGE_VIEW}/:id`,
		// 	component: React.lazy(() => import('./page/PurchaseEdit'))
		// },
		// {
		// 	auth: authRoles.admin,
		// 	path: PURCHASE_PAGE_LIST,
		// 	component: React.lazy(() => import('./page/PurchaseList'))
		// },
		// {
		// 	auth: authRoles.approver,
		// 	path: PURCHASE_PAGE_LIST_APPROVE,
		// 	component: React.lazy(() => import('./page/PurchaseListApprove'))
		// }
	]
};

export default AssetConfig;
