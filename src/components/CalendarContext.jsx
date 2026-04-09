/* eslint-disable react/prop-types */
import React, { createContext, useContext, useMemo, useState } from "react";

const CalendarContext = createContext(null);
const CURRENT_MONTH_SESSION_KEY = "currentMonthVisited";

function getInitialCurrentDate() {
    if (typeof globalThis === "undefined" || !globalThis.sessionStorage) {
        return new Date();
    }

    try {
        const storedValue = globalThis.sessionStorage.getItem(CURRENT_MONTH_SESSION_KEY);
        if (!storedValue) {
            return new Date();
        }

        const parsedDate = new Date(storedValue);
        if (Number.isNaN(parsedDate.getTime())) {
            return new Date();
        }

        return parsedDate;
    } catch {
        return new Date();
    }
}

export function CalendarProvider({ children }) {
    const [currentDate, setCurrentDate] = useState(getInitialCurrentDate);

    const updateCurrentDate = (nextDateOrUpdater) => {
        setCurrentDate((prevDate) => {
            const nextDate =
                typeof nextDateOrUpdater === "function"
                    ? nextDateOrUpdater(prevDate)
                    : nextDateOrUpdater;

            if (!(nextDate instanceof Date) || Number.isNaN(nextDate.getTime())) {
                return prevDate;
            }

            if (typeof globalThis !== "undefined" && globalThis.sessionStorage) {
                globalThis.sessionStorage.setItem(CURRENT_MONTH_SESSION_KEY, nextDate.toISOString());
            }

            return nextDate;
        });
    };

    const value = useMemo(() => ({
        currentDate,
        setCurrentDate: updateCurrentDate,
    }), [currentDate]);

    return (
        <CalendarContext.Provider value={value}>
            {children}
        </CalendarContext.Provider>
    );
}

export function useCalendar() {
    const context = useContext(CalendarContext);

    if (!context) {
        throw new Error("useCalendar must be used within a CalendarProvider");
    }

    return context;
}
