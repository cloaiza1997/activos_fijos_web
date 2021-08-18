/* eslint-disable react/prefer-stateless-function */
import { URL_BACK } from '@core/consts/consts';
import { formatDate } from '@core/utils/utils';
import React from 'react';

/**
 * @class CertificatePrint
 * @brief Página para imprimir un acta de movimiento
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
class CertificatePrint extends React.Component {
	render() {
		return (
			<div className="text-left p-40">
				<div className="flex justify-between">
					<img src="assets/images/logos/logo_grande.png" alt="logo" className="h-32" />

					<h1 className="text-20 text-blue font-bold">ACTA DE MOVIMIENTOS DE ACTIVOS</h1>
				</div>

				<table className="w-full mb-20">
					<tbody>
						<tr>
							<td className="font-bold">Dirección</td>
							<td>{this.props.companyInfo.address}</td>

							<td className="font-bold">Fecha</td>
							<td>{formatDate(this.props.certificate.created_at)}</td>
						</tr>

						<tr>
							<td className="font-bold">Ciudad</td>
							<td>{this.props.companyInfo.city}</td>

							<td className="font-bold">Nº</td>
							<td>{`${this.props.certificate.id}`.padStart(6, '0')}</td>
						</tr>

						<tr>
							<td className="font-bold">Teléfono</td>
							<td>{this.props.companyInfo.phone_number}</td>
						</tr>
					</tbody>
				</table>

				<table className="print text-center mb-20 w-full">
					<thead className="bg-blue text-white">
						<tr>
							<th className="w-1/2">Entrega</th>
							<th className="w-1/2">Recibe</th>
						</tr>
					</thead>

					<tbody>
						<tr>
							<td>{this.props.certificate.get_deliver_user.display_name}</td>
							<td>{this.props.certificate.get_receiver_user.display_name}</td>
						</tr>
					</tbody>
				</table>

				<table className="print  text-center mb-20 w-full">
					<thead className="bg-blue text-white text-center">
						<tr>
							<th className="w-1/2">Área</th>
							<th className="w-1/2">Área</th>
						</tr>
					</thead>

					<tbody>
						<tr>
							<td>{this.props.certificate.get_deliver_area.str_val}</td>
							<td>{this.props.certificate.get_receiver_area.str_val}</td>
						</tr>
					</tbody>
				</table>

				<table className="print mb-20 w-full">
					<thead className="bg-blue text-white text-center">
						<tr>
							<th className="">Nº Activo</th>
							<th className="">Activo</th>
							<th className="">Marca</th>
							<th className="">Serial</th>
							<th className="">Estado</th>
							<th className="">Observaciones</th>
						</tr>
					</thead>

					<tbody>
						{this.props.certificate.get_certificate_details.map(asset => (
							<tr key={asset.id}>
								<td>{asset.asset_number}</td>
								<td>{asset.name}</td>
								<td>{asset.brand}</td>
								<td>{asset.serial_number}</td>
								<td>{asset.get_physical_status.str_val}</td>
								<td>{asset.observations}</td>
							</tr>
						))}
					</tbody>
				</table>

				<p className="mb-20 text-justify">
					Quien ocupa el cargo de {this.props.certificate.get_receiver_user.get_position.str_val} quien como
					resposable adquiere el compromiso de infromar cualquier tipo de novedades que suceda con dicho(s)
					activo (s) como daño, necesidad de mantenimiento, movimiento de una oficina a otra o persona al
					lider de proceso de activos fijos.
				</p>

				<table className="print mb-20 w-full">
					<thead className="bg-blue text-white text-center">
						<tr>
							<th className="w-1/2">Firma quien entrega</th>
							<th className="w-1/2">Firma quien recibe</th>
						</tr>
					</thead>

					<tbody>
						<tr>
							<td>
								<div className="flex items-center justify-center h-32">
									<img
										src={`${URL_BACK}attachments/${this.props.certificate.get_deliver_user.signature}`}
										alt="Firma"
										className="h-full"
									/>
								</div>
							</td>
							<td>
								<div className="flex items-center justify-center h-32">
									<img
										src={`${URL_BACK}attachments/${this.props.certificate.get_receiver_user.signature}`}
										alt="Firma"
										className="h-full"
									/>
								</div>
							</td>
						</tr>
					</tbody>
				</table>

				<table className="print w-full">
					<tbody>
						<tr>
							<td className="font-bold w-1/4">Elaborado por</td>
							<td className="w-1/4">{this.props.certificate.get_creator_user.display_name}</td>

							<td className="font-bold w-1/4">Autorizado por</td>
							<td className="w-1/4">{this.props.certificate.get_approver_user.display_name}</td>
						</tr>

						<tr>
							<td className="font-bold w-1/4">Fecha</td>
							<td className="w-1/4">{formatDate(this.props.certificate.created_at)}</td>

							<td className="font-bold w-1/4">Fecha</td>
							<td className="w-1/4">{formatDate(this.props.certificate.approved_at)}</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
}

export default CertificatePrint;
