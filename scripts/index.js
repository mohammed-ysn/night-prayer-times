const maghribTimeInput = document.getElementById("maghribTimeInput");
const fajrTimeInput = document.getElementById("fajrTimeInput");
const calculateButton = document.getElementById("calculateButton");
const midpointTimeDisplay = document.getElementById("midpointTimeDisplay");
const lastThirdTimeDisplay = document.getElementById("lastThirdTimeDisplay");

maghribTimeInput.addEventListener("input", checkAllFieldsComplete);
maghribTimeInput.addEventListener("change", checkReasonableMaghribTime);
fajrTimeInput.addEventListener("input", checkAllFieldsComplete);
fajrTimeInput.addEventListener("change", checkReasonableFajrTime);
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

function checkAllFieldsComplete() {
  if (maghribTimeInput.value && fajrTimeInput.value) {
    calculateButton.disabled = false;
  } else {
    calculateButton.disabled = true;
  }
}

function checkReasonableMaghribTime() {
  const enteredTime = maghribTimeInput.value;
  const time = new Date(`2000-01-01T${enteredTime}`);
  console.log(time);
  const hours = time.getHours();

  // reasonable defined as 1pm <= time <= 11 pm
  // ignoring minutes
  if (hours < 13 || hours > 23) {
    maghribTimeInput.style.borderColor = "red";
    createWarningMessage(
      "maghribWarning",
      "🚨 Please check that the time for Maghrib is correct"
    );
  } else {
    maghribTimeInput.style.borderColor = "";
    const warningMsg = document.querySelector("#maghribWarning");
    if (warningMsg) warningMsg.remove();
  }
}

function checkReasonableFajrTime() {
  const enteredTime = fajrTimeInput.value;
  const time = new Date(`2000-01-01T${enteredTime}`);
  const hours = time.getHours();

  // reasonable defined as 12 am <= time <= 7 am
  // ignoring minutes
  if (hours > 8) {
    maghribTimeInput.style.borderColor = "red";
    createWarningMessage(
      "fajrWarning",
      "🚨 Please check that the time for Fajr is correct"
    );
  } else {
    maghribTimeInput.style.borderColor = "";
    const warningMsg = document.querySelector("#fajrWarning");
    if (warningMsg) warningMsg.remove();
  }
}

function createWarningMessage(id, message) {
  let warningMsg = document.querySelector(`#${id}`);
  if (warningMsg) {
    warningMsg.textContent = message;
  } else {
    warningMsg = document.createElement("p");
    warningMsg.id = id;
    warningMsg.textContent = message;
    warningMsg.style.color = "orange";
    calculateButton.insertAdjacentElement("beforebegin", warningMsg);
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
