/* eslint-disable react/prop-types */
import React, { useId } from "react";
import { format } from "date-fns";
import GooeyButton from "./GooeyButton";

function EventModal({
    selectedRange,
    eventTitle,
    eventNote,
    onTitleChange,
    onNoteChange,
    onSubmit,
    onClose,
}) {
    const eventTitleInputId = useId();

    if (!selectedRange) {
        return null;
    }

    return (
        <div className="eventModalOverlay" onPointerDown={onClose}>
            <div className="eventModal" onPointerDown={(e) => e.stopPropagation()}>
                <div style={{display:"flex",justifyContent:"center"}}>Add Event</div>
                <div>
                    {format(selectedRange.start, "dd MMM yyyy")} to {format(selectedRange.end, "dd MMM yyyy")}
                </div>
                <div className="input-container">
                    <label className="label" htmlFor={eventTitleInputId}>Event title (optional)</label>
                    <span className="underline" />
                    <input
                        id={eventTitleInputId}
                        type="text"
                        placeholder=" "
                        value={eventTitle}
                        onChange={(e) => onTitleChange(e.target.value)}
                    />
                    
                </div>
                <textarea
                    placeholder="Add a note (optional, saved to Notes too)"
                    value={eventNote}
                    onChange={(e) => onNoteChange(e.target.value)}
                />
                <GooeyButton onClick={onSubmit}>Submit</GooeyButton>
            </div>
        </div>
    );
}

export default EventModal;
