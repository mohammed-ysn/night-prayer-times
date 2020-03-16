const calcBtn = document.querySelector('#calc-btn');

const convertToMinutes = prayer => {
  return Number(prayer.substring(0, 2)) * 60 + Number(prayer.substring(3, 5));
};

const formatTime = time => {
  const hours = Math.floor(time / 60) - 12;
  const minutes =
    (time % 60).toString().length === 1 ? `0${time % 60}` : time % 60;
  const period = hours >= 12 ? 'AM' : 'PM';
  return `${hours}:${minutes} ${period}`;
};

const calcTime = (maghrib, fajr) => {
  maghrib = convertToMinutes(maghrib);
  fajr = convertToMinutes(fajr) + 1440;
  const difference = fajr - maghrib;
  const endTime = formatTime(Math.floor(maghrib + difference / 2));
  return endTime;
};

const createEndTime = (maghrib, fajr) => {
  let endTime = document.createElement('h1');
  endTime.setAttribute('id', 'end-time');
  endTime.innerText = `End time: ${calcTime(maghrib, fajr)}`;
  return endTime;
};

calcBtn.onclick = () => {
  const maghrib = document.querySelector('#maghrib-time').value;
  const fajr = document.querySelector('#fajr-time').value;
  let endTime;

  if (document.querySelector('#end-time') === null) {
    // Does not exit
    endTime = createEndTime(maghrib, fajr);
    document.body.appendChild(endTime);
  } else {
    // Exists
    endTime = document.querySelector('#end-time');
    endTime.textContent = `End time: ${calcTime(maghrib, fajr)}`;
  }
};
