import { axios } from '@core/services/Api';
import { DATE_FORMATS, formatDate, getPathByParams } from '@core/utils/utils';
import { TextField, Typography } from '@material-ui/core';
import Button from '@core/components/Button';
import Loading from '@core/components/Loading';
import React, { useEffect, useState } from 'react';
// Components
import { ASSET_PAGE_VIEW, ASSET_UPDATE_COST_EXECUTED, ASSET_UPDATE_COST_REVERSED } from '../../asset/AssetConst';
import { DEPRECATION_PAGE_VIEW, DEPRECATION_URL_EDIT, DEPRECATION_URL_STATUS_REVERSE } from '../DeprecationConst';

/**
 * @function DeprecationCreate
 * @brief Formulario de visualización del resultado de una depreciación
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
export default function DeprecationCreate(props) {
	const { id } = props?.match?.params;

	const [deprecation, setDeprecation] = useState({});
	const [loading, setLoading] = useState(false);
	const [skeleton, setSkeleton] = useState(true);

	const status = deprecation?.get_status?.parameter_key;

	const canReverse =
		(status === ASSET_UPDATE_COST_EXECUTED || status === ASSET_UPDATE_COST_REVERSED) && deprecation.can_reverse;

	const onUpdateStatus = url => {
		setLoading(true);

		axios({
			url: getPathByParams(url, { id }),
			method: 'POST',
			success: data => {
				setDeprecation(data.deprecation);
				setLoading(false);
			},
			error: () => setLoading(false)
		});
	};

	useEffect(() => {
		axios({
			method: 'GET',
			url: getPathByParams(DEPRECATION_URL_EDIT, { id }),
			success: data => {
				setDeprecation(data.deprecation);
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
				Depreciación Nº {deprecation.id} - Estado: {deprecation.get_status.str_val}{' '}
				{deprecation.id_parent && ` - Reversa`}
			</Typography>

			<div className="flex flex-col text-11 leading-none p-10 border-1 rounded-8 mb-16 w-full">
				<span>
					Creada por: <span className="font-bold">{deprecation.get_user.display_name}</span> -{' '}
					{formatDate(deprecation.created_at, DATE_FORMATS.YYYY_MM_DD_hh_mm_ss)}
				</span>
			</div>

			{deprecation?.get_children?.id && (
				<p className="mb-16">
					<a
						href={`${DEPRECATION_PAGE_VIEW}/${deprecation?.get_children?.id}`}
						target="_blank"
						rel="noopener noreferrer"
						className="font-bold"
					>
						Ir a la depreciación reversada Nº {deprecation?.get_children?.id}
					</a>
				</p>
			)}

			<TextField
				label="Observaciones"
				value={deprecation.observations}
				className="w-full"
				multiline
				disabled
				rows={4}
			/>

			<div className="mb-10 border-b-1">
				<Typography component="h1" color="primary" className="text-xl font-bold my-16">
					Detalles de la depreciación
				</Typography>

				{deprecation.get_details.length > 0 && (
					<table className="print mb-16 w-full">
						<thead>
							<tr>
								<th>Nº activo</th>
								<th>Activo</th>
								<th>Marca</th>
								<th>Serial</th>
								<th>Valor anterior</th>
								<th>Valor nuevo</th>
							</tr>
						</thead>

						<tbody>
							{deprecation.get_details.map((item, index) => {
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
										<td className="text-right">$ {item.old_value}</td>
										<td className="text-right">$ {item.new_value}</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				)}
			</div>

			{canReverse && (
				<div className="text-center m-20">
					<Button
						variant="contained"
						color="primary"
						loading={loading}
						confirm={{
							title: 'Reversar',
							message: '¿Confirma reversar la depreciación?'
						}}
						onClick={() => onUpdateStatus(DEPRECATION_URL_STATUS_REVERSE)}
						className="mx-4 bg-red-400 hover:bg-red-600"
					>
						Reversar
					</Button>
				</div>
			)}
		</div>
	);
}
