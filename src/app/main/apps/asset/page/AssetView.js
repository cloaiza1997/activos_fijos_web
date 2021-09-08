import { axios } from '@core/services/Api';
import { getPathByParams, redirect } from '@core/utils/utils';
import { Tab, Tabs } from '@material-ui/core';
import Loading from '@core/components/Loading';
import React, { useEffect, useState } from 'react';
// Components
import { ASSET_PAGE_LIST, ASSET_URL_EDIT } from '../AssetConst';
import AssetAttachments from '../components/AssetAttachments';
import AssetCertificates from '../components/AssetCertificates';
import AssetEdit from '../components/AssetEdit';
import AssetDepreReval from '../components/AssetDepreReval';
import AssetInventories from '../components/AssetInventories';

function AssetView(props) {
	const { id } = props?.match?.params;

	const [data, setData] = useState({});
	const [skeleton, setSkeleton] = useState(true);
	const [tab, setTab] = useState(0);

	const tabs = [
		{ label: 'Información', component: <AssetEdit data={data} setData={setData} /> },
		{ label: 'Adjuntos', component: <AssetAttachments data={data} setData={setData} /> },
		{ label: 'Actas', component: <AssetCertificates certificates={data?.asset?.certificates} /> },
		{ label: 'Depreciaciones y Revaluaciones', component: <AssetDepreReval asset={data?.asset} /> },
		{ label: 'Mantenimientos', component: null },
		{ label: 'Inventarios', component: <AssetInventories inventories={data?.asset?.get_inventories} /> },
		{ label: 'Bajas', component: null }
	];

	useEffect(() => {
		const success = response => {
			const { asset } = response;

			if (asset) {
				setData(response);
				setSkeleton(false);
			} else {
				error();
			}
		};

		const error = () => redirect(ASSET_PAGE_LIST);

		axios({ url: getPathByParams(ASSET_URL_EDIT, { id }), method: 'GET', success });
		// eslint-disable-next-line
	}, []);

	return skeleton ? (
		<Loading />
	) : (
		<div>
			<Tabs
				value={tab}
				onChange={(event, index) => setTab(index)}
				indicatorColor="primary"
				textColor="primary"
				variant="scrollable"
				scrollButtons="auto"
				classes={{ root: 'bg-white shadow-md' }}
			>
				{tabs.map((_tab, index) => (
					<Tab key={index} label={_tab.label} className="w-auto" />
				))}
			</Tabs>

			<div className="p-20">{tabs[tab].component}</div>
		</div>
	);
}

export default AssetView;
