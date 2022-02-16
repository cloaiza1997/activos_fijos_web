import {
	FormControl,
	Icon,
	IconButton,
	InputAdornment,
	InputLabel,
	ListSubheader,
	MenuItem,
	Select,
	TextField,
	Typography
} from '@material-ui/core';
import { axios } from '@core/services/Api';
import { formatDate, getHandleChange, redirect, roundNumber } from '@core/utils/utils';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { useForm } from '@fuse/hooks';
import Button from '@core/components/Button';
import Loading from '@core/components/Loading';
import React, { useEffect, useState } from 'react';
// Components
import { PAYMENT_METHODS, PURCHASE_PAGE_VIEW, PURCHASE_URL_CREATE, PURCHASE_URL_STORE } from '../PurchaseConst';
import PurchaseModel from '../model/PurchaseModel';
import PurchaseItemModel from '../model/PurchaseItemModel';

/**
 * @function PurchaseCreate
 * @brief Formulario de creación de orden compra
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
export default function PurchaseCreate() {
	const [disabled, setDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState({});
	const [disabledItem, setDisabledItem] = useState(true);
	const [skeleton, setSkeleton] = useState(true);

	const { form, handleChange } = useForm(new PurchaseModel());
	const {
		form: formItem,
		handleChange: handleChangeItem,
		setForm: setFormItem,
		resetForm: resetFormItem
	} = useForm(new PurchaseItemModel());

	const subtotal = (() => {
		let _subtotal = 0;

		form.items.forEach(item => {
			_subtotal += item.total_value;
		});

		return _subtotal;
	})();

	const iva = roundNumber(subtotal * data.iva);
	const total = roundNumber(subtotal + iva);
	const isCredit = data.payment_methods?.some(
		e => e.id === form.id_payment_method && e.key === PAYMENT_METHODS.CREDIT
	);

	const onAddItem = () => {
		const { items } = form;
		const item = { ...formItem, total_value: formItem.quantity * formItem.unit_value };

		if (formItem.index === undefined) {
			items.push(item);
		} else {
			items[formItem.index] = item;
		}

		handleChange(getHandleChange('items', items));
		resetFormItem();
	};

	const onEditPurchaseItem = (item, index) => {
		setFormItem({ ...new PurchaseItemModel(item), index });
	};

	const onRemovePurchaseItem = index => {
		const { items } = form;

		items.splice(index, 1);

		handleChange(getHandleChange('items', items));
	};

	const onStorePurchase = () => {
		setLoading(true);

		axios({
			url: PURCHASE_URL_STORE,
			method: 'POST',
			data: {
				...form,
				delivery_date: formatDate(form.delivery_date),
				sub_total: subtotal,
				iva,
				total
			},
			success: ({ purchase }) => {
				redirect(`${PURCHASE_PAGE_VIEW}/${purchase.id}`);
			},
			error: () => setLoading(false)
		});
	};

	useEffect(() => {
		const success = response => {
			setData(response);
			setSkeleton(false);
		};

		axios({ url: PURCHASE_URL_CREATE, method: 'GET', success });
	}, []);

	useEffect(() => {
		const _disabled =
			!form.id_provider ||
			!form.id_requesting_user ||
			!form.delivery_date ||
			!form.delivery_address.trim() ||
			!form.id_city ||
			!form.id_payment_method ||
			(isCredit && (!form.payment_days || form.payment_days <= 0)) ||
			!form.items.length;

		setDisabled(_disabled);
	}, [form, isCredit]);

	useEffect(() => {
		const _disabled =
			!formItem.product.trim() ||
			!formItem.quantity ||
			formItem.quantity <= 0 ||
			!formItem.unit_value ||
			formItem.unit_value <= 0;

		setDisabledItem(_disabled);
	}, [formItem]);

	return skeleton ? (
		<Loading />
	) : (
		<div className="p-20">
			<Typography component="h1" color="primary" className="text-xl font-bold mb-10">
				Crear orden de compra
			</Typography>

			<div className="flex mb-10 w-full">
				<div className="w-3/5">
					<div className="flex mb-10">
						<FormControl className="mr-2 w-1/2" required>
							<InputLabel>Solicitado por</InputLabel>

							<Select name="id_requesting_user" value={form.id_requesting_user} onChange={handleChange}>
								{data.users?.map(user => (
									<MenuItem key={user.id} value={user.id}>
										{user.display_name}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<FormControl className="ml-2 w-1/2" required>
							<InputLabel>Proveedor</InputLabel>

							<Select name="id_provider" value={form.id_provider} onChange={handleChange}>
								{data.providers?.map(provider => (
									<MenuItem key={provider.id} value={provider.id}>
										{provider.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>

					<div>
						<Typography color="primary" className="font-bold mb-10">
							Datos de entrega
						</Typography>

						<div className="flex">
							<KeyboardDatePicker
								disableToolbar
								variant="inline"
								format="yyyy-MM-DD"
								label="Fecha de entrega"
								value={form.delivery_date || null}
								onChange={date => handleChange(getHandleChange('delivery_date', date))}
								className="w-1/3"
								disablePast
								required
							/>

							<TextField
								label="Dirección de entrega"
								name="delivery_address"
								value={form.delivery_address}
								onChange={handleChange}
								className="mx-4 w-1/3"
								required
							/>

							<FormControl className="w-1/3" required>
								<InputLabel>Ciudad de entrega</InputLabel>

								<Select name="id_city" value={form.id_city} onChange={handleChange}>
									{data.cities?.map(city =>
										city.is_department ? (
											<ListSubheader key={city.id} className="font-bold" value="">
												{city.name}
											</ListSubheader>
										) : (
											<MenuItem key={city.id} value={city.id}>
												{city.name}
											</MenuItem>
										)
									)}
								</Select>
							</FormControl>
						</div>
					</div>
				</div>

				<div className="flex ml-10 p-10 border-1 rounded-8 w-2/5">
					<div className="w-1/2">
						<Typography color="primary" className="font-bold mb-10">
							Resumen
						</Typography>

						<table className="w-full">
							<tbody>
								<tr>
									<td>Subtotal</td>
									<td className="text-right">$ {subtotal}</td>
								</tr>

								<tr className="border-b">
									<td>IVA</td>
									<td className="text-right">$ {iva}</td>
								</tr>

								<tr>
									<td className="font-bold">Total</td>
									<td className="font-bold text-right">$ {total}</td>
								</tr>
							</tbody>
						</table>
					</div>

					<div className="ml-20 w-1/2">
						<FormControl className="mb-10 w-full" required>
							<InputLabel>Forma de pago</InputLabel>

							<Select name="id_payment_method" value={form.id_payment_method} onChange={handleChange}>
								{data.payment_methods?.map(method => (
									<MenuItem key={method.id} value={method.id}>
										{method.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						{isCredit && (
							<TextField
								type="number"
								label="Días"
								name="payment_days"
								value={form.payment_days}
								onChange={handleChange}
								className="w-full"
								required
							/>
						)}
					</div>
				</div>
			</div>

			<div className="flex p-10 border-1 rounded-8 mb-10 w-full">
				<div className="w-2/5">
					<Typography color="primary" className="font-bold mb-10">
						Ítems
					</Typography>

					<TextField
						label="Producto"
						name="product"
						value={formItem.product}
						onChange={handleChangeItem}
						className="mb-10 w-full"
						required
					/>

					<div className="flex mb-10">
						<TextField
							type="number"
							label="Valor unitario"
							name="unit_value"
							value={formItem.unit_value}
							onChange={e => {
								handleChangeItem(e);

								if (e.target.value >= data.asset_amount) {
									handleChangeItem(getHandleChange('quantity', 1));
								}
							}}
							className="mr-2 w-3/5"
							InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
							required
						/>

						<TextField
							type="number"
							label="Cantidad"
							name="quantity"
							value={formItem.quantity}
							onChange={handleChangeItem}
							className="ml-2 w-2/5"
							disabled={formItem.unit_value >= data.asset_amount}
							required
						/>
					</div>

					<div className="flex">
						<TextField
							type="number"
							label="Valor total"
							name="total_value"
							value={formItem.quantity * formItem.unit_value}
							className="mr-2 w-1/2"
							InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
							disabled
						/>

						<Button
							variant="contained"
							color="secondary"
							className="ml-2 w-1/2"
							disabled={disabledItem}
							onClick={onAddItem}
						>
							{formItem.index === undefined ? 'Agregar' : 'Actualizar'}
						</Button>
					</div>
				</div>

				<div className="ml-20 w-3/5">
					{form.items.length === 0 ? (
						<div className="flex justify-center items-center w-full h-full">
							<Typography color="secondary">No se han agregado ítems a la compra</Typography>
						</div>
					) : (
						<table className="border-1 rounded-8 w-full">
							<thead className="border-b">
								<tr>
									<th>Producto</th>
									<th>Cantidad</th>
									<th>Valor unitario</th>
									<th>Valor total</th>
									<th>Activo fijo</th>
									<th>Acciones</th>
								</tr>
							</thead>

							<tbody>
								{form.items.map((item, index) => (
									<tr key={index} className="border-b">
										<td>{item.product}</td>
										<td className="text-center">{item.quantity}</td>
										<td className="text-right">$ {item.unit_value}</td>
										<td className="text-right">$ {item.total_value}</td>

										<td className="text-center">
											{item.unit_value >= data.asset_amount ? 'Si' : 'No'}
										</td>

										<td className="text-center">
											<IconButton size="small" onClick={() => onEditPurchaseItem(item, index)}>
												<Icon fontSize="small" className="text-blue">
													edit
												</Icon>
											</IconButton>

											<IconButton size="small" onClick={() => onRemovePurchaseItem(index)}>
												<Icon fontSize="small" className="text-red">
													delete
												</Icon>
											</IconButton>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>
			</div>

			<TextField
				label="Observaciones"
				name="observations"
				value={form.observations}
				onChange={handleChange}
				className="w-full"
				multiline
				rows={4}
				rowsMax={4}
			/>

			<div className="text-center m-20">
				<Button
					variant="contained"
					color="primary"
					disabled={disabled}
					loading={loading}
					onClick={onStorePurchase}
				>
					Guardar
				</Button>
			</div>
		</div>
	);
}
