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
    default: timeToElapse
  })[value];


  // Challenge 1
  impact.currentlyInfected = reportedCases * estimatedInfectionRate;
  severeImpact.currentlyInfected = reportedCases * severeEstimatedInfectionRate;

  // find the factor
  const infectedDuration = estimateNumberOfDays(periodType);
  const factor = Math.floor(infectedDuration / growthRate);

  // calculate the estimated infection rate
  impact.infectionsByRequestedTime = impact.currentlyInfected * (2 ** factor);
  severeImpact.infectionsByRequestedTime = severeImpact.currentlyInfected * (2 ** factor);

  // Challenge 2
  impact.severeCasesByRequestedTime = impact.infectionsByRequestedTime * percentGrowth;
  severeImpact.severeCasesByRequestedTime = severeImpact.infectionsByRequestedTime * percentGrowth;

  // Calculate available bed space
  const findBedSpace = (totalBed, infectionCases) => (totalBed * 0.35) - infectionCases;
  // Calculate the available space based on severity
  impact.hospitalBedsByRequestedTime = findBedSpace(totalHospitalBeds,
    impact.severeCasesByRequestedTime);
  severeImpact.hospitalBedsByRequestedTime = findBedSpace(totalHospitalBeds,
    severeImpact.severeCasesByRequestedTime);

  // Challenge 3
  impact.casesForICUByRequestedTime = impact.infectionsByRequestedTime * 0.05;
  severeImpact.casesForICUByRequestedTime = severeImpact.infectionsByRequestedTime * 0.05;

  impact.casesForVentilatorsByRequestedTime = impact.infectionsByRequestedTime * 0.02;
  severeImpact.casesForVentilatorsByRequestedTime = severeImpact.infectionsByRequestedTime * 0.02;

  // calculate the economic impact based on severity
  impact.dollarsInFlight = impact.infectionsByRequestedTime
  * avgDailyIncomeInUSD * avgDailyIncomePopulation * infectedDuration;

  severeImpact.dollarsInFlight = severeImpact.infectionsByRequestedTime
  * avgDailyIncomeInUSD * avgDailyIncomePopulation * infectedDuration;

  // Return the calculate data
  return {
    data,
    impact,
    severeImpact
  };
};

export default covid19ImpactEstimator;
