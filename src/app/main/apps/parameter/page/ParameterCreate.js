import { axios } from '@core/services/Api';
import { redirect } from '@core/utils/utils';
import { TextField, Typography } from '@material-ui/core';
import { useForm } from '@fuse/hooks';
import Button from '@core/components/Button';
import React, { useEffect, useState } from 'react';
// Components
import { PARAMETER_PAGE_LIST_DETAIL, PARAMETER_URL_STORE } from '../ParameterConst';
import ParameterModel from '../model/ParameterModel';

/**
 * @function ParameterCreate
 * @brief Creación de parámetro
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
export default function ParameterCreate(props) {
	const { id } = props?.match?.params;

	const [disabled, setDisabled] = useState(true);
	const [loading, setLoading] = useState(false);

	const { form, handleChange } = useForm(new ParameterModel({ id_parent: id }));

	const onStoreParameter = () => {
		setLoading(true);

		const success = () => redirect(`${PARAMETER_PAGE_LIST_DETAIL}/${id}`);
		const error = () => setLoading(false);

		axios({ url: PARAMETER_URL_STORE, method: 'POST', data: form, success, error });
	};

	useEffect(() => {
		const _disabled = !(form.num_val || form.str_val);

		setDisabled(_disabled);
	}, [form]);

	return (
		<div className="p-20">
			<Typography component="h1" color="primary" className="text-xl font-bold mb-16">
				Crear parámetro
			</Typography>

			<div>
				<TextField
					label="Nombre"
					name="name"
					value={form.name || ''}
					onChange={handleChange}
					className="pb-16 w-full"
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
			</div>

			<div className="flex items-center justify-center p-20">
				<Button
					variant="contained"
					color="primary"
					onClick={onStoreParameter}
					loading={loading}
					disabled={disabled}
				>
					Guardar
				</Button>
			</div>
		</div>
	);
}
