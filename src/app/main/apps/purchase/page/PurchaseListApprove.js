import { axios } from '@core/services/Api';
import { Icon, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Loading from '@core/components/Loading';
import React, { useEffect, useState } from 'react';
import Table from '@core/components/Table';
// Components
import { PURCHASE_URL_LIST_APPROVE, PURCHASE_PAGE_VIEW } from '../PurchaseConst';

function PurchaseListApprove() {
	const [skeleton, setSkeleton] = useState(true);
	const [purchases, setPurchases] = useState([]);

	useEffect(() => {
		const success = data => {
			setPurchases(data.purchases);
			setSkeleton(false);
		};

		axios({ url: PURCHASE_URL_LIST_APPROVE, method: 'GET', success });
	}, []);

	const columns = [
		{
			name: 'Nº',
			accesor: 'consecutive',
			selector: row => row.consecutive,
			sortable: true,
			center: true
		},
		{
			name: 'Fecha de creación',
			accesor: 'created_at',
			selector: row => row.created_at,
			sortable: true,
			center: true
		},
		{
			name: 'Fecha de entrega',
			accesor: 'delivery_date',
			selector: row => row.delivery_date,
			sortable: true,
			center: true
		},
		{
			name: 'Proveedor',
			accesor: 'provider',
			selector: row => row.provider,
			sortable: true
		},
		{
			name: 'Elaborada por',
			accesor: 'creator',
			selector: row => row.creator,
			sortable: true
		},
		{
			name: 'Ítems',
			accesor: 'items',
			selector: row => row.items,
			sortable: true,
			center: true
		},
		{
			name: 'Valor total',
			accesor: 'total',
			selector: row => row.total,
			sortable: true,
			right: true,
			cell: row => `$ ${row.total}`
		},
		{
			name: 'Forma de pago',
			accesor: 'payment_method',
			selector: row => row.payment_method,
			sortable: true,
			center: true
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
			sortable: true,
			center: true,
			cell: row => (
				<Link to={`${PURCHASE_PAGE_VIEW}/${row.id}`} role="button">
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
		<Table title="Aprobación de órdenes de compra" columns={columns} data={purchases} />
	);
}

export default PurchaseListApprove;
