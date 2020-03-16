const calcBtn = document.querySelector('#calc-btn');

const splitTime = prayer => {
  return [Number(prayer.substring(0, 2)), Number(prayer.substring(3, 5))];
};

const calcDifference = (maghrib, fajr) => {
  fajr[0] += 24;
  return [fajr[0] - maghrib[0], fajr[1] - maghrib[1]];
};

const calcTime = (maghrib, fajr) => {
  maghrib = splitTime(maghrib);
  fajr = splitTime(fajr);
  let difference = calcDifference(maghrib, fajr);
  if (difference[1] >= 60) {
    // Reformat time
  }
};

const createEndTime = (maghrib, fajr) => {
  let endTime = document.createElement('h1');
  endTime.innerText = `End time: ${calcTime(maghrib, fajr)}`;
  return endTime;
};

calcBtn.onclick = () => {
  const maghrib = document.querySelector('#maghrib-time').value;
  const fajr = document.querySelector('#fajr-time').value;

  let endTime = createEndTime(maghrib, fajr);
  document.body.appendChild(endTime);
};
