// Element selectors
const maghribInput = document.getElementById("maghribTimeInput");
const fajrInput = document.getElementById("fajrTimeInput");
const calculateButton = document.getElementById("calculateButton");
const midpointDisplay = document.getElementById("midpointTimeDisplay");
const lastThirdDisplay = document.getElementById("lastThirdTimeDisplay");

// Constants
const DATE_BASE = "2000-01-01T";
const MAGHRIB_HOURS_RANGE = { min: 13, max: 23 };
const FAJR_MAX_HOUR = 8;

// Event listeners
maghribInput.addEventListener("input", updateCalculateButtonState);
fajrInput.addEventListener("input", updateCalculateButtonState);
maghribInput.addEventListener("change", () =>
  validateTimeRange(maghribInput, MAGHRIB_HOURS_RANGE, "maghribWarning", "🚨 Please check that the time for Maghrib is correct")
);
fajrInput.addEventListener("change", () =>
  validateTimeRange(fajrInput, { min: 0, max: FAJR_MAX_HOUR }, "fajrWarning", "🚨 Please check that the time for Fajr is correct")
);
calculateButton.addEventListener("click", calculatePrayerTimes);
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !calculateButton.disabled) {
    calculateButton.click();
  }
});

// Functions
function updateCalculateButtonState() {
  calculateButton.disabled = !(maghribInput.value && fajrInput.value);
}

function calculatePrayerTimes() {
  const maghribTime = parseTimeInput(maghribInput.value);
  const fajrTime = parseTimeInput(fajrInput.value, true);

  const midpoint = getFractionalTimeBetween(maghribTime, fajrTime, 0.5);
  const lastThird = getFractionalTimeBetween(maghribTime, fajrTime, 2 / 3);

  midpointDisplay.textContent = formatTime(midpoint);
  lastThirdDisplay.textContent = formatTime(lastThird);
}

function parseTimeInput(timeStr, allowNextDay = false) {
  const time = new Date(`${DATE_BASE}${timeStr}`);
  if (allowNextDay && time < new Date(`${DATE_BASE}${maghribInput.value}`)) {
    time.setDate(time.getDate() + 1);
  }
  return time;
}

function getFractionalTimeBetween(start, end, fraction) {
  const diff = end - start;
  return new Date(start.getTime() + diff * fraction);
}

function formatTime(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${minutes} ${period}`;
}

function validateTimeRange(input, { min, max }, warningId, warningMsg) {
  const hours = new Date(`${DATE_BASE}${input.value}`).getHours();
  const isValid = hours >= min && hours <= max;

  input.style.borderColor = isValid ? "" : "red";
  toggleWarningMessage(!isValid, warningId, warningMsg);
}

function toggleWarningMessage(show, id, message) {
  let warning = document.getElementById(id);

  if (show) {
    if (!warning) {
      warning = document.createElement("p");
      warning.id = id;
      warning.style.color = "orange";
      calculateButton.insertAdjacentElement("beforebegin", warning);
    }
    warning.textContent = message;
  } else if (warning) {
    warning.remove();
  }
}
