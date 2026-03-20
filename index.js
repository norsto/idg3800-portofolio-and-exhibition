
// The periods are based around late may times
function applyTimeBasedBg() {
    const currentDate = new Date();
    const convertToMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();
    console.log(convertToMinutes);

    const periods = [
        { name: "night", start: 22 * 60 + 30, end: 3 * 60}, // 22.30 - 03.00
        { name: "dawn", start: 3* 60, end: 4* 60}, // 03.00 - 04.00
        { name: "sunrise", start: 4 * 60, end: 4 * 60 + 30}, // 04.00 - 04.30
        { name: "morning", start: 4 * 60 + 30, end: 12 * 60}, // 04.30 - 12.00
        { name: "afternoon", start: 12 * 60, end: 20 * 60}, // 12.00 - 20.00
        { name: "evening", start: 20 * 60, end: 22 * 60 + 15}, // 20.00 - 22.15
        { name: "sunset", start: 22 * 60 + 15, end: 22 * 60 + 30} // 22.15 - 22.30
    ];

    const currentPeriod = periods.find(p => {
        if (p.end > p.start) {
            return convertToMinutes >= p.start && convertToMinutes < p.end;
        } else {
            return convertToMinutes >= p.start || convertToMinutes < p.end;
        }
    });

    const background = document.querySelector(".background__ground");

    document.body.className = "";
    background.classList.remove(`${currentPeriod.name}--overlay`);

    // const current = periods.find(p => convertToMinutes >= p.start && convertToMinutes < p.end);

    periods.forEach(p => {
        console.log(p.name, p.start, p.end);
    });

    console.log("Total minutes:", convertToMinutes, "Current period:", currentPeriod?.name);

    if (currentPeriod) {
        document.body.classList.add(currentPeriod.name);
        background.classList.add(`${currentPeriod.name}--overlay`);
    }
}

// Calls to change background when page is rendered
applyTimeBasedBg();

// Updates background automatically every 60 seconds
// Make it 15 min or like 10 or maybe 60 seconds is good have to check
setInterval(applyTimeBasedBg, 60000);