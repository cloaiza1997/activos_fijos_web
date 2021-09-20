import { authRoles } from 'app/auth';
import { ASSET_PAGE_CREATE, ASSET_PAGE_LIST, ASSET_PAGE_LIST_OWN } from 'app/main/apps/asset/AssetConst';
import {
	CERTIFICATE_PAGE_CREATE,
	CERTIFICATE_PAGE_LIST,
	CERTIFICATE_PAGE_LIST_APPROVE,
	CERTIFICATE_PAGE_LIST_OWN
} from 'app/main/apps/certificate/CertificateConst';
import { DEPRECATION_PAGE_LIST } from 'app/main/apps/depreciation/DeprecationConst';
import {
	DERECOGNITION_PAGE_LIST,
	DERECOGNITION_PAGE_LIST_APPROVE
} from 'app/main/apps/derecognition/DerecognitionConst';
import { INVENTORY_PAGE_LIST } from 'app/main/apps/inventory/InventoryConst';
import { LOG_PAGE_LIST } from 'app/main/apps/log/LogConst';
import { MAINTENANCE_PAGE_LIST } from 'app/main/apps/maintenance/MaintenanceConst';
import { PARAMETER_PAGE_LIST } from 'app/main/apps/parameter/ParameterConst';
import { PROVIDER_PAGE_LIST } from 'app/main/apps/provider/ProviderConst';
import {
	PURCHASE_PAGE_CREATE,
	PURCHASE_PAGE_LIST,
	PURCHASE_PAGE_LIST_APPROVE
} from 'app/main/apps/purchase/PurchaseConst';
import { REVALUATION_PAGE_LIST } from 'app/main/apps/revaluation/RevaluationConst';
import { USER_PAGE_LIST } from 'app/main/apps/users/UsersConst';

const navigationConfig = [
	{
		auth: authRoles.staff,
		id: 'compras',
		title: 'COMPRAS',
		type: 'collapse',
		children: [
			{
				auth: authRoles.admin,
				id: 'crear-orden',
				title: 'Crear orden',
				type: 'item',
				icon: 'shopping_cart',
				url: PURCHASE_PAGE_CREATE
			},
			{
				auth: authRoles.admin,
				id: 'listar-ordenes',
				title: 'Órdenes de compra',
				type: 'item',
				icon: 'shopping_bag',
				url: PURCHASE_PAGE_LIST
			},
			{
				auth: authRoles.approver,
				id: 'aprobar-compra',
				title: 'Aprobaciones',
				type: 'item',
				icon: 'add_task',
				url: PURCHASE_PAGE_LIST_APPROVE
			}
		]
	},
	{
		id: 'activos',
		title: 'ACTIVOS',
		type: 'collapse',
		children: [
			{
				auth: authRoles.admin,
				id: 'crear-activo',
				title: 'Ingresar activo',
				type: 'item',
				icon: 'add_circle_outline',
				url: ASSET_PAGE_CREATE
			},
			{
				auth: authRoles.admin,
				id: 'listar-activos',
				title: 'Listado de activos',
				type: 'item',
				icon: 'fact_check',
				url: ASSET_PAGE_LIST
			},
			{
				auth: authRoles.user,
				id: 'mis-activos',
				title: 'Mis activos',
				type: 'item',
				icon: 'devices',
				url: ASSET_PAGE_LIST_OWN
			}
		]
	},
	{
		id: 'actas',
		title: 'ACTAS',
		type: 'collapse',
		children: [
			{
				auth: authRoles.admin,
				id: 'generar-acta',
				title: 'Generar acta',
				type: 'item',
				icon: 'post_add',
				url: CERTIFICATE_PAGE_CREATE
			},
			{
				auth: authRoles.admin,
				id: 'actas',
				title: 'Listado de actas',
				type: 'item',
				icon: 'assignment',
				url: CERTIFICATE_PAGE_LIST
			},
			{
				auth: authRoles.approver,
				id: 'aprovaciones',
				title: 'Aprobaciones',
				type: 'item',
				icon: 'grading',
				url: CERTIFICATE_PAGE_LIST_APPROVE
			},
			{
				auth: authRoles.user,
				id: 'mis-actas',
				title: 'Mis actas',
				type: 'item',
				icon: 'content_copy',
				url: CERTIFICATE_PAGE_LIST_OWN
			}
		]
	},
	{
		id: 'procesos_masivos',
		title: 'PROCESOS MASIVOS',
		type: 'collapse',
		children: [
			{
				auth: authRoles.admin,
				id: 'revaluaciones',
				title: 'Revaluaciones',
				type: 'item',
				icon: 'published_with_changes',
				url: REVALUATION_PAGE_LIST
			},
			{
				auth: authRoles.admin,
				id: 'depreciaciones',
				title: 'Depreciaciones',
				type: 'item',
				icon: 'trending_down',
				url: DEPRECATION_PAGE_LIST
			},
			{
				auth: authRoles.admin,
				id: 'bajas',
				title: 'Bajas',
				type: 'item',
				icon: 'remove_circle_outline',
				url: DERECOGNITION_PAGE_LIST
			},
			{
				auth: authRoles.approver,
				id: 'bajas_approvacion',
				title: 'Bajas (Aprobaciones)',
				type: 'item',
				icon: 'remove_circle_outline',
				url: DERECOGNITION_PAGE_LIST_APPROVE
			},
			{
				auth: authRoles.admin,
				id: 'mantenimientos',
				title: 'Mantenimientos',
				type: 'item',
				icon: 'build',
				url: MAINTENANCE_PAGE_LIST
			},
			{
				auth: authRoles.admin,
				id: 'inventarios',
				title: 'Inventarios',
				type: 'item',
				icon: 'widgets',
				url: INVENTORY_PAGE_LIST
			}
		]
	},
	{
		auth: authRoles.admin,
		id: 'reportes',
		title: 'REPORTES',
		type: 'collapse',
		children: [
			{
				id: 'reportes',
				title: 'Generar reportes',
				type: 'item',
				icon: 'grading',
				url: ''
			}
		]
	},
	{
		auth: authRoles.admin,
		id: 'sistema',
		title: 'SISTEMA',
		type: 'collapse',
		children: [
			{
				auth: authRoles.admin,
				id: 'usuarios',
				title: 'Usuarios',
				type: 'item',
				icon: 'people',
				url: USER_PAGE_LIST
			},
			{
				auth: authRoles.admin,
				id: 'proveedores',
				title: 'Proveedores',
				type: 'item',
				icon: 'engineering',
				url: PROVIDER_PAGE_LIST
			},
			{
				auth: authRoles.admin,
				id: 'parametros',
				title: 'Parámetros',
				type: 'item',
				icon: 'settings',
				url: PARAMETER_PAGE_LIST
			},
			{
				auth: authRoles.admin,
				id: 'logs',
				title: 'Logs',
				type: 'item',
				icon: 'subject',
				url: LOG_PAGE_LIST
			}
		]
	}
];

export default navigationConfig;
