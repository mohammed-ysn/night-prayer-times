const calcBtn = document.querySelector('#calc-btn');

const convertToMinutes = prayer => {
  return Number(prayer.substring(0, 2)) * 60 + Number(prayer.substring(3, 5));
};

const formatTime = time => {
  let hours = Math.floor(time / 60) - 12;
  const minutes = time % 60;
  const period = hours >= 12 ? 'AM' : 'PM';
  return `${hours}:${minutes} ${period}`;
};

const calcTime = (maghrib, fajr) => {
  maghrib = convertToMinutes(maghrib);
  fajr = convertToMinutes(fajr) + 1440;
  const difference = fajr - maghrib;
  const endTime = formatTime(Math.floor(maghrib + difference / 2));
  alert(endTime);
  return endTime;
};

const createEndTime = (maghrib, fajr) => {
  let endTime = document.createElement('h1');
  endTime.innerText = `End time: ${calcTime(maghrib, fajr)}`;
  return endTime;
};

calcBtn.onclick = () => {
  const maghrib = document.querySelector('#maghrib-time').value;
  const fajr = document.querySelector('#fajr-time').value;
  const endTime = createEndTime(maghrib, fajr);
  document.body.appendChild(endTime);
};
