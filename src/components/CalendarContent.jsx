import React, { useEffect, useMemo, useState } from "react";
import {
    addDays,
    compareAsc,
    eachDayOfInterval,
    endOfMonth,
    format,
    isWithinInterval,
    startOfMonth,
} from "date-fns";
import { useCalendar } from "./CalendarContext";
import EventModal from "./EventModal";
import EventGoogleCalendarModal from "./EventGoogleCalendarModal";
import "../styles/CalendarContent.css"


const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const NOTES_STORAGE_KEY = "monthly-notes";
const EVENTS_STORAGE_KEY = "calendar-events";
const getMonthKey = (date) => format(date, "yyyy-MM");
const currentYear = new Date().getFullYear();

function getInitialEvents() {
    if (typeof globalThis === "undefined" || !globalThis.localStorage) {
        return [];
    }

    try {
        const raw = globalThis.localStorage.getItem(EVENTS_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed
            .map((event) => ({
                ...event,
                start: new Date(event.start),
                end: new Date(event.end),
            }))
            .filter(
                (event) =>
                    event.start instanceof Date &&
                    !Number.isNaN(event.start.getTime()) &&
                    event.end instanceof Date &&
                    !Number.isNaN(event.end.getTime())
            );
    } catch {
        return [];
    }
}

function CalendarContent() {
    const { currentDate, setCurrentDate } = useCalendar();
    const [rangeStart, setRangeStart] = useState(null);
    const [rangeEnd, setRangeEnd] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [events, setEvents] = useState(getInitialEvents);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [eventTitle, setEventTitle] = useState("");
    const [eventNote, setEventNote] = useState("");
    const [boundaryPage, setBoundaryPage] = useState(null);
    const [hoveredEventInfo, setHoveredEventInfo] = useState(null);
    const [selectedEventForGoogle, setSelectedEventForGoogle] = useState(null);

    const clearRangeAndModal = () => {
        setRangeStart(null);
        setRangeEnd(null);
        setEventTitle("");
        setEventNote("");
        setIsEventModalOpen(false);
    };

    const goNextMonth = () => {
        if (boundaryPage === "before") {
            setBoundaryPage(null);
            return;
        }

        if (boundaryPage === "after") {
            return;
        }

        if (currentDate.getMonth() === 11) {
            clearRangeAndModal();
            setBoundaryPage("after");
            return;
        }

        clearRangeAndModal();
        setCurrentDate(
            (prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1)
        );
    }

    const goCurrentMonth = () => {
        setBoundaryPage(null);
        clearRangeAndModal();
        setCurrentDate(new Date());
    }

    const goPreviousMonth = () => {
        if (boundaryPage === "after") {
            setBoundaryPage(null);
            return;
        }

        if (boundaryPage === "before") {
            return;
        }

        if (currentDate.getMonth() === 0) {
            clearRangeAndModal();
            setBoundaryPage("before");
            return;
        }

        clearRangeAndModal();
        setCurrentDate(
            (prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1)
        );
    }

    const handleDragStart = (day) => {
        setRangeStart(day);
        setRangeEnd(day);
        setIsDragging(true);
    };

    const handleDragEnter = (day) => {
        if (!isDragging || !rangeStart) {
            return;
        }

        setRangeEnd(day);
    };

    const handleDragEnd = () => {
        if (rangeStart && rangeEnd) {
            setIsEventModalOpen(true);
        }

        setIsDragging(false);
    };

    useEffect(() => {
        const stopDrag = () => {
            if (!isDragging) {
                return;
            }

            if (rangeStart && rangeEnd) {
                setIsEventModalOpen(true);
            }

            setIsDragging(false);
        };

        globalThis.addEventListener("pointerup", stopDrag);

        return () => {
            globalThis.removeEventListener("pointerup", stopDrag);
        };
    }, [isDragging, rangeStart, rangeEnd]);

    useEffect(() => {
        if (typeof globalThis === "undefined" || !globalThis.localStorage) {
            return;
        }

        const serializedEvents = events.map((event) => ({
            ...event,
            start: event.start.toISOString(),
            end: event.end.toISOString(),
        }));

        globalThis.localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(serializedEvents));
    }, [events]);

    const selectedRange = useMemo(() => {
        if (!rangeStart || !rangeEnd) {
            return null;
        }

        return compareAsc(rangeStart, rangeEnd) <= 0
            ? { start: rangeStart, end: rangeEnd }
            : { start: rangeEnd, end: rangeStart };
    }, [rangeStart, rangeEnd]);

    const addEventForSelectedRange = () => {
        if (!selectedRange) {
            return;
        }

        const nextTitle = eventTitle.trim();

        setEvents((prevEvents) => {
            const nextId = Date.now();
            const title = nextTitle || `Event ${nextId}`;

            return [
                ...prevEvents,
                {
                    id: nextId,
                    title,
                    start: selectedRange.start,
                    end: selectedRange.end,
                },
            ];
        });

        const trimmedNote = eventNote.trim();
        if (trimmedNote) {
            const noteDates = [
                format(selectedRange.start, "yyyy-MM-dd"),
                format(selectedRange.end, "yyyy-MM-dd"),
            ];

            let savedNotes = [];
            try {
                const rawNotes = globalThis.localStorage.getItem(NOTES_STORAGE_KEY);
                const parsedNotes = rawNotes ? JSON.parse(rawNotes) : [];
                savedNotes = Array.isArray(parsedNotes) ? parsedNotes : [];
            } catch {
                savedNotes = [];
            }

            const nextNote = {
                id: Date.now(),
                title: nextTitle || "Event Note",
                content: trimmedNote,
                dates: noteDates,
                monthKey: getMonthKey(currentDate),
            };

            globalThis.localStorage.setItem(
                NOTES_STORAGE_KEY,
                JSON.stringify([nextNote, ...savedNotes])
            );
            globalThis.dispatchEvent(new Event("monthly-notes-updated"));
        }

        setEventTitle("");
        setEventNote("");
        setRangeStart(null);
        setRangeEnd(null);
        setIsEventModalOpen(false);
    };

    const isDayInSelectedRange = (day) => {
        if (!selectedRange) {
            return false;
        }

        return isWithinInterval(day, selectedRange);
    };

    const getDayEvents = (day) => {
        return events.filter((event) => isWithinInterval(day, { start: event.start, end: event.end }));
    };

    const updateHoveredEvent = (eventData, pointerEvent) => {
        setHoveredEventInfo({
            event: eventData,
            x: pointerEvent.clientX,
            y: pointerEvent.clientY,
        });
    };

    const buildGoogleCalendarEventUrl = (eventData) => {
        const startDate = format(eventData.start, "yyyyMMdd");
        const endDateExclusive = format(addDays(eventData.end, 1), "yyyyMMdd");
        const details = `Event from ${format(eventData.start, "dd MMM yyyy")} to ${format(eventData.end, "dd MMM yyyy")}`;

        const params = new URLSearchParams({
            action: "TEMPLATE",
            text: eventData.title || "Calendar Event",
            dates: `${startDate}/${endDateExclusive}`,
            details,
        });

        return `https://calendar.google.com/calendar/render?${params.toString()}`;
    };

    const addSelectedEventToGoogleCalendar = () => {
        if (!selectedEventForGoogle) {
            return;
        }

        const googleCalendarUrl = buildGoogleCalendarEventUrl(selectedEventForGoogle);
        globalThis.open(googleCalendarUrl, "_blank", "noopener,noreferrer");
        setSelectedEventForGoogle(null);
    };

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const monthStartDay = monthStart.getDay();
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const totalDateCells = 42;
    const trailingEmptyCells = Math.max(0, totalDateCells - (monthStartDay + days.length));

    const isBoundaryVisible = boundaryPage !== null;
    const boundaryYear = boundaryPage === "after" ? currentYear + 1 : currentYear;

    return (
        <div style={{"flex":1}}>
            {isBoundaryVisible ? (
                <div className="newYearPage">
                    <h2>Happy New Year {boundaryYear}</h2>
                </div>
            ) : (
                <div className="calendarContent">

                    {weekdays.map((weekday) => (
                        <div key={weekday} className="calendarWeekday">
                            {weekday}
                        </div>
                    ))}

                    {Array.from({ length: monthStartDay }, (_, i) => (
                        <div key={`empty-${i}`} className="emptyDay">

                        </div>
                    ))}


                    {days.map((day) => (
                        <div
                            key={day.getTime()}
                            className={`calendarDay ${isDayInSelectedRange(day) ? "selectedRange" : ""}`}
                            onPointerDown={() => handleDragStart(day)}
                            onPointerEnter={() => handleDragEnter(day)}
                            onPointerUp={handleDragEnd}
                        >
                            <span className="dayNumber">{format(day, "d")}</span>
                            <div className="eventLines">
                                {getDayEvents(day).map((event) => (
                                    <button
                                        type="button"
                                        key={`${event.id}-${day.getTime()}`}
                                        className="eventLine"
                                        onPointerDown={(e) => e.stopPropagation()}
                                        onPointerUp={(e) => e.stopPropagation()}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedEventForGoogle(event);
                                        }}
                                        onPointerEnter={(e) => updateHoveredEvent(event, e)}
                                        onPointerMove={(e) => updateHoveredEvent(event, e)}
                                        onPointerLeave={() => setHoveredEventInfo(null)}
                                    >

                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    {Array.from({ length: trailingEmptyCells }, (_, i) => (
                        <div key={`empty-end-${i}`} className="emptyDay">
                        </div>
                    ))}

                </div>
            )}

            <div className="calendarActions">
                <div className="prevAction" onClick={goPreviousMonth}></div>
                <div className="nextAction" onClick={goNextMonth}></div>
            </div>


            {isEventModalOpen && selectedRange && (
                <EventModal
                    selectedRange={selectedRange}
                    eventTitle={eventTitle}
                    eventNote={eventNote}
                    onTitleChange={setEventTitle}
                    onNoteChange={setEventNote}
                    onSubmit={addEventForSelectedRange}
                    onClose={clearRangeAndModal}
                />
            )}

            {hoveredEventInfo && (
                <div
                    className="eventHoverDialog"
                    style={{
                        left: `${Math.min(hoveredEventInfo.x + 14, globalThis.innerWidth - 240)}px`,
                        top: `${Math.min(hoveredEventInfo.y + 14, globalThis.innerHeight - 110)}px`,
                    }}
                >
                    <div className="eventHoverTitle">{hoveredEventInfo.event.title}</div>
                    <div className="eventHoverDates">
                        {format(hoveredEventInfo.event.start, "dd MMM yyyy")} - {format(hoveredEventInfo.event.end, "dd MMM yyyy")}
                    </div>
                </div>
            )}

            {selectedEventForGoogle && (
                <EventGoogleCalendarModal
                    eventData={selectedEventForGoogle}
                    onClose={() => setSelectedEventForGoogle(null)}
                    onAddToGoogle={addSelectedEventToGoogleCalendar}
                />
            )}
        </div>
    );
}

export default CalendarContent;