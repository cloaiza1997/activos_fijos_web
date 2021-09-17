import { axios } from '@core/services/Api';
import { DATE_FORMATS, formatDate } from '@core/utils/utils';
import { Icon, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Loading from '@core/components/Loading';
import React, { useEffect, useState } from 'react';
import Table from '@core/components/Table';
// Components
import { MAINTENANCE_PAGE_CREATE, MAINTENANCE_PAGE_VIEW, MAINTENANCE_URL_LIST } from '../MaintenanceConst';

/**
 * @function MaintenanceList
 * @brief Listado de mantenimientos
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
function MaintenanceList() {
	const [skeleton, setSkeleton] = useState(true);
	const [maintenances, setMaintenances] = useState([]);

	useEffect(() => {
		const success = data => {
			setMaintenances(data.maintenances);
			setSkeleton(false);
		};

		axios({ url: MAINTENANCE_URL_LIST, method: 'GET', success });
	}, []);

	const columns = [
		{
			name: 'Nº',
			accesor: 'id',
			selector: row => row.id,
			sortable: true,
			center: true
		},
		{
			name: 'Tipo',
			accesor: 'get_type.str_val',
			selector: row => row.get_type.str_val,
			sortable: true
		},
		{
			name: 'Fecha de creación',
			accesor: 'created_at',
			selector: row => formatDate(row.created_at, DATE_FORMATS.YYYY_MM_DD_hh_mm_ss),
			sortable: true,
			center: true
		},
		{
			name: 'Programado por',
			accesor: 'get_user.display_name',
			selector: row => row.get_user.display_name,
			sortable: true,
			center: true
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
				<Link to={`${MAINTENANCE_PAGE_VIEW}/${row.id}`} role="button">
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
			title="Mantenimientos"
			columns={columns}
			data={maintenances}
			button={{ text: 'Crear mantenimiento', href: MAINTENANCE_PAGE_CREATE }}
		/>
	);
}

export default MaintenanceList;
