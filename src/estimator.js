const covid19ImpactEstimator = (data) => {
  const severeEstimatedInfectionRate = 50;
  const estimatedInfectionRate = 10;
  const month = 30;
  const week = 7;
  const growthRate = 3;
  const percentGrowth = 0.15;

  const {
    periodType,
    timeToElapse,
    region,
    reportedCases,
    totalHospitalBeds
  } = data;

  const impact = {};
  const severeImpact = {};

  const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = region;

  const estimateNumberOfDays = (value) => ({
    months: timeToElapse * month,
    weeks: timeToElapse * week,
    days: timeToElapse
  })[value];


  // Challenge 1
  impact.currentlyInfected = Math.trunc(reportedCases * estimatedInfectionRate);
  severeImpact.currentlyInfected = Math.trunc(reportedCases * severeEstimatedInfectionRate);

  // find the factor
  const infectedDuration = estimateNumberOfDays(periodType);
  const factor = Math.trunc(infectedDuration / growthRate);

  // calculate the estimated infection rate
  impact.infectionsByRequestedTime = impact.currentlyInfected * (2 ** factor);
  severeImpact.infectionsByRequestedTime = severeImpact.currentlyInfected * (2 ** factor);

  // Challenge 2
  impact.severeCasesByRequestedTime = Math.trunc(impact.infectionsByRequestedTime * percentGrowth);
  severeImpact.severeCasesByRequestedTime = Math.trunc(severeImpact.infectionsByRequestedTime * percentGrowth);

  // Calculate available bed space
  const findBedSpace = (totalBed, infectionCases) => Math.trunc((totalBed * 0.35) - infectionCases);
  // Calculate the available space based on severity
  impact.hospitalBedsByRequestedTime = findBedSpace(totalHospitalBeds,
    impact.severeCasesByRequestedTime);
  severeImpact.hospitalBedsByRequestedTime = findBedSpace(totalHospitalBeds,
    severeImpact.severeCasesByRequestedTime);

  // Challenge 3
  impact.casesForICUByRequestedTime = Math.trunc(impact.infectionsByRequestedTime * 0.05);
  severeImpact.casesForICUByRequestedTime = Math.trunc(severeImpact.infectionsByRequestedTime * 0.05);

  impact.casesForVentilatorsByRequestedTime = Math.trunc(impact.infectionsByRequestedTime * 0.02);
  severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(severeImpact.infectionsByRequestedTime * 0.02);

  // calculate the economic impact based on severity
  impact.dollarsInFlight = impact.infectionsByRequestedTime
  * avgDailyIncomeInUSD * avgDailyIncomePopulation * infectedDuration;
  impact.dollarsInFlight = Math.round(impact.dollarsInFlight, 2);

  severeImpact.dollarsInFlight = severeImpact.infectionsByRequestedTime
  * avgDailyIncomeInUSD * avgDailyIncomePopulation * infectedDuration;
  severeImpact.dollarsInFlight = Math.round(severeImpact.dollarsInFlight, 2);

  // Return the calculate data
  return {
    data,
    impact,
    severeImpact
  };
};

export default covid19ImpactEstimator;
