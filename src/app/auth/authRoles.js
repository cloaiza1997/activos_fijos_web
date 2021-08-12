/**
 * Authorization Roles
 */
const authRoles = {
	admin: ['Administrador'],
	approver: ['Aprobador'],
	responsible: ['Responsable'],
	staff: ['Administrador', 'Aprobador'],
	user: ['Administrador', 'Aprobador', 'Responsable'],
	// admin: ['admin'],
	// staff: ['admin', 'staff'],
	// user: ['admin', 'staff', 'user'],
	onlyGuest: []
};

export default authRoles;
