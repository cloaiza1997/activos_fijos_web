export default function UserModel(data) {
	const item = data || {};

	return {
		id: item.id,
		id_document_type: item.id_document_type || '',
		document_number: item.document_number || '',
		name: item.name || '',
		last_name: item.last_name || '',
		email: item.email || '',
		phone_number: item.phone_number || '',
		id_role: item.id_role || '',
		id_area: item.id_area || '',
		id_position: item.id_position || '',
		id_status: item.id_status || ''
	};
}
