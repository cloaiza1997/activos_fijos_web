import { formatDate } from '@core/utils/utils';
import { Icon, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import React from 'react';
import Table from '@core/components/Table';
// Components
import { MAINTENANCE_PAGE_VIEW } from '../../maintenance/MaintenanceConst';

/**
 * @function AssetMaintenances
 * @brief Listado de mantenimientos
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
function AssetMaintenances(props) {
	const { maintenances = [] } = props;

	const columns = [
		{
			name: 'Nº',
			accesor: 'id_maintenance',
			selector: row => row.id_maintenance,
			sortable: true,
			center: true
		},
		{
			name: 'Fecha de realización',
			accesor: 'executed_at',
			selector: row => formatDate(row.executed_at),
			sortable: true
		},
		{
			name: 'Tipo de mantenimiento',
			accesor: 'maintenance.get_type.str_val',
			selector: row => row.maintenance.get_type.str_val,
			sortable: true
		},
		{
			name: 'Estado',
			accesor: 'maintenance.get_status.str_val',
			selector: row => row.maintenance.get_status.str_val,
			sortable: true
		},
		{
			name: '',
			center: true,
			cell: row => (
				<Link to={`${MAINTENANCE_PAGE_VIEW}/${row.id_maintenance}`} role="button" target="_blank">
					<IconButton size="small">
						<Icon color="primary">launch</Icon>
					</IconButton>
				</Link>
			)
		}
	];

	return <Table title="Mantenimientos" columns={columns} data={maintenances.reverse()} />;
}

export default AssetMaintenances;
