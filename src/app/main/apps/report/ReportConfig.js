import { authRoles } from 'app/auth';
import React from 'react';
import { REPORT_PAGE } from './ReportConst';

const ReportConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			auth: authRoles.admin,
			path: REPORT_PAGE,
			component: React.lazy(() => import('./page/ReportList'))
		}
	]
};

export default ReportConfig;
