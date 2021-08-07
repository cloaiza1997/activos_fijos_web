import { axios } from '@core/services/Api';
import { Icon, IconButton } from '@material-ui/core';
import Loading from '@core/components/Loading';
import React, { useEffect, useState } from 'react';
import Table from '@core/components/Table';
// Components
import { PURCHASE_PAGE_CREATE, PURCHASE_PAGE_VIEW, PURCHASE_URL_LIST } from '../PurchaseConst';

function PurchaseList() {
	const [skeleton, setSkeleton] = useState(true);
	const [purchases, setPurchases] = useState([]);

	useEffect(() => {
		const success = data => {
			setPurchases(data.purchases);
			setSkeleton(false);
		};

		axios({ url: PURCHASE_URL_LIST, method: 'GET', success });
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
				<IconButton size="small" href={`${PURCHASE_PAGE_VIEW}/${row.id}`}>
					<Icon color="primary">launch</Icon>
				</IconButton>
			)
		}
	];

	return skeleton ? (
		<Loading />
	) : (
		<Table
			title="Listado de órdenes de compra"
			columns={columns}
			data={purchases}
			button={{ text: 'Crear orden', href: PURCHASE_PAGE_CREATE }}
		/>
	);
}

export default PurchaseList;
