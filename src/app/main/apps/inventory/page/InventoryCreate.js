import { axios } from '@core/services/Api';
import { redirect } from '@core/utils/utils';
import { TextField, Typography } from '@material-ui/core';
import { useForm } from '@fuse/hooks';
import Button from '@core/components/Button';
import React, { useEffect, useState } from 'react';
// Components
import { INVENTORY_PAGE_VIEW, INVENTORY_URL_STORE } from '../InventoryConst';

/**
 * @function InventoryCreate
 * @brief Formulario de creación de un inventario
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
export default function InventoryCreate() {
	const [disabled, setDisabled] = useState(true);
	const [loading, setLoading] = useState(false);

	const { form, handleChange } = useForm({ observations: '' });

	const onStoreDeprecation = () => {
		setLoading(true);

		axios({
			url: INVENTORY_URL_STORE,
			method: 'POST',
			data: form,
			success: ({ inventory }) => {
				redirect(`${INVENTORY_PAGE_VIEW}/${inventory.id}`);
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
				Iniciar proceso de inventario
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
				autoFocus
			/>

			<div className="text-center m-20">
				<Button
					variant="contained"
					color="primary"
					disabled={disabled}
					loading={loading}
					onClick={onStoreDeprecation}
				>
					Iniciar
				</Button>
			</div>
		</div>
	);
}
