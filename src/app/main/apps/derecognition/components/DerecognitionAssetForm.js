/* eslint-disable camelcase */
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
import React, { useState, useEffect } from 'react';

/**
 * @function DerecognitionAssetForm
 * @brief Formulario de baja de activos
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
function DerecognitionAssetForm(props) {
	const { open, setOpen, form, handleChange, data, currentAsset, setCurrentAsset } = props;

	const edit = currentAsset.index !== undefined;

	const [disabled, setDisabled] = useState(true);
	const [asset, setAsset] = useState(edit ? data.assets.find(_asset => _asset.id === currentAsset.id_asset) : {});

	const { form: formItem, handleChange: handleChangeItem } = useForm(currentAsset);

	const assetsList = data.assets.filter(
		_asset => _asset.id === asset.id || !form.get_details.some(detail => detail.id_asset === _asset.id)
	);

	const onAddItem = () => {
		const { get_details } = form;

		if (edit) {
			get_details[currentAsset.index] = formItem;
		} else {
			get_details.push(formItem);
		}

		handleChange(getHandleChange('get_details', get_details));
		setCurrentAsset({});
		setOpen(false);
	};

	useEffect(() => {
		const _disabled = !formItem.id_asset || !formItem.id_reason;

		setDisabled(_disabled);
	}, [formItem]);

	return (
		<Dialog open={open} classes={{ paper: 'w-lg max-w-lg' }}>
			<DialogTitle>Seleccionar activo</DialogTitle>

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
				/>

				<FormControl className="mb-16 w-full" required>
					<InputLabel>Motivo de la baja</InputLabel>

					<Select name="id_reason" value={formItem.id_reason} onChange={handleChangeItem} required>
						{data.derecognition_reasons?.map(reason => (
							<MenuItem key={reason.id} value={reason.id}>
								{reason.str_val}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<TextField
					label="Observaciones"
					name="observations"
					value={formItem.observations}
					onChange={handleChangeItem}
					className="w-full"
					multiline
					rows={4}
					rowsMax={4}
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

				<Button variant="contained" color="primary" onClick={onAddItem} disabled={disabled}>
					{edit ? 'Actualizar' : 'Seleccionar'}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default DerecognitionAssetForm;
