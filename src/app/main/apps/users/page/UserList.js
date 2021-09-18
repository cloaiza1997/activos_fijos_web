import { axios } from '@core/services/Api';
import { Icon, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Loading from '@core/components/Loading';
import React, { useEffect, useState } from 'react';
import Table from '@core/components/Table';
// Components
import { USER_PAGE_CREATE, USER_PAGE_VIEW, USER_URL_LIST } from '../UsersConst';

/**
 * @function UserList
 * @brief Listado de usuarios
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
function UserList() {
	const [skeleton, setSkeleton] = useState(true);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const success = data => {
			setUsers(data.users.reverse());
			setSkeleton(false);
		};

		axios({ url: USER_URL_LIST, method: 'GET', success });
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
			name: 'Apellidos',
			accesor: 'last_name',
			selector: row => row.last_name,
			sortable: true
		},
		{
			name: 'Correo',
			accesor: 'email',
			selector: row => row.email,
			sortable: true
		},
		{
			name: 'Correo',
			accesor: 'get_role.str_val',
			selector: row => row.get_role.str_val,
			sortable: true
		},
		{
			name: 'Estado',
			accesor: 'get_status.str_val',
			selector: row => row.get_status.str_val,
			sortable: true,
			center: true
		},
		{
			name: '',
			sortable: true,
			center: true,
			cell: row => (
				<Link to={`${USER_PAGE_VIEW}/${row.id}`} role="button">
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
			title="Usuarios"
			columns={columns}
			data={users}
			button={{ text: 'Crear usuario', href: USER_PAGE_CREATE }}
		/>
	);
}

export default UserList;
