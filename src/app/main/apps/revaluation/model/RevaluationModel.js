export default function RevaluationModel(data) {
	const item = data || {};

	return {
		id: item.id || '',
		id_user: item.id_user || '',
		observations: item.observations || '',
		id_status: item.id_status || '',
		id_parent: item.id_parent || '',
		details: item.details || []
	};
}
