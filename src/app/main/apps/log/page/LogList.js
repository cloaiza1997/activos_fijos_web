import { axios } from '@core/services/Api';
import { DATE_FORMATS, formatDate } from '@core/utils/utils';
import Loading from '@core/components/Loading';
import React, { useEffect, useState } from 'react';
import Table from '@core/components/Table';
// Components
import { LOG_URL_LIST } from '../LogConst';

/**
 * @function LogList
 * @brief Listado de logs
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
function LogList() {
	const [skeleton, setSkeleton] = useState(true);
	const [users, setLogs] = useState([]);

	useEffect(() => {
		const success = data => {
			setLogs(data.logs.reverse());
			setSkeleton(false);
		};

		axios({ url: LOG_URL_LIST, method: 'GET', success });
	}, []);

	const columns = [
		{
			name: 'Usuario',
			accesor: 'get_user.display_name',
			selector: row => row.get_user?.display_name,
			sortable: true,
			center: true
		},
		{
			name: 'Módulo/Proceso',
			accesor: 'get_app_key.str_val',
			selector: row => row.get_app_key.str_val,
			sortable: true
		},
		{
			name: 'Registro',
			accesor: 'id_register',
			selector: row => row.id_register,
			sortable: true
		},
		{
			name: 'Descripción',
			accesor: 'description',
			selector: row => row.description,
			sortable: true
		},
		{
			name: 'Ip',
			accesor: 'ip',
			selector: row => row.ip,
			sortable: true
		},
		{
			name: 'Cliente',
			accesor: 'client',
			selector: row => row.client,
			sortable: true
		},
		{
			name: 'Fecha',
			accesor: 'created_at',
			selector: row => formatDate(row.created_at, DATE_FORMATS.DD_MM_YYYY),
			sortable: true
		},
		{
			name: 'Hora',
			accesor: 'created_at',
			selector: row => formatDate(row.created_at, DATE_FORMATS.hh_mm_ss),
			sortable: true
		}
	];

	return skeleton ? <Loading /> : <Table title="Logs de auditoría" columns={columns} data={users} exportReport />;
}

export default LogList;
