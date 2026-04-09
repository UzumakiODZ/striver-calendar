import { useEffect } from "react";
import { useCalendar } from "./CalendarContext";

const monthColors = [
    "#9B8EC7",
    "#F2EAE0",
    "#1F6F5F",
    "#FFFDEB",
    "#FFEDCE",
    "#CFECF3",
    "#FFF6F6",
    "#f8dad9",
    "#9FCB98",
    "#DAF9DE",
    "#D5E7B5",
    "#f9ddec",
];

function MonthThemeSync() {
    const { currentDate } = useCalendar();

    useEffect(() => {
        const monthIndex = currentDate.getMonth();
        const nextColor = monthColors[monthIndex] || "#f9fafb";

        const calendarProviderSurface = document.querySelector(".calendarProviderSurface");
        if (!calendarProviderSurface) {
            return;
        }

        calendarProviderSurface.style.setProperty("--calendar-bg", nextColor);
    }, [currentDate]);

    return null;
}

export default MonthThemeSync;
