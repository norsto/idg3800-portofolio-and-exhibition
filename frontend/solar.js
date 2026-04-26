// Key used to identify the cached data in localStorage
const CACHE_KEY = "solar";

// Fetches and returns solar times from http://sunrise-sunset.org API
async function _fetchSolarTimes(lat, lon) {

    const res = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&date=today&formatted=0`);
    const data = await res.json();
    const t = data.results;

    // Renames API fields to cleaner names for use in the rest of the app
    return {
        astronomicalDawn:  t.astronomical_twilight_begin,
        nauticalDawn:      t.nautical_twilight_begin,
        civilDawn:         t.civil_twilight_begin,
        sunrise:           t.sunrise,
        solarNoon:         t.solar_noon,
        sunset:            t.sunset,
        civilDusk:         t.civil_twilight_end,
        nauticalDusk:      t.nautical_twilight_end,
        astronomicalDusk:  t.astronomical_twilight_end,
    };
}

// Returns solar times for today, using localStorage cache to avoid unnecessary API calls
export async function getSolarTimes(lat, lon) {
    // Current date and time, converts it to a string, splits at the T, and grabs the date part
    // Isolate just the date portion e.g. "2026-04-12"
    const today = new Date().toISOString().split("T")[0];
    const cached = localStorage.getItem(CACHE_KEY);

    // If cached data exists and is from today, return it without calling the API
    if (cached) {
        const parsed = JSON.parse(cached);
        // parsed.date: the date that was saved when we last fetched from the API
        // Won't run the rest of the function uless the data is stale
        if (parsed.date === today) return parsed.times;
    }

    // Cache is missing or stale — fetch fresh data and save it
    const times = await _fetchSolarTimes(lat, lon);
    localStorage.setItem(CACHE_KEY, JSON.stringify({ date: today, times }));
    return times;
}