import { JOB_NAME, MARKETS } from '../enum';

const ONE_MINUTE = 1000 * 60;
const ONE_HOUR = ONE_MINUTE * 60;

// 기본값은 1시간에 한번 interval이 실행되도록 한다. day, week, month를 위한 default값 설정
export const jobNameToTime = (jobName: JOB_NAME) => {
  const isHour = jobName.includes('HOUR');
  const isMinute = jobName.includes('MINUTE');

  if (isHour) {
    const hour = parseInt(jobName.split('_')[1]);
    return ONE_HOUR * hour;
  }

  if (isMinute) {
    const minute = parseInt(jobName.split('_')[1]);
    return ONE_MINUTE * minute;
  }

  // default
  return ONE_HOUR;
};
/**
 *
 * @param coinName market name
 * @param count candle count
 */
export const createQueryParam = (
  jobName: JOB_NAME,
  coinName: MARKETS,
  count: number = 200,
) => {
  const queryParamList = {
    // DAY: `days?market=KRW-BTC&count=10`
    DAY: `days?market=${coinName}`,
    WEEK: `weeks?market=${coinName}`,
    MONTH: `months?market=${coinName}`,
    HOUR_4: `minutes/240?market=${coinName}`,
    HOUR_1: `minutes/60?market=${coinName}`,
    MINUTE_30: `minutes/30?market=${coinName}`,
    MINUTE_15: `minutes/15?market=${coinName}`,
    MINUTE_10: `minutes/10?market=${coinName}`,
    MINUTE_5: `minutes/5?market=${coinName}`,
    MINUTE_3: `minutes/3?market=${coinName}`,
    MINUTE_1: `minutes/1?market=${coinName}`,
  };
  return `candles/${queryParamList[jobName]}&count=${count}`;
};
