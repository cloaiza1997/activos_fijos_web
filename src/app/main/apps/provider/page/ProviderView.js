import { axios } from '@core/services/Api';
import { FormControl, InputLabel, ListSubheader, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import { getPathByParams } from '@core/utils/utils';
import { useForm } from '@fuse/hooks';
import Button from '@core/components/Button';
import Loading from '@core/components/Loading';
import React, { useEffect, useState } from 'react';
// Components
import { PROVIDER_URL_EDIT, PROVIDER_URL_UPDATE } from '../ProviderConst';
import ProviderModel from '../model/ProviderModel';

/**
 * @function ProviderView
 * @brief Edición de proveedor
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
export default function ProviderView(props) {
	const { id } = props?.match?.params;

	const [data, setData] = useState({});
	const [disabled, setDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [skeleton, setSkeleton] = useState(true);

	const { form, handleChange, setForm } = useForm(new ProviderModel());

	const onUpdateProvider = () => {
		setLoading(true);

		const success = () => setLoading(false);

		const error = () => setLoading(false);

		axios({ url: getPathByParams(PROVIDER_URL_UPDATE, { id }), method: 'PUT', data: form, success, error });
	};

	useEffect(() => {
		const success = response => {
			setData(response);
			setForm(new ProviderModel(response.provider));
			setSkeleton(false);
		};

		axios({ url: getPathByParams(PROVIDER_URL_EDIT, { id }), method: 'GET', success });
		// eslint-disable-next-line
	}, [id]);

	useEffect(() => {
		const _disabled =
			!form.id_document_type ||
			!form.document_number.trim() ||
			!form.name.trim() ||
			!form.address.trim() ||
			!form.id_city ||
			!form.email.trim() ||
			!form.phone_number.trim();

		setDisabled(_disabled);
	}, [form]);

	return skeleton ? (
		<Loading />
	) : (
		<div className="p-20">
			<Typography component="h1" color="primary" className="text-xl font-bold mb-16">
				Editar proveedor
			</Typography>

			<div>
				<FormControl className="p-4 w-1/4" required>
					<InputLabel>Tipo de documento</InputLabel>

					<Select name="id_document_type" value={form.id_document_type} onChange={handleChange} required>
						{data.document_types?.map(type => (
							<MenuItem key={type.id} value={type.id}>
								{type.str_val}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<TextField
					type="number"
					label="Número de documento"
					name="document_number"
					value={form.document_number}
					onChange={handleChange}
					className="p-4 w-1/4"
					required
				/>

				<TextField
					label="Razón social"
					name="name"
					value={form.name}
					onChange={handleChange}
					className="p-4 w-1/4"
					required
				/>

				<TextField
					label="Correo"
					name="email"
					value={form.email}
					onChange={handleChange}
					className="p-4 w-1/4"
					required
				/>

				<TextField
					type="number"
					label="Celular"
					name="phone_number"
					value={form.phone_number}
					onChange={handleChange}
					className="p-4 w-1/4"
					required
				/>

				<FormControl className="p-4 w-1/4" required>
					<InputLabel>Ciudad</InputLabel>

					<Select name="id_city" value={form.id_city} onChange={handleChange}>
						{data.cities?.map(city =>
							city.is_department ? (
								<ListSubheader key={city.id} className="font-bold" value="">
									{city.name}
								</ListSubheader>
							) : (
								<MenuItem key={city.id} value={city.id}>
									{city.name}
								</MenuItem>
							)
						)}
					</Select>
				</FormControl>

				<TextField
					label="Dirección"
					name="address"
					value={form.address}
					onChange={handleChange}
					className="p-4 w-1/4"
					required
				/>

				<FormControl className="p-4 w-1/4" required>
					<InputLabel>Estado</InputLabel>

					<Select name="is_active" value={form.is_active} onChange={handleChange}>
						<MenuItem value={1}>Activo</MenuItem>
						<MenuItem value={0}>Inactivo</MenuItem>
					</Select>
				</FormControl>

				<TextField
					label="Observaciones"
					name="observations"
					value={form.observations}
					onChange={handleChange}
					className="w-full"
					multiline
					rows={4}
					rowsMax={4}
				/>
			</div>

			<div className="flex items-center justify-center p-20">
				<Button
					variant="contained"
					color="primary"
					onClick={() => onUpdateProvider()}
					className="mx-4"
					loading={loading}
					disabled={disabled}
				>
					Actualizar
				</Button>
			</div>
		</div>
	);
}
