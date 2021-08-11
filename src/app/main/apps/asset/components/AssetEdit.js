import { axios } from '@core/services/Api';
import { FormControl, InputLabel, Select, TextField, Typography, MenuItem, InputAdornment } from '@material-ui/core';
import { getPathByParams, roundNumber } from '@core/utils/utils';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { useForm } from '@fuse/hooks';
import Button from '@core/components/Button';
import React, { useEffect, useState } from 'react';
// Components
import { ASSET_URL_UPDATE } from '../AssetConst';
import { PURCHASE_PAGE_VIEW } from '../../purchase/PurchaseConst';
import AssetModel from '../model/AssetModel';

function AssetEdit(props) {
	const { data, setData } = props;

	const [disabled, setDisabled] = useState(true);
	const [loading, setLoading] = useState(false);

	const { form, handleChange } = useForm(new AssetModel(data.asset));

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

			{data.asset.get_purchase_item && (
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
			/>

			<div className="flex mb-10">
				<FormControl className="w-1/3" required>
					<InputLabel>Marca</InputLabel>

					<Select name="id_brand" value={form.id_brand} onChange={handleChange} required>
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
					required
				/>

				<TextField
					label="Número de serie"
					name="serial_number"
					value={form.serial_number}
					onChange={handleChange}
					className="w-1/3"
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
						required
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

			<div className="text-center m-20">
				<Button
					variant="contained"
					color="primary"
					disabled={disabled}
					loading={loading}
					onClick={onUpdateAsset}
				>
					Actualizar
				</Button>
			</div>
		</div>
	);
}

export default AssetEdit;
