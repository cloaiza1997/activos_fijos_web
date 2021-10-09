import { Icon, IconButton, makeStyles, TextField } from '@material-ui/core';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import DataTable from 'react-data-table-component';
import React, { useMemo, useRef, useState } from 'react';
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

	const { title, columns = [], data = [], button, keyField, exportReport } = props;

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

	const convertArrayOfObjectsToCSV = () => {
		let result;

		const columnDelimiter = ',';
		const lineDelimiter = '\n';
		const keys = columns.map(column => column.name);

		result = '';
		result += keys.join(columnDelimiter);
		result += lineDelimiter;

		data.forEach(item => {
			let ctr = 0;

			columns.forEach(column => {
				if (column.selector) {
					if (ctr > 0) result += columnDelimiter;

					result += column.selector(item) || '';

					ctr += 1;
				}
			});

			result += lineDelimiter;
		});

		return result;
	};

	const downloadCSV = () => {
		let csv = convertArrayOfObjectsToCSV();

		if (csv == null) return;

		const filename = `${title}.csv`;

		if (!csv.match(/^data:text\/csv/i)) {
			csv = `data:text/csv;charset=utf-8,${csv}`;
		}

		const link = document.createElement('a');
		link.setAttribute('href', encodeURI(csv));
		link.setAttribute('download', filename);
		link.click();
	};

	const subHeaderComponentMemo = useMemo(() => {
		const handleClear = () => {
			if (filterText) {
				setResetPaginationToggle(!resetPaginationToggle);
				setFilterText('');
			}
		};

		return (
			<div className="flex justify-between w-full max-w-full">
				<FilterComponent
					onFilter={e => setFilterText(e.target.value)}
					onClear={handleClear}
					filterText={filterText}
				/>

				<div className="flex items-center justify-center">
					{exportReport && (
						<Button variant="contained" color="primary" onClick={downloadCSV}>
							Exportar .csv
						</Button>
					)}

					{button && (
						<Link to={button?.href} role="button">
							<Button
								variant="contained"
								color="secondary"
								className="no-link mx-20"
								onClick={button?.onClick}
							>
								{button?.text}
							</Button>
						</Link>
					)}
				</div>
			</div>
		);
		// eslint-disable-next-line
	}, [filterText, resetPaginationToggle, button, title, columns, data]);

	return (
		<div className={clsx('main bg-white', classes.table)}>
			<DataTable
				keyField={keyField}
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
