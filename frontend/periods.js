// Gets the sun's current altitude in degrees and whether it's rising or setting
function _getSunPosition(lat, lon) {
    const now = new Date();
    const minuteAgo = new Date(now - 60000);

    const current = SunCalc.getPosition(now, lat, lon).altitude * (180 / Math.PI);
    const previous = SunCalc.getPosition(minuteAgo, lat, lon).altitude * (180 / Math.PI);

    return {
        degrees: current,
        isRising: current > previous
    };
}

// Map current sun position to a named period
export function getCurrentPeriod(lat, lon) { // overrideDegrees = null, overrideRising = null
    const { degrees, isRising } = _getSunPosition(lat, lon);
    // const { degrees, isRising } = overrideDegrees !== null
    //     ? { degrees: overrideDegrees, isRising: overrideRising }
    //     : _getSunPosition(lat, lon);

    if (degrees < -18) return "night";

    if (isRising) {
        if (degrees < -12) return "dawn";
        else if (degrees < -6) return "sunrise";
        else return "morning";
    } else {
        if (degrees > 6) return "afternoon";
        else if (degrees > 0) return "golden";
        else if (degrees > -6) return "sunset";
        else if (degrees > -12) return "evening";
        else return "night";
    }
}