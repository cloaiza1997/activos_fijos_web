import { formatDate } from '@core/utils/utils';
import { Icon, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import React from 'react';
import Table from '@core/components/Table';
// Components
import { REVALUATION_PAGE_VIEW } from '../../revaluation/RevaluationConst';

function AssetRevaluations(props) {
	const { asset = {} } = props;

	const columns = [
		{
			name: 'Fecha de revaluación',
			accesor: 'created_at',
			selector: row => formatDate(row.created_at),
			sortable: true,
			center: true
		},
		{
			name: 'Valor anterior',
			accesor: 'old_value',
			selector: row => `$ ${row.old_value}`,
			sortable: true,
			right: true
		},
		{
			name: 'Valor nuevo',
			accesor: 'new_value',
			selector: row => `$ ${row.new_value}`,
			sortable: true,
			right: true
		},
		{
			name: 'Observaciones',
			accesor: 'observations',
			selector: row => row.observations,
			sortable: true
		},
		{
			name: '',
			center: true,
			cell: row => (
				<Link to={`${REVALUATION_PAGE_VIEW}/${row.id_depre_reval}`} target="_blank" role="button">
					<IconButton size="small">
						<Icon color="primary">launch</Icon>
					</IconButton>
				</Link>
			)
		}
	];

	return (
		<Table
			title={`Revaluaciones - Costo actual $ ${asset.current_value}`}
			columns={columns}
			data={asset.get_revaluations}
		/>
	);
}

export default AssetRevaluations;
