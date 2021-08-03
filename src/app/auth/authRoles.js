/**
 * Authorization Roles
 */
const authRoles = {
	admin: ['Administrador'],
	approver: ['Administrador', 'Aprobador'],
	responsible: ['Administrador', 'Responsable'],
	user: ['Administrador', 'Aprobador', 'Responsable'],
	// admin: ['admin'],
	// staff: ['admin', 'staff'],
	// user: ['admin', 'staff', 'user'],
	onlyGuest: []
};

export default authRoles;
