export default function AssetModel(data) {
	const item = data || {};

	return {
		id: item.id || '',
		id_asset_group: item.id_asset_group || '',
		id_asset_type: item.id_asset_type || '',
		asset_number: item.asset_number || '',
		name: item.name || '',
		description: item.description || '',
		id_brand: item.id_brand || '',
		model: item.model || '',
		serial_number: item.serial_number || '',
		entry_date: item.entry_date || '',
		current_value: item.current_value || '',
		use_life: item.use_life || '',
		id_maintenance_frequence: item.id_maintenance_frequence || '',
		id_purchase_item: item.id_purchase_item || '',
		id_status: item.id_status || ''
	};
}
