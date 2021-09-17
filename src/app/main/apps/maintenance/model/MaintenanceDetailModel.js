export default function MaintenanceDetailModel(data) {
	const item = data || {};

	return {
		index: item.index,
		id: item.id,
		id_asset: item.id_asset || '',
		executed_at: item.executed_at || '',
		observations: item.observations || ''
	};
}
