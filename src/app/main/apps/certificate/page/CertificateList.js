import { axios } from '@core/services/Api';
// import { Icon, IconButton } from '@material-ui/core';
import Loading from '@core/components/Loading';
import React, { useEffect, useState } from 'react';
import Table from '@core/components/Table';
// Components
import { CERTIFICATE_PAGE_CREATE, CERTIFICATE_URL_LIST } from '../CertificateConst';

function CertificateList() {
	const [skeleton, setSkeleton] = useState(true);
	const [certificates, setCertificates] = useState([]);

	useEffect(() => {
		const success = data => {
			// setCertificates(data.certificates);
			setCertificates([]);
			setSkeleton(false);
		};

		axios({ url: CERTIFICATE_URL_LIST, method: 'GET', success });
	}, []);

	const columns = [
		// {
		// 	name: 'Nº',
		// 	accesor: 'asset_number',
		// 	selector: row => row.asset_number,
		// 	sortable: true,
		// 	center: true
		// },
		// {
		// 	name: 'Nombre',
		// 	accesor: 'name',
		// 	selector: row => row.name,
		// 	sortable: true
		// },
		// {
		// 	name: 'Grupo',
		// 	accesor: 'group',
		// 	selector: row => row.group,
		// 	sortable: true
		// },
		// {
		// 	name: 'Tipo',
		// 	accesor: 'type',
		// 	selector: row => row.type,
		// 	sortable: true
		// },
		// {
		// 	name: 'Marca',
		// 	accesor: 'brand',
		// 	selector: row => row.brand,
		// 	sortable: true
		// },
		// {
		// 	name: 'Estado',
		// 	accesor: 'status',
		// 	selector: row => row.status,
		// 	sortable: true,
		// 	center: true
		// },
		// {
		// 	name: 'Responsable',
		// 	accesor: 'user',
		// 	selector: row => row.user,
		// 	sortable: true
		// },
		// {
		// 	name: '',
		// 	center: true,
		// 	cell: row => (
		// 		<IconButton size="small" href={`${ASSET_PAGE_VIEW}/${row.id}`}>
		// 			<Icon color="primary">launch</Icon>
		// 		</IconButton>
		// 	)
		// }
	];

	return skeleton ? (
		<Loading />
	) : (
		<Table
			title="Actas de movimiento"
			columns={columns}
			data={certificates}
			button={{ text: 'Generar acta', href: CERTIFICATE_PAGE_CREATE }}
		/>
	);
}

export default CertificateList;
