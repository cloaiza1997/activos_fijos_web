import { authRoles } from 'app/auth';
import React from 'react';
import {
	CERTIFICATE_PAGE_CREATE,
	CERTIFICATE_PAGE_LIST,
	CERTIFICATE_PAGE_LIST_APPROVE,
	CERTIFICATE_PAGE_LIST_OWN,
	CERTIFICATE_PAGE_VIEW
} from './CertificateConst';

const CertificateConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			auth: authRoles.admin,
			path: CERTIFICATE_PAGE_CREATE,
			component: React.lazy(() => import('./page/CertificateCreate'))
		},
		{
			auth: authRoles.user,
			path: `${CERTIFICATE_PAGE_VIEW}/:id`,
			component: React.lazy(() => import('./page/CertificateView'))
		},
		{
			auth: authRoles.admin,
			path: CERTIFICATE_PAGE_LIST,
			component: React.lazy(() => import('./page/CertificateList'))
		},
		{
			auth: authRoles.approver,
			path: CERTIFICATE_PAGE_LIST_APPROVE,
			component: React.lazy(() => import('./page/CertificateListApprove'))
		},
		{
			auth: authRoles.user,
			path: CERTIFICATE_PAGE_LIST_OWN,
			component: React.lazy(() => import('./page/CertificateListOwn'))
		}
	]
};

export default CertificateConfig;
