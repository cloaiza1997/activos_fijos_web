import { axios } from '@core/services/Api';
import { DATE_FORMATS, formatDate } from '@core/utils/utils';
import { Icon, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Loading from '@core/components/Loading';
import React, { useEffect, useState } from 'react';
import Table from '@core/components/Table';
// Components}
import { DERECOGNITION_PAGE_CREATE, DERECOGNITION_PAGE_VIEW, DERECOGNITION_URL_LIST } from '../DerecognitionConst';

/**
 * @function DerecognitionList
 * @brief Listado de bajas
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
function DerecognitionList() {
	const [skeleton, setSkeleton] = useState(true);
	const [derecognitions, setDerecognitions] = useState([]);

	useEffect(() => {
		const success = data => {
			setDerecognitions(data.derecognitions?.reverse());
			setSkeleton(false);
		};

		axios({ url: DERECOGNITION_URL_LIST, method: 'GET', success });
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
			accesor: 'get_creator_user.display_name',
			selector: row => row.get_creator_user?.display_name,
			sortable: true,
			center: true
		},
		{
			name: 'Fecha de aprobación',
			accesor: 'approved_at',
			selector: row => (row.approved_at ? formatDate(row.approved_at, DATE_FORMATS.YYYY_MM_DD_hh_mm_ss) : ''),
			sortable: true,
			center: true
		},
		{
			name: 'Aprobado por',
			accesor: 'get_approver_user.display_name',
			selector: row => row.get_approver_user?.display_name,
			sortable: true,
			center: true
		},
		{
			name: 'Estado',
			accesor: 'get_status.str_val',
			selector: row => row.get_status?.str_val,
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
				<Link to={`${DERECOGNITION_PAGE_VIEW}/${row.id}`} role="button">
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
			title="Bajas"
			columns={columns}
			data={derecognitions}
			button={{ text: 'Iniciar proceso de bajas', href: DERECOGNITION_PAGE_CREATE }}
		/>
	);
}

export default DerecognitionList;
