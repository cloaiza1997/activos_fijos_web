import { axios } from '@core/services/Api';
import { redirect } from '@core/utils/utils';
import { TextField, Typography } from '@material-ui/core';
import { useForm } from '@fuse/hooks';
import Button from '@core/components/Button';
import React, { useEffect, useState } from 'react';
// Components
import { REVALUATION_PAGE_VIEW, REVALUATION_URL_STORE } from '../RevaluationConst';
import RevaluationModel from '../model/RevaluationModel';

/**
 * @function RevaluationCreate
 * @brief Formulario de creación de una revaluación
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
export default function RevaluationCreate() {
	const [disabled, setDisabled] = useState(true);
	const [loading, setLoading] = useState(false);

	const { form, handleChange } = useForm(new RevaluationModel());

	const onStorePurchase = () => {
		setLoading(true);

		axios({
			url: REVALUATION_URL_STORE,
			method: 'POST',
			data: form,
			success: ({ revaluation }) => {
				redirect(`${REVALUATION_PAGE_VIEW}/${revaluation.id}`);
			},
			error: () => setLoading(false)
		});
	};

	useEffect(() => {
		const _disabled = !form.observations.trim();

		setDisabled(_disabled);
	}, [form]);

	return (
		<div className="p-20">
			<Typography component="h1" color="primary" className="text-xl font-bold mb-10">
				Crear revaluación
			</Typography>

			<TextField
				label="Observaciones"
				name="observations"
				value={form.observations}
				onChange={handleChange}
				className="w-full"
				required
				multiline
				rows={4}
				rowsMax={4}
			/>

			<div className="text-center m-20">
				<Button
					variant="contained"
					color="primary"
					disabled={disabled}
					loading={loading}
					onClick={onStorePurchase}
				>
					Guardar
				</Button>
			</div>
		</div>
	);
}
