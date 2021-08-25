import { authRoles } from 'app/auth';
import React from 'react';
import { REVALUATION_PAGE_LIST, REVALUATION_PAGE_CREATE, REVALUATION_PAGE_VIEW } from './RevaluationConst';

const RevaluationConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			auth: authRoles.admin,
			path: REVALUATION_PAGE_CREATE,
			component: React.lazy(() => import('./page/RevaluationCreate'))
		},
		{
			auth: authRoles.admin,
			path: REVALUATION_PAGE_LIST,
			component: React.lazy(() => import('./page/RevaluationList'))
		},
		{
			auth: authRoles.user,
			path: `${REVALUATION_PAGE_VIEW}/:id`,
			component: React.lazy(() => import('./page/RevaluationEdit'))
		}
	]
};

export default RevaluationConfig;
