import { axios } from '@core/services/Api';
import { FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import { redirect } from '@core/utils/utils';
import { useForm } from '@fuse/hooks';
import Button from '@core/components/Button';
import Loading from '@core/components/Loading';
import React, { useEffect, useState } from 'react';
// Components
import { USER_URL_CREATE, USER_PAGE_VIEW, USER_URL_STORE } from '../UsersConst';
import UserModel from '../model/UserModel';

/**
 * @function UserCreate
 * @brief Creación de usuario
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
export default function UserCreate() {
	const [data, setData] = useState({});
	const [disabled, setDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [skeleton, setSkeleton] = useState(true);

	const { form, handleChange } = useForm(new UserModel());

	const onStoreUser = () => {
		setLoading(true);

		const success = ({ user }) => {
			redirect(`${USER_PAGE_VIEW}/${user.id}`);
		};

		const error = () => setLoading(false);

		axios({ url: USER_URL_STORE, method: 'POST', data: form, success, error });
	};

	useEffect(() => {
		const success = response => {
			setData(response);
			setSkeleton(false);
		};

		axios({ url: USER_URL_CREATE, method: 'GET', success });
	}, []);

	useEffect(() => {
		const _disabled =
			!form.id_document_type ||
			!form.document_number.trim() ||
			!form.name.trim() ||
			!form.last_name.trim() ||
			!form.email.trim() ||
			!form.id_role ||
			!form.id_area ||
			!form.id_position;

		setDisabled(_disabled);
	}, [form]);

	return skeleton ? (
		<Loading />
	) : (
		<div className="p-20">
			<Typography component="h1" color="primary" className="text-xl font-bold mb-16">
				Crear usuario
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
					label="Nombre"
					name="name"
					value={form.name}
					onChange={handleChange}
					className="p-4 w-1/4"
					required
				/>

				<TextField
					label="Apellidos"
					name="last_name"
					value={form.last_name}
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
				/>

				<FormControl className="p-4 w-1/4" required>
					<InputLabel>Área</InputLabel>

					<Select name="id_area" value={form.id_area} onChange={handleChange} required>
						{data.company_areas?.map(area => (
							<MenuItem key={area.id} value={area.id}>
								{area.str_val}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<FormControl className="p-4 w-1/4" required>
					<InputLabel>Cargo</InputLabel>

					<Select name="id_position" value={form.id_position} onChange={handleChange} required>
						{data.company_positions?.map(position => (
							<MenuItem key={position.id} value={position.id}>
								{position.str_val}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<FormControl className="p-4 w-1/4" required>
					<InputLabel>Rol</InputLabel>

					<Select name="id_role" value={form.id_role} onChange={handleChange} required>
						{data.roles?.map(position => (
							<MenuItem key={position.id} value={position.id}>
								{position.str_val}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</div>

			<div className="flex items-center justify-center p-20">
				<Button variant="contained" color="primary" onClick={onStoreUser} loading={loading} disabled={disabled}>
					Guardar
				</Button>
			</div>
		</div>
	);
}
