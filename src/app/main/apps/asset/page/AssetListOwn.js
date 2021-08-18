import { axios } from '@core/services/Api';
import { Icon, IconButton } from '@material-ui/core';
import Loading from '@core/components/Loading';
import React, { useEffect, useState } from 'react';
import Table from '@core/components/Table';
// Components
import { ASSET_PAGE_VIEW, ASSET_URL_LIST_OWN } from '../AssetConst';

function AssetListOwn() {
	const [skeleton, setSkeleton] = useState(true);
	const [assets, setAssets] = useState([]);

	useEffect(() => {
		const success = data => {
			setAssets(data.assets.map(asset => ({ ...asset, id_table: `${asset.id}${asset.certificate_number}` })));
			setSkeleton(false);
		};

		axios({ url: ASSET_URL_LIST_OWN, method: 'GET', success });
	}, []);

	const columns = [
		{
			name: 'Acta Nº',
			accesor: 'certificate_number',
			selector: row => row.certificate_number,
			sortable: true,
			center: true,
			minWidth: '90px',
			maxWidth: '90px'
		},
		{
			name: 'Activo Nº',
			accesor: 'asset_number',
			selector: row => row.asset_number,
			sortable: true,
			center: true,
			minWidth: '120px',
			maxWidth: '120px'
		},
		{
			name: 'Activo',
			accesor: 'name',
			selector: row => row.name,
			sortable: true
		},
		{
			name: 'Marca',
			accesor: 'brand',
			selector: row => row.brand,
			sortable: true
		},
		{
			name: 'Marca',
			accesor: 'brand',
			selector: row => row.brand,
			sortable: true
		},
		{
			name: 'Fecha de entrega',
			accesor: 'delivered_at',
			selector: row => row.delivered_at,
			sortable: true,
			center: true
		},
		{
			name: 'Fecha de firma',
			accesor: 'received_at',
			selector: row => row.received_at,
			sortable: true,
			center: true
		},
		{
			name: 'Entregado por',
			accesor: 'deliver_user',
			selector: row => row.deliver_user,
			sortable: true,
			center: true
		},
		{
			name: 'Estado de acta',
			accesor: 'certificate_status',
			selector: row => row.certificate_status,
			sortable: true,
			center: true
		},
		{
			name: '',
			center: true,
			minWidth: '60px',
			maxWidth: '60px',
			cell: row => (
				<IconButton size="small" href={`${ASSET_PAGE_VIEW}/${row.id}`}>
					<Icon color="primary">launch</Icon>
				</IconButton>
			)
		}
	];

	return skeleton ? (
		<Loading />
	) : (
		<Table title="Listado de activos asignados" columns={columns} data={assets} keyField="id_table" />
	);
}

export default AssetListOwn;
