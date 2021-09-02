import { axios } from '@core/services/Api';
import { DATE_FORMATS, formatDate } from '@core/utils/utils';
import { Icon, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Loading from '@core/components/Loading';
import React, { useEffect, useState } from 'react';
import Table from '@core/components/Table';
// Components
import { DEPRECATION_PAGE_CREATE, DEPRECATION_PAGE_VIEW, DEPRECATION_URL_LIST } from '../DeprecationConst';

/**
 * @function DeprecationList
 * @brief Listado de depreciaciones
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
function DeprecationList() {
	const [skeleton, setSkeleton] = useState(true);
	const [deprecations, setDeprecations] = useState([]);

	useEffect(() => {
		const success = data => {
			setDeprecations(data.deprecations?.reverse());
			setSkeleton(false);
		};

		axios({ url: DEPRECATION_URL_LIST, method: 'GET', success });
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
				<Link to={`${DEPRECATION_PAGE_VIEW}/${row.id}`} role="button">
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
			title="Depreciaciones"
			columns={columns}
			data={deprecations}
			button={{ text: 'Crear depreciación', href: DEPRECATION_PAGE_CREATE }}
		/>
	);
}

export default DeprecationList;
