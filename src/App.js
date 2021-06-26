import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkButton, clickButton, selectState1, selectState2 } from "./index";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  let state1 = useSelector(selectState1);
  let state2 = useSelector(selectState2);
  console.log(`Current state1 is: ${state1}`);
  console.log(`Current state2 is: ${state2}`);
  // const CLICKBUTTON = "buttons/clickButton";
  // const CHECKBUTTON = "buttons/checkButton";

  // const changeFirstState = () => {
  //   return {
  //     type: CHECKBUTTON,
  //     payload: !state1,
  //   };
  // };

  // const changeSecondState = () => {
  //   return {
  //     type: CLICKBUTTON,
  //     payload: !state2,
  //   };
  // };

  // const clickButton1 = () => {
  //   dispatch(changeFirstState());
  // };

  // const clickButton2 = () => {
  //   dispatch(changeSecondState());
  // };

  const clickButton1 = () => {
    dispatch(checkButton(!state1));
  };

  const clickButton2 = () => {
    dispatch(clickButton(!state2));
  };

  //==========
  //Render 2nd Button

  const renderButton2 = () => {
    if (state1) {
      return (
        <div>
          <div className="clickButton">
            <button onClick={() => clickButton2()}>
              2. Click me to render something.
            </button>
          </div>
          <div>{state2 ? "Button is clicked." : "Button is not clicked."}</div>
        </div>
      );
    }
  };

  //==========
  //Duct Calculation

  const material = {
    thickness: {
      "20mm": 20,
      "30mm": 30,
    },
    millerSpace: {
      "20mm": 26,
      "30mm": 36,
    },
    panelType: {
      "15HB21": "15HB21",
      "15HS31": "15HS31",
    },
    flangesType: {
      161: "161",
      "161/30": "161/30",
    },
    ductAngleType: {
      "21SQ01": "21SQ01",
      "21SQ02": "21SQ02",
    },
  };

  //console.log(materialThickness["30mm"])

  const sizeA = (i) => {
    let a = tableValueForTheRow(i) / 1000;
    return a;
  };

  const sizeA2 = (i) => {
    let a2 = sizeA(i) + (material.thickness["30mm"] / 1000) * 2;
    return a2;
  };

  const sizeB = (j) => {
    let b = tableValueForTheFirstColumn(j - 1) / 1000;
    return b;
  };

  const sizeB2 = (j) => {
    let b2 = sizeB(j) + (material.thickness["30mm"] / 1000) * 2;
    return b2;
  };

  //SizeA3 is for fittings
  const sizeA3 = (i) => {
    let a3 = sizeA2(i) + (material.millerSpace["30mm"] / 1000) * 2;
    return a3;
  };
  //SizeB3 is for fittings
  const sizeB3 = (j) => {
    let b3 = sizeB2(j) + (material.millerSpace["30mm"] / 1000) * 2;
    return b3;
  };

  const ductLength = () => 1.2;

  const ductSurface = (i, j) => {
    return (sizeA2(i) + sizeB2(j)) * 2 * ductLength();
  };

  const reinforcementStep = () => 0.75;

  const bomPanel = (i, j) => {
    let panelQ = ductSurface(i, j);
    return panelQ;
  };

  const bomFlanges = (i, j) => {
    let flangesQ = sizeA(i) * 4 + sizeB(j) * 4;
    return flangesQ;
  };

  const bomCorners = (i, j) => {
    let cornersQ = 8;
    return cornersQ;
  };

  const bomTape = (i, j) => {
    let tapeQ = (ductLength() * 2) / 50;
    return tapeQ;
  };

  const bomPanelGlue = (i, j) => {
    let panelGlueQ = ductLength() * 0.02 * 4;
    return panelGlueQ;
  };

  const bomFlangeGlue = (i, j) => {
    let flangeGlueQ = (bomFlanges(i, j) * 10) / 500;
    return flangeGlueQ;
  };

  const bomSealant = (i, j) => {
    let sealantQ = ductLength() * 0.2;
    return sealantQ;
  };

  const bomDisks = (i, j) => {
    let disksQ =
      sizeA2(i) >= 1
        ? (4 * sizeA2(i)) / reinforcementStep()
        : 0 + sizeB2(j) >= 1
        ? (4 * sizeB2(j)) / reinforcementStep()
        : 0;
    return disksQ;
  };

  const bomScrews = (i, j) => {
    let screwsQ =
      sizeA2(i) >= 1
        ? (2 * sizeA2(i)) / reinforcementStep()
        : 0 + sizeB2(j) >= 1
        ? (2 * sizeB2(j)) / reinforcementStep()
        : 0;
    return screwsQ;
  };

  const bomReinforcement = (i, j) => {
    let reinforcementQ =
      sizeA2(i) >= 1
        ? (sizeA2(i) * sizeA2(i)) / reinforcementStep()
        : 0 + sizeB2(j) >= 1
        ? (sizeB2(j) * sizeB2(j)) / reinforcementStep()
        : 0;
    return reinforcementQ;
  };

  const costsPerUnit = {
    panelCost: {
      "15HB21": 5,
      "15HS31": 9,
    },
    flangesCost: {
      161: 1.15,
      "161/30": 1.3,
    },
    ductCornerCost: {
      "21SQ01": 0.12,
      "21SQ02": 0.14,
    },
    flangesGlueCost: {
      "21CL08": 4.55,
      "21CL09": 8.3,
    },
    tapeCost: {
      "21NS05": 8.85,
    },
    panelGlueCost: {
      "21CL02": 4.55,
    },
    sealantCost: {
      "21SL01": 1.24,
    },
    diskCost: {
      "21RF01": 0.38,
    },
    screwCost: {
      "21RF03": 0.0945,
    },
    reinforcementCost: {
      "21RF02": 1.33,
    },
  };

  const transportCost = () => {
    let logistics = 0.15;
    return logistics;
  };

  const gainCost = () => {
    let gain = 1;
    return gain;
  };

  const laborCostRates = {
    hourlyRate: 12, //brutto euro/hour
    employersSocialTax: 0.2409, // % euro/hour
  };

  const sizeAB = (i, j) => {
    return sizeA(i) * sizeB(j);
  };

  const laborCost = (i, j) => {
    if (sizeAB() < 0.1225) {
      return laborCostRates.hourlyRate * (10 / 60);
    } else if (sizeAB(i, j) < 0.5625) {
      return laborCostRates.hourlyRate * (15 / 60);
    } else if (sizeAB(i, j) < 1.1025) {
      return laborCostRates.hourlyRate * (20 / 60);
    } else if (sizeAB(i, j) < 2.25) {
      return laborCostRates.hourlyRate * (25 / 60);
    } else {
      return laborCostRates.hourlyRate * (30 / 60);
    }
  };

  const est = (i, j) => {
    return laborCost(i, j) * (1 + laborCostRates.employersSocialTax);
  };

  const totalPanelCost = (i, j) => {
    return bomPanel(i, j) * costsPerUnit.panelCost["15HS31"];
  };

  const totalFlangeCost = (i, j) => {
    return bomFlanges(i, j) * costsPerUnit.flangesCost["161/30"];
  };

  const totalCornerCost = (i, j) => {
    return bomCorners(i, j) * costsPerUnit.ductCornerCost["21SQ02"];
  };

  const totalTapeCost = (i, j) => {
    return bomTape(i, j) * costsPerUnit.tapeCost["21NS05"];
  };

  const totalPanelGlueCost = (i, j) => {
    return bomPanelGlue(i, j) * costsPerUnit.panelGlueCost["21CL02"];
  };

  const totalFlangesGlueCost = (i, j) => {
    return bomFlangeGlue(i, j) * costsPerUnit.flangesGlueCost["21CL09"];
  };

  const totalSealantCost = (i, j) => {
    return bomSealant(i, j) * costsPerUnit.sealantCost["21SL01"];
  };

  const totalDisksCost = (i, j) => {
    return bomDisks(i, j) * costsPerUnit.diskCost["21RF01"];
  };

  const totalScrewCost = (i, j) => {
    return bomScrews(i, j) * costsPerUnit.screwCost["21RF03"];
  };

  const totalReinforcementCost = (i, j) => {
    return bomReinforcement(i, j) * costsPerUnit.reinforcementCost["21RF02"];
  };

  const totalMaterialCost = (i, j) => {
    return (
      totalPanelCost(i, j) +
      totalFlangeCost(i, j) +
      totalCornerCost(i, j) +
      totalTapeCost(i, j) +
      totalPanelGlueCost(i, j) +
      totalFlangesGlueCost(i, j) +
      totalSealantCost(i, j) +
      totalDisksCost(i, j) +
      totalScrewCost(i, j) +
      totalReinforcementCost(i, j)
    );
  };

  const totalCost = (i, j) => {
    return totalMaterialCost(i, j) + est(i, j);
  };

  const totalSellingPrice = (i, j) => {
    return (
      totalMaterialCost(i, j) * transportCost() + totalCost() * (1 + gainCost())
    );
  };

  //==========
  //Cell content

  const tableValueForTheRow = (i) => {
    return (i *= 100);
  };

  const tableValueForTheFirstColumn = (j) => {
    return (j *= 100);
  };

  //This one cell value is only for test
  // const cellContent = (i, j) => {
  //   return (
  //     tableValueForTheRow(i) + tableValueForTheFirstColumn(j-1)
  //   )
  // };

  const cellContent = (i, j) => {
    return ductSurface(i, j);
  };

  //==========
  //Render 1st row as a table head

  const renderTableHead = (i) => {
    return <th key={i}>{i === 0 ? "0" : tableValueForTheRow(i)}</th>;
  };

  const renderTableHeads = (n) => {
    let tableHeads = [];
    for (let i = 0; i < n; i++) {
      tableHeads.push(renderTableHead(i));
    }
    return tableHeads;
  };

  const renderTableRowWithHeads = (i) => {
    return <tr>{renderTableHeads(i)}</tr>;
  };

  //==========
  //Render all other rows, where only 1st cell will have the same number
  //as it is in the table head row

  const renderTableData = (cellValue, j) => {
    let i = cellValue;
    return (
      <td key={j === 1 ? i : i + j}>
        {j === 1 ? tableValueForTheFirstColumn(i) : cellContent(i, j)}
      </td>
    );
  };

  const renderTableCells = (cellValue) => {
    let tableCells = [];
    for (let j = 1; j < 22; j++) {
      tableCells.push(renderTableData(cellValue, j));
    }
    return tableCells;
  };

  // const renderTableCellsWithData = (cellValue) => {
  //   return renderTableCells(cellValue);
  // };

  const renderTableRow = (cellValue) => {
    return <tr key={cellValue}>{renderTableCells(cellValue)}</tr>;
  };

  const renderTableRows = (n) => {
    let tableRows = [];
    let a = [];
    for (let i = 1; i < n; i++) {
      let cellValue = a.push(i);
      tableRows.push(renderTableRow(cellValue));
    }
    return tableRows;
  };

  const renderTableRowsWithData = (i) => {
    return <tbody>{renderTableRows(i)}</tbody>;
  };

  //==========
  //Render the whole table

  const renderTable = () => {
    if (state1 && state2) {
      return (
        <div>
          <table>
            <caption>Ducts</caption>
            <thead>{renderTableRowWithHeads(21)}</thead>
            {renderTableRowsWithData(21)}
          </table>
        </div>
      );
    }
  };

  return (
    <div style={{ fontSize: "2rem" }} className="App">
      <button onClick={() => clickButton1()}>
        {state1 ? "1. 2nd button is Active" : "1. 2nd button is NOT active"}
      </button>
      <div>{renderButton2()}</div>
      <div>{renderTable()}</div>
    </div>
  );
}

export default App;
