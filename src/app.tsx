import { ChangeEvent, useState } from 'react'
import logo from './assets/logo-nlw-expert.svg'
import { NewNoteCard } from './components/new-note-card'
import { NoteCard } from './components/note-card'

interface Note {
    id: string
    date: Date
    content: string
}

export function App() {
    // observando uma informação que vem do input do usuário
    const [search, setSearch] = useState('')

    const [notes, setNotes] = useState<Note[]>(() => {
        const notesOnStorage = localStorage.getItem('notes')

        if (notesOnStorage) {
            return JSON.parse(notesOnStorage)
        }

        return []
    })

    function onNoteCreated(content: string) {
        const newNote = {
            id: crypto.randomUUID(),
            date: new Date(),
            content
        }

        const notesArray = [newNote, ...notes]

        setNotes(notesArray)

        localStorage.setItem('notes', JSON.stringify(notesArray))
    }

    function handleSearch(event: ChangeEvent<HTMLInputElement>) {
        const query = event.target.value

        setSearch(query)
    }

    function onNoteDeleted(id: string) {
        const allNotesUpdated = notes.filter((note) => {
            return note.id !== id
        })

        setNotes(allNotesUpdated)

        localStorage.setItem('notes', JSON.stringify(allNotesUpdated))
    }

    const filteredNotes =
        search !== ''
            ? notes.filter((note) =>
                  note.content
                      .toLocaleLowerCase()
                      .includes(search.toLocaleLowerCase())
              )
            : notes

    return (
        <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
            {' '}
            {/* adicionado padding 5 para melhorar o responsivo, em telas de no minimo 768px */}
            <h1 className="text-3xl font-bold underline">
                <img src={logo} alt="NLW Expert" />
                Hello world!
            </h1>
            <form className="w-full">
                <input
                    type="text"
                    placeholder="busque em suas notas"
                    className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
                    onChange={handleSearch}
                ></input>
            </form>
            <div className="h-px bg-slate-700" />
            <div className="grid auto-rows-[250px] gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <NewNoteCard onNoteCreated={onNoteCreated} />

                {filteredNotes.map((note) => {
                    return (
                        <NoteCard
                            key={note.id}
                            note={note}
                            onNoteDeleted={onNoteDeleted}
                        />
                    )
                })}
            </div>
        </div>
    )
}
