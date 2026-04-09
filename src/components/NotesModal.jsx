/* eslint-disable react/prop-types */
import React, { useId } from "react";
import GooeyButton from "./GooeyButton";

function NotesModal({ content, datesInput, onContentChange, onDatesChange, onSubmit, onClose }) {
    const associatedDatesInputId = useId();

    return (
        <div className="notesModalOverlay" onPointerDown={onClose}>
            <div className="notesModal" onPointerDown={(e) => e.stopPropagation()}>
                <textarea
                    placeholder="Note Content"
                    value={content}
                    onChange={(e) => onContentChange(e.target.value)}
                />
                <div className="input-container">
                    <label className="label" htmlFor={associatedDatesInputId}>Associated Dates (comma separated)</label>
                    <span className="underline" />
                    <input
                        id={associatedDatesInputId}
                        type="text"
                        placeholder=" "
                        value={datesInput}
                        onChange={(e) => onDatesChange(e.target.value)}
                    />
                </div>
                <GooeyButton onClick={onSubmit}>Submit Note</GooeyButton>
            </div>
        </div>
    );
}

export default NotesModal;
