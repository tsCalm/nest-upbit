import { JOB_NAME } from '../enum';

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
