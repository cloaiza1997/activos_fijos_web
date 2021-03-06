import AssetConfig from './asset/AssetConfig';
import CertificateConfig from './certificate/CertificateConfig';
import DeprecationConfig from './depreciation/DeprecationConfig';
import DerecognitionConfig from './derecognition/DerecognitionConfig';
import InventoryConfig from './inventory/InventoryConfig';
import LogConfig from './log/LogConfig';
import MaintenanceConfig from './maintenance/MaintenanceConfig';
import ParameterConfig from './parameter/ParameterConfig';
import ProviderConfig from './provider/ProviderConfig';
import PurchaseConfig from './purchase/PurchaseConfig';
import ReportConfig from './report/ReportConfig';
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
	ParameterConfig,
	ProviderConfig,
	PurchaseConfig,
	ReportConfig,
	RevaluationConfig,
	UserConfig
];

export default appsConfigs;
