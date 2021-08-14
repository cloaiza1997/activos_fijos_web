/* eslint-disable camelcase */
import { axios } from '@core/services/Api';
import { FormControl, Icon, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import { getHandleChange, getPathByParams } from '@core/utils/utils';
import { showNotifySuccess } from '@core/utils/notify';
import { useForm } from '@fuse/hooks';
import Button from '@core/components/Button';
import Loading from '@core/components/Loading';
import React, { useEffect, useState } from 'react';
// Components
import { CERTIFICATE_URL_EDIT, CERTIFICATE_URL_STORE_ITEM, CERTIFICATE_URL_UPDATE } from '../CertificateConst';
import CertificateModel from '../model/CertificateModel';
import CertificateAssetForm from '../components/CertificateAssetForm';

function CertificateView(props) {
	const { id } = props?.match?.params;

	const [currentAsset, setCurrentAsset] = useState({});
	const [data, setData] = useState({});
	const [disabled, setDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [skeleton, setSkeleton] = useState(true);

	const { form, handleChange, setForm } = useForm(new CertificateModel());

	const onUpdateCertificate = () => {
		setLoading(true);

		axios({
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

	// console.log(form);

	return skeleton ? (
		<Loading />
	) : (
		<div className="p-20">
			<Typography component="h1" color="primary" className="text-xl font-bold mb-16">
				Editar acta de movimiento {`${form.id}`.padStart(6, '0')}
			</Typography>

			<div className="flex mb-10">
				<FormControl className="mr-2 w-1/4" required>
					<InputLabel>Entrega</InputLabel>

					<Select name="id_deliver_user" value={form.id_deliver_user} onChange={handleChange} required>
						{data.users?.map(user => (
							<MenuItem key={user.id} value={user.id}>
								{user.display_name}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<FormControl className="mx-2 w-1/4" required>
					<InputLabel>Área que entrega</InputLabel>

					<Select name="id_deliver_area" value={form.id_deliver_area} onChange={handleChange} required>
						{data.areas?.map(area => (
							<MenuItem key={area.id} value={area.id}>
								{area.str_val}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<FormControl className="mx-2 w-1/4" required>
					<InputLabel>Recibe</InputLabel>

					<Select name="id_receiver_user" value={form.id_receiver_user} onChange={handleChange} required>
						{data.users?.map(user => (
							<MenuItem key={user.id} value={user.id}>
								{user.display_name}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<FormControl className="ml-2 w-1/4" required>
					<InputLabel>Área que recibe</InputLabel>

					<Select name="id_receiver_area" value={form.id_receiver_area} onChange={handleChange} required>
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

				<Button variant="contained" color="secondary" onClick={() => setOpen(true)} className="mb-16">
					Agregar activo
				</Button>

				{form.items.length > 0 && (
					<table className="print mb-16 w-full">
						<thead>
							<tr>
								<th>Nº activo</th>
								<th>Activo</th>
								<th>Marca</th>
								<th>Modelo</th>
								<th>Serial</th>
								<th>Estado</th>
								<th>Adjuntos</th>
								<th>Observaciones</th>
								<th>Acciones</th>
							</tr>
						</thead>

						<tbody>
							{form.items.map((item, index) => (
								<tr key={index}>
									<td className="text-center">{item.asset_number}</td>
									<td>{item.name}</td>
									<td className="text-center">{item.brand}</td>
									<td>{item.model}</td>
									<td>{item.serial_number}</td>
									<td className="text-center">
										{
											data.physical_status.find(status => status.id === item.id_physical_status)
												.name
										}
									</td>
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
					/>
				)}
			</div>

			<TextField
				label="Observaciones generales"
				name="observations"
				value={form.observations}
				onChange={handleChange}
				className="mb-10 w-full"
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
					onClick={onUpdateCertificate}
				>
					Actualizar
				</Button>
			</div>
		</div>
	);
}

export default CertificateView;
