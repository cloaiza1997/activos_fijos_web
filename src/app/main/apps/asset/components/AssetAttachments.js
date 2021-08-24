import FileUpload from '@core/components/FileUpload';
import React from 'react';
// Components
import { ASSET_APP_KEY, ASSET_DECOMMISSIONED } from '../AssetConst';

function AssetAttachments(props) {
	const { data, setData } = props;

	return (
		<div>
			<FileUpload
				files={data.asset.files}
				appKey={ASSET_APP_KEY}
				registerId={data.asset.id}
				disabled={!data.user_is_admin && data?.get_status?.parameter_key !== ASSET_DECOMMISSIONED}
				onSuccess={files => setData({ ...data, asset: { ...data.asset, files } })}
			/>
		</div>
	);
}

export default AssetAttachments;
