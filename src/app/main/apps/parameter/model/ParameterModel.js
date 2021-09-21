export default function ParameterModel(data) {
	const item = data || {};

	return {
		id: item.id,
		id_parent: item.id_parent || '',
		name: item.name || '',
		num_val: item.num_val,
		str_val: item.str_val,
		is_active: item.is_active
	};
}
