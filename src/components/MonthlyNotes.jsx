import React, { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { useCalendar } from "./CalendarContext";
import NotesModal from "./NotesModal";
import { HiArchiveBoxXMark } from "react-icons/hi2";
import '../styles/MonthlyNotes.css'

const STORAGE_KEY = "monthly-notes";
const getMonthKey = (date) => format(date, "yyyy-MM");

function getInitialNotes() {
    if (typeof globalThis === "undefined" || !globalThis.localStorage) {
        return [];
    }

    try {
        const raw = globalThis.localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return [];
        }

        const parsed = JSON.parse(raw);

        if (!Array.isArray(parsed)) {
            return [];
        }

        // Backfill old notes that were saved before month-wise support.
        const fallbackMonthKey = getMonthKey(new Date());
        return parsed.map((note) => ({
            ...note,
            monthKey: typeof note.monthKey === "string" ? note.monthKey : fallbackMonthKey,
        }));
    } catch {
        return [];
    }
}


function MonthlyNotes() {
    const { currentDate } = useCalendar();
    const [notesItems, setNotesItems] = useState(getInitialNotes);
    const [content, setContent] = useState("");
    const [datesInput, setDatesInput] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const currentMonthKey = getMonthKey(currentDate);

    const visibleNotes = useMemo(
        () => notesItems.filter((note) => note.monthKey === currentMonthKey),
        [notesItems, currentMonthKey]
    );

    useEffect(() => {
        if (typeof globalThis === "undefined" || !globalThis.localStorage) {
            return;
        }

        globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(notesItems));
    }, [notesItems]);

    useEffect(() => {
        const syncNotesFromStorage = () => {
            setNotesItems(getInitialNotes());
        };

        globalThis.addEventListener("monthly-notes-updated", syncNotesFromStorage);

        return () => {
            globalThis.removeEventListener("monthly-notes-updated", syncNotesFromStorage);
        };
    }, []);

    const addNote = () => {
        const nextContent = content.trim();
        const nextDates = datesInput
            .split(",")
            .map((date) => date.trim())
            .filter(Boolean);

        if (!nextContent) {
            return;
        }

        const nextNote = {
            id: Date.now(),
            content: nextContent,
            dates: nextDates,
            monthKey: currentMonthKey,
        };

        setNotesItems((prev) => [nextNote, ...prev]);
        setContent("");
        setDatesInput("");
        setIsModalOpen(false);
    };

    const deleteNote = (id) => {
        setNotesItems((prev) => prev.filter((note) => note.id !== id));
    }

    return (
        <div className="monthlyNotes">
            {/* eslint-disable-next-line jsx-a11y/prefer-tag-over-role */}
            <div
                className="addNoteTrigger"
                role="button"
                tabIndex={0}
                onClick={() => setIsModalOpen(true)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setIsModalOpen(true);
                    }
                }}
            >
                + Add Note
            </div>

            {isModalOpen && (
                <NotesModal
                    content={content}
                    datesInput={datesInput}
                    onContentChange={setContent}
                    onDatesChange={setDatesInput}
                    onSubmit={addNote}
                    onClose={() => setIsModalOpen(false)}
                />
            )}

            <div className="notesList">
                {visibleNotes.map((note) => (
                    <div key={note.id} className="noteCard">
                        <div style={{display:'flex',flexDirection:'column'}}>
                            <div>{note.content}</div>
                            <div>Dates: {note.dates?.length ? note.dates.join(", ") : "None"}</div>
                        </div>
                        <div className="deleteNotes" onClick={() => deleteNote(note.id)} title="Delete Note"> <HiArchiveBoxXMark /> </div>
                    </div>
                ))}
            </div>

            {!visibleNotes.length && (
                <p>No notes for this month yet.</p>
            )}
        </div>
    );
}

export default MonthlyNotes;