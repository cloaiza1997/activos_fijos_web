import { axios } from '@core/services/Api';
import { Icon, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Loading from '@core/components/Loading';
import React, { useEffect, useState } from 'react';
import Table from '@core/components/Table';
// Components
import { PARAMETER_PAGE_CREATE, PARAMETER_PAGE_VIEW, PARAMETER_URL_LIST } from '../ParameterConst';

/**
 * @function ParameterList
 * @brief Listado de parámetros
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
function ParameterList() {
	const [skeleton, setSkeleton] = useState(true);
	const [providers, setProviders] = useState([]);

	useEffect(() => {
		const success = data => {
			setProviders(data.parameters.reverse());
			setSkeleton(false);
		};

		axios({ url: PARAMETER_URL_LIST, method: 'GET', success });
	}, []);

	const columns = [
		{
			name: 'Parámetro',
			accesor: 'name',
			selector: row => row.name,
			sortable: true
		},
		{
			name: 'Descripción',
			accesor: 'description',
			selector: row => row.description,
			sortable: true
		},
		{
			name: 'Valor numérico',
			accesor: 'num_val',
			selector: row => row.num_val,
			sortable: true,
			right: true
		},
		{
			name: 'Valor en texto',
			accesor: 'str_val',
			selector: row => row.str_val,
			sortable: true
		},
		{
			name: 'Estado',
			accesor: 'is_active',
			minWidth: '90px',
			maxWidth: '90px',
			selector: row => (row.is_active ? 'Activo' : 'Inactivo'),
			sortable: true,
			center: true
		},
		{
			name: 'Editar',
			sortable: true,
			center: true,
			minWidth: '90px',
			maxWidth: '90px',
			cell: row =>
				!!row.is_editable && (
					<Link to={`${PARAMETER_PAGE_VIEW}/${row.id}`} role="button">
						<IconButton size="small">
							<Icon color="primary">launch</Icon>
						</IconButton>
					</Link>
				)
		},
		{
			name: 'Detalles',
			sortable: true,
			center: true,
			minWidth: '90px',
			maxWidth: '90px',
			cell: row =>
				!!row.is_editable_details && (
					<Link to={`${PARAMETER_PAGE_VIEW}/${row.id}`} role="button">
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
			title="Parámetros"
			columns={columns}
			data={providers}
			button={{ text: 'Crear parámetro', href: PARAMETER_PAGE_CREATE }}
		/>
	);
}

export default ParameterList;
