import { axios } from '@core/services/Api';
import { Icon, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Loading from '@core/components/Loading';
import React, { useEffect, useState } from 'react';
import Table from '@core/components/Table';
// Components
import {
	PARAMETER_PAGE_CREATE,
	PARAMETER_PAGE_LIST_DETAIL,
	PARAMETER_PAGE_VIEW,
	PARAMETER_URL_LIST,
	PARAMETER_URL_LIST_DETAIL
} from '../ParameterConst';

/**
 * @function ParameterList
 * @brief Listado de parámetros
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
function ParameterList(props) {
	const { id } = props?.match?.params;

	const [skeleton, setSkeleton] = useState(true);
	const [parameters, setParameters] = useState([]);
	const [parent, setParent] = useState(null);

	useEffect(() => {
		const success = data => {
			setParameters(data.parameters.reverse());
			setParent(data.parameter);
			setSkeleton(false);
		};

		axios({ url: id ? `${PARAMETER_URL_LIST_DETAIL}/${id}` : PARAMETER_URL_LIST, method: 'GET', success });
	}, [id]);

	const columns = [
		{
			name: 'Key',
			accesor: 'parameter_key',
			selector: row => row.parameter_key,
			sortable: true,
			maxWidth: '300px'
		},
		{
			name: 'Parámetro',
			accesor: 'name',
			selector: row => row.name,
			sortable: true,
			maxWidth: '200px'
		},
		{
			name: 'Valor numérico',
			accesor: 'num_val',
			selector: row => row.num_val,
			sortable: true,
			right: true,
			maxWidth: '150px'
		},
		{
			name: 'Valor en texto',
			accesor: 'str_val',
			selector: row => row.str_val,
			sortable: true,
			maxWidth: '350px'
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
					<Link to={`${PARAMETER_PAGE_LIST_DETAIL}/${row.id}`} role="button">
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
			title={parent ? `Detalles de: ${parent?.name || parent?.str_val}` : 'Parámetros'}
			columns={columns}
			data={parameters}
			button={parent && { text: 'Crear parámetro', href: `${PARAMETER_PAGE_CREATE}/${parent?.id}` }}
		/>
	);
}

export default ParameterList;
