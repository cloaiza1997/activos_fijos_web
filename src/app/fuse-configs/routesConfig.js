import { LOGIN_INDEX } from 'app/main/login/LoginConsts';
import { LS_USER } from 'app/auth/AuthConsts';
import { Redirect } from 'react-router-dom';
import appsConfigs from 'app/main/apps/appsConfigs';
import FuseUtils from '@fuse/utils';
import LoginConfig from 'app/main/login/LoginConfig';
import React from 'react';

const routeConfigs = [...appsConfigs, LoginConfig];

const routes = [
	// if you want to make whole app auth protected by default change defaultAuth for example:
	// ...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['admin','staff','user']),
	// The individual route configs which has auth option won't be overridden.
	...FuseUtils.generateRoutesFromConfigs(routeConfigs, null),
	{
		path: '/',
		exact: true,
		component: () => <Redirect to={localStorage.getItem(LS_USER) ? '/' : LOGIN_INDEX} />
	}
];

export default routes;
