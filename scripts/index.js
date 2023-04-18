function calculateTimes() {
  const maghribTimeInput = document.getElementById("maghribTimeInput").value;
  const fajrTimeInput = document.getElementById("fajrTimeInput").value;

  const maghribDate = new Date(`2000-01-01T${maghribTimeInput}:00`);
  let fajrDate = new Date(`2000-01-01T${fajrTimeInput}:00`);

  if (fajrDate < maghribDate) {
    fajrDate.setDate(fajrDate.getDate() + 1);
  }

  const midpointTime = getTimeBetweenDates(maghribDate, fajrDate, 1 / 2);
  const lastThirdTime = getTimeBetweenDates(maghribDate, fajrDate, 2 / 3);

  // set the innerHTML of the paragraph elements to display the calculated times
  document.getElementById("midpointTimeDisplay").innerHTML =
    getTimeWithAMPM(midpointTime);
  document.getElementById("lastThirdTimeDisplay").innerHTML =
    getTimeWithAMPM(lastThirdTime);
}

function getTimeBetweenDates(date1, date2, fraction) {
  const timeDiff = Math.abs(date1 - date2);
  const fractionOfTimeDiff = timeDiff * fraction;
  const calculatedTime = new Date(date1.getTime() + fractionOfTimeDiff);
  return calculatedTime;
}

function getTimeWithAMPM(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const ampm = hours >= 12 ? "PM" : "AM";

  // convert hours from military time to standard time
  const standardHours = hours % 12 || 12;

  const timeString = `${standardHours}:${minutes
    .toString()
    .padStart(2, "0")} ${ampm}`;

  return timeString;
}
