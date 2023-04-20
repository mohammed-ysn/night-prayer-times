const maghribTimeInput = document.getElementById("maghribTimeInput");
const fajrTimeInput = document.getElementById("fajrTimeInput");
const calculateButton = document.getElementById("calculateButton");
const midpointTimeDisplay = document.getElementById("midpointTimeDisplay");
const lastThirdTimeDisplay = document.getElementById("lastThirdTimeDisplay");

maghribTimeInput.addEventListener("input", checkFields);
fajrTimeInput.addEventListener("input", checkFields);
calculateButton.addEventListener("click", calculateTimes);

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    if (!calculateButton.disabled) {
      calculateButton.click();
    }
  }
});

function calculateTimes() {
  const maghribDate = new Date(`2000-01-01T${maghribTimeInput.value}`);
  const fajrDate = new Date(`2000-01-01T${fajrTimeInput.value}`);

  if (fajrDate < maghribDate) {
    fajrDate.setDate(fajrDate.getDate() + 1);
  }

  const midpointTime = getTimeBetweenDates(maghribDate, fajrDate, 1 / 2);
  const lastThirdTime = getTimeBetweenDates(maghribDate, fajrDate, 2 / 3);

  midpointTimeDisplay.textContent = getTimeWithAMPM(midpointTime);
  lastThirdTimeDisplay.textContent = getTimeWithAMPM(lastThirdTime);
}

function checkFields() {
  if (maghribTimeInput.value && fajrTimeInput.value) {
    calculateButton.disabled = false;
  } else {
    calculateButton.disabled = true;
  }
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

  const standardHours = hours % 12 || 12;

  const timeString = `${standardHours}:${minutes
    .toString()
    .padStart(2, "0")} ${ampm}`;

  return timeString;
}
