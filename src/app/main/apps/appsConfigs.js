import AssetConfig from './asset/AssetConfig';
import CertificateConfig from './certificate/CertificateConfig';
import DeprecationConfig from './depreciation/DeprecationConfig';
import DerecognitionConfig from './derecognition/DerecognitionConfig';
import InventoryConfig from './inventory/InventoryConfig';
import MaintenanceConfig from './maintenance/MaintenanceConfig';
import PurchaseConfig from './purchase/PurchaseConfig';
import RevaluationConfig from './revaluation/RevaluationConfig';

const appsConfigs = [
	AssetConfig,
	CertificateConfig,
	DeprecationConfig,
	DerecognitionConfig,
	InventoryConfig,
	MaintenanceConfig,
	PurchaseConfig,
	RevaluationConfig
];

export default appsConfigs;
