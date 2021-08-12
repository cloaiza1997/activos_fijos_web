import { axios } from '@core/services/Api';
import { Icon, IconButton } from '@material-ui/core';
import Loading from '@core/components/Loading';
import React, { useEffect, useState } from 'react';
import Table from '@core/components/Table';
// Components
import { ASSET_PAGE_CREATE, ASSET_PAGE_VIEW, ASSET_URL_LIST } from '../AssetConst';

function AssetList() {
	const [skeleton, setSkeleton] = useState(true);
	const [assets, setAssets] = useState([]);

	useEffect(() => {
		const success = data => {
			setAssets(data.assets);
			setSkeleton(false);
		};

		axios({ url: ASSET_URL_LIST, method: 'GET', success });
	}, []);

	const columns = [
		{
			name: 'Nº',
			accesor: 'asset_number',
			selector: row => row.asset_number,
			sortable: true,
			center: true
		},
		{
			name: 'Nombre',
			accesor: 'name',
			selector: row => row.name,
			sortable: true
		},
		{
			name: 'Grupo',
			accesor: 'group',
			selector: row => row.group,
			sortable: true
		},
		{
			name: 'Tipo',
			accesor: 'type',
			selector: row => row.type,
			sortable: true
		},
		{
			name: 'Marca',
			accesor: 'brand',
			selector: row => row.brand,
			sortable: true
		},
		{
			name: 'Estado',
			accesor: 'status',
			selector: row => row.status,
			sortable: true,
			center: true
		},
		{
			name: 'Responsable',
			accesor: 'user',
			selector: row => row.user,
			sortable: true
		},
		{
			name: '',
			center: true,
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
		<Table
			title="Listado de activos"
			columns={columns}
			data={assets}
			button={{ text: 'Ingresar activo', href: ASSET_PAGE_CREATE }}
		/>
	);
}

export default AssetList;
