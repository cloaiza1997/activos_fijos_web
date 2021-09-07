import AssetConfig from './asset/AssetConfig';
import CertificateConfig from './certificate/CertificateConfig';
import DeprecationConfig from './depreciation/DeprecationConfig';
import InventoryConfig from './inventory/InventoryConfig';
import PurchaseConfig from './purchase/PurchaseConfig';
import RevaluationConfig from './revaluation/RevaluationConfig';

const appsConfigs = [
	AssetConfig,
	CertificateConfig,
	DeprecationConfig,
	InventoryConfig,
	PurchaseConfig,
	RevaluationConfig
];

export default appsConfigs;
