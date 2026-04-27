const FEDERAL_BRACKETS_2024_SINGLE = [
  { rate: 0.1, threshold: 0 },
  { rate: 0.12, threshold: 11600 },
  { rate: 0.22, threshold: 47150 },
  { rate: 0.24, threshold: 100525 },
  { rate: 0.32, threshold: 191950 },
  { rate: 0.35, threshold: 243725 },
  { rate: 0.37, threshold: 609350 }
];

const STANDARD_DEDUCTION_2024_SINGLE = 14600;

function federalTax(salary) {
  const income = Math.max(0, Number(salary || 0) - STANDARD_DEDUCTION_2024_SINGLE);
  let tax = 0;

  for (let i = 0; i < FEDERAL_BRACKETS_2024_SINGLE.length; i += 1) {
    const current = FEDERAL_BRACKETS_2024_SINGLE[i];
    const next = FEDERAL_BRACKETS_2024_SINGLE[i + 1];
    const nextThreshold = next ? next.threshold : Number.POSITIVE_INFINITY;

    if (income > current.threshold) {
      tax += (Math.min(income, nextThreshold) - current.threshold) * current.rate;
    }
  }

  return tax;
}

function stateTax(salary, stateTaxRate) {
  return Number(salary || 0) * (Number(stateTaxRate || 0) / 100);
}

function annualTakeHome(salary, stateTaxRate) {
  const gross = Number(salary || 0);
  const tax = federalTax(gross) + stateTax(gross, stateTaxRate);
  return gross - tax;
}

function monthlyTakeHome(salary, stateTaxRate) {
  return annualTakeHome(salary, stateTaxRate) / 12;
}

function adjustedSalary(baseSalary, sourceColIndex, targetColIndex) {
  if (!sourceColIndex || !targetColIndex) {
    return Number(baseSalary || 0);
  }
  return Math.round(Number(baseSalary || 0) * (Number(targetColIndex) / Number(sourceColIndex)));
}

function compareVerdict(netDelta) {
  if (netDelta > 200) {
    return "BETTER";
  }
  if (netDelta < -200) {
    return "WORSE";
  }
  return "SIMILAR";
}

function cityComparison(baseSalary, sourceCity, targetCity) {
  const sourceNetMonthly = monthlyTakeHome(baseSalary, sourceCity.stateTaxRate) - sourceCity.medianRent1BR;
  const adjusted = adjustedSalary(baseSalary, sourceCity.colIndex, targetCity.colIndex);
  const targetNetMonthly = monthlyTakeHome(adjusted, targetCity.stateTaxRate) - targetCity.medianRent1BR;

  const netDelta = targetNetMonthly - sourceNetMonthly;
  const rentDelta = targetCity.medianRent1BR - sourceCity.medianRent1BR;

  return {
    cityId: targetCity.id,
    cityName: targetCity.name,
    state: targetCity.state,
    adjustedSalary: adjusted,
    estTakeHomeMonthly: Math.round(monthlyTakeHome(adjusted, targetCity.stateTaxRate)),
    rentDelta,
    sourceNetMonthly,
    targetNetMonthly,
    netDelta,
    verdict: compareVerdict(netDelta)
  };
}

function remoteRoi(payload) {
  const salary = Number(payload.salary || 0);
  const remoteSalary = Number(payload.remoteSalary || 0);
  const commuteMonthly = Number(payload.commuteMonthly || 0);
  const miscMonthly = Number(payload.miscMonthly || 0);
  const sourceCity = payload.sourceCity;
  const targetCity = payload.targetCity;

  const officeTaxAnnual = federalTax(salary) + stateTax(salary, sourceCity.stateTaxRate);
  const remoteTaxAnnual = federalTax(remoteSalary) + stateTax(remoteSalary, targetCity.stateTaxRate);

  const officeNetMonthly = (salary - officeTaxAnnual) / 12 - commuteMonthly - miscMonthly - sourceCity.medianRent1BR;
  const remoteNetMonthly = (remoteSalary - remoteTaxAnnual) / 12 - targetCity.medianRent1BR;

  const monthlyDelta = remoteNetMonthly - officeNetMonthly;

  return {
    office: {
      monthlyNet: officeNetMonthly,
      taxMonthly: officeTaxAnnual / 12,
      rentMonthly: sourceCity.medianRent1BR,
      commuteMonthly,
      miscMonthly
    },
    remote: {
      monthlyNet: remoteNetMonthly,
      taxMonthly: remoteTaxAnnual / 12,
      rentMonthly: targetCity.medianRent1BR
    },
    monthlyDelta,
    annualDelta: monthlyDelta * 12,
    verdict: monthlyDelta >= 0 ? "WORTH IT" : "NOT WORTH IT"
  };
}

module.exports = {
  adjustedSalary,
  annualTakeHome,
  cityComparison,
  federalTax,
  monthlyTakeHome,
  remoteRoi,
  stateTax
};
