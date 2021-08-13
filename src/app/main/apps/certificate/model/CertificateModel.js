export default function CertificateModel(data) {
	const item = data || {};

	return {
		id: item.id || '',
		id_deliver_user: item.id_deliver_user || '',
		id_deliver_area: item.id_deliver_area || '',
		delivered_at: item.delivered_at || '',
		id_receiver_user: item.id_receiver_user || '',
		id_receiver_area: item.id_receiver_area || '',
		received_at: item.received_at || '',
		id_creator_user: item.id_creator_user || '',
		created_at: item.created_at || '',
		id_approver_user: item.id_approver_user || '',
		approved_at: item.approved_at || '',
		id_status: item.id_status || '',
		id_parent: item.id_parent || '',
		observations: item.observations || '',
		updated_at: item.updated_at || '',
		items: item.items || []
	};
}
