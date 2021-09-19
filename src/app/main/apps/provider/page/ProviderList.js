import { axios } from '@core/services/Api';
import { Icon, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Loading from '@core/components/Loading';
import React, { useEffect, useState } from 'react';
import Table from '@core/components/Table';
// Components
import { PROVIDER_PAGE_CREATE, PROVIDER_PAGE_VIEW, PROVIDER_URL_LIST } from '../ProviderConst';

/**
 * @function ProviderList
 * @brief Listado de proveedores
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
function ProviderList() {
	const [skeleton, setSkeleton] = useState(true);
	const [providers, setProviders] = useState([]);

	useEffect(() => {
		const success = data => {
			setProviders(data.providers.reverse());
			setSkeleton(false);
		};

		axios({ url: PROVIDER_URL_LIST, method: 'GET', success });
	}, []);

	const columns = [
		{
			name: 'Tipo de documento',
			accesor: 'get_document_type.str_val',
			selector: row => row.get_document_type.str_val,
			sortable: true,
			center: true
		},
		{
			name: 'Número de documento',
			accesor: 'document_number',
			selector: row => row.document_number,
			sortable: true
		},
		{
			name: 'Nombre',
			accesor: 'name',
			selector: row => row.name,
			sortable: true
		},
		{
			name: 'Dirección',
			accesor: 'address',
			selector: row => row.address,
			sortable: true
		},
		{
			name: 'Correo',
			accesor: 'email',
			selector: row => row.email,
			sortable: true
		},
		{
			name: 'Teléfono',
			accesor: 'phone_number',
			selector: row => row.phone_number,
			sortable: true
		},
		{
			name: 'Estado',
			accesor: 'is_active',
			selector: row => (row.is_active ? 'Activo' : 'Inactivo'),
			sortable: true,
			center: true
		},
		{
			name: '',
			sortable: true,
			center: true,
			cell: row => (
				<Link to={`${PROVIDER_PAGE_VIEW}/${row.id}`} role="button">
					<IconButton size="small">
						<Icon color="primary">launch</Icon>
					</IconButton>
				</Link>
			)
		}
	];

	return skeleton ? (
		<Loading />
	) : (
		<Table
			title="Proveedores"
			columns={columns}
			data={providers}
			button={{ text: 'Crear proveedor', href: PROVIDER_PAGE_CREATE }}
		/>
	);
}

export default ProviderList;
