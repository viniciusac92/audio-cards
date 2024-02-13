import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner'

interface NewNoteCardProps {
    onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard(props: NewNoteCardProps) {
    const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
    const [content, setContent] = useState('')
    const [isRecording, setIsRecording] = useState(false)

    function handleStartEditor() {
        setShouldShowOnboarding(false)
    }

    function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
        setContent(event.target.value)

        if (event.target.value === '') {
            setShouldShowOnboarding(true)
        }
    }

    function handleSaveNote(event: FormEvent) {
        event.preventDefault() // prevenir o comportamento padrão do form submit do html de mudança de tela

        if (content === '') {
            return
        }

        // chamo a função de dentro do app passando por parâmetro o valor de content (state)
        props.onNoteCreated(content)

        // apos setar o valor para a nota criada, limpa o valor do state
        setContent('')
        setShouldShowOnboarding(true)

        toast.success('Nota criada com sucesso!')
    }

    function handleStartRecording() {
        /** verifica se as propriedades SpeechRecognition e webkitSpeechRecognition existem no 
        objeto window, referente ao browser que esta rodando a aplicacao */
        const isSpeechRecognitionAPIAvailable =
            'SpeechRecognition' in window || 'webkitSpeechRecognition' in window

        if (!isSpeechRecognitionAPIAvailable) {
            alert('navegador sem suporte para gravação')
            return
        }

        setIsRecording(true)
        setShouldShowOnboarding(false)

        const SpeechRecognitionAPI =
            window.SpeechRecognition || window.webkitSpeechRecognition

        speechRecognition = new SpeechRecognitionAPI()

        speechRecognition.lang = 'pt-BR'
        speechRecognition.continuous = true // não pare de gravar
        speechRecognition.maxAlternatives = 1 // dentre as varias alternativas que retorne apenas 1
        speechRecognition.interimResults = true // a api deve continuar trazendo resultados conforme será falado

        speechRecognition.onresult = (event) => {
            const transcription = Array.from(event.results).reduce(
                (text, result) => {
                    // text é a string q inicia, e result é cada item do result
                    return text.concat(result[0].transcript)
                },
                'fala do usuario >>> ' // valor que inicia o reduce, nesse caso uma string
            )

            setContent(transcription) // atualiza o conteudo da textarea com a transcricao
        }
        speechRecognition.onerror = (event) => {
            console.error(event)
        }

        speechRecognition.start()
    }

    function handleStopRecording() {
        setIsRecording(false)

        if (speechRecognition !== null) {
            speechRecognition.stop()
        }
    }

    return (
        <Dialog.Root>
            <Dialog.Trigger className="rounded-md text-left flex flex-col bg-slate-700 p-5 gap-3 hover:ring-2 hover:ring-slate-600 focus:ring-2 focus:ring-lime-400 outline-none">
                <span className="text-sm font-medium text-slate-300">
                    Adicionar nota
                </span>
                <p className="text-sm leading-6 text-slate-400">
                    Grave uma nota em áudio que será convertida para texto
                    automaticamente.
                </p>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="inset-0 fixed bg-black/50" />
                <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-0 md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
                    <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
                        <X className="w-5 h-5" />
                    </Dialog.Close>

                    <form className="flex-1 flex flex-col ">
                        <div className="flex flex-1 flex-col gap-3 p-5">
                            <span className="text-sm font-medium text-slate-300">
                                Adicionar nota
                            </span>
                            {shouldShowOnboarding ? (
                                <p className="text-sm leading-6 text-slate-400">
                                    Comece{' '}
                                    <button
                                        onClick={handleStartRecording}
                                        className="font-medium text-lime-400 hover:underline"
                                        type="button"
                                    >
                                        gravando uma nota
                                    </button>{' '}
                                    em áudio ou se preferir{' '}
                                    <button
                                        onClick={handleStartEditor}
                                        className="font-medium text-lime-400 hover:underline"
                                        type="button"
                                    >
                                        utilize apenas texto
                                    </button>
                                    .
                                </p>
                            ) : (
                                <textarea
                                    autoFocus
                                    className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                                    onChange={handleContentChanged}
                                    value={content} // sempre com o seu valor da textarea refletindo o valor do state denominado como content
                                />
                            )}
                        </div>

                        {isRecording ? (
                            <button
                                type="button"
                                onClick={handleStopRecording}
                                className="w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-sm text-stale-300 outline-none font-medium hover:bg-slate-100"
                            >
                                <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                                Gravando .. (clique para pausar)
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSaveNote}
                                className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
                            >
                                Salvar nota
                            </button>
                        )}
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
