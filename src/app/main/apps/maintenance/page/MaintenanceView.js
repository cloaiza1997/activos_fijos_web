/* eslint-disable camelcase */
import { axios } from '@core/services/Api';
import { FormControl, Icon, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import { getHandleChange, formatDate, getPathByParams } from '@core/utils/utils';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { useForm } from '@fuse/hooks';
import { useSelector } from 'react-redux';
import Button from '@core/components/Button';
import FileUpload from '@core/components/FileUpload';
import Loading from '@core/components/Loading';
import React, { useEffect, useState } from 'react';
// Components
import {
	MAINTENANCE_APP_KEY,
	MAINTENANCE_STATUS,
	MAINTENANCE_URL_EDIT,
	MAINTENANCE_URL_STATUS_CANCEL,
	MAINTENANCE_URL_STATUS_FINISHED,
	MAINTENANCE_URL_UPDATE
} from '../MaintenanceConst';
import { ASSET_PAGE_VIEW } from '../../asset/AssetConst';
import MaintenanceDetailModel from '../model/MaintenanceDetailModel';
import MaintenanceModel from '../model/MaintenanceModel';

/**
 * @function MaintenanceView
 * @brief Detalle de un mantenimiento
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
export default function MaintenanceView(props) {
	const { id } = props?.match?.params;

	const [data, setData] = useState({});
	const [disabled, setDisabled] = useState(true);
	const [disabledFormAsset, setDisabledFormAsset] = useState(true);
	const [idProvider, setIdProvider] = useState('');
	const [idUser, setIdUser] = useState('');
	const [loading, setLoading] = useState(false);
	const [skeleton, setSkeleton] = useState(true);

	const { form, handleChange, setForm } = useForm(new MaintenanceModel());
	const {
		form: formAsset,
		handleChange: handleChangeAsset,
		setForm: setFormAsset
	} = useForm(new MaintenanceDetailModel());

	const { user } = useSelector(({ auth }) => auth);

	const status = data?.maintenance?.get_status?.parameter_key;

	const canEdit = user.is_admin && status === MAINTENANCE_STATUS.MAINTENANCE_IN_PROCESS;

	const onAddAsset = () => {
		const details = [...(form.get_details || [])];
		const item = { ...formAsset, executed_at: formatDate(formAsset.executed_at) };

		if (formAsset.index >= 0 && details.length > 0) {
			details[formAsset.index] = {
				...details[formAsset.index],
				...item
			};
		} else {
			details.push(item);
		}

		handleChange(getHandleChange('get_details', details));
		setFormAsset(new MaintenanceDetailModel());
	};

	const onAddResponsible = responsible => {
		const { get_responsibles } = form;
		get_responsibles.push(responsible);

		handleChange(getHandleChange('get_responsibles', get_responsibles));
	};

	const onUpdateMaintenance = () => {
		setLoading(true);

		const success = () => {
			setLoading(false);
		};

		const error = () => setLoading(false);

		return axios({
			url: getPathByParams(MAINTENANCE_URL_UPDATE, { id }),
			method: 'PUT',
			data: form,
			success,
			error
		});
	};

	const onUpdateStatus = url => {
		setLoading(true);

		const success = response => {
			setData(response);
			setForm(new MaintenanceModel(response.maintenance));
			setLoading(false);
		};

		axios({ url: getPathByParams(url, { id }), method: 'POST', success });
	};

	useEffect(() => {
		const success = response => {
			setData(response);
			setForm(new MaintenanceModel(response.maintenance));
			setSkeleton(false);
		};

		axios({ url: getPathByParams(MAINTENANCE_URL_EDIT, { id }), method: 'GET', success });
		// eslint-disable-next-line
	}, [id]);

	useEffect(() => {
		const _disabled = !form.id_type || !form.get_details.length || !form.get_responsibles;

		setDisabled(_disabled);
	}, [form]);

	useEffect(() => {
		const _disabled = !formAsset.id_asset || !formAsset.executed_at;

		setDisabledFormAsset(_disabled);
	}, [formAsset]);

	return skeleton ? (
		<Loading />
	) : (
		<div className="p-20">
			<Typography component="h1" color="primary" className="text-xl font-bold mb-16">
				Proceso de mantenimiento Nº {form.id} - Estado: {data.maintenance?.get_status?.str_val}
			</Typography>

			<div>
				<FormControl className="mb-10 w-1/3" required>
					<InputLabel>Tipo de mantenimiento</InputLabel>

					<Select name="id_type" value={form.id_type} onChange={handleChange} disabled={!canEdit} required>
						{data.maintenance_types?.map(type => (
							<MenuItem key={type.id} value={type.id}>
								{type.str_val}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<TextField
					label="Observaciones"
					name="observations"
					value={form.observations}
					onChange={handleChange}
					className="mb-16 w-full"
					disabled={!canEdit}
					multiline
					rows={4}
					rowsMax={4}
				/>
			</div>

			<div className="mb-16">
				<Typography color="primary" className="font-bold mb-10">
					Responsables del mantenimiento
				</Typography>

				{canEdit && (
					<div className="flex items-center">
						<FormControl className="mb-10 w-1/3" required>
							<InputLabel>Proveedor</InputLabel>

							<Select value={idProvider} onChange={e => setIdProvider(e.target.value)}>
								{data.providers
									?.filter(
										provider =>
											!form.get_responsibles.some(_res => _res.id_provider === provider.id)
									)
									.map(provider => (
										<MenuItem key={provider.id} value={provider.id}>
											{provider.name}
										</MenuItem>
									))}
							</Select>
						</FormControl>

						<Button
							variant="contained"
							color="primary"
							className="mx-10"
							onClick={() => {
								onAddResponsible({ id_provider: idProvider });
								setIdProvider('');
							}}
							disabled={!idProvider}
						>
							Agregar
						</Button>

						<FormControl className="mb-10 w-1/3" required>
							<InputLabel>Usuario interno</InputLabel>

							<Select value={idUser} onChange={e => setIdUser(e.target.value)}>
								{data.users
									?.filter(_user => !form.get_responsibles.some(_res => _res.id_user === _user.id))
									.map(_user => (
										<MenuItem key={_user.id} value={_user.id}>
											{_user.display_name}
										</MenuItem>
									))}
							</Select>
						</FormControl>

						<Button
							variant="contained"
							color="primary"
							className="mx-10"
							onClick={() => {
								onAddResponsible({ id_user: idUser });
								setIdUser('');
							}}
							disabled={!idUser}
						>
							Agregar
						</Button>
					</div>
				)}

				{form.get_responsibles?.length > 0 && (
					<table className="print w-full">
						<thead>
							<tr>
								<th>Responsable</th>
								<th>Nombre</th>
								{canEdit && <th className="w-0">Acciones</th>}
							</tr>
						</thead>

						<tbody>
							{form.get_responsibles.map((responsible, index) => {
								const _data = responsible.id_user
									? data.users.find(_user => _user.id === responsible.id_user)
									: data.providers.find(provider => provider.id === responsible.id_provider);

								return (
									<tr key={index}>
										<td>{responsible.id_user ? 'Usuario' : 'Proveedor'}</td>
										<td>{responsible.id_user ? _data.display_name : _data.name}</td>
										{canEdit && (
											<td className="text-center">
												<IconButton
													size="small"
													onClick={() => {
														const { get_responsibles } = form;

														get_responsibles.splice(index, 1);
														handleChange(
															getHandleChange('get_responsibles', get_responsibles)
														);
													}}
													className="mx-4"
												>
													<Icon fontSize="small" className="text-red">
														delete
													</Icon>
												</IconButton>
											</td>
										)}
									</tr>
								);
							})}
						</tbody>
					</table>
				)}
			</div>

			<div>
				<Typography color="primary" className="font-bold mb-10">
					Listado de activos para el mantenimiento
				</Typography>

				{canEdit && (
					<div>
						<FormControl className="mb-10 mx-4 w-1/3" required>
							<InputLabel>Activo</InputLabel>

							<Select name="id_asset" value={formAsset.id_asset} onChange={handleChangeAsset}>
								{data.assets
									?.filter(
										asset =>
											asset.id === formAsset.id_asset ||
											!form.get_details.some(detail => detail.id_asset === asset.id)
									)
									?.map(asset => (
										<MenuItem key={asset.id} value={asset.id}>
											{asset.asset_number} - {asset.name} - {asset.maintenance_date}
										</MenuItem>
									))}
							</Select>
						</FormControl>

						<KeyboardDatePicker
							disableToolbar
							variant="inline"
							format="yyyy-MM-DD"
							label="Fecha de mantenimiento"
							value={formAsset.executed_at || null}
							onChange={date => handleChangeAsset(getHandleChange('executed_at', date))}
							className="mx-4 w-1/3"
							required
						/>

						<Button
							variant="contained"
							color="primary"
							className="mx-10"
							onClick={onAddAsset}
							disabled={disabledFormAsset}
						>
							{formAsset.index >= 0 ? 'Actualizar' : 'Agregar'}
						</Button>

						<TextField
							label="Observaciones"
							name="observations"
							value={formAsset.observations}
							onChange={handleChangeAsset}
							className="mb-16 w-full"
							multiline
							rows={2}
							rowsMax={2}
						/>
					</div>
				)}

				{form.get_details?.length > 0 && (
					<table className="print mb-16 w-full">
						<thead>
							<tr>
								<th>Nº Activo</th>
								<th>Activo</th>
								<th>Último mantenimiento</th>
								<th>Frecuencia del mantenimiento</th>
								<th>Fecha de mantenimiento</th>
								<th>Observaciones</th>
								{canEdit && <th>Acciones</th>}
							</tr>
						</thead>

						<tbody>
							{form.get_details.map((detail, index) => {
								const _data = detail.asset || data.assets.find(asset => asset.id === detail.id_asset);

								return (
									<tr key={index}>
										<td className="text-center">
											<a
												href={`${ASSET_PAGE_VIEW}/${_data.id}`}
												target="_blank"
												rel="noopener noreferrer"
											>
												{_data.asset_number}
											</a>
										</td>
										<td>{_data.name}</td>
										<td className="text-center">{_data.maintenance_date}</td>
										<td className="text-center">{_data.get_maintenance_frequence?.num_val * 1}</td>
										<td className="text-center">{detail.executed_at}</td>
										<td className="text-center">{detail.observations}</td>
										{canEdit && (
											<td className="text-center">
												<IconButton
													size="small"
													onClick={() => {
														setFormAsset(new MaintenanceDetailModel({ ...detail, index }));
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
														const { get_details } = form;

														get_details.splice(index, 1);
														handleChange(getHandleChange('get_details', get_details));
													}}
													className="mx-4"
												>
													<Icon fontSize="small" className="text-red">
														delete
													</Icon>
												</IconButton>
											</td>
										)}
									</tr>
								);
							})}
						</tbody>
					</table>
				)}
			</div>

			<FileUpload files={form.files} appKey={MAINTENANCE_APP_KEY} registerId={form.id} disabled={!canEdit} />

			<div className="flex items-center justify-center p-20">
				{canEdit && (
					<>
						<Button
							variant="contained"
							color="primary"
							loading={loading}
							confirm={{
								title: 'Finalizar',
								message: '¿Confirma finalizar el proceso de mantenimiento?'
							}}
							onClick={() =>
								onUpdateMaintenance().then(() => onUpdateStatus(MAINTENANCE_URL_STATUS_FINISHED))
							}
							className="bg-green-400 hover:bg-green-600 mx-4"
						>
							Finalizar
						</Button>

						<Button
							variant="contained"
							color="primary"
							loading={loading}
							confirm={{
								title: 'Anular',
								message: '¿Confirma anular el proceso de mantenimiento?'
							}}
							onClick={() => onUpdateStatus(MAINTENANCE_URL_STATUS_CANCEL)}
							className="bg-red-400 hover:bg-red-600 mx-4"
						>
							Anular
						</Button>

						<Button
							variant="contained"
							color="primary"
							onClick={onUpdateMaintenance}
							className="mx-4"
							loading={loading}
							disabled={disabled}
						>
							Actualizar
						</Button>
					</>
				)}
			</div>
		</div>
	);
}
