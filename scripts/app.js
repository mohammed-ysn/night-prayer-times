const calcBtn = document.querySelector('#calc-btn');
const ishaEndContainer = document.querySelector('#end-of-isha');
const lastThirdContainer = document.querySelector('#last-third');

const convertToMinutes = (prayer) => {
  return Number(prayer.substring(0, 2)) * 60 + Number(prayer.substring(3, 5));
};

const formatTime = (time) => {
  let hours, minutes, period;

  if (time >= 1440) {
    period = 'AM';

    time -= 720;

    hours = Math.floor(time / 60);

    if (hours > 12) {
      hours -= 12;
    }
  } else {
    period = 'PM';

    time -= 720;

    hours = Math.floor(time / 60);
  }

  minutes = time % 60;

  if (minutes.toString().length === 1) {
    minutes = `0${minutes}`;
  }

  return `${hours}:${minutes} ${period}`;
};

const calcEndTime = (maghrib, difference) => {
  return formatTime(Math.floor(maghrib + difference / 2));
};

const calcLastThird = (maghrib, difference) => {
  return formatTime(Math.floor(maghrib + difference * (2 / 3)));
};

const calcTimes = (maghrib, fajr) => {
  maghrib = convertToMinutes(maghrib);

  fajr = convertToMinutes(fajr) + 1440;

  const difference = fajr - maghrib;

  return {
    endTime: calcEndTime(maghrib, difference),
    lastThird: calcLastThird(maghrib, difference),
  };
};

calcBtn.addEventListener('click', () => {
  const maghrib = document.querySelector('#maghrib-time').value;

  const fajr = document.querySelector('#fajr-time').value;

  const { endTime, lastThird } = calcTimes(maghrib, fajr);

  if (ishaEndContainer.hasChildNodes()) {
    const ishaEndHeading = document.querySelector('#end-of-isha h2');

    ishaEndHeading.innerText = `Isha ends at: ${endTime}`;

    const lastThirdHeading = document.querySelector('#last-third h2');

    lastThirdHeading.innerText = `Last third of the night: ${lastThird}`;
  } else {
    const ishaEndHeading = document.createElement('h2');

    ishaEndHeading.innerText = `Isha ends at: ${endTime}`;

    ishaEndContainer.appendChild(ishaEndHeading);

    const lastThirdHeading = document.createElement('h2');

    lastThirdHeading.innerText = `Last third of the night: ${lastThird}`;

    lastThirdContainer.appendChild(lastThirdHeading);
  }
});
