import { axios } from '@core/services/Api';
import { DATE_FORMATS, formatDate } from '@core/utils/utils';
import { Icon, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Loading from '@core/components/Loading';
import React, { useEffect, useState } from 'react';
import Table from '@core/components/Table';
// Components}
import { INVENTORY_PAGE_CREATE, INVENTORY_PAGE_VIEW, INVENTORY_URL_LIST } from '../InventoryConst';

/**
 * @function InventoryList
 * @brief Listado de inventarios
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
function InventoryList() {
	const [skeleton, setSkeleton] = useState(true);
	const [inventories, setInventories] = useState([]);

	useEffect(() => {
		const success = data => {
			setInventories(data.inventories?.reverse());
			setSkeleton(false);
		};

		axios({ url: INVENTORY_URL_LIST, method: 'GET', success });
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
			name: 'Fecha de creación',
			accesor: 'created_at',
			selector: row => formatDate(row.created_at, DATE_FORMATS.YYYY_MM_DD_hh_mm_ss),
			sortable: true,
			center: true
		},
		{
			name: 'Ejecutado por',
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
				<Link to={`${INVENTORY_PAGE_VIEW}/${row.id}`} role="button">
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
			title="Inventarios"
			columns={columns}
			data={inventories}
			button={{ text: 'Realizar inventario', href: INVENTORY_PAGE_CREATE }}
		/>
	);
}

export default InventoryList;
