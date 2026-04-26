import { applyTimeBasedBg } from "./background.js";
import { getCurrentPeriod } from "./periods.js";

const LAT = 60.7945;
const LON = 10.6923;

// Fallback in case the API fetch fails
const FALLBACK_PERIOD = "morning";

// function _logAllPeriods() {
//     console.log("Rising:");
//     for (let degrees = -18; degrees <= 90; degrees += 1) {
//         console.log(`  ${degrees}°  →  ${getCurrentPeriod(LAT, LON, degrees, true)}`);
//     }
//     console.log("Setting:");
//     for (let degrees = 90; degrees >= -18; degrees -= 1) {
//         console.log(`  ${degrees}°  →  ${getCurrentPeriod(LAT, LON, degrees, false)}`);
//     }
// }

// _logAllPeriods();

function init() {
    try {
        console.log("Current period:", getCurrentPeriod(LAT, LON));
        applyTimeBasedBg(LAT, LON);
        setInterval(() => applyTimeBasedBg(LAT, LON), 60000);
    } catch (err) {
        console.error("Failed to fetch solar times: ", err);
        document.body.classList.add(FALLBACK_PERIOD);
    }
}

init();