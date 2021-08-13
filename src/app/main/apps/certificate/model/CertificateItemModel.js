export default function CertificateItemModel(data) {
	const item = data || {};

	return {
		id: item.id || '',
		id_certificate: item.id_certificate || '',
		id_asset: item.id_asset || '',
		asset_number: item.asset_number || '',
		name: item.name || '',
		brand: item.brand || '',
		model: item.model || '',
		serial_number: item.serial_number || '',
		observations: item.observations || '',
		id_physical_status: item.id_physical_status || '',
		files: item.files || []
	};
}
