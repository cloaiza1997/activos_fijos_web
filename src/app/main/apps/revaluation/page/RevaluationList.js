import { axios } from '@core/services/Api';
import { DATE_FORMATS, formatDate } from '@core/utils/utils';
import { Icon, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Loading from '@core/components/Loading';
import React, { useEffect, useState } from 'react';
import Table from '@core/components/Table';
// Components
import { REVALUATION_URL_LIST, REVALUATION_PAGE_CREATE, REVALUATION_PAGE_VIEW } from '../RevaluationConst';

/**
 * @function RevaluationList
 * @brief Listado de revaluaciones
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
function RevaluationList() {
	const [skeleton, setSkeleton] = useState(true);
	const [revaluations, setRevaluations] = useState([]);

	useEffect(() => {
		const success = data => {
			setRevaluations(data.revaluations);
			setSkeleton(false);
		};

		axios({ url: REVALUATION_URL_LIST, method: 'GET', success });
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
			name: 'Fecha de revaluación',
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
			name: 'Nº reversado',
			accesor: 'id_parent',
			selector: row => row.id_parent,
			sortable: true,
			center: true
		},
		{
			name: '',
			sortable: true,
			center: true,
			cell: row => (
				<Link to={`${REVALUATION_PAGE_VIEW}/${row.id}`} role="button">
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
			title="Revaluaciones"
			columns={columns}
			data={revaluations}
			button={{ text: 'Crear revaluación', href: REVALUATION_PAGE_CREATE }}
		/>
	);
}

export default RevaluationList;
