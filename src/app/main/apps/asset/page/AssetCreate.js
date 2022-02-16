import {
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography
} from '@material-ui/core';
import { axios } from '@core/services/Api';
import { formatDate, getHandleChange, getPathByParams, redirect, roundNumber } from '@core/utils/utils';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { useForm } from '@fuse/hooks';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@core/components/Button';
import Loading from '@core/components/Loading';
import React, { useEffect, useState } from 'react';
// Components
import { ASSET_PAGE_VIEW, ASSET_URL_CREATE, ASSET_URL_PURCHASE_ITEMS, ASSET_URL_STORE } from '../AssetConst';
import { PURCHASE_PAGE_VIEW, PURCHASE_STATUS } from '../../purchase/PurchaseConst';
import AssetModel from '../model/AssetModel';

/**
 * @function AssetCreate
 * @brief Página de creación de un activo
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
function AssetCreate() {
	const [data, setData] = useState({});
	const [disabled, setDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [purchase, setPurchase] = useState({});
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
			<Typography component="h1" color="primary" className="text-xl font-bold mb-16">
				Ingresar activo
			</Typography>

			<div className="flex flex-col mb-16">
				<div>
					<Button variant="contained" color="secondary" onClick={() => setOpen(true)}>
						Relacionar con orden de compra
					</Button>
				</div>

				{purchase.id && (
					<p className="mt-16">
						<a
							href={`${PURCHASE_PAGE_VIEW}/${purchase.id}`}
							target="_blank"
							rel="noopener noreferrer"
							className="font-bold"
						>
							Ir a la orden de compra {purchase.consecutive}
						</a>
					</p>
				)}

				{open && (
					<DialogAssetPurchase
						name="id_purchase_item"
						value={form.id_purchase_item}
						handleChange={handleChange}
						purchase={purchase}
						setPurchase={setPurchase}
						open={open}
						onClose={() => setOpen(false)}
					/>
				)}
			</div>

			<div className="flex mb-10">
				<TextField
					label="Nombre del activo"
					name="name"
					value={form.name}
					onChange={handleChange}
					className="w-1/3"
					required
					autoFocus
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
						disabled={!!purchase?.id}
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

function DialogAssetPurchase({ open, onClose, name, value, handleChange, purchase, setPurchase }) {
	const [purchases, setPurchases] = useState([]);
	const [selected, setSelected] = useState({ id: value });
	const [purchaseSelected, setPurchaseSelected] = useState(purchase);
	const [skeleton, setLoading] = useState(true);

	useEffect(() => {
		axios({
			method: 'GET',
			url: getPathByParams(ASSET_URL_PURCHASE_ITEMS, { status: PURCHASE_STATUS.PURCHASE_STATUS_FINISHED }),
			success: response => {
				const _purchases = response.purchases?.filter(_purchase => !!_purchase.items.length);

				setPurchases(_purchases);
				setLoading(false);
			}
		});
	}, []);

	return (
		<Dialog open={open}>
			{skeleton ? (
				<div className="h-128 w-128">
					<Loading />
				</div>
			) : (
				<>
					<DialogTitle>Ingerso de activo - Buscar orden de compra</DialogTitle>

					<DialogContent className="flex flex-col">
						<Autocomplete
							options={purchases}
							getOptionLabel={option => option.consecutive}
							value={purchaseSelected.id ? purchaseSelected : null}
							onChange={(event, _value) => setPurchaseSelected(_value)}
							renderInput={params => <TextField {...params} label="Número de orden de compra" />}
							noOptionsText="No hay resultados"
							className="mb-16"
						/>

						{purchaseSelected.id && (
							<div>
								<p className="text-justify font-bold mb-16">
									Debe de seleccionar algún ítem relacionado con la compra, para proceder con el
									ingreso del activo. Tenga en cuenta que solo puede realizar esta operación durante
									el ingreso de un activo, por lo cual si después de ingresado desea realacionarlo con
									una orden de compra, ya no podrá hacerlo.
								</p>

								<p className="mb-16">
									<a
										href={`${PURCHASE_PAGE_VIEW}/${purchaseSelected.id}`}
										target="_blank"
										rel="noopener noreferrer"
										className="font-bold"
									>
										Ir a la orden de compra {purchaseSelected.consecutive}
									</a>
								</p>

								<table className="print w-full">
									<thead>
										<tr>
											<th className="w-0">Seleccionar</th>
											<th>Producto</th>
											<th>Valor unitario</th>
										</tr>
									</thead>

									<tbody>
										{purchaseSelected?.items?.map(item => (
											<tr key={item.id}>
												<td className="text-center">
													<Checkbox
														checked={selected?.id === item.id}
														onChange={e => setSelected(e.target.checked ? item : null)}
														inputProps={{ 'aria-label': 'primary checkbox' }}
													/>
												</td>
												<td>{item.product}</td>
												<td className="text-right">$ {item.unit_value}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</DialogContent>

					<DialogActions>
						<Button
							variant="contained"
							color="primary"
							onClick={onClose}
							className="bg-red-400 hover:bg-red-600"
						>
							Cancelar
						</Button>

						<Button
							variant="contained"
							color="primary"
							onClick={() => {
								handleChange(getHandleChange(name, selected?.id || ''));
								handleChange(getHandleChange('current_value', selected?.unit_value || ''));
								setPurchase(selected ? purchaseSelected : {});
								onClose();
							}}
							className="bg-green-400 hover:bg-green-600"
						>
							Seleccionar
						</Button>
					</DialogActions>
				</>
			)}
		</Dialog>
	);
}
