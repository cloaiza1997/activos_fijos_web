import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField
} from '@material-ui/core';
import { getHandleChange } from '@core/utils/utils';
import { useForm } from '@fuse/hooks';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@core/components/Button';
import FileUpload from '@core/components/FileUpload';
import React, { useState, useEffect } from 'react';
// Components
import CertificateItemModel from '../model/CertificateItemModel';

function CertificateAssetForm(props) {
	const { open, setOpen, form, handleChange, data, currentAsset, setCurrentAsset, disabledForm } = props;

	const edit = currentAsset.index !== undefined;

	const [disabled, setDisabled] = useState(true);
	const [asset, setAsset] = useState(edit ? data.assets.find(_asset => _asset.id === currentAsset.id_asset) : {});

	const { form: formItem, handleChange: handleChangeItem } = useForm(new CertificateItemModel(currentAsset));

	const assetsList = data.assets.filter(
		_asset => _asset.id === asset.id || !form.items.some(item => item.id_asset === _asset.id)
	);

	const onAddItem = () => {
		const { items } = form;

		const item = {
			...formItem,
			asset_number: asset.asset_number,
			name: asset.name,
			brand: asset.get_brand.str_val,
			model: asset.model,
			status: asset.get_status.str_val,
			serial_number: asset.serial_number
		};

		if (edit) {
			items[currentAsset.index] = item;
		} else {
			items.push(item);
		}

		handleChange(getHandleChange('items', items));
		setCurrentAsset({});
		setOpen(false);
	};

	useEffect(() => {
		const _disabled = !formItem.id_asset || !formItem.id_physical_status;

		setDisabled(_disabled);
	}, [formItem]);

	return (
		<Dialog open={open} classes={{ paper: 'w-lg max-w-lg' }}>
			<DialogTitle>Ingerso de activo - Buscar orden de compra</DialogTitle>

			<DialogContent className="flex flex-col">
				<Autocomplete
					options={assetsList}
					getOptionLabel={option =>
						`${option.asset_number} - ${option.get_status.str_val} - ${option.name} - ${option.serial_number}`
					}
					value={formItem.id_asset ? asset : null}
					onChange={(event, value) => {
						handleChangeItem(getHandleChange('id_asset', value.id));
						setAsset(value);
					}}
					renderInput={params => <TextField {...params} label="Activo fijo" />}
					noOptionsText="No hay resultados"
					className="mb-16"
					disabled={disabledForm}
				/>

				<FormControl className="mb-16 w-full" required>
					<InputLabel>Estado físico</InputLabel>

					<Select
						name="id_physical_status"
						value={formItem.id_physical_status}
						onChange={handleChangeItem}
						disabled={disabledForm}
						required
					>
						{data.physical_status?.map(status => (
							<MenuItem key={status.id} value={status.id}>
								{status.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<FileUpload
					className="mb-16"
					files={formItem.files}
					onExternalChange={files => {
						handleChangeItem(getHandleChange('files', files));
					}}
					disabled={disabledForm}
				/>

				<TextField
					label="Observaciones"
					name="observations"
					value={formItem.observations}
					onChange={handleChangeItem}
					className="w-full"
					multiline
					rows={4}
					rowsMax={4}
					disabled={disabledForm}
				/>
			</DialogContent>

			<DialogActions>
				<Button
					variant="contained"
					color="primary"
					onClick={() => setOpen(false)}
					className="bg-red-400 hover:bg-red-600"
				>
					Cancelar
				</Button>

				<Button variant="contained" color="primary" onClick={onAddItem} disabled={disabled || disabledForm}>
					{edit ? 'Actualizar' : 'Seleccionar'}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default CertificateAssetForm;
