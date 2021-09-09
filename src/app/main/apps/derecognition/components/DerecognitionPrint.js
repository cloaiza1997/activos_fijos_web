/* eslint-disable react/prefer-stateless-function */
import { formatDate } from '@core/utils/utils';
import React from 'react';

/**
 * @class DerecognitionPrint
 * @brief Página para imprimir un acta de bajas
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
class DerecognitionPrint extends React.Component {
	render() {
		return (
			<div className="text-left p-40">
				<div className="flex">
					<img src="assets/images/logos/logo_grande.png" alt="logo" className="h-32" />

					<h1 className="text-20 text-blue font-bold">RELACIÓN DE ACTIVOS PARA DAR DE BAJA</h1>
				</div>

				<table className="w-full mb-20">
					<tbody>
						<tr>
							<td className="font-bold">Dirección</td>
							<td>{this.props.companyInfo.address}</td>

							<td className="font-bold">Fecha</td>
							<td>{formatDate(this.props.derecognition.created_at)}</td>
						</tr>

						<tr>
							<td className="font-bold">Ciudad</td>
							<td>{this.props.companyInfo.city}</td>

							<td className="font-bold">Nº</td>
							<td>{`${this.props.derecognition.id}`.padStart(6, '0')}</td>
						</tr>

						<tr>
							<td className="font-bold">Teléfono</td>
							<td>{this.props.companyInfo.phone_number}</td>
						</tr>
					</tbody>
				</table>

				<table className="print mb-20 w-full">
					<thead className="bg-blue text-white text-center">
						<tr>
							<th className="">Nº Activo</th>
							<th className="">Activo</th>
							<th className="">Criterio para dar de baja</th>
							<th className="">Valor en libros</th>
						</tr>
					</thead>

					<tbody>
						{this.props.derecognition.get_details.map(detail => (
							<tr key={detail.get_asset.id}>
								<td>{detail.get_asset.asset_number}</td>
								<td>{detail.get_asset.name}</td>
								<td>{detail.get_reason.str_val}</td>
								<td className="text-right">$ {detail.get_asset.current_value}</td>
							</tr>
						))}
					</tbody>
				</table>

				<table className="print w-full">
					<tbody>
						<tr>
							<td className="font-bold w-1/4">Elaborado por</td>
							<td className="w-1/4">{this.props.derecognition.get_creator_user.display_name}</td>

							<td className="font-bold w-1/4">Autorizado por</td>
							<td className="w-1/4">{this.props.derecognition.get_approver_user?.display_name}</td>
						</tr>

						<tr>
							<td className="font-bold w-1/4">Fecha</td>
							<td className="w-1/4">{formatDate(this.props.derecognition.created_at)}</td>

							<td className="font-bold w-1/4">Fecha</td>
							<td className="w-1/4">{formatDate(this.props.derecognition.approved_at)}</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
}

export default DerecognitionPrint;
