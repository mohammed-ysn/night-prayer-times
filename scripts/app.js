const calcBtn = document.querySelector('#calc-btn');

const convertToMinutes = (prayer) => {
  return Number(prayer.substring(0, 2)) * 60 + Number(prayer.substring(3, 5));
};

const formatTime = (time) => {
  let hours;
  let minutes;
  let period;
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

const calcTime = (maghrib, fajr) => {
  maghrib = convertToMinutes(maghrib);
  fajr = convertToMinutes(fajr) + 1440;
  const difference = fajr - maghrib;
  const endTime = formatTime(Math.floor(maghrib + difference / 2));
  return endTime;
};

const createEndTime = (maghrib, fajr) => {
  const endTime = document.createElement('h2');
  endTime.setAttribute('id', 'end-time');
  endTime.innerText = `End of Isha: ${calcTime(maghrib, fajr)}`;
  return endTime;
};

calcBtn.onclick = () => {
  const maghrib = document.querySelector('#maghrib-time').value;
  const fajr = document.querySelector('#fajr-time').value;
  endTime = calcTime(maghrib, fajr);
  Swal.fire({
    titleText: `End of Isha: ${endTime}`,
    timer: 4000,
    showConfirmButton: false,
    timerProgressBar: true,
    allowOutsideClick: false,
    stopKeydownPropagation: false,
    background: '#feffff',
  });
};
