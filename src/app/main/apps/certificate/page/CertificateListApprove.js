import { axios } from '@core/services/Api';
import { Icon, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Loading from '@core/components/Loading';
import React, { useEffect, useState } from 'react';
import Table from '@core/components/Table';
// Components
import { CERTIFICATE_PAGE_VIEW, CERTIFICATE_URL_LIST_APPROVE } from '../CertificateConst';

/**
 * @function CertificateListApprove
 * @brief Página de listado de aprobación de actas
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
function CertificateListApprove() {
	const [skeleton, setSkeleton] = useState(true);
	const [certificates, setCertificates] = useState([]);

	useEffect(() => {
		const success = data => {
			setCertificates(data.certificates);
			setSkeleton(false);
		};

		axios({ url: CERTIFICATE_URL_LIST_APPROVE, method: 'GET', success });
	}, []);

	const columns = [
		{
			name: 'Nº',
			accesor: 'id',
			selector: row => row.id,
			sortable: true,
			center: true,
			cell: row => `${row.id}`.padStart(6, '0')
		},
		{
			name: 'Fecha entrega',
			accesor: 'delivered_at',
			selector: row => row.delivered_at,
			sortable: true
		},
		{
			name: 'Entregado por',
			accesor: 'get_deliver_user.display_name',
			selector: row => row.get_deliver_user.display_name,
			sortable: true
		},
		{
			name: 'Responsable',
			accesor: 'get_receiver_user.display_name',
			selector: row => row.get_receiver_user.display_name,
			sortable: true
		},
		{
			name: '',
			center: true,
			cell: row => (
				<Link to={`${CERTIFICATE_PAGE_VIEW}/${row.id}`} role="button">
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
		<Table title="Actas de movimiento por aprobación" columns={columns} data={certificates} />
	);
}

export default CertificateListApprove;
