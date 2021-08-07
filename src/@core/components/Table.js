import { Icon, IconButton, makeStyles, TextField } from '@material-ui/core';
import clsx from 'clsx';
import React, { useMemo, useRef, useState } from 'react';
import DataTable from 'react-data-table-component';
import Button from './Button';

const useStyles = makeStyles(() => ({
	table: {
		'& .rdt_Table': {
			borderTopWidth: 1,
			borderColor: 'rgba(0,0,0,.12)',
			marginTop: 10,
			'& .rdt_TableHead': {
				'& .rdt_TableHeadRow': {
					minHeight: 35,
					'& .rdt_TableCol': {
						padding: '0px 5px',
						display: 'flex',
						justifyContent: 'center'
					}
				}
			},
			'& .rdt_TableBody': {
				'& .rdt_TableRow': {
					minHeight: 35,
					'& .rdt_TableCell': {
						padding: '0px 5px'
					}
				}
			}
		}
	}
}));

/**
 * @function Table
 * @brief Datatable
 * @details
 * @date 01/06/2021
 * @see https://www.npmjs.com/package/react-data-table-component#columns
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
function Table(props) {
	const classes = useStyles();

	const { title, columns = [], data = [], button } = props;

	const [filterText, setFilterText] = useState('');
	const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

	// Filtra los datos de acuerdo con el texto ingresado
	const filteredItems = data.filter(item => {
		let filtered = false;
		// Se recorren las columnas para extraer cada uno de los valores de cada item por cada columna
		for (let i = 0; i < columns.length - 1; i += 1) {
			// Se extrae el nombre del parámetro a comparar
			const { accesor } = columns[i];

			if (accesor) {
				// Se extrae el valor de la celda
				const row = `${item[accesor]}`;

				const validate = row && row.toLowerCase().includes(filterText.toLowerCase());

				if (validate) {
					filtered = true;
					break;
				}
			}
		}

		return filtered;
	});

	const subHeaderComponentMemo = useMemo(() => {
		const handleClear = () => {
			if (filterText) {
				setResetPaginationToggle(!resetPaginationToggle);
				setFilterText('');
			}
		};

		return (
			<div className="flex justify-between w-full">
				<FilterComponent
					onFilter={e => setFilterText(e.target.value)}
					onClear={handleClear}
					filterText={filterText}
				/>

				{button && (
					<Button
						variant="contained"
						color="secondary"
						className="no-link mx-20"
						onClick={button?.onClick}
						href={button?.href}
						role="button"
					>
						{button?.text}
					</Button>
				)}
			</div>
		);
	}, [filterText, resetPaginationToggle]);

	return (
		<div className={clsx('bg-white', classes.table)}>
			<DataTable
				title={title}
				columns={columns}
				data={filteredItems}
				highlightOnHover
				pagination
				paginationResetDefaultPage={resetPaginationToggle}
				subHeader
				subHeaderComponent={subHeaderComponentMemo}
				noDataComponent={
					<div className="flex items-center justify-center m-20 p-40 border-1 rounded-8 w-full">
						No hay registros para mostrar
					</div>
				}
				paginationComponentOptions={{
					rowsPerPageText: 'Filas por página',
					rangeSeparatorText: 'de',
					noRowsPerPage: false,
					selectAllRowsItem: false,
					selectAllRowsItemText: 'Todo'
				}}
			/>
		</div>
	);
}

export default Table;

function FilterComponent({ filterText, onFilter, onClear }) {
	const inputRef = useRef(null);

	return (
		<TextField
			inputRef={inputRef}
			type="text"
			placeholder="Búscar"
			value={filterText}
			onChange={onFilter}
			InputProps={{
				className: 'h-full',
				startAdornment: <Icon>search</Icon>,
				endAdornment: (
					<IconButton
						size="small"
						onClick={() => {
							onClear();
							inputRef.current.focus();
						}}
					>
						<Icon>close</Icon>
					</IconButton>
				)
			}}
		/>
	);
}
