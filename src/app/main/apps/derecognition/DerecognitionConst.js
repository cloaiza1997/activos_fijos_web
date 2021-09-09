export const DERECOGNITION_APP_KEY = 'DERECOGNITIONS';

// Páginas
export const DERECOGNITION_PAGE_CREATE = '/derecognition/create';
export const DERECOGNITION_PAGE_VIEW = '/derecognition/view';
export const DERECOGNITION_PAGE_LIST = '/derecognition/list';
// Endpoint
export const DERECOGNITION_URL_EDIT = 'derecognition/:id/edit';
export const DERECOGNITION_URL_LIST = 'derecognition';
export const DERECOGNITION_URL_STATUS_APPROVED = 'derecognition/status/approved/:id';
export const DERECOGNITION_URL_STATUS_CANCEL = 'derecognition/status/cancel/:id';
export const DERECOGNITION_URL_STATUS_CHECKING = 'derecognition/status/checking/:id';
export const DERECOGNITION_URL_STATUS_EXECUTED = 'derecognition/status/executed/:id';
export const DERECOGNITION_URL_STATUS_REJECTED = 'derecognition/status/rejected/:id';
export const DERECOGNITION_URL_STATUS_REVERSED = 'derecognition/status/reversed/:id';
export const DERECOGNITION_URL_STORE = 'derecognition';
export const DERECOGNITION_URL_UPDATE = 'derecognition/:id';

export const DERECOGNITION_STATUS = {
	APPROVED: 'DERECOGNITION_APPROVED',
	CANCELLED: 'DERECOGNITION_CANCELLED',
	CHECKING: 'DERECOGNITION_CHECKING',
	EXECUTED: 'DERECOGNITION_EXECUTED',
	IN_PROCESS: 'DERECOGNITION_IN_PROCESS',
	REJECTED: 'DERECOGNITION_REJECTED',
	REVERSED: 'DERECOGNITION_REVERSED'
};
