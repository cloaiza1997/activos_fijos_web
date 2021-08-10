import { axios } from '@core/services/Api';
import { formatDate, getHandleChange, redirect, roundNumber } from '@core/utils/utils';
import { FormControl, InputLabel, Select, TextField, Typography, MenuItem, InputAdornment } from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { useForm } from '@fuse/hooks';
import Button from '@core/components/Button';
import Loading from '@core/components/Loading';
import React, { useEffect, useState } from 'react';
// Components
import { ASSET_PAGE_VIEW, ASSET_URL_CREATE, ASSET_URL_STORE } from '../AssetConst';
import AssetModel from '../model/AssetModel';

function AssetCreate() {
	const [disabled, setDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState({});
	const [skeleton, setSkeleton] = useState(true);

	const { form, handleChange, setForm } = useForm(new AssetModel());

	const onStoreAsset = () => {
		setLoading(true);

		axios({
			url: ASSET_URL_STORE,
			method: 'POST',
			data: {
				...form,
				entry_date: formatDate(form.entry_date)
			},
			success: ({ asset }) => {
				redirect(`${ASSET_PAGE_VIEW}/${asset.id}`);
			},
			error: () => setLoading(false)
		});
	};

	useEffect(() => {
		const success = response => {
			setData(response);
			setSkeleton(false);
		};

		axios({ url: ASSET_URL_CREATE, method: 'GET', success });
	}, []);

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

	return skeleton ? (
		<Loading />
	) : (
		<div className="p-20">
			<Typography component="h1" color="primary" className="text-xl font-bold mb-10">
				Crear orden de compra
			</Typography>

			<div className="flex mb-10">
				<TextField
					label="Npmbre del activo"
					name="name"
					value={form.name}
					onChange={handleChange}
					className="w-1/3"
					required
				/>

				<FormControl className="mx-4 w-1/3" required>
					<InputLabel>Grupo de activo</InputLabel>

					<Select
						name="id_asset_group"
						value={form.id_asset_group}
						onChange={e => {
							setForm({ ...form, id_asset_type: '' });
							handleChange(e);
						}}
						required
					>
						{data.asset_groups?.map(group => (
							<MenuItem key={group.id} value={group.id}>
								{group.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<FormControl className="w-1/3" required>
					<InputLabel>Tipo de activo</InputLabel>

					<Select name="id_asset_type" value={form.id_asset_type} onChange={handleChange} required>
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
					onChange={date => handleChange(getHandleChange('entry_date', date))}
					className="w-1/3"
					required
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
						onChange={handleChange}
						className="ml-2 w-1/2"
						InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
						// disabled
						required
					/>
				</div>
			</div>

			<div className="text-center m-20">
				<Button
					variant="contained"
					color="primary"
					disabled={disabled}
					loading={loading}
					onClick={onStoreAsset}
				>
					Guardar
				</Button>
			</div>
		</div>
	);
}

export default AssetCreate;
