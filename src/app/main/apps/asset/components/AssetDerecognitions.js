import { formatDate } from '@core/utils/utils';
import { Icon, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import React from 'react';
import Table from '@core/components/Table';
// Components
import { DERECOGNITION_PAGE_VIEW } from '../../derecognition/DerecognitionConst';

/**
 * @function AssetDerecognitions
 * @brief Listado de bajas
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
function AssetDerecognitions(props) {
	const { derecognitions = [] } = props;

	const columns = [
		{
			name: 'Nº',
			accesor: 'id_derecognition',
			selector: row => row.id_derecognition,
			sortable: true,
			center: true
		},
		{
			name: 'Fecha ejecución',
			accesor: 'updated_at',
			selector: row => formatDate(row.updated_at),
			sortable: true
		},
		{
			name: 'Realizado por',
			accesor: 'derecognition.get_derecognition.get_creator_user.display_name',
			selector: row => row.derecognition.get_derecognition.get_creator_user.display_name,
			sortable: true
		},
		{
			name: 'Motivo',
			accesor: 'derecognition.get_reason.str_val',
			selector: row => row.derecognition.get_reason.str_val,
			sortable: true
		},
		{
			name: '',
			center: true,
			cell: row => (
				<Link to={`${DERECOGNITION_PAGE_VIEW}/${row.id_derecognition}`} role="button" target="_blank">
					<IconButton size="small">
						<Icon color="primary">launch</Icon>
					</IconButton>
				</Link>
			)
		}
	];

	return <Table title="Bajas" columns={columns} data={derecognitions.reverse()} />;
}

export default AssetDerecognitions;
