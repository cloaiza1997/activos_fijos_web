export default function PurchaseModel(data) {
	const item = data || {};

	return {
		id: item.id || '',
		id_provider: item.id_provider || '',
		id_requesting_user: item.id_requesting_user || '',
		delivery_date: item.delivery_date || '',
		delivery_address: item.delivery_address || '',
		id_city: item.id_city || '',
		sub_total: item.sub_total || '',
		iva: item.iva || '',
		total: item.total || '',
		id_status: item.id_status || '',
		id_payment_method: item.id_payment_method || '',
		payment_days: item.payment_days || '',
		observations: item.observations || '',
		items: item.items || [],
		files: item.files || []
	};
}
