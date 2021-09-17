/* eslint-disable camelcase */
import { axios } from '@core/services/Api';
import { DATE_FORMATS, formatDate, getHandleChange, getPathByParams } from '@core/utils/utils';
import { FormControl, Icon, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import { showNotifySuccess } from '@core/utils/notify';
import { useForm } from '@fuse/hooks';
import { useSelector } from 'react-redux';
import Button from '@core/components/Button';
import Loading from '@core/components/Loading';
import Print from '@core/components/Print';
import React, { useEffect, useState } from 'react';
// Components
import {
	CERTIFICATE_URL_EDIT,
	CERTIFICATE_URL_STORE_ITEM,
	CERTIFICATE_URL_UPDATE,
	CERTIFICATE_STATUS,
	CERTIFICATE_URL_STATUS_CHECKING,
	CERTIFICATE_URL_STATUS_REJECTED,
	CERTIFICATE_URL_STATUS_APPROVED,
	CERTIFICATE_URL_STATUS_SEND_SIGN,
	CERTIFICATE_URL_STATUS_ACTIVE,
	CERTIFICATE_URL_STATUS_INANCTIVE,
	CERTIFICATE_URL_STATUS_CANCEL
} from '../CertificateConst';
import { ASSET_PAGE_VIEW } from '../../asset/AssetConst';
import CertificateAssetForm from '../components/CertificateAssetForm';
import CertificateModel from '../model/CertificateModel';
import CertificatePrint from '../components/CertificatePrint';

const { IN_PROCESS, APPROVED, ACTIVE, CHECKING, SIGNATURE_PROCESS } = CERTIFICATE_STATUS;

function CertificateView(props) {
	const { id } = props?.match?.params;

	const [currentAsset, setCurrentAsset] = useState({});
	const [data, setData] = useState({});
	const [disabled, setDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [skeleton, setSkeleton] = useState(true);

	const { user } = useSelector(({ auth }) => auth);

	const { form, handleChange, setForm } = useForm(new CertificateModel());

	const status = data.certificate?.get_status?.parameter_key;

	const canEdit = user.is_admin && (status === IN_PROCESS || status === APPROVED || status === ACTIVE);
	const canChecking = user.is_admin && status === IN_PROCESS;
	const canApprove = user.is_approver && status === CHECKING;
	const canSendSign = user.is_admin && status === APPROVED;
	const canSign = user.id === form.id_receiver_user && status === SIGNATURE_PROCESS;
	const canInactive = user.is_admin && status === ACTIVE;
	const canView = status === ACTIVE;

	const onUpdateCertificate = () => {
		setLoading(true);

		return axios({
			url: getPathByParams(CERTIFICATE_URL_UPDATE, { id }),
			method: 'PUT',
			data: form,
			success: async ({ certificate }) => {
				const itemsPromise = [];

				for (let i = 0; i < form.items.length; i += 1) {
					const item = form.items[i];

					const formData = new FormData();

					formData.append('id', item.id);
					formData.append('id_certificate', certificate.id);
					formData.append('asset_number', item.asset_number);
					formData.append('brand', item.brand);
					formData.append('id_asset', item.id_asset);
					formData.append('id_physical_status', item.id_physical_status);
					formData.append('model', item.model);
					formData.append('name', item.name);
					formData.append('observations', item.observations || '');
					formData.append('serial_number', item.serial_number);

					item.files.forEach(file =>
						file.oldFile || file.id_app_key
							? formData.append('oldFiles[]', file.id)
							: formData.append('files[]', file)
					);

					const response = axios({
						url: CERTIFICATE_URL_STORE_ITEM,
						method: 'POST',
						data: formData
					}).then(({ certi_detail }) => certi_detail);

					itemsPromise.push(response);
				}

				const items = await Promise.all(itemsPromise);
				showNotifySuccess('Acta actualizada correctamente');

				setForm({ ...new CertificateModel({ ...certificate, items }) });
				setData({ ...data, certificate: { ...data.certificate, ...certificate } });
				setLoading(false);
			},
			error: () => setLoading(false)
		});
	};

	const updateStatus = url => {
		setLoading(true);

		axios({
			url: getPathByParams(url, { id }),
			method: 'POST',
			success: ({ certificate }) => {
				setForm({ ...new CertificateModel({ ...form, ...certificate }) });
				setData({ ...data, certificate: { ...data.certificate, ...certificate } });
				setLoading(false);
			},
			error: () => setLoading(false)
		});
	};

	useEffect(() => {
		const success = response => {
			setData(response);

			setForm(
				new CertificateModel({ ...response.certificate, items: response.certificate.get_certificate_details })
			);

			setSkeleton(false);
		};

		axios({ url: getPathByParams(CERTIFICATE_URL_EDIT, { id }), method: 'GET', success });
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		const _disabled =
			!form.id_deliver_user ||
			!form.id_deliver_area ||
			!form.id_receiver_user ||
			!form.id_receiver_area ||
			!form.items.length;

		setDisabled(_disabled);
	}, [form]);

	return skeleton ? (
		<Loading />
	) : (
		<div className="p-20">
			<Typography component="h1" color="primary" className="text-xl font-bold mb-16">
				Acta de movimiento {`${form.id}`.padStart(6, '0')} - {data.certificate.get_status.str_val}
			</Typography>

			<div className="flex flex-col text-11 leading-none p-10 border-1 rounded-8 mb-10 w-full">
				<span className="mb-6">
					Creada por: <span className="font-bold">{data.certificate.get_creator_user.display_name}</span> -{' '}
					{formatDate(data.certificate.created_at, DATE_FORMATS.YYYY_MM_DD_hh_mm_ss)}
				</span>

				{data.certificate.get_approver_user && (
					<span>
						Aprobada por:{' '}
						<span className="font-bold">{data.certificate.get_approver_user.display_name}</span> -{' '}
						{formatDate(data.certificate.get_approver_user, DATE_FORMATS.YYYY_MM_DD_hh_mm_ss)}
					</span>
				)}
			</div>

			<div className="flex mb-10">
				<FormControl className="mr-2 w-1/4" required>
					<InputLabel>Entrega</InputLabel>

					<Select
						name="id_deliver_user"
						value={form.id_deliver_user}
						onChange={handleChange}
						disabled={!canEdit}
						required
					>
						{data.users?.map(_user => (
							<MenuItem key={_user.id} value={_user.id}>
								{_user.display_name}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<FormControl className="mx-2 w-1/4" required>
					<InputLabel>Área que entrega</InputLabel>

					<Select
						name="id_deliver_area"
						value={form.id_deliver_area}
						onChange={handleChange}
						disabled={!canEdit}
						required
					>
						{data.areas?.map(area => (
							<MenuItem key={area.id} value={area.id}>
								{area.str_val}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<FormControl className="mx-2 w-1/4" required>
					<InputLabel>Recibe</InputLabel>

					<Select
						name="id_receiver_user"
						value={form.id_receiver_user}
						onChange={handleChange}
						disabled={!canEdit}
						required
					>
						{data.users?.map(_user => (
							<MenuItem key={_user.id} value={_user.id}>
								{_user.display_name}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<FormControl className="ml-2 w-1/4" required>
					<InputLabel>Área que recibe</InputLabel>

					<Select
						name="id_receiver_area"
						value={form.id_receiver_area}
						onChange={handleChange}
						disabled={!canEdit}
						required
					>
						{data.areas?.map(area => (
							<MenuItem key={area.id} value={area.id}>
								{area.str_val}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</div>

			<div>
				<Typography component="h1" color="primary" className="text-xl font-bold my-16">
					Activos del acta de movimiento
				</Typography>

				{canEdit && (
					<Button variant="contained" color="secondary" onClick={() => setOpen(true)} className="mb-16">
						Agregar activo
					</Button>
				)}

				{form.items.length > 0 && (
					<table className="print mb-16 w-full">
						<thead>
							<tr>
								<th>Nº activo</th>
								<th>Activo</th>
								<th>Marca</th>
								<th>Modelo</th>
								<th>Serial</th>
								<th>Estado Físico</th>
								<th>Estado</th>
								<th>Adjuntos</th>
								<th>Observaciones</th>
								<th>Acciones</th>
							</tr>
						</thead>

						<tbody>
							{form.items.map((item, index) => (
								<tr key={index}>
									<td className="text-center">
										<a
											href={`${ASSET_PAGE_VIEW}/${item.id_asset}`}
											target="_blank"
											rel="noopener noreferrer"
										>
											{item.asset_number}
										</a>
									</td>
									<td>{item.name}</td>
									<td className="text-center">{item.brand}</td>
									<td>{item.model}</td>
									<td>{item.serial_number}</td>
									<td className="text-center">
										{
											data.physical_status.find(_status => _status.id === item.id_physical_status)
												.name
										}
									</td>
									<td className="text-center">{item.status}</td>
									<td className="text-center">{item.files.length}</td>
									<td>{item.observations}</td>
									<td className="text-center">
										<IconButton
											size="small"
											onClick={() => {
												setCurrentAsset({ ...item, index });
												setOpen(true);
											}}
											className="mx-4"
										>
											<Icon fontSize="small" color="primary">
												edit
											</Icon>
										</IconButton>

										{canEdit && (
											<IconButton
												size="small"
												onClick={() => {
													const { items } = form;

													items.splice(index, 1);
													handleChange(getHandleChange('items', items));
												}}
												className="mx-4"
											>
												<Icon fontSize="small" className="text-red">
													delete
												</Icon>
											</IconButton>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}

				{open && (
					<CertificateAssetForm
						open={open}
						setOpen={setOpen}
						form={form}
						handleChange={handleChange}
						data={data}
						currentAsset={currentAsset}
						setCurrentAsset={setCurrentAsset}
						disabledForm={!canEdit}
					/>
				)}
			</div>

			<TextField
				label="Observaciones generales"
				name="observations"
				value={form.observations}
				onChange={handleChange}
				className="mb-10 w-full"
				disabled={!canEdit}
				multiline
				rows={4}
				rowsMax={4}
			/>

			<div className="text-center m-20">
				{canChecking && (
					<Button
						variant="contained"
						color="primary"
						loading={loading}
						confirm={{
							title: 'Enviar a revisión',
							message: '¿Confirma enviar a revisión?'
						}}
						onClick={() => onUpdateCertificate().then(() => updateStatus(CERTIFICATE_URL_STATUS_CHECKING))}
						className="mx-4 bg-green-400 hover:bg-green-600"
					>
						Enviar a revisión
					</Button>
				)}

				{canSendSign && (
					<Button
						variant="contained"
						color="primary"
						loading={loading}
						confirm={{
							title: 'Enviar a firmar',
							message: '¿Confirma enviar a firmar el acta?'
						}}
						onClick={() => onUpdateCertificate().then(() => updateStatus(CERTIFICATE_URL_STATUS_SEND_SIGN))}
						className="mx-4 bg-green-400 hover:bg-green-600"
					>
						Enviar a firmar
					</Button>
				)}

				{canSign && (
					<Button
						variant="contained"
						color="primary"
						loading={loading}
						onClick={() => updateStatus(CERTIFICATE_URL_STATUS_ACTIVE)}
						className="mx-4 bg-green-400 hover:bg-green-600"
					>
						Firmar
					</Button>
				)}

				{canView && (
					<>
						<Print
							trigger={
								<Button variant="contained" color="secondary" loading={loading} className="mx-4">
									Visualizar
								</Button>
							}
							title={`Acta_Movimiento_${`${data.certificate.id}`.padStart(6, '0')}`}
							Component={CertificatePrint}
							componentProps={{ certificate: data.certificate, companyInfo: data.company_info }}
						/>
					</>
				)}

				{canInactive && (
					<Button
						variant="contained"
						color="primary"
						loading={loading}
						confirm={{
							title: 'Inactivar',
							message: '¿Confirma inactivar el acta?'
						}}
						onClick={() => updateStatus(CERTIFICATE_URL_STATUS_INANCTIVE)}
						className="mx-4 bg-red-400 hover:bg-red-600"
					>
						Inactivar
					</Button>
				)}

				{canEdit && (
					<>
						<Button
							variant="contained"
							color="primary"
							loading={loading}
							confirm={{
								title: 'Anular',
								message: '¿Confirma anular el acta?'
							}}
							onClick={() => updateStatus(CERTIFICATE_URL_STATUS_CANCEL)}
							className="mx-4 bg-red-400 hover:bg-red-600"
						>
							Anular
						</Button>

						<Button
							variant="contained"
							color="primary"
							disabled={disabled}
							loading={loading}
							confirm={{
								title: 'Actualizar',
								message: '¿Confirma actualizar el acta?'
							}}
							className="mx-4"
							onClick={onUpdateCertificate}
						>
							Actualizar
						</Button>
					</>
				)}

				{canApprove && (
					<>
						<Button
							variant="contained"
							color="primary"
							loading={loading}
							confirm={{
								title: 'Rechazar',
								message: '¿Confirma rechazar el acta?'
							}}
							onClick={() => updateStatus(CERTIFICATE_URL_STATUS_REJECTED)}
							className="bg-red-400 hover:bg-red-600 mx-5"
						>
							Rechazar
						</Button>

						<Button
							variant="contained"
							color="primary"
							loading={loading}
							confirm={{
								title: 'Aprobar',
								message: '¿Confirma aprobar el acta?'
							}}
							onClick={() => updateStatus(CERTIFICATE_URL_STATUS_APPROVED)}
							className="bg-green-400 hover:bg-green-600 mx-5"
						>
							Aprobar
						</Button>
					</>
				)}
			</div>
		</div>
	);
}

export default CertificateView;
