import { axios } from '@core/services/Api';
import { getHandleChange, getPathByParams } from '@core/utils/utils';
import { Icon, IconButton, TextField, Typography } from '@material-ui/core';
import { useForm } from '@fuse/hooks';
import Button from '@core/components/Button';
import Loading from '@core/components/Loading';
import React, { useEffect, useState } from 'react';
// Components
import { ASSET_PAGE_VIEW, ASSET_UPDATE_COST_IN_PROCESS } from '../../asset/AssetConst';
import { REVALUATION_URL_EDIT, REVALUATION_URL_UPDATE } from '../RevaluationConst';
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
	const canEdit = _revaluation?.get_status?.parameter_key === ASSET_UPDATE_COST_IN_PROCESS;

	const onUpdateRevaluation = () => {
		setLoading(true);

		axios({
			url: getPathByParams(REVALUATION_URL_UPDATE, { id }),
			method: 'PUT',
			data: form,
			success: ({ revaluation }) => {
				setData({ ...data, revaluation });
				setForm(
					new RevaluationModel({
						...revaluation,
						details: revaluation.get_details?.map(detail => new RevaluationDetailModel(detail)) || []
					})
				);
				setLoading(false);
			},
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
				Revaluación Nº {form.id}
			</Typography>

			<TextField
				label="Observaciones"
				name="observations"
				value={form.observations}
				onChange={handleChange}
				className="w-full"
				required
				multiline
				rows={4}
				rowsMax={4}
			/>

			<div className="mb-10 border-b-1">
				<Typography component="h1" color="primary" className="text-xl font-bold my-16">
					Activos del acta de movimiento
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
				<Button
					variant="contained"
					color="primary"
					loading={loading}
					confirm={{
						title: 'Reversar',
						message: '¿Confirma reversar la revaluación?'
					}}
					// onClick={onUpdateRevaluation}
					className="mx-4 bg-red-400 hover:bg-red-600"
				>
					Reversar
				</Button>

				<Button
					variant="contained"
					color="primary"
					loading={loading}
					confirm={{
						title: 'Cancelar',
						message: '¿Confirma cancelar el proceso de revaluación?'
					}}
					// onClick={onUpdateRevaluation}
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
						title: 'Completar',
						message: '¿Confirma finalizar el proceso de revaluación?'
					}}
					// onClick={onUpdateRevaluation}
					className="mx-4 bg-green-400 hover:bg-green-600"
				>
					Completar
				</Button>

				{canEdit && (
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
				)}
			</div>
		</div>
	);
}
