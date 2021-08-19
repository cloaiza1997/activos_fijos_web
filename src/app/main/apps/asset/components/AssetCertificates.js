import { Icon, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import React from 'react';
import Table from '@core/components/Table';
// Components
import { CERTIFICATE_PAGE_VIEW } from '../../certificate/CertificateConst';

function AssetCertificates(props) {
	const { certificates = [] } = props;

	const columns = [
		{
			name: 'Nº',
			accesor: 'certificate_number',
			selector: row => row.certificate_number,
			sortable: true,
			center: true
		},
		{
			name: 'Fecha entrega',
			accesor: 'delivered_at',
			selector: row => row.delivered_at,
			sortable: true
		},
		{
			name: 'Fecha firma',
			accesor: 'received_at',
			selector: row => row.received_at,
			sortable: true
		},
		{
			name: 'Entregado por',
			accesor: 'deliver_user',
			selector: row => row.deliver_user,
			sortable: true
		},
		{
			name: 'Responsable',
			accesor: 'receiver_user',
			selector: row => row.receiver_user,
			sortable: true
		},
		{
			name: 'Estado',
			accesor: 'status',
			selector: row => row.status,
			sortable: true,
			center: true
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

	return <Table title="Actas de movimiento" columns={columns} data={certificates} />;
}

export default AssetCertificates;
