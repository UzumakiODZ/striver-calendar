import React from "react";
import HeroImage from "./HeroImage";
import CalendarContent from "./CalendarContent";
import MonthlyNotes from "./MonthlyNotes";
import MonthThemeSync from "./MonthThemeSync";
import { CalendarProvider } from "./CalendarContext";
import '../styles/Calendar.css'

function Calendar() {
    return (
        <div className="calendar">
            <div className="calendarCoil">
                {Array.from({ length: 15 }, (_, i) => (
                    <div key={i} className="day-cell">

                    </div>
                ))}
            </div>

            <CalendarProvider>
                <div className="calendarProviderSurface">
                    <MonthThemeSync />
                    <HeroImage />
                    <div className="calendarMain">
                        <CalendarContent />
                        <MonthlyNotes />
                    </div>
                </div>
            </CalendarProvider>
            
        </div>
    );
}

export default Calendar;