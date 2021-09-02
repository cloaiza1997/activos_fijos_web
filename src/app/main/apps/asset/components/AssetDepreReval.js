import { formatDate } from '@core/utils/utils';
import { Icon, IconButton, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import React from 'react';
import Table from '@core/components/Table';
// Components
import { REVALUATION_PAGE_VIEW } from '../../revaluation/RevaluationConst';

function AssetRevaluations(props) {
	const { asset = {} } = props;

	const columns = [
		{
			name: 'Nº',
			accesor: 'id_depre_reval',
			selector: row => row.id_depre_reval,
			sortable: true,
			center: true
		},
		{
			name: 'Acción',
			accesor: 'depre_reval.get_action_type.str_val',
			selector: row => row.depre_reval.get_action_type.str_val,
			sortable: true,
			center: true
		},
		{
			name: 'Estado',
			accesor: 'depre_reval.get_status.str_val',
			selector: row => row.depre_reval.get_status.str_val,
			sortable: true,
			center: true
		},
		{
			name: 'Fecha de ejecución',
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
			title={
				<div className="mb-10">
					<Typography component="h1" color="primary" className="text-xl font-bold mb-10">
						Depreciaciones y Revaluaciones
					</Typography>

					<div className="flex flex-col text-sm">
						<span>• Costo actual: $ {asset.current_value}</span>

						<span>• Costo inicial: $ {asset.init_value}</span>

						<span>• Valor residual: $ {asset.residual_value}</span>
					</div>
				</div>
			}
			columns={columns}
			data={asset.get_depre_reval.reverse()}
		/>
	);
}

export default AssetRevaluations;
