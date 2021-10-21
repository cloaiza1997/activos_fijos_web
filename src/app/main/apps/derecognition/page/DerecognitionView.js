/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
import { axios } from '@core/services/Api';
import { DATE_FORMATS, formatDate, getHandleChange, getPathByParams } from '@core/utils/utils';
import { Icon, IconButton, TextField, Typography } from '@material-ui/core';
import { useForm } from '@fuse/hooks';
import { useSelector } from 'react-redux';
import Button from '@core/components/Button';
import Loading from '@core/components/Loading';
import Print from '@core/components/Print';
import React, { useEffect, useState } from 'react';
// Components
import { ASSET_PAGE_VIEW } from '../../asset/AssetConst';
import {
	DERECOGNITION_STATUS,
	DERECOGNITION_URL_EDIT,
	DERECOGNITION_URL_STATUS_APPROVED,
	DERECOGNITION_URL_STATUS_CANCEL,
	DERECOGNITION_URL_STATUS_CHECKING,
	DERECOGNITION_URL_STATUS_EXECUTED,
	DERECOGNITION_URL_STATUS_REJECTED,
	DERECOGNITION_URL_STATUS_REVERSED,
	DERECOGNITION_URL_UPDATE
} from '../DerecognitionConst';
import DerecognitionAssetForm from '../components/DerecognitionAssetForm';
import DerecognitionPrint from '../components/DerecognitionPrint';

const { IN_PROCESS, APPROVED, CHECKING, EXECUTED } = DERECOGNITION_STATUS;

function DerecognitionView(props) {
	const { id } = props?.match?.params;

	const [currentAsset, setCurrentAsset] = useState({});
	const [data, setData] = useState({});
	const [disabled, setDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [skeleton, setSkeleton] = useState(true);

	const { user } = useSelector(({ auth }) => auth);

	const { form, handleChange, setForm } = useForm({});

	const getCost = () => {
		let cost = 0;

		form?.get_details?.forEach(item => {
			const asset = data.all_assets?.find(_asset => _asset.id === item.id_asset);

			cost += parseFloat(asset.current_value);
		});

		return cost;
	};

	const status = data.derecognition?.get_status?.parameter_key;

	const canApprove = user.is_approver && status === CHECKING;
	const canChecking = user.is_admin && status === IN_PROCESS;
	const canEdit = user.is_admin && (status === IN_PROCESS || status === APPROVED);
	const canExecute = user.is_admin && status === APPROVED;
	const canReverse = user.is_admin && status === EXECUTED;
	const canView = status === EXECUTED;

	const onUpdate = () => {
		setLoading(true);

		return axios({
			url: getPathByParams(DERECOGNITION_URL_UPDATE, { id }),
			method: 'PUT',
			data: form,
			success: async ({ derecognition }) => {
				setData({ ...data, derecognition: { ...data.derecognition, ...derecognition } });
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
			success: ({ derecognition }) => {
				setData({ ...data, derecognition: { ...data.derecognition, ...derecognition } });
				setLoading(false);
			},
			error: () => setLoading(false)
		});
	};

	useEffect(() => {
		const success = response => {
			setData(response);
			setForm(response.derecognition);

			setSkeleton(false);
		};

		axios({ url: getPathByParams(DERECOGNITION_URL_EDIT, { id }), method: 'GET', success });
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		const _disabled = !form.observations?.trim() || !form.get_details?.length;

		setDisabled(_disabled);
	}, [form]);

	return skeleton ? (
		<Loading />
	) : (
		<div className="p-20">
			<Typography component="h1" color="primary" className="text-xl font-bold mb-16">
				Baja de activos Nº {`${form.id}`.padStart(6, '0')} - {data.derecognition.get_status.str_val}
			</Typography>

			<div className="flex flex-col text-11 leading-none p-10 border-1 rounded-8 mb-10 w-full">
				<span className="mb-6">
					Creada por: <span className="font-bold">{data.derecognition.get_creator_user.display_name}</span> -{' '}
					{formatDate(data.derecognition.created_at, DATE_FORMATS.YYYY_MM_DD_hh_mm_ss)}
				</span>

				{data.derecognition.get_approver_user && (
					<span>
						Aprobada por:{' '}
						<span className="font-bold">{data.derecognition.get_approver_user.display_name}</span> -{' '}
						{formatDate(data.derecognition.get_approver_user, DATE_FORMATS.YYYY_MM_DD_hh_mm_ss)}
					</span>
				)}
			</div>

			<TextField
				label="Observaciones"
				name="observations"
				value={form.observations}
				onChange={handleChange}
				className="mb-10 w-full"
				disabled={!canEdit}
				required
				multiline
				rows={4}
				rowsMax={4}
			/>

			<div>
				<Typography component="h1" color="primary" className="text-xl font-bold my-16">
					Activos para la baja - Costo de la baja: $ {getCost()}
				</Typography>

				{canEdit && (
					<Button
						variant="contained"
						color="secondary"
						onClick={() => {
							setCurrentAsset({});
							setOpen(true);
						}}
						className="mb-16"
					>
						Agregar activo
					</Button>
				)}

				{form.get_details.length > 0 && (
					<table className="print mb-16 w-full">
						<thead>
							<tr>
								<th>Nº activo</th>
								<th>Activo</th>
								<th>Marca</th>
								<th>Modelo</th>
								<th>Serial</th>
								<th>Costo actual</th>
								<th>Motivo</th>
								<th>Observaciones</th>
								{canEdit && <th>Acciones</th>}
							</tr>
						</thead>

						<tbody>
							{form.get_details.map((item, index) => {
								const asset = data.all_assets?.find(_asset => _asset.id === item.id_asset) || {};

								return (
									<tr key={index}>
										<td className="text-center">
											<a
												href={`${ASSET_PAGE_VIEW}/${item.id_asset}`}
												target="_blank"
												rel="noopener noreferrer"
											>
												{asset.asset_number}
											</a>
										</td>
										<td>{asset.name}</td>
										<td className="text-center">{asset.get_brand.str_val}</td>
										<td>{asset.model}</td>
										<td>{asset.serial_number}</td>
										<td className="text-right">$ {asset.current_value}</td>
										<td className="text-center">
											{
												data.derecognition_reasons.find(reason => reason.id === item.id_reason)
													.str_val
											}
										</td>
										<td>{item.observations}</td>
										{canEdit && (
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

				{open && (
					<DerecognitionAssetForm
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
						onClick={() => onUpdate().then(() => updateStatus(DERECOGNITION_URL_STATUS_CHECKING))}
						className="mx-4 bg-green-400 hover:bg-green-600"
						disabled={disabled}
					>
						Enviar a revisión
					</Button>
				)}

				{canView && (
					<Print
						trigger={
							<Button variant="contained" color="secondary" loading={loading} className="mx-4">
								Visualizar
							</Button>
						}
						title={`Baja_de_Activos_${`${data.derecognition.id}`.padStart(6, '0')}`}
						Component={DerecognitionPrint}
						componentProps={{ derecognition: data.derecognition, companyInfo: data.company_info }}
					/>
				)}

				{canExecute && (
					<Button
						variant="contained"
						color="primary"
						loading={loading}
						disabled={disabled}
						confirm={{
							title: 'Ejecutar',
							message: '¿Confirma ejecutar el proceso de bajas?'
						}}
						onClick={() => onUpdate().then(() => updateStatus(DERECOGNITION_URL_STATUS_EXECUTED))}
						className="mx-4 bg-green-400 hover:bg-green-600"
					>
						Ejecutar
					</Button>
				)}

				{canReverse && (
					<Button
						variant="contained"
						color="primary"
						loading={loading}
						confirm={{
							title: 'Reversar',
							message: '¿Confirma reversar el proceso de bajas?'
						}}
						onClick={() => updateStatus(DERECOGNITION_URL_STATUS_REVERSED)}
						className="mx-4 bg-red-400 hover:bg-red-600"
					>
						Reversar
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
								message: '¿Confirma anular el proceso de bajas?'
							}}
							onClick={() => updateStatus(DERECOGNITION_URL_STATUS_CANCEL)}
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
								message: '¿Confirma actualizar el proceso de bajas?'
							}}
							className="mx-4"
							onClick={onUpdate}
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
								message: '¿Confirma rechazar el proceso de bajas?'
							}}
							onClick={() => updateStatus(DERECOGNITION_URL_STATUS_REJECTED)}
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
								message: '¿Confirma aprobar el proceso de bajas?'
							}}
							onClick={() => updateStatus(DERECOGNITION_URL_STATUS_APPROVED)}
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

export default DerecognitionView;
