import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';

/**
 * @function Print
 * @brief Permite imprimir el contenido de un componente
 * @date 01/06/2021
 * @author Cristian Loaiza <cristianaloaiza@estudiante.uniajc.edu.co>
 * @param {Component} Componente Debe de ser un componente de clase, ejemplo: class PurchasePrint extends React.Component { render() { return <></> }}
 */
function Print(props) {
	const { trigger, title, Component, componentProps } = props;

	const componentPrintRef = useRef(null);

	return (
		<>
			<ReactToPrint trigger={() => trigger} content={() => componentPrintRef.current} documentTitle={title} />

			<div className="hidden">
				<Component ref={componentPrintRef} {...componentProps} />
			</div>
		</>
	);
}

export default Print;
