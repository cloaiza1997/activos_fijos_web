import { axios } from '@core/services/Api';
import { FormControl, InputLabel, MenuItem, Select, Typography } from '@material-ui/core';
import Loading from '@core/components/Loading';
import React, { useEffect, useState } from 'react';
import Table from '@core/components/Table';
import Button from '@core/components/Button';
// Components
import { REPORT_URL } from '../ReportConst';

/**
 * @function ReportList
 * @brief Listado de reportes
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 */
function ReportList() {
	const [skeleton, setSkeleton] = useState(true);
	const [loading, setLoading] = useState(false);
	const [reportList, setReportList] = useState([]);
	const [name, setName] = useState('');
	const [columns, setColumns] = useState([]);
	const [results, setResults] = useState([]);
	const [reportName, setReportName] = useState('');

	const onGenerateReport = () => {
		setLoading(true);
		setColumns([]);
		setResults([]);

		const success = data => {
			const { label = '', report = [] } = data || {};

			if (report.length > 0) {
				const row = report[0];

				const _columns = Object.keys(row).map(key => ({
					name: key,
					accesor: key,
					selector: _row => _row[key],
					sortable: true
				}));

				setColumns(_columns);
				setResults(report);
			} else {
				setColumns([]);
				setResults([]);
			}

			setReportName(label);
			setLoading(false);
		};

		const error = () => setLoading(false);

		axios({ url: REPORT_URL, method: 'POST', data: { name }, success, error });
	};

	useEffect(() => {
		const success = data => {
			setReportList(data.reports);
			setSkeleton(false);
		};

		axios({ url: REPORT_URL, method: 'GET', success });
	}, []);

	return skeleton ? (
		<Loading />
	) : (
		<div>
			<div className="p-20">
				<Typography component="h1" color="primary" className="text-xl font-bold mb-10">
					Generación de reportes
				</Typography>

				<div className="flex">
					<FormControl className="mx-4 w-1/3" required>
						<InputLabel>Seleccione el tipo de reporte a generar</InputLabel>

						<Select value={name} onChange={e => setName(e.target.value)}>
							{reportList?.map(report => (
								<MenuItem key={report.name} value={report.name}>
									{report.label}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<Button
						variant="contained"
						color="secondary"
						className="mx-20"
						onClick={onGenerateReport}
						disabled={!name}
						loading={loading}
					>
						Generar reporte
					</Button>
				</div>
			</div>

			<Table title={reportName} columns={columns} data={results} exportReport />
		</div>
	);
}

export default ReportList;
