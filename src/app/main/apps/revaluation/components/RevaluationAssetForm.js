import { Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, TextField } from '@material-ui/core';
import { getHandleChange, isNumberPositive } from '@core/utils/utils';
import { useForm } from '@fuse/hooks';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@core/components/Button';
import React, { useState, useEffect } from 'react';
// Components
import RevaluationDetailModel from '../model/RevaluationDetailModel';

/**
 * @function RevaluationAssetForm
 * @brief Formulario para agregar activos a una revaluación
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
function RevaluationAssetForm(props) {
	const { open, setOpen, form, handleChange, data, currentAsset, setCurrentAsset } = props;

	const edit = currentAsset.index !== undefined;

	const [disabled, setDisabled] = useState(true);
	const [asset, setAsset] = useState(edit ? data.assets.find(_asset => _asset.id === currentAsset.id_asset) : {});

	const { form: formItem, handleChange: handleChangeItem } = useForm(
		new RevaluationDetailModel({ ...currentAsset, id_depre_reval: data.revaluation.id })
	);

	const assetsList = data.assets.filter(
		_asset => _asset.id === asset.id || !form.details.some(detail => detail.id_asset === _asset.id)
	);

	const onAddItem = () => {
		const { details } = form;

		if (edit) {
			details[currentAsset.index] = formItem;
		} else {
			details.push(formItem);
		}

		handleChange(getHandleChange('details', details));

		setCurrentAsset({});
		setOpen(false);
	};

	useEffect(() => {
		const _disabled =
			!formItem.id_asset ||
			!isNumberPositive(formItem.old_value) ||
			!isNumberPositive(formItem.new_value) ||
			!formItem.observations.trim();

		setDisabled(_disabled);
	}, [formItem]);

	return (
		<Dialog open={open} classes={{ paper: 'w-lg max-w-lg' }}>
			<DialogTitle>Seleccionar activo</DialogTitle>

			<DialogContent className="flex flex-col">
				<Autocomplete
					options={assetsList}
					getOptionLabel={option => `${option.asset_number} - ${option.name}`}
					value={formItem.id_asset ? asset : null}
					onChange={(event, value) => {
						handleChangeItem(getHandleChange('id_asset', value.id));
						handleChangeItem(getHandleChange('old_value', value.current_value));
						setAsset(value);
					}}
					renderInput={params => <TextField {...params} label="Activo fijo" />}
					noOptionsText="No hay resultados"
					className="mb-16"
				/>

				<TextField
					type="number"
					label="Costo actual"
					name="old_value"
					value={formItem.old_value}
					className="w-full mb-16"
					InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
					required
					disabled
				/>

				<TextField
					type="number"
					label="Nuevo costo"
					name="new_value"
					value={formItem.new_value}
					onChange={handleChangeItem}
					className="w-full mb-16"
					InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
					required
				/>

				<TextField
					label="Observaciones"
					name="observations"
					value={formItem.observations}
					onChange={handleChangeItem}
					className="w-full mb-16"
					required
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

export default RevaluationAssetForm;
