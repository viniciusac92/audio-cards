import logo from './assets/logo-nlw-expert.svg';
import { NewNoteCard } from './components/new-note-card';
import { NoteCard } from './components/note-card';

const note = {
    date: new Date(),
    content: 'hello world'
};

export function App() {
    return (
        <div className="mx-auto max-w-6xl my-12 space-y-6">
            <h1 className="text-3xl font-bold underline">
                <img src={logo} alt="NLW Expert" />
                Hello world!
            </h1>

            <form className="w-full">
                <input
                    type="text"
                    placeholder="busque em suas notas"
                    className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
                ></input>
            </form>

            <div className="h-px bg-slate-700" />

            <div className="grid grid-cols-3 auto-rows-[250px] gap-6">
                <NewNoteCard />
                <NoteCard note={note} />
                <NoteCard note={note} />
                <NoteCard note={note} />
                <NoteCard note={note} />
                <NoteCard note={note} />
                <NoteCard note={note} />
                <NoteCard note={note} />
            </div>
        </div>
    );
}
