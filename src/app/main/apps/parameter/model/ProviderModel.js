export default function ProviderModel(data) {
	const item = data || {};

	return {
		id: item.id,
		id_document_type: item.id_document_type || '',
		document_number: item.document_number || '',
		name: item.name || '',
		address: item.address || '',
		id_city: item.id_city || '',
		email: item.email || '',
		phone_number: item.phone_number || '',
		observations: item.observations || '',
		is_active: item.is_active || ''
	};
}
