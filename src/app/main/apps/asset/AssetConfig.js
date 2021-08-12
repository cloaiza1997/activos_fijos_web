import { authRoles } from 'app/auth';
import React from 'react';
import { ASSET_PAGE_CREATE, ASSET_PAGE_LIST, ASSET_PAGE_LIST_OWN, ASSET_PAGE_VIEW } from './AssetConst';

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
			auth: authRoles.user,
			path: `${ASSET_PAGE_VIEW}/:id`,
			component: React.lazy(() => import('./page/AssetView'))
		},
		{
			auth: authRoles.admin,
			path: ASSET_PAGE_LIST,
			component: React.lazy(() => import('./page/AssetList'))
		},
		{
			auth: authRoles.user,
			path: ASSET_PAGE_LIST_OWN,
			component: React.lazy(() => import('./page/AssetListOwn'))
		}
	]
};

export default AssetConfig;
