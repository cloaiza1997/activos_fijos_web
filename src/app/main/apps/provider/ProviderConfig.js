import { authRoles } from 'app/auth';
import React from 'react';
import { PROVIDER_PAGE_CREATE, PROVIDER_PAGE_LIST, PROVIDER_PAGE_VIEW } from './ProviderConst';

const ProviderConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			auth: authRoles.admin,
			path: PROVIDER_PAGE_CREATE,
			component: React.lazy(() => import('./page/ProviderCreate'))
		},
		{
			auth: authRoles.admin,
			path: PROVIDER_PAGE_LIST,
			component: React.lazy(() => import('./page/ProviderList'))
		},
		{
			auth: authRoles.admin,
			path: `${PROVIDER_PAGE_VIEW}/:id`,
			component: React.lazy(() => import('./page/ProviderView'))
		}
	]
};

export default ProviderConfig;
