import { authRoles } from 'app/auth';
import React from 'react';
import { DERECOGNITION_PAGE_CREATE, DERECOGNITION_PAGE_LIST, DERECOGNITION_PAGE_VIEW } from './DerecognitionConst';

const DerecognitionConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			auth: authRoles.admin,
			path: DERECOGNITION_PAGE_CREATE,
			component: React.lazy(() => import('./page/DerecognitionCreate'))
		},
		{
			auth: authRoles.admin,
			path: DERECOGNITION_PAGE_LIST,
			component: React.lazy(() => import('./page/DerecognitionList'))
		},
		{
			auth: authRoles.user,
			path: `${DERECOGNITION_PAGE_VIEW}/:id`,
			component: React.lazy(() => import('./page/DerecognitionView'))
		}
	]
};

export default DerecognitionConfig;
