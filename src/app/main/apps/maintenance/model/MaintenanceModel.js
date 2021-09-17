export default function MaintenanceModel(data) {
	const item = data || {};

	return {
		id: item.id,
		id_type: item.id_type || '',
		observations: item.observations || '',
		id_status: item.id_status,
		get_responsibles: item.get_responsibles || [],
		get_details: item.get_details || [],
		files: item.files || []
	};
}
