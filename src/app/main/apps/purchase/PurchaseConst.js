export const PURCHASE_APP_KEY = 'PURCHASES';

// Páginas
export const PURCHASE_PAGE_CREATE = '/purchase/create';
export const PURCHASE_PAGE_VIEW = '/purchase/view';
export const PURCHASE_PAGE_LIST = '/purchase/list';
export const PURCHASE_PAGE_LIST_APPROVE = '/purchase/list_approve';
// Endpoint
export const PURCHASE_URL_CREATE = 'purchase/create';
export const PURCHASE_URL_EDIT = 'purchase/:id/edit';
export const PURCHASE_URL_GET_BY_STATUS = 'purchase_by_status/:status';
export const PURCHASE_URL_LIST = 'purchase';
export const PURCHASE_URL_LIST_APPROVE = 'purchase_to_approve';
export const PURCHASE_URL_STORE = 'purchase';
export const PURCHASE_URL_UPDATE = 'purchase/:id';
export const PURCHASE_URL_UPDATE_STATUS = 'purchase/update_status/:id';

export const PAYMENT_METHODS = {
	EFFECTIVE: 'EFFECTIVE_PAYMENT',
	CREDIT: 'CREDIT_PAYMENT'
};

export const PURCHASE_STATUS = {
	PURCHASE_STATUS_IN_PROCESS: 'PURCHASE_STATUS_IN_PROCESS',
	PURCHASE_STATUS_CHECKING: 'PURCHASE_STATUS_CHECKING',
	PURCHASE_STATUS_CANCELLED: 'PURCHASE_STATUS_CANCELLED',
	PURCHASE_STATUS_APPROVED: 'PURCHASE_STATUS_APPROVED',
	PURCHASE_STATUS_REJECTED: 'PURCHASE_STATUS_REJECTED',
	PURCHASE_STATUS_CLOSED: 'PURCHASE_STATUS_CLOSED',
	PURCHASE_STATUS_FINISHED: 'PURCHASE_STATUS_FINISHED'
};
