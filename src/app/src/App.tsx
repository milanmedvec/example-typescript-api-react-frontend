import './App.css';
import { NoteController_renderIndex } from '@example/lib-intercom/routes/note/index';
import { NoteController_storeAdd } from '@example/lib-intercom/routes/note/create';
import { NoteController_actionDelete } from '@example/lib-intercom/routes/note/[id]/delete';
import React from 'react';
import { client } from './client/client';
import ContentLoader from './components/content-loader';

const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

type DayNotesProps = {
    date: string;
    setDate: (date: string) => void;
};

function DayNotes(props: DayNotesProps): JSX.Element {
    const { date, setDate } = props;
    const newTimeRef = React.useRef<HTMLInputElement>(null);
    const newNoteRef = React.useRef<HTMLInputElement>(null);

    const nextDate = () => {
        const currentDate = new Date(date);
        currentDate.setDate(currentDate.getDate() + 1);
        setDate(formatDate(currentDate));
    };

    const prevDate = () => {
        const currentDate = new Date(date);
        currentDate.setDate(currentDate.getDate() - 1);
        setDate(formatDate(currentDate));
    };

    const saveNewNote = async (showLoader: () => void, reload: () => void) => {
        const time = newTimeRef.current?.value;
        const note = newNoteRef.current?.value;
        if (time && note) {
            showLoader();

            const response = await client.call(NoteController_storeAdd, undefined, undefined, {
                date,
                time,
                note,
            });
            if (!response.success) {
                alert(response.error);
            }

            reload();
        }
    };

    const deleteNote = async (id: string, showLoader: () => void, reload: () => void) => {
        if (!confirm('Are you sure you want to delete?')) {
            return;
        }

        showLoader();

        const response = await client.call(NoteController_actionDelete, { noteId: id }, undefined, undefined);
        if (!response.success) {
            alert(response.error);
        }
        reload();
    };

    return (
        <>
            <div className="diary-day-header">
                <a onClick={() => prevDate()} className="diary-day-header__left">
                    <i className="fas fa-arrow-left" />
                    {'Previous date'}
                </a>

                <div className="diary-day-header__date">{date}</div>

                <a onClick={() => nextDate()} className="diary-day-header__right">
                    {'Next date'}
                    <i className="fas fa-arrow-right" />
                </a>
            </div>

            <ContentLoader
                defaultValue={date}
                load={() => {
                    return client.call(NoteController_renderIndex, undefined, { date }, undefined);
                }}
                render={(notes, showLoader, reload) => {
                    return (
                        <ul className="diary-day-body">
                            {notes.map(note => (
                                <li key={note.id} className="diary-day-body__item">
                                    <div className="diary-day-body__item-date">{formatTime(note.createdAt)}</div>
                                    <input
                                        className="diary-day-body__item-note"
                                        type="text"
                                        readOnly={true}
                                        value={note.note}
                                    />
                                    <button
                                        className="diary-day-body__item-button-delete"
                                        onClick={() => deleteNote(note.id, showLoader, reload)}
                                    >
                                        {'Delete note'}
                                    </button>
                                </li>
                            ))}
                            <li className="diary-day-body__new">
                                <input
                                    className="diary-day-body__new-time"
                                    ref={newTimeRef}
                                    type="time"
                                    placeholder={'Time'}
                                    defaultValue={formatTime(new Date())}
                                />
                                <input
                                    className="diary-day-body__new-note"
                                    ref={newNoteRef}
                                    type="text"
                                    placeholder={'New note'}
                                />
                                <button
                                    className="diary-day-body__new-button-add"
                                    onClick={() => saveNewNote(showLoader, reload)}
                                >
                                    {'Add note'}
                                </button>
                            </li>
                        </ul>
                    );
                }}
            />
        </>
    );
}

function App(): JSX.Element {
    const [date, setDate] = React.useState(formatDate(new Date()));

    return (
        <div className="app">
            <DayNotes date={date} setDate={setDate} />
        </div>
    );
}

export default App;
