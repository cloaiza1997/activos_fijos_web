import FileUpload from '@core/components/FileUpload';
import React from 'react';
// Components
import { ASSET_APP_KEY } from '../AssetConst';

function AssetAttachments(props) {
	const { data } = props;

	return (
		<div>
			<FileUpload
				files={data.asset.files}
				appKey={ASSET_APP_KEY}
				registerId={data.asset.id}
				disabled={!data.user_is_admin}
			/>
		</div>
	);
}

export default AssetAttachments;
