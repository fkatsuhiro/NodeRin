import React from 'react';
import { getTimeDifferenceInMinutes } from '../utils/timeUtils';

type UrlRelevanceProps = {
  initialTime: string;
  currentTime: string;
};

const UrlRelevance: React.FC<UrlRelevanceProps> = ({ initialTime, currentTime }) => {
  const timeDifference = getTimeDifferenceInMinutes(initialTime, currentTime);

  let color = 'blue';
  if (timeDifference <= 5) {
    color = 'red';
  } else if (timeDifference <= 10) {
    color = 'orange';
  } else if (timeDifference <= 30) {
    color = 'yellow';
  } else if (timeDifference <= 60) {
    color = 'green';
  }

  return (
    <span style={{ display: 'inline-block', width: '15px', height: '15px', borderRadius: '50%', backgroundColor: color }}></span>
  );
};

export default UrlRelevance;