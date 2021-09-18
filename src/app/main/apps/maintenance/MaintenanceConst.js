export const MAINTENANCE_APP_KEY = 'MAINTENANCES';

// Páginas
export const MAINTENANCE_PAGE_CREATE = '/maintenance/create';
export const MAINTENANCE_PAGE_VIEW = '/maintenance/view';
export const MAINTENANCE_PAGE_LIST = '/maintenance/list';
// Endpoint
export const MAINTENANCE_URL_CREATE = 'maintenance/create';
export const MAINTENANCE_URL_EDIT = 'maintenance/:id/edit';
export const MAINTENANCE_URL_LIST = 'maintenance';
export const MAINTENANCE_URL_STATUS_CANCEL = 'maintenance/status/cancel/:id';
export const MAINTENANCE_URL_STATUS_FINISHED = 'maintenance/status/finished/:id';
export const MAINTENANCE_URL_STORE = 'maintenance';
export const MAINTENANCE_URL_UPDATE = 'maintenance/:id';

export const MAINTENANCE_STATUS = {
	MAINTENANCE_IN_PROCESS: 'MAINTENANCE_IN_PROCESS',
	MAINTENANCE_FINISHED: 'MAINTENANCE_FINISHED',
	MAINTENANCE_CANCELLED: 'MAINTENANCE_CANCELLED'
};
