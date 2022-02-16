import { axios } from '@core/services/Api';
import { getPathByParams } from '@core/utils/utils';
import { FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import { useForm } from '@fuse/hooks';
import Button from '@core/components/Button';
import Loading from '@core/components/Loading';
import React, { useEffect, useState } from 'react';
// Components
import { PARAMETER_URL_EDIT, PARAMETER_URL_UPDATE } from '../ParameterConst';
import ParameterModel from '../model/ParameterModel';

/**
 * @function ParameterView
 * @brief Edición de parámetro
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
export default function ParameterView(props) {
	const { id } = props?.match?.params;

	const [disabled, setDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [skeleton, setSkeleton] = useState(true);

	const { form, handleChange, setForm } = useForm(new ParameterModel({ id_parent: id }));

	const onUpdateParameter = () => {
		setLoading(true);

		const success = () => setLoading(false);
		const error = () => setLoading(false);

		axios({ url: getPathByParams(PARAMETER_URL_UPDATE, { id }), method: 'PUT', data: form, success, error });
	};

	useEffect(() => {
		const _disabled = !(form.num_val || form.str_val);

		setDisabled(_disabled);
	}, [form]);

	useEffect(() => {
		const success = response => {
			setForm(new ParameterModel(response.parameter));
			setSkeleton(false);
		};

		axios({ url: getPathByParams(PARAMETER_URL_EDIT, { id }), method: 'GET', success });
		// eslint-disable-next-line
	}, [id]);

	return skeleton ? (
		<Loading />
	) : (
		<div className="p-20">
			<Typography component="h1" color="primary" className="text-xl font-bold mb-16">
				Editar parámetro
			</Typography>

			<div>
				<TextField
					label="Nombre"
					name="name"
					value={form.name || ''}
					onChange={handleChange}
					className="pb-16 w-full"
					autoFocus
				/>

				<TextField
					type="number"
					label="Valor numérico"
					name="num_val"
					value={form.num_val || ''}
					onChange={handleChange}
					className="pb-16 w-full"
					required
				/>

				<TextField
					label="Valor en texto"
					name="str_val"
					value={form.str_val || ''}
					onChange={handleChange}
					className="pb-16 w-full"
					required
					multiline
					rowsMax={10}
				/>

				<FormControl className="pb-16 w-1/4" required>
					<InputLabel>Estado</InputLabel>

					<Select name="is_active" value={form.is_active} onChange={handleChange}>
						<MenuItem value={1}>Activo</MenuItem>
						<MenuItem value={0}>Inactivo</MenuItem>
					</Select>
				</FormControl>
			</div>

			<div className="flex items-center justify-center p-20">
				<Button
					variant="contained"
					color="primary"
					onClick={onUpdateParameter}
					loading={loading}
					disabled={disabled}
				>
					Actualizar
				</Button>
			</div>
		</div>
	);
}
