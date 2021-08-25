import { axios } from '@core/services/Api';
import { DATE_FORMATS, formatDate, getHandleChange, getPathByParams } from '@core/utils/utils';
import { Icon, IconButton, TextField, Typography } from '@material-ui/core';
import { useForm } from '@fuse/hooks';
import Button from '@core/components/Button';
import Loading from '@core/components/Loading';
import React, { useEffect, useState } from 'react';
// Components
import {
	ASSET_PAGE_VIEW,
	ASSET_UPDATE_COST_EXECUTED,
	ASSET_UPDATE_COST_IN_PROCESS,
	ASSET_UPDATE_COST_REVERSED
} from '../../asset/AssetConst';
import {
	REVALUATION_PAGE_VIEW,
	REVALUATION_URL_EDIT,
	REVALUATION_URL_STATUS_CANCEL,
	REVALUATION_URL_STATUS_EXECUTE,
	REVALUATION_URL_STATUS_REVERSE,
	REVALUATION_URL_UPDATE
} from '../RevaluationConst';
import RevaluationAssetForm from '../components/RevaluationAssetForm';
import RevaluationModel from '../model/RevaluationModel';
import RevaluationDetailModel from '../model/RevaluationDetailModel';

/**
 * @function RevaluationEdit
 * @brief Formulario de edición de una revaluación
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
export default function RevaluationEdit(props) {
	const { id } = props?.match?.params;

	const [currentAsset, setCurrentAsset] = useState({});
	const [data, setData] = useState({});
	const [disabled, setDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [skeleton, setSkeleton] = useState(true);

	const { form, handleChange, setForm } = useForm(new RevaluationModel());

	const _revaluation = data?.revaluation || {};
	const status = _revaluation?.get_status?.parameter_key;

	const canEdit = status === ASSET_UPDATE_COST_IN_PROCESS;
	const canReverse =
		(status === ASSET_UPDATE_COST_EXECUTED || status === ASSET_UPDATE_COST_REVERSED) &&
		data.revaluation.can_reverse;

	const onSuccess = ({ revaluation }) => {
		setData({ ...data, revaluation });
		setForm(
			new RevaluationModel({
				...revaluation,
				details: revaluation.get_details?.map(detail => new RevaluationDetailModel(detail)) || []
			})
		);
		setLoading(false);
	};

	const onUpdateRevaluation = () => {
		setLoading(true);

		axios({
			url: getPathByParams(REVALUATION_URL_UPDATE, { id }),
			method: 'PUT',
			data: form,
			success: onSuccess,
			error: () => setLoading(false)
		});
	};

	const onUpdateStatus = url => {
		setLoading(true);

		axios({
			url: getPathByParams(url, { id }),
			method: 'POST',
			success: onSuccess,
			error: () => setLoading(false)
		});
	};

	useEffect(() => {
		axios({
			method: 'GET',
			url: getPathByParams(REVALUATION_URL_EDIT, { id }),
			success: _data => {
				setData(_data);
				setForm(
					new RevaluationModel({
						..._data.revaluation,
						details: _data.revaluation.get_details?.map(detail => new RevaluationDetailModel(detail)) || []
					})
				);
				setSkeleton(false);
			}
		});
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		const _disabled = !form.observations.trim() || !form.details.length;

		setDisabled(_disabled);
	}, [form]);

	return skeleton ? (
		<Loading />
	) : (
		<div className="p-20">
			<Typography component="h1" color="primary" className="text-xl font-bold mb-10">
				Revaluación Nº {form.id} - Estado: {data.revaluation.get_status.str_val}
				{form.id_parent && ` - Reversa`}
			</Typography>

			<div className="flex flex-col text-11 leading-none p-10 border-1 rounded-8 mb-16 w-full">
				<span>
					Creada por: <span className="font-bold">{data.revaluation.get_user.display_name}</span> -{' '}
					{formatDate(data.revaluation.created_at, DATE_FORMATS.YYYY_MM_DD_hh_mm_ss)}
				</span>
			</div>

			{data.revaluation?.get_children?.id && (
				<p className="mb-16">
					<a
						href={`${REVALUATION_PAGE_VIEW}/${data.revaluation?.get_children?.id}`}
						target="_blank"
						rel="noopener noreferrer"
						className="font-bold"
					>
						Ir a la revaluación reversada Nº {data.revaluation?.get_children?.id}
					</a>
				</p>
			)}

			<TextField
				label="Observaciones"
				name="observations"
				value={form.observations}
				onChange={handleChange}
				className="w-full"
				required
				multiline
				disabled={!canEdit}
				rows={4}
				rowsMax={4}
			/>

			<div className="mb-10 border-b-1">
				<Typography component="h1" color="primary" className="text-xl font-bold my-16">
					Activos del proceso de revaluacións
				</Typography>

				{canEdit && (
					<Button variant="contained" color="secondary" onClick={() => setOpen(true)} className="mb-16">
						Agregar activo
					</Button>
				)}

				{form.details.length > 0 && (
					<table className="print mb-16 w-full">
						<thead>
							<tr>
								<th>Nº activo</th>
								<th>Activo</th>
								<th>Marca</th>
								<th>Serial</th>
								<th>Valor anterior</th>
								<th>Valor nuevo</th>
								<th>Observaciones</th>

								{canEdit && <th>Acciones</th>}
							</tr>
						</thead>

						<tbody>
							{form.details.map((item, index) => {
								const asset = data.assets.find(_asset => _asset.id === item.id_asset);

								if (!asset) {
									return null;
								}

								return (
									<tr key={index}>
										<td className="text-center">
											<a
												href={`${ASSET_PAGE_VIEW}/${asset.id}`}
												target="_blank"
												rel="noopener noreferrer"
											>
												{asset.asset_number}
											</a>
										</td>
										<td>{asset.name}</td>
										<td className="text-center">{asset.get_brand.str_val}</td>
										<td className="text-center">{asset.serial_number}</td>
										<td className="text-right">$ {item.old_value}</td>
										<td className="text-right">$ {item.new_value}</td>
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
														const { details } = form;

														details.splice(index, 1);
														handleChange(getHandleChange('details', details));
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

				{open && canEdit && (
					<RevaluationAssetForm
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
				{canReverse && (
					<Button
						variant="contained"
						color="primary"
						loading={loading}
						confirm={{
							title: 'Reversar',
							message: '¿Confirma reversar la revaluación?'
						}}
						onClick={() => onUpdateStatus(REVALUATION_URL_STATUS_REVERSE)}
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
								title: 'Cancelar',
								message: '¿Confirma cancelar el proceso de revaluación?'
							}}
							onClick={() => onUpdateStatus(REVALUATION_URL_STATUS_CANCEL)}
							className="mx-4 bg-red-400 hover:bg-red-600"
						>
							Cancelar
						</Button>

						<Button
							variant="contained"
							color="primary"
							disabled={disabled}
							loading={loading}
							confirm={{
								title: 'Ejecutar',
								message: '¿Confirma ejecutar el proceso de revaluación y actualizar los costos?'
							}}
							onClick={() => onUpdateStatus(REVALUATION_URL_STATUS_EXECUTE)}
							className="mx-4 bg-green-400 hover:bg-green-600"
						>
							Ejecutar
						</Button>

						<Button
							variant="contained"
							color="primary"
							disabled={disabled}
							loading={loading}
							confirm={{
								title: 'Actualizar',
								message: '¿Confirma actualizar la revaluación?'
							}}
							onClick={onUpdateRevaluation}
							className="mx-4"
						>
							Actualizar
						</Button>
					</>
				)}
			</div>
		</div>
	);
}
