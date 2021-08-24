export default function RevaluationDetailModel(data) {
	const item = data || {};

	return {
		id: item.id || null,
		id_depre_reval: item.id_depre_reval || '',
		id_asset: item.id_asset || '',
		old_value: item.old_value || '',
		new_value: item.new_value || '',
		observations: item.observations || '',
		id_parent: item.id_parent || ''
	};
}
