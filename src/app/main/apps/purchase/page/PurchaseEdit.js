import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
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
import { DATE_FORMATS, formatDate, getHandleChange, getPathByParams, redirect, roundNumber } from '@core/utils/utils';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { useForm } from '@fuse/hooks';
import { useSelector } from 'react-redux';
import Button from '@core/components/Button';
import FileUpload from '@core/components/FileUpload';
import Loading from '@core/components/Loading';
import Print from '@core/components/Print';
import React, { useEffect, useState } from 'react';
// Components
import {
	PAYMENT_METHODS,
	PURCHASE_APP_KEY,
	PURCHASE_PAGE_LIST,
	PURCHASE_STATUS,
	PURCHASE_URL_EDIT,
	PURCHASE_URL_UPDATE,
	PURCHASE_URL_UPDATE_STATUS
} from '../PurchaseConst';
import PurchaseItemModel from '../model/PurchaseItemModel';
import PurchaseModel from '../model/PurchaseModel';
import PurchasePrint from '../components/PurchasePrint';

const {
	PURCHASE_STATUS_APPROVED,
	PURCHASE_STATUS_CANCELLED,
	PURCHASE_STATUS_CHECKING,
	PURCHASE_STATUS_CLOSED,
	PURCHASE_STATUS_FINISHED,
	PURCHASE_STATUS_IN_PROCESS,
	PURCHASE_STATUS_REJECTED
} = PURCHASE_STATUS;

/**
 * @function PurchaseEdit
 * @brief Formulario de edición de orden compra
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
export default function PurchaseEdit(props) {
	const { id } = props?.match?.params;

	const { user } = useSelector(({ auth }) => auth);

	const [data, setData] = useState({});
	const [disabled, setDisabled] = useState(true);
	const [disabledItem, setDisabledItem] = useState(true);
	const [loading, setLoading] = useState(false);
	const [skeleton, setSkeleton] = useState(true);

	const [openApprove, setOpenApprove] = useState(false);
	const [openCancel, setOpenCancel] = useState(false);
	const [openChecking, setOpenChekcing] = useState(false);
	const [openClose, setOpenClose] = useState(false);
	const [openFinish, setOpenFinish] = useState(false);
	const [openReject, setOpenReject] = useState(false);

	const { form, handleChange, setForm } = useForm(new PurchaseModel());

	const {
		form: formItem,
		handleChange: handleChangeItem,
		setForm: setFormItem,
		resetForm: resetFormItem
	} = useForm(new PurchaseItemModel());

	const status = data?.purchase?.get_status?.parameter_key;

	const formDisabled =
		!user.is_admin || (status !== PURCHASE_STATUS_IN_PROCESS && status !== PURCHASE_STATUS_APPROVED);

	const inProcess = user.is_admin && status === PURCHASE_STATUS_IN_PROCESS;

	const canChecking = user.is_approver && status === PURCHASE_STATUS_CHECKING;
	const canClose = user.is_admin && status === PURCHASE_STATUS_APPROVED;
	const canFinish = user.is_admin && status === PURCHASE_STATUS_CLOSED;
	const canView = user.is_admin && (canFinish || status === PURCHASE_STATUS_FINISHED);
	const canCancel = user.is_admin && (inProcess || canClose || canFinish);

	const subtotal = (() => {
		let _subtotal = 0;

		form.items.forEach(item => {
			_subtotal += parseInt(item.total_value, 10);
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

	const onUpdatePurchase = () => {
		setLoading(true);

		return axios({
			url: getPathByParams(PURCHASE_URL_UPDATE, { id }),
			method: 'PUT',
			data: {
				...form,
				delivery_date: formatDate(form.delivery_date),
				sub_total: subtotal,
				iva,
				total
			},
			success: ({ purchase }) => {
				setLoading(false);
				setData({ ...data, purchase });
			},
			error: () => setLoading(false)
		});
	};

	const onUpdateStatus = _status => {
		setLoading(true);

		axios({
			url: getPathByParams(PURCHASE_URL_UPDATE_STATUS, { id }),
			method: 'PUT',
			data: {
				status: _status
			},
			success: ({ purchase }) => {
				setLoading(false);
				setData({ ...data, purchase });
			},
			error: () => setLoading(false)
		});
	};

	useEffect(() => {
		const success = response => {
			const { purchase } = response;

			if (purchase) {
				setData(response);
				setForm(new PurchaseModel(purchase));
				setSkeleton(false);
			} else {
				error();
			}
		};

		const error = () => redirect(PURCHASE_PAGE_LIST);

		axios({ url: getPathByParams(PURCHASE_URL_EDIT, { id }), method: 'GET', success, error });
		// eslint-disable-next-line
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
				Orden de compra <span className="underline">{`${form.id}`.padStart(8, '0')}</span> (
				{data.purchase.get_status.str_val})
			</Typography>

			<div className="flex flex-col text-11 leading-none p-10 border-1 rounded-8 mb-10 w-full">
				<span className="mb-6">
					Creada por: <span className="font-bold">{data.purchase.get_creator_user.display_name}</span> -{' '}
					{formatDate(data.purchase.created_at, DATE_FORMATS.YYYY_MM_DD_hh_mm_ss)}
				</span>

				<span className="mb-6">
					Actualizada por: <span className="font-bold">{data.purchase.get_updater_user.display_name}</span> -{' '}
					{formatDate(data.purchase.updated_at, DATE_FORMATS.YYYY_MM_DD_hh_mm_ss)}
				</span>

				{data.purchase.approved_at && (
					<span>
						Aprobada por: <span className="font-bold">{data.purchase.get_approver_user.display_name}</span>{' '}
						- {formatDate(data.purchase.approved_at, DATE_FORMATS.YYYY_MM_DD_hh_mm_ss)}
					</span>
				)}
			</div>

			<div className="flex mb-10 w-full">
				<div className="w-3/5">
					<div className="flex mb-10">
						<FormControl className="mr-2 w-1/2" required>
							<InputLabel>Solicitado por</InputLabel>

							<Select
								name="id_requesting_user"
								value={form.id_requesting_user}
								onChange={handleChange}
								disabled={formDisabled}
							>
								{data.users?.map(_user => (
									<MenuItem key={_user.id} value={_user.id}>
										{_user.display_name}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<FormControl className="ml-2 w-1/2" required>
							<InputLabel>Proveedor</InputLabel>

							<Select
								name="id_provider"
								value={form.id_provider}
								onChange={handleChange}
								disabled={formDisabled}
							>
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
								disabled={formDisabled}
								disablePast
								required
							/>

							<TextField
								label="Dirección de entrega"
								name="delivery_address"
								value={form.delivery_address}
								onChange={handleChange}
								className="mx-4 w-1/3"
								disabled={formDisabled}
								required
							/>

							<FormControl className="w-1/3" required>
								<InputLabel>Ciudad de entrega</InputLabel>

								<Select
									name="id_city"
									value={form.id_city}
									onChange={handleChange}
									disabled={formDisabled}
								>
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

							<Select
								name="id_payment_method"
								value={form.id_payment_method}
								onChange={handleChange}
								disabled={formDisabled}
							>
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
								disabled={formDisabled}
								required
							/>
						)}
					</div>
				</div>
			</div>
			<div id="div_test" className="flex p-10 border-1 rounded-8 mb-10 w-full">
				{!formDisabled && (
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
							disabled={formDisabled}
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
								disabled={formDisabled}
								required
							/>

							<TextField
								type="number"
								label="Cantidad"
								name="quantity"
								value={formItem.quantity}
								onChange={handleChangeItem}
								className="ml-2 w-2/5"
								disabled={formDisabled || formItem.unit_value >= data.asset_amount}
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
								disabled={formDisabled || disabledItem}
								onClick={onAddItem}
							>
								{formItem.index === undefined ? 'Agregar' : 'Actualizar'}
							</Button>
						</div>
					</div>
				)}

				<div className={formDisabled ? 'w-full' : 'ml-20 w-3/5'}>
					{formDisabled && (
						<Typography color="primary" className="font-bold mb-10">
							Ítems
						</Typography>
					)}
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
									{!formDisabled && <th>Acciones</th>}
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

										{!formDisabled && (
											<td className="text-center">
												<IconButton
													size="small"
													onClick={() => onEditPurchaseItem(item, index)}
												>
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
										)}
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
				className="mb-10 w-full"
				multiline
				rows={4}
				rowsMax={4}
				disabled={formDisabled}
			/>

			<FileUpload files={form.files} appKey={PURCHASE_APP_KEY} registerId={form.id} disabled={!canCancel} />

			<div className="text-center m-20">
				{canCancel && (
					<Button
						variant="contained"
						color="primary"
						loading={loading}
						onClick={() => setOpenCancel(true)}
						className="bg-red-400 hover:bg-red-600 mx-5"
					>
						Cancelar
					</Button>
				)}

				{inProcess && (
					<Button
						variant="contained"
						color="primary"
						loading={loading}
						onClick={() => setOpenChekcing(true)}
						className="bg-green-400 hover:bg-green-600 mx-5"
					>
						Enviar a revisión
					</Button>
				)}

				{canView && (
					<Print
						trigger={
							<Button variant="contained" color="secondary" loading={loading} className="mx-5">
								Visualizar
							</Button>
						}
						title={`Orden_de_Compra_${`${data.purchase.id}`.padStart(8, '0')}`}
						Component={PurchasePrint}
						componentProps={{ purchase: data.purchase, companyInfo: data.company_info }}
					/>
				)}

				{!formDisabled && (
					<Button
						variant="contained"
						color="primary"
						disabled={disabled}
						loading={loading}
						onClick={onUpdatePurchase}
						className="mx-5"
					>
						Actualizar
					</Button>
				)}

				{canClose && (
					<Button
						variant="contained"
						color="secondary"
						loading={loading}
						onClick={() => setOpenClose(true)}
						className="mx-5"
					>
						Cerrar
					</Button>
				)}

				{canFinish && (
					<Button
						variant="contained"
						color="primary"
						loading={loading}
						onClick={() => setOpenFinish(true)}
						className="bg-green-400 hover:bg-green-600 mx-5"
					>
						Finalizar
					</Button>
				)}

				{canChecking && (
					<>
						<Button
							variant="contained"
							color="primary"
							loading={loading}
							onClick={() => setOpenReject(true)}
							className="bg-red-400 hover:bg-red-600 mx-5"
						>
							Rechazar
						</Button>

						<Button
							variant="contained"
							color="primary"
							loading={loading}
							onClick={() => setOpenApprove(true)}
							className="bg-green-400 hover:bg-green-600 mx-5"
						>
							Aprobar
						</Button>
					</>
				)}
			</div>

			<DialogConfirmUpdateStatus
				title="Enviar a revisión"
				message="¿Confirma enviar a revisión la orden de compra?"
				open={openChecking}
				onClose={() => setOpenChekcing(false)}
				onConfirm={() => onUpdatePurchase().then(() => onUpdateStatus(PURCHASE_STATUS_CHECKING))}
			/>

			<DialogConfirmUpdateStatus
				title="Cancelar"
				message="¿Confirma anular la orden de compra?"
				open={openCancel}
				onClose={() => setOpenCancel(false)}
				onConfirm={() => onUpdateStatus(PURCHASE_STATUS_CANCELLED)}
			/>

			<DialogConfirmUpdateStatus
				title="Rechazar"
				message="¿Confirma rechazar la orden de compra?"
				open={openReject}
				onClose={() => setOpenReject(false)}
				onConfirm={() => onUpdateStatus(PURCHASE_STATUS_REJECTED)}
			/>

			<DialogConfirmUpdateStatus
				title="Aprobar"
				message="¿Confirma aprobar la orden de compra?"
				open={openApprove}
				onClose={() => setOpenApprove(false)}
				onConfirm={() => onUpdateStatus(PURCHASE_STATUS_APPROVED)}
			/>

			<DialogConfirmUpdateStatus
				title="Cerrar"
				message="¿Confirma cerrar la orden de compra?"
				open={openClose}
				onClose={() => setOpenClose(false)}
				onConfirm={() => onUpdateStatus(PURCHASE_STATUS_CLOSED)}
			/>

			<DialogConfirmUpdateStatus
				title="Finalizar"
				message="¿Confirma finalizar la orden de compra?"
				open={openFinish}
				onClose={() => setOpenFinish(false)}
				onConfirm={() => onUpdatePurchase().then(() => onUpdateStatus(PURCHASE_STATUS_FINISHED))}
			/>
		</div>
	);
}

function DialogConfirmUpdateStatus({ title, message, open, onClose, onConfirm }) {
	return (
		<Dialog open={open}>
			<DialogTitle>{title}</DialogTitle>

			<DialogContent className="flex flex-col">{message}</DialogContent>

			<DialogActions>
				<Button variant="contained" color="primary" onClick={onClose} className="bg-red-400 hover:bg-red-600">
					Cancelar
				</Button>

				<Button
					variant="contained"
					color="primary"
					onClick={() => {
						onConfirm();
						onClose();
					}}
					className="bg-green-400 hover:bg-green-600"
				>
					Aceptar
				</Button>
			</DialogActions>
		</Dialog>
	);
}
