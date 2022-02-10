import FileUpload from '@core/components/FileUpload';
import React from 'react';
// Components
import { ASSET_APP_KEY, ASSET_DECOMMISSIONED } from '../AssetConst';

/**
 * @function AssetAttachments
 * @brief Formulario de carga de archivos de un activo
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
function AssetAttachments(props) {
	const { data, setData } = props;

	return (
		<div>
			<FileUpload
				files={data.asset.files}
				appKey={ASSET_APP_KEY}
				registerId={data.asset.id}
				disabled={!data.user_is_admin || data?.asset?.get_status?.parameter_key === ASSET_DECOMMISSIONED}
				onSuccess={files => setData({ ...data, asset: { ...data.asset, files } })}
			/>
		</div>
	);
}

export default AssetAttachments;
