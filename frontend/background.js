import { getCurrentPeriod } from "./periods.js";

// Removes all period classed from the body
function _clearPeriod() {
    const periods = [
        "night",
        "dawn",
        "sunrise",
        "morning",
        "afternoon",
        "golden",
        "sunset",
        "evening"
    ];

    periods.forEach(p => document.body.classList.remove(p));
}

// Updates the body class to reflect the current period
export function applyTimeBasedBg(lat, lon) {
    const currentPeriod = getCurrentPeriod(lat, lon);

    _clearPeriod();

    if (currentPeriod) {
        document.body.classList.add(currentPeriod);
    }
}