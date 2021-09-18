import { axios } from '@core/services/Api';
import { FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import { getPathByParams } from '@core/utils/utils';
import { useForm } from '@fuse/hooks';
import Button from '@core/components/Button';
import FileUpload, { FILES_TYPES } from '@core/components/FileUpload';
import Loading from '@core/components/Loading';
import React, { useEffect, useState } from 'react';
// Components
import { USER_APP_KEY, USER_URL_EDIT, USER_URL_UPDATE, USER_URL_UPDATE_PASSWORD } from '../UsersConst';
import UserModel from '../model/UserModel';

/**
 * @function UserView
 * @brief Edición de usuario
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
export default function UserView(props) {
	const { id } = props?.match?.params;

	const [data, setData] = useState({});
	const [disabled, setDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [skeleton, setSkeleton] = useState(true);

	const { form, handleChange, setForm } = useForm(new UserModel());

	const onUpdateUser = _signature => {
		setLoading(true);

		let _data = { ...form };

		delete _data.signature;

		if (_signature) {
			_data = { ..._data, signature: _signature[0]?.file_name || null };
		}

		const success = () => setLoading(false);

		const error = () => setLoading(false);

		axios({ url: getPathByParams(USER_URL_UPDATE, { id }), method: 'PUT', data: _data, success, error });
	};

	const onUpdatePassword = () => {
		setLoading(true);

		const success = () => setLoading(false);

		const error = () => setLoading(false);

		axios({ url: getPathByParams(USER_URL_UPDATE_PASSWORD, { id }), method: 'POST', success, error });
	};

	useEffect(() => {
		const success = response => {
			setData(response);
			setForm(new UserModel(response.user));
			setSkeleton(false);
		};

		axios({ url: getPathByParams(USER_URL_EDIT, { id }), method: 'GET', success });
		// eslint-disable-next-line
	}, [id]);

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
				Editar usuario
			</Typography>

			<div className="mb-16">
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

				<FormControl className="p-4 w-1/4" required>
					<InputLabel>Estado</InputLabel>

					<Select name="id_status" value={form.id_status} onChange={handleChange} required>
						{data.status?.map(status => (
							<MenuItem key={status.id} value={status.id}>
								{status.str_val}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</div>

			<FileUpload
				title="Firma"
				files={form.signature}
				appKey={USER_APP_KEY}
				onSuccess={onUpdateUser}
				registerId={form.id}
				multiple={false}
				accept={FILES_TYPES.IMAGES}
			/>

			<div className="flex items-center justify-center p-20">
				<Button
					variant="contained"
					color="primary"
					loading={loading}
					confirm={{
						title: 'Cambiar contraseña',
						message: '¿Confirma cambiar la contraseña del usuario?'
					}}
					onClick={onUpdatePassword}
					className="bg-green-400 hover:bg-green-600 mx-4"
				>
					Cambiar contraseña
				</Button>

				<Button
					variant="contained"
					color="primary"
					onClick={() => onUpdateUser()}
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
