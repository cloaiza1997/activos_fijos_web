/* eslint-disable react/prefer-stateless-function */
import { formatDate } from '@core/utils/utils';
import React from 'react';

/**
 * @class PurchasePrint
 * @brief Página para imprimir orden de compra
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
class PurchasePrint extends React.Component {
	render() {
		return (
			<div className="text-left p-40">
				<div className="flex justify-between">
					<img src="assets/images/logos/logo_grande.png" alt="logo" className="h-32" />

					<h1 className="text-20 text-blue font-bold">ORDEN DE COMPRA</h1>
				</div>

				<table className="w-full mb-20">
					<tbody>
						<tr>
							<td className="font-bold">Dirección</td>
							<td>{this.props.companyInfo.address}</td>

							<td className="font-bold">Fecha</td>
							<td>{formatDate(this.props.purchase.created_at)}</td>
						</tr>

						<tr>
							<td className="font-bold">Ciudad</td>
							<td>{this.props.companyInfo.city}</td>

							<td className="font-bold">Nº</td>
							<td>{`${this.props.purchase.id}`.padStart(8, '0')}</td>
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
							<th className="w-1/2">Solicitado por</th>
							<th className="w-1/2">Área solicitante</th>
						</tr>
					</thead>

					<tbody>
						<tr>
							<td>{this.props.purchase.get_requesting_user.display_name}</td>
							<td>{this.props.purchase.get_requesting_user.area.str_val}</td>
						</tr>
					</tbody>
				</table>

				<table className="print mb-20 w-full">
					<thead className="bg-blue text-white text-center">
						<tr>
							<th className="w-1/2">Proveedor</th>
							<th className="w-1/2">Datos de entrega</th>
						</tr>
					</thead>

					<tbody>
						<tr>
							<td>{this.props.purchase.get_provider.name}</td>
							<td>{this.props.purchase.delivery_date}</td>
						</tr>
						<tr>
							<td>{this.props.purchase.get_provider.address}</td>
							<td>{this.props.purchase.delivery_address}</td>
						</tr>
						<tr>
							<td>{this.props.purchase.get_provider.city.str_val}</td>
							<td>{this.props.purchase.city.str_val}</td>
						</tr>
					</tbody>
				</table>

				<table className="print mb-20 w-full">
					<thead className="bg-blue text-white text-center">
						<tr>
							<th className="">Producto</th>
							<th className="w-88">Cantidad</th>
							<th className="w-136">Valor unitario</th>
							<th className="w-136">Valor total</th>
						</tr>
					</thead>

					<tbody>
						{this.props.purchase.items.map(item => (
							<tr key={item.id}>
								<td>{item.product}</td>
								<td className="text-center">{item.quantity}</td>
								<td className="text-right">$ {item.unit_value}</td>
								<td className="text-right">$ {item.total_value}</td>
							</tr>
						))}

						<tr>
							<td rowSpan="3" colSpan="2">
								<span className="font-bold">Obervaciones: </span>
								{this.props.purchase.observations}
							</td>
							<td className="font-bold">Subtotal</td>
							<td className="text-right">$ {this.props.purchase.sub_total}</td>
						</tr>

						<tr>
							<td className="font-bold">IVA</td>
							<td className="text-right">$ {this.props.purchase.iva}</td>
						</tr>

						<tr>
							<td className="font-bold">Total</td>
							<td className="text-right">$ {this.props.purchase.total}</td>
						</tr>
					</tbody>
				</table>

				<table className="print mb-20 w-full">
					<tbody>
						<tr>
							<td className="font-bold bg-blue text-white text-center w-1/4">Forma de pago</td>
							<td className="text-center w-1/4">{this.props.purchase.get_payment_method.str_val}</td>

							<td className="font-bold bg-blue text-white text-center w-1/4">Días</td>
							<td className="text-center w-1/4">{this.props.purchase.payment_days || 'No aplica'}</td>
						</tr>
					</tbody>
				</table>

				<table className="print w-full">
					<tbody>
						<tr>
							<td className="font-bold w-1/4">Elaborado por</td>
							<td className="w-1/4">{this.props.purchase.get_creator_user.display_name}</td>

							<td className="font-bold w-1/4">Autorizado por</td>
							<td className="w-1/4">{this.props.purchase.get_approver_user.display_name}</td>
						</tr>

						<tr>
							<td className="font-bold w-1/4">Fecha</td>
							<td className="w-1/4">{formatDate(this.props.purchase.created_at)}</td>

							<td className="font-bold w-1/4">Fecha</td>
							<td className="w-1/4">{formatDate(this.props.purchase.approved_at)}</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
}

export default PurchasePrint;
