import { formatDate } from '@core/utils/utils';
import { Icon, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import React from 'react';
import Table from '@core/components/Table';
// Components
import { INVENTORY_PAGE_VIEW } from '../../inventory/InventoryConst';

/**
 * @function AssetInventories
 * @brief Listado de inventarios
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
function AssetInventories(props) {
	const { inventories = [] } = props;

	const columns = [
		{
			name: 'Nº',
			accesor: 'id_inventory',
			selector: row => row.id_inventory,
			sortable: true,
			center: true
		},
		{
			name: 'Fecha proceso',
			accesor: 'created_at',
			selector: row => formatDate(row.created_at),
			sortable: true
		},
		{
			name: 'Realizado por',
			accesor: 'inventory.get_user.display_name',
			selector: row => row.inventory.get_user.display_name,
			sortable: true
		},
		{
			name: '',
			center: true,
			cell: row => (
				<Link to={`${INVENTORY_PAGE_VIEW}/${row.id_inventory}`} role="button" target="_blank">
					<IconButton size="small">
						<Icon color="primary">launch</Icon>
					</IconButton>
				</Link>
			)
		}
	];

	return <Table title="Inventarios" columns={columns} data={inventories.reverse()} />;
}

export default AssetInventories;
