/**
 * Authorization Roles
 */
const authRoles = {
	admin: ['Administrador'],
	approver: ['Aprobador'],
	responsible: ['Responsable'],
	staff: ['Administrador', 'Aprobador'],
	user: ['Administrador', 'Aprobador', 'Responsable'],
	onlyGuest: []
};

export default authRoles;
