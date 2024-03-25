import { Header } from "../../components/Header"
import { Input } from "../../components/Input"
import { FormEvent, useState, useEffect } from "react"
import { FiTrash } from "react-icons/fi"
import { db } from "../../services/firebaseConnection"
import { 
    addDoc, // Adicionar um Documento dentro de uma Coleção (gera um ID aleatorio)
    collection, // A collection tem que ser o mesmo nome da coleção do banco de dados (no caso, 'links')
    onSnapshot, // Algo em tempo real, um listener (observer)
    query, // Busca personalizada
    orderBy, // Ordenação, usando o campo 'created' que no caso é o new Date, ordem de data
    doc, //
    deleteDoc //
} from "firebase/firestore"

interface LinkProps{
    id: string;
    name: string;
    url: string;
    bg: string;
    color: string;
}

export function Admin(){
    const [nameInput, setNameInput] = useState('')
    const [urlInput, setUrlInput] = useState('')
    const [textColorinput, setTextColorinput] = useState('#F1F1F1')
    const [bgColorinput, setBgColorinput] = useState("#121212")

    const [links, setLinks] = useState<LinkProps[]>([])

    useEffect(() => {
        const linksRef = collection(db, 'links')
        const queryRef = query(linksRef, orderBy('created', 'asc'))

        const unsub = onSnapshot(queryRef, (snapshot) => {
            let lista = [] as LinkProps[]
            snapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    name: doc.data().name,
                    url: doc.data().url,
                    bg: doc.data().bg,
                    color: doc.data().color
                })
            })
            setLinks(lista)
        }) 

        return () => {
            unsub()
        }

    }, [])

    function handleRegister(e: FormEvent){
        e.preventDefault()

        if(nameInput === '' || urlInput === '') {
            alert('Preencha todos os campos')
            return
        }

      addDoc(collection(db, 'links'), {
            name: nameInput,
            url: urlInput,
            bg: bgColorinput,
            color: textColorinput,
            created: new Date()
        })
        .then(() =>{
            setNameInput('')
            setUrlInput('')
            console.log('Cadastrado com sucesso')
        })
        .catch((error) => {
            console.log('Erro ao cadastrar' + error)
        })
    }

    async function handleDelete(id: string){
        const docRef = doc(db, 'links', id)
        await deleteDoc(docRef)
    }

    
    return(
        <div className="flex items-center flex-col min-h-screen pb-7 px-2">
            <Header />

            <form className="flex flex-col mt-8 mb-3 w-full max-w-xl" onSubmit={handleRegister}>
                <label className="text-white font-medium mt-2 mb-2">Nome do Elemento</label>
                <Input
                placeholder="Defina um nome"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                />

                <label className="text-white font-medium mt-2 mb-2">URL do Link</label>
                <Input
                type='url'
                placeholder="Insira a URL"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                />  
                
                {nameInput !== '' && (
                    <div className="mt-5 flex items-center justify-center flex-col mb-7 p-1 pb-5 border-gray-100/25 border rounded-md">
                    <label className="text-white font-medium mt-2 mb-3">Preview:</label>
                    <article
                    className="w-11/12 max-w-lg flex flex-col items-center justify-between rounded px-1 py-3"
                    style={{ marginBottom: 8, marginTop: 8, backgroundColor: bgColorinput}}
                    >
                        <p className="font-medium" style={{color: textColorinput}}>{nameInput}</p>
                    </article>
                    </div>
                )}

                <section className="flex my-4 gap-5">
                    <div className="flex gap-3 items-center">
                    <label className="text-white font-medium mt-2 mb-2">Cor do Texto</label>
                    <input
                    type='color'
                    value={textColorinput}
                    onChange={(e) => setTextColorinput(e.target.value)}
                    />
                    </div>

                    <div className="flex gap-3 items-center">
                    <label className="text-white font-medium mt-2 mb-2">Background</label>
                    <input
                    type='color'
                    value={bgColorinput}
                    onChange={(e) => setBgColorinput(e.target.value)}
                    />
                    </div>
                </section>

                <button type="submit" className="mb-7 bg-blue-600 h-9 rounded-md text-white font-medium gap-4 flex justify-center items-center">
                    Cadastrar
                </button>
            </form>

            <h2 className="font-bold text-white mb-4 text-2xl">
                Links Cadastrados
            </h2>

            {links.map( (link) => (
            <article 
            key={link.id}
            className="flex items-center justify-between w-11/12 max-w-xl rounded py-3 px-2 mb-2 select-none"
            style={{ backgroundColor: link.bg, color: link.color}}
            >
                <p>{link.name}</p>
                <div>
                    <button
                    onClick={() => handleDelete(link.id)}
                    className="border border-dashed p-1.5 rounded bg-neutral-900"
                    >
                        <FiTrash size={18} color="#FFF" />
                    </button>
                </div>
            </article>
            ))}
        </div>
    )
}