/* eslint-disable react/prefer-stateless-function */
/* eslint-disable no-undef */
import {
	FormControl,
	InputLabel,
	Select,
	TextField,
	Typography,
	MenuItem,
	InputAdornment,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions
} from '@material-ui/core';
import { axios } from '@core/services/Api';
import { getPathByParams, roundNumber } from '@core/utils/utils';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { URL_BACK } from '@core/consts/consts';
import { useForm } from '@fuse/hooks';
import Button from '@core/components/Button';
import Print from '@core/components/Print';
import React, { useEffect, useState } from 'react';
// Components
import { ASSET_DECOMMISSIONED, ASSET_URL_UPDATE } from '../AssetConst';
import { PURCHASE_PAGE_VIEW } from '../../purchase/PurchaseConst';
import AssetModel from '../model/AssetModel';

/**
 * @function AssetEdit
 * @brief Formulario de edición de un activo
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
function AssetEdit(props) {
	const { data, setData } = props;

	const [disabled, setDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);

	const { form, handleChange } = useForm(new AssetModel(data.asset));

	const canEdit = data.user_is_admin && data?.asset?.get_status?.parameter_key !== ASSET_DECOMMISSIONED;

	const onUpdateAsset = () => {
		setLoading(true);

		axios({
			url: getPathByParams(ASSET_URL_UPDATE, { id: form.id }),
			method: 'PUT',
			data: form,
			success: ({ asset }) => {
				setData({ ...data, asset });
				setLoading(false);
			},
			error: () => setLoading(false)
		});
	};

	useEffect(() => {
		const _disabled =
			!form.name.trim() ||
			!form.id_asset_group ||
			!form.id_asset_type ||
			!form.id_brand ||
			!form.model.trim() ||
			!form.serial_number.trim() ||
			!form.entry_date ||
			!form.id_maintenance_frequence ||
			!form.use_life ||
			!form.current_value;

		setDisabled(_disabled);
	}, [form]);

	return (
		<div>
			<Typography component="h1" color="primary" className="text-xl font-bold mb-10">
				Activo fijo Nº {data.asset.asset_number} - Estado: {data.asset.get_status.str_val}
			</Typography>

			{data.asset.get_purchase_item && data.user_is_admin && (
				<p className="mb-16">
					<a
						href={`${PURCHASE_PAGE_VIEW}/${data.asset.get_purchase_item.id_purchase}`}
						target="_blank"
						rel="noopener noreferrer"
						className="font-bold"
					>
						Ir a la orden de compra {`${data.asset.get_purchase_item.id_purchase}`.padStart(8, '0')} (
						{data.asset.get_purchase_item.product})
					</a>
				</p>
			)}

			<div className="flex mb-10">
				<TextField
					label="Nombre del activo"
					name="name"
					value={form.name}
					onChange={handleChange}
					className="w-1/3"
					disabled={!canEdit}
					required
				/>

				<FormControl className="mx-4 w-1/3" required>
					<InputLabel>Grupo de activo</InputLabel>

					<Select name="id_asset_group" value={form.id_asset_group} disabled>
						{data.asset_groups?.map(group => (
							<MenuItem key={group.id} value={group.id}>
								{group.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<FormControl className="w-1/3" required>
					<InputLabel>Tipo de activo</InputLabel>

					<Select name="id_asset_type" value={form.id_asset_type} disabled>
						{data.asset_types
							?.filter(type => type.id_parent === form.id_asset_group)
							?.map(type => (
								<MenuItem key={type.id} value={type.id}>
									{type.name}
								</MenuItem>
							))}
					</Select>
				</FormControl>
			</div>

			<TextField
				label="Descripción"
				name="description"
				value={form.description}
				onChange={handleChange}
				className="mb-10 w-full"
				multiline
				rows={4}
				rowsMax={4}
				disabled={!canEdit}
			/>

			<div className="flex mb-10">
				<FormControl className="w-1/3" required>
					<InputLabel>Marca</InputLabel>

					<Select name="id_brand" value={form.id_brand} onChange={handleChange} disabled={!canEdit} required>
						{data.asset_brands?.map(brand => (
							<MenuItem key={brand.id} value={brand.id}>
								{brand.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<TextField
					label="Modelo"
					name="model"
					value={form.model}
					onChange={handleChange}
					className="mx-4 w-1/3"
					disabled={!canEdit}
					required
				/>

				<TextField
					label="Número de serie"
					name="serial_number"
					value={form.serial_number}
					onChange={handleChange}
					className="w-1/3"
					disabled={!canEdit}
					required
				/>
			</div>

			<div className="flex mb-10">
				<KeyboardDatePicker
					disableToolbar
					variant="inline"
					format="yyyy-MM-DD"
					label="Fecha de ingreso"
					value={form.entry_date || null}
					className="w-1/3"
					disabled
				/>

				<FormControl className="mx-4 w-1/3" required>
					<InputLabel>Frecuencia de mantenimiento</InputLabel>

					<Select
						name="id_maintenance_frequence"
						value={form.id_maintenance_frequence}
						onChange={handleChange}
						disabled={!canEdit}
						required
					>
						{data.asset_main_freq?.map(freq => (
							<MenuItem key={freq.id} value={freq.id}>
								({roundNumber(parseInt(freq.freq, 10), 0)}) {freq.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<div className="flex w-1/3">
					<TextField
						type="number"
						label="Vida útil en años"
						name="use_life"
						value={form.use_life}
						onChange={handleChange}
						className="mr-2 w-1/2"
						disabled
					/>

					<TextField
						type="number"
						label="Costo"
						name="current_value"
						value={form.current_value}
						className="ml-2 w-1/2"
						InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
						disabled
					/>
				</div>
			</div>

			{canEdit && (
				<div className="text-center m-20">
					<Button variant="contained" color="secondary" onClick={() => setOpen(true)} className="mx-4">
						Placa
					</Button>

					<Button
						variant="contained"
						color="primary"
						disabled={disabled}
						loading={loading}
						onClick={onUpdateAsset}
						className="mx-4"
					>
						Actualizar
					</Button>

					<DialogAssetQrCode open={open} onClose={() => setOpen(false)} asset={data.asset} />
				</div>
			)}
		</div>
	);
}

export default AssetEdit;

function DialogAssetQrCode({ open, onClose, asset }) {
	return (
		<Dialog open={open}>
			<DialogTitle>Generación de placa de activo fijo</DialogTitle>

			<DialogContent>
				<AssetPlate asset={asset} />
			</DialogContent>

			<DialogActions className="flex items-center justify-center">
				<Button variant="contained" color="primary" onClick={onClose} className="bg-red-400 hover:bg-red-600">
					Cancelar
				</Button>

				<Print
					trigger={
						<Button variant="contained" color="primary">
							Imprimir
						</Button>
					}
					title={`Placa_Activo_${asset.asset_number}`}
					Component={AssetPlate}
					componentProps={{ asset }}
				/>
			</DialogActions>
		</Dialog>
	);
}

class AssetPlate extends React.Component {
	render() {
		return (
			<div className="flex flex-col items-center justify-center">
				<div className="flex flex-col items-center justify-center m-10 px-20 pt-20 pb-10 border-1 rounded-8">
					<img
						src={`${URL_BACK}assets-qrcodes/${this.props.asset.asset_number}.svg`}
						alt=""
						className="mb-10"
					/>

					<span>{this.props.asset.asset_number}</span>
				</div>
			</div>
		);
	}
}
