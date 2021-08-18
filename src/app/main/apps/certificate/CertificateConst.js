export const CERTIFICATE_APP_KEY = 'CERTIFICATES';
// Páginas
export const CERTIFICATE_PAGE_CREATE = '/certificate/create';
export const CERTIFICATE_PAGE_LIST = '/certificate/list';
export const CERTIFICATE_PAGE_LIST_APPROVE = '/certificate/list_to_approve';
export const CERTIFICATE_PAGE_LIST_OWN = '/certificate/list_own';
export const CERTIFICATE_PAGE_VIEW = '/certificate/view';
// Endpoint
export const CERTIFICATE_URL_CREATE = 'certificate/create';
export const CERTIFICATE_URL_EDIT = 'certificate/:id/edit';
export const CERTIFICATE_URL_LIST = 'certificate';
export const CERTIFICATE_URL_LIST_APPROVE = 'certificate/list_to_approve';
export const CERTIFICATE_URL_LIST_OWN = 'certificate/list_own';
export const CERTIFICATE_URL_STATUS_ACTIVE = 'certificate/status/active/:id';
export const CERTIFICATE_URL_STATUS_APPROVED = 'certificate/status/approved/:id';
export const CERTIFICATE_URL_STATUS_CANCEL = 'certificate/status/cancel/:id';
export const CERTIFICATE_URL_STATUS_CHECKING = 'certificate/status/checking/:id';
export const CERTIFICATE_URL_STATUS_INANCTIVE = 'certificate/status/inactive/:id';
export const CERTIFICATE_URL_STATUS_REJECTED = 'certificate/status/rejected/:id';
export const CERTIFICATE_URL_STATUS_SEND_SIGN = 'certificate/status/send_sign/:id';
export const CERTIFICATE_URL_STORE = 'certificate';
export const CERTIFICATE_URL_STORE_ITEM = 'certificate/store_item';
export const CERTIFICATE_URL_UPDATE = 'certificate/:id';
// Estados
export const CERTIFICATE_STATUS = {
	IN_PROCESS: 'CERTIFICATE_IN_PROCESS',
	CHECKING: 'CERTIFICATE_CHECKING',
	APPROVED: 'CERTIFICATE_APPROVED',
	REJECTED: 'CERTIFICATE_REJECTED',
	SIGNATURE_PROCESS: 'CERTIFICATE_SIGNATURE_PROCESS',
	ACTIVE: 'CERTIFICATE_ACTIVE',
	INACTIVE: 'CERTIFICATE_INACTIVE',
	CANCELLED: 'CERTIFICATE_CANCELLED'
};
