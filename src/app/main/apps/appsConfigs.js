import AssetConfig from './asset/AssetConfig';
import CertificateConfig from './certificate/CertificateConfig';
import DeprecationConfig from './depreciation/DeprecationConfig';
import DerecognitionConfig from './derecognition/DerecognitionConfig';
import InventoryConfig from './inventory/InventoryConfig';
import LogConfig from './log/LogConfig';
import MaintenanceConfig from './maintenance/MaintenanceConfig';
import ProviderConfig from './provider/ProviderConfig';
import PurchaseConfig from './purchase/PurchaseConfig';
import RevaluationConfig from './revaluation/RevaluationConfig';
import UserConfig from './users/UsersConfig';

const appsConfigs = [
	AssetConfig,
	CertificateConfig,
	DeprecationConfig,
	DerecognitionConfig,
	InventoryConfig,
	LogConfig,
	MaintenanceConfig,
	ProviderConfig,
	PurchaseConfig,
	RevaluationConfig,
	UserConfig
];

export default appsConfigs;
