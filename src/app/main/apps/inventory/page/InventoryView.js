import { Autocomplete } from '@material-ui/lab';
import { axios } from '@core/services/Api';
import { DATE_FORMATS, formatDate, getPathByParams } from '@core/utils/utils';
import { Icon, IconButton, TextField, Typography } from '@material-ui/core';
import { useForm } from '@fuse/hooks';
import Button from '@core/components/Button';
import Loading from '@core/components/Loading';
import React, { useEffect, useState } from 'react';
// Components
import {
	INVENTORY_STATUS,
	INVENTORY_URL_EDIT,
	INVENTORY_URL_STATUS_FINISHED,
	INVENTORY_URL_UPDATE
} from '../InventoryConst';
import { ASSET_PAGE_VIEW } from '../../asset/AssetConst';
import InventoryAsset from '../components/InventoryAsset';

/**
 * @function InventoryView
 * @brief Formulario de visualización de un inventario
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
export default function InventoryView(props) {
	const { id } = props?.match?.params;

	const [data, setData] = useState({});
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [selectedAsset, setSelectedAsset] = useState(null);
	const [skeleton, setSkeleton] = useState(true);

	const { form, handleChange, setForm } = useForm({ observations: '' });

	const status = data?.inventory?.get_status?.parameter_key;

	const canEdit = status === INVENTORY_STATUS.INVENTORY_STATUS_IN_PROCESS;

	const onUpdateInventory = () => {
		setLoading(true);

		axios({
			url: getPathByParams(INVENTORY_URL_UPDATE, { id }),
			method: 'PUT',
			data: form,
			success: () => {
				setLoading(false);
			},
			error: () => setLoading(false)
		});
	};

	const onUpdateStatusFinished = () => {
		setLoading(true);

		axios({
			url: getPathByParams(INVENTORY_URL_STATUS_FINISHED, { id }),
			method: 'POST',
			success: ({ inventory }) => {
				setData({ ...data, inventory: { ...data?.inventory, ...inventory } });
				setLoading(false);
			},
			error: () => setLoading(false)
		});
	};

	useEffect(() => {
		axios({
			method: 'GET',
			url: getPathByParams(INVENTORY_URL_EDIT, { id }),
			success: _data => {
				setData(_data);
				setForm({ observations: _data.inventory.observations });
				setSkeleton(false);
			}
		});
		// eslint-disable-next-line
	}, []);

	return skeleton ? (
		<Loading />
	) : (
		<div className="p-20">
			<Typography component="h1" color="primary" className="text-xl font-bold mb-10">
				Inventario Nº {data.inventory.id} - Estado: {data.inventory.get_status.str_val}
			</Typography>

			<div className="flex flex-col text-11 leading-none p-10 border-1 rounded-8 mb-16 w-full">
				<span>
					Creada por: <span className="font-bold">{data.inventory.get_user.display_name}</span> -{' '}
					{formatDate(data.inventory.created_at, DATE_FORMATS.YYYY_MM_DD_hh_mm_ss)}
				</span>
			</div>

			<TextField
				label="Observaciones"
				name="observations"
				value={form.observations}
				onChange={handleChange}
				className="w-full"
				multiline
				rows={4}
				disabled={!canEdit}
			/>

			<div className="mb-16 border-b-1">
				<Typography component="h1" color="primary" className="text-xl font-bold my-16">
					Activos del inventario
				</Typography>

				{canEdit && (
					<div className="flex items-center mb-16">
						<Autocomplete
							options={data.assets.filter(
								asset => !data.inventory.get_details.some(detail => detail.id_asset === asset.id)
							)}
							getOptionLabel={option =>
								`${option.asset_number} - ${option.get_status.str_val} - ${option.name} - ${option.serial_number}`
							}
							value={selectedAsset}
							onChange={(event, value) => {
								setSelectedAsset(value);
							}}
							renderInput={params => <TextField {...params} label="Activo fijo" />}
							noOptionsText="No hay resultados"
							className="w-2/3"
						/>

						<div className="mx-10">
							<Button
								variant="contained"
								color="primary"
								onClick={() => setOpen(true)}
								disabled={!selectedAsset}
							>
								Agregar
							</Button>
						</div>
					</div>
				)}

				{data.inventory.get_details.length > 0 && (
					<table className="print mb-16 w-full">
						<thead>
							<tr>
								<th>Nº activo</th>
								<th>Activo</th>
								<th>Marca</th>
								<th>Serial</th>
								{canEdit && <th>Acciones</th>}
							</tr>
						</thead>

						<tbody>
							{data.inventory.get_details.map((item, index) => {
								return (
									<tr key={index}>
										<td className="text-center">
											<a
												href={`${ASSET_PAGE_VIEW}/${item.id_asset}`}
												target="_blank"
												rel="noopener noreferrer"
											>
												{item.asset.asset_number}
											</a>
										</td>
										<td>{item.asset.name}</td>
										<td className="text-center">{item.asset.get_brand.str_val}</td>
										<td className="text-center">{item.asset.serial_number}</td>
										{canEdit && (
											<td className="text-center">
												<IconButton
													size="small"
													onClick={() => {
														setSelectedAsset(item.asset);
														setOpen(true);
													}}
													className="mx-4"
												>
													<Icon fontSize="small" color="primary">
														edit
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

			{open && (
				<InventoryAsset
					open={open}
					setOpen={setOpen}
					assetId={selectedAsset.id}
					inventoryId={data.inventory.id}
					setData={setData}
				/>
			)}

			{canEdit && (
				<div className="text-center m-20">
					<Button
						variant="contained"
						color="primary"
						loading={loading}
						confirm={{
							title: 'Finalizar',
							message: '¿Confirma finalizar el proceso de inventario?'
						}}
						onClick={onUpdateStatusFinished}
						className="bg-green-400 hover:bg-green-600 mx-4"
						disabled={!data.inventory.get_details.length > 0}
					>
						Finalizar
					</Button>

					<Button
						variant="contained"
						color="primary"
						loading={loading}
						onClick={onUpdateInventory}
						className="mx-4"
					>
						Actualizar
					</Button>
				</div>
			)}
		</div>
	);
}
