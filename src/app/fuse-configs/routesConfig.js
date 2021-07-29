import { Redirect } from 'react-router-dom';
import { LOGIN_INDEX } from 'app/main/login/LoginConsts';
import appsConfigs from 'app/main/apps/appsConfigs';
import authRoleExamplesConfigs from 'app/main/auth/authRoleExamplesConfigs';
import CallbackConfig from 'app/main/callback/CallbackConfig';
import DocumentationConfig from 'app/main/documentation/DocumentationConfig';
import FuseUtils from '@fuse/utils';
import LoginConfig from 'app/main/login/LoginConfig';
import LogoutConfig from 'app/main/logout/LogoutConfig';
import pagesConfigs from 'app/main/pages/pagesConfigs';
import React from 'react';
import RegisterConfig from 'app/main/register/RegisterConfig';
import UserInterfaceConfig from 'app/main/user-interface/UserInterfaceConfig';

const routeConfigs = [
	...appsConfigs,
	// ...pagesConfigs,
	// ...authRoleExamplesConfigs,
	// UserInterfaceConfig,
	// DocumentationConfig,
	// LogoutConfig,
	LoginConfig
	// RegisterConfig,
	// LogoutConfig,
	// CallbackConfig
];

const routes = [
	// if you want to make whole app auth protected by default change defaultAuth for example:
	// ...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['admin','staff','user']),
	// The individual route configs which has auth option won't be overridden.
	...FuseUtils.generateRoutesFromConfigs(routeConfigs, null),
	// {
	// 	path: '/apps/dashboards/project',
	// 	exact: true,
	// 	component: () => <Redirect to={LOGIN_INDEX} />
	// },
	{
		path: '/',
		exact: true,
		component: () => <Redirect to={LOGIN_INDEX} />
	},
	{
		component: () => <Redirect to="/pages/errors/error-404" />
	}
];

export default routes;
