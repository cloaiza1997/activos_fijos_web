export default function PurchaseItemModel(data) {
	const item = data || {};

	return {
		id: item.id || '',
		id_purchase: item.id_purchase || '',
		product: item.product || '',
		quantity: item.quantity || '',
		unit_value: item.unit_value || '',
		total_value: item.total_value || ''
	};
}
