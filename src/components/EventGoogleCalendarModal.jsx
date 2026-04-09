/* eslint-disable react/prop-types */
import React from "react";
import { format } from "date-fns";
import GooeyButton from "./GooeyButton";

function EventGoogleCalendarModal({ eventData, onClose, onAddToGoogle }) {
    if (!eventData) {
        return null;
    }

    return (
        <div className="eventModalOverlay" onPointerDown={onClose}>
            <div className="eventModal" onPointerDown={(e) => e.stopPropagation()}>
                <div>Event Options</div>
                <div>{eventData.title}</div>
                <div>
                    {format(eventData.start, "dd MMM yyyy")} to {format(eventData.end, "dd MMM yyyy")}
                </div>
                <div className="eventActionButtons">
                    <GooeyButton onClick={onAddToGoogle}>Add to Google Calendar</GooeyButton>
                    <GooeyButton style={{color: "red",}} onClick={onClose}>Cancel</GooeyButton>
                </div>
            </div>
        </div>
    );
}

export default EventGoogleCalendarModal;
