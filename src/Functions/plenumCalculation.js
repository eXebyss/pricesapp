import { laborCostRates } from "./LaborCostRates/laborCostRates";
import { costsPerUnit } from "./CostPerUnit/costPerUnit";
import {
  materialCheckForThickness,
  materialCheckForFlanges,
  materialCheckForCorner,
  materialCheckForFlangeGlue,
  transportCost,
  gainCost,
  reinforcementStep,
  sizeA,
  sizeB,
  sizeA2,
  sizeB2,
  sizeAB,
  sizeA3,
  sizeB3,
} from "./calculation";
import { endCapSurface } from "./endCapCalculation";

const plenumHeight = (state1) => 0.1 + materialCheckForThickness(state1);

const plenumSurface = (i, j, state1) => {
  return (
    Math.ceil(
      ((sizeA3(i, state1) + sizeB3(j, state1)) * 2 * plenumHeight(state1) +
        endCapSurface(i, j, state1)) *
        1000
    ) / 1000
  );
};

//Duct BOM

const bomPanel = (i, j, state1) => {
  let panelQ = plenumSurface(i, j, state1);
  return panelQ;
};

const bomFlanges = (i, j) => {
  let flangesQ = sizeA(i) * 2 + sizeB(j) * 2;
  return flangesQ;
};

const bomCorners = () => {
  let cornersQ = 4;
  return cornersQ;
};

const bomTape = (i, j, state1) => {
  let tapeQ = Math.ceil((plenumSurface(i, j, state1) / 50) * 100) / 100;
  return tapeQ;
};

const bomPanelGlue = (i, j, state1) => {
  let panelGlueQ =
    Math.ceil(plenumSurface(i, j, state1) * 0.01 * 4 * 100) / 100;
  return panelGlueQ;
};

const bomFlangeGlue = (i, j) => {
  let flangeGlueQ = Math.ceil(((bomFlanges(i, j) * 10) / 500) * 100) / 100;
  return flangeGlueQ;
};

const bomSealant = (i, j, state1) => {
  let sealantQ = Math.ceil(plenumSurface(i, j, state1) * 0.1 * 100) / 100;
  return sealantQ;
};

const bomDisks = (i, j, state1) => {
  let disksQ =
    (sizeA2(i, state1) >= 1
      ? 4 * Math.floor(sizeA2(i, state1) / reinforcementStep())
      : 0) +
    (sizeB2(j, state1) >= 1
      ? 4 * Math.floor(sizeB2(j, state1) / reinforcementStep())
      : 0);
  return disksQ;
};

const bomScrews = (i, j, state1) => {
  let screwsQ =
    (sizeA2(i, state1) >= 1
      ? 2 * Math.floor(sizeA2(i, state1) / reinforcementStep())
      : 0) +
    (sizeB2(j, state1) >= 1
      ? 2 * Math.floor(sizeB2(j, state1) / reinforcementStep())
      : 0);
  return screwsQ;
};

const bomReinforcement = (i, j, state1) => {
  let reinforcementQ =
    (sizeA2(i, state1) >= 1
      ? sizeA2(i, state1) * Math.floor(sizeA2(i, state1) / reinforcementStep())
      : 0) +
    (sizeB2(j, state1) >= 1
      ? sizeB2(j, state1) * Math.floor(sizeB2(j, state1) / reinforcementStep())
      : 0);
  return reinforcementQ;
};

//labor cost

const laborCost = (i, j) => {
  if (sizeAB(i, j) < 0.1225) {
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

//Price Calculation

const est = (i, j) => {
  return laborCost(i, j) * (1 + laborCostRates.employersSocialTax);
};

const totalPanelCost = (i, j, state1) => {
  return bomPanel(i, j, state1) * costsPerUnit.panelCost[state1];
};

const totalFlangeCost = (i, j, state1) => {
  return bomFlanges(i, j) * materialCheckForFlanges(state1);
};

const totalCornerCost = (state1) => {
  return bomCorners() * materialCheckForCorner(state1);
};

const totalTapeCost = (i, j, state1) => {
  return bomTape(i, j, state1) * costsPerUnit.tapeCost["21NS05"];
};

const totalPanelGlueCost = (i, j, state1) => {
  return bomPanelGlue(i, j, state1) * costsPerUnit.panelGlueCost["21CL02"];
};

const totalFlangesGlueCost = (i, j, state1) => {
  return bomFlangeGlue(i, j) * materialCheckForFlangeGlue(state1);
};

const totalSealantCost = (i, j, state1) => {
  return bomSealant(i, j, state1) * costsPerUnit.sealantCost["21SL01"];
};

const totalDisksCost = (i, j, state1) => {
  return bomDisks(i, j, state1) * costsPerUnit.diskCost["21RF01"];
};

const totalScrewCost = (i, j, state1) => {
  return bomScrews(i, j, state1) * costsPerUnit.screwCost["21RF03"];
};

const totalReinforcementCost = (i, j, state1) => {
  return (
    bomReinforcement(i, j, state1) * costsPerUnit.reinforcementCost["21RF02"]
  );
};

const totalMaterialCost = (i, j, state1) => {
  return (
    totalPanelCost(i, j, state1) +
    totalFlangeCost(i, j, state1) +
    totalCornerCost(state1) +
    totalTapeCost(i, j, state1) +
    totalPanelGlueCost(i, j, state1) +
    totalFlangesGlueCost(i, j, state1) +
    totalSealantCost(i, j, state1) +
    totalDisksCost(i, j, state1) +
    totalScrewCost(i, j, state1) +
    totalReinforcementCost(i, j, state1)
  );
};

const totalCost = (i, j, state1) => {
  return totalMaterialCost(i, j, state1) + est(i, j, state1);
};

const totalSellingPrice = (i, j, state1) => {
  return (
    Math.round(
      (totalMaterialCost(i, j, state1) * transportCost() +
        totalCost(i, j, state1) * (1 + gainCost())) *
        100
    ) / 100
  );
};

export const cellContent = (i, j, state1) => {
  return totalSellingPrice(i, j, state1);
};