import { URL_BACK } from '@core/consts/consts';
import { axios } from '@core/services/Api';
import { showNotifyError } from '@core/utils/notify';
import { getPathByParams } from '@core/utils/utils';
import { Icon, IconButton, Typography } from '@material-ui/core';
import clsx from 'clsx';
import React, { useState } from 'react';
import Files from 'react-files';
import Button from './Button';

/**
 * @function FileUpload
 * @brief Componente para carga de archivos
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
export default function FileUpload(props) {
	const {
		accepts = FILES_TYPES_COMBINED.IMG_PDF_DOC_SHEET_SLIDE,
		appKey,
		className,
		disabled,
		files: initialFiles = [],
		registerId,
		onExternalChange
	} = props;

	const [files, setFiles] = useState(initialFiles);
	const [loading, setLoading] = useState(false);
	const [applyChanges, setApplyChanges] = useState(false);

	const onChange = newFiles => {
		const _files = [...files, ...newFiles];

		setFiles(_files);
		setApplyChanges(true);
	};

	const onError = ({ message }, file) => showNotifyError(message);

	const onRemoveFile = index => {
		const _files = [...files];

		_files.splice(index, 1);

		setFiles(_files);
		setApplyChanges(true);
	};

	const onUploadFiles = () => {
		const form = new FormData();

		files.forEach(file => (file.file_name ? form.append('oldFiles[]', file.id) : form.append('files[]', file)));

		if (onExternalChange) {
			onExternalChange(form);
			setApplyChanges(false);
		} else {
			setLoading(true);

			const success = response => {
				setFiles(response.files);
				setLoading(false);
				setApplyChanges(false);
			};

			const error = () => setLoading(false);

			axios({
				url: getPathByParams(FILE_URL_UPLOAD, { appKey, registerId }),
				method: 'POST',
				data: form,
				success,
				error
			});
		}
	};

	return (
		<div className={clsx('border-1 rounded-8 px-20 py-10', className)}>
			<Typography color="primary" className="font-bold mb-10">
				Carga de archivos
			</Typography>

			{!disabled && (
				<Files
					className="flex items-center justify-center border-1 border-dashed rounded-8 p-20 hover:bg-grey-200 hover:border-blue-400 hover:text-blue-400 cursor-pointer"
					onChange={onChange}
					onError={onError}
					accepts={accepts.split(',')}
					multiple
					maxFileSize={10000000}
					minFileSize={0}
					clickable
				>
					Arrastra los archivos o haz clic aquí
				</Files>
			)}

			<div className="mt-10">
				{files.length > 0 && (
					<div className="mb-10">
						{files.map((file, index) => (
							<div key={index} className="flex items-center justify-between mb-2">
								<a
									href={
										file.name
											? URL.createObjectURL(file)
											: `${URL_BACK}attachments/${file.file_name}`
									}
									target="_blank"
									rel="noopener noreferrer"
								>
									{file.name || file.file_name}
								</a>

								{!disabled && (
									<IconButton size="small" onClick={() => onRemoveFile(index)}>
										<Icon>close</Icon>
									</IconButton>
								)}
							</div>
						))}
					</div>
				)}

				{!disabled && applyChanges && (
					<Button variant="contained" color="primary" loading={loading} onClick={onUploadFiles}>
						Aplicar cambios para actualizar archivos
					</Button>
				)}
			</div>
		</div>
	);
}

/**
 * Formatos aceptados por el input file
 */
export const FILES_TYPES = {
	DOC: '.doc,.docx,.xml,a pplication/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	IMAGES: 'image/*',
	PDF: '.pdf',
	SHEET: '.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel',
	SLIDE: 'application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.slideshow,application/vnd.openxmlformats-officedocument.presentationml.presentation',
	TXT: 'text/plain'
};

/**
 * Tipos de documentos permitidos combinados
 */
export const FILES_TYPES_COMBINED = {
	IMG_PDF_DOC_SHEET_SLIDE: `${FILES_TYPES.IMAGES},${FILES_TYPES.PDF},${FILES_TYPES.DOC},${FILES_TYPES.SHEET},${FILES_TYPES.SLIDE}`,
	IMG_PDF_DOC_SHEET: `${FILES_TYPES.IMAGES},${FILES_TYPES.PDF},${FILES_TYPES.DOC},${FILES_TYPES.SHEET}`,
	PDF_DOC_SHEET_SLIDE: `${FILES_TYPES.PDF},${FILES_TYPES.DOC},${FILES_TYPES.SHEET},${FILES_TYPES.SLIDE}`
};

export const FILE_URL_UPLOAD = 'upload_files/:appKey/:registerId';
