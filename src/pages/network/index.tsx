import { FormEvent, useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { Input } from "../../components/Input";

import { db } from "../../services/firebaseConnection";
import { 
    setDoc, // Criar um Item em um documento que é digitado
    doc, 
    getDoc  // Buscar uma vez um único documento
} from "firebase/firestore";


export function Network(){
    const [facebook, setFacebook] = useState('')
    const [instagram, setInstagram] = useState('')
    const [linkedin, setLinkedin] = useState('')

    useEffect(() => {
        function loadLinks(){
            const docRef = doc(db, 'social', 'link')
            getDoc(docRef)
            .then((snapshot) => {
                if(snapshot.data() !== undefined){
                    setFacebook(snapshot.data()?.facebook)
                    setInstagram(snapshot.data()?.instagram)
                    setLinkedin(snapshot.data()?.linkedin)
                }
            })
        }

        loadLinks()
    }, [])

    function handleRegister(e: FormEvent){
        e.preventDefault()

        setDoc(doc(db, 'social', 'link'), {
          facebook: facebook,
          instagram: instagram,
          linkedin: linkedin  
        })
        .then(()=>{
            console.log('Cadastrado')
        })
        .catch((error) => {
            console.log('Erro' + error)
        })
    }


    return(
        <div className="flex items-center flex-col min-h-screen pb-7 px-2">
            <Header />

            <h1 className="text-white text-2xl font-medium mt-8 mb-4">Minhas redes</h1>
       
            <form className="flex flex-col max-w-xl w-full" onSubmit={handleRegister}>
                <label className="text-white font-medium mt-2 mb-3">Link do Facebook</label>
                <Input
                placeholder="Insira a URL..."
                type='url'
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                 />

                <label className="text-white font-medium mt-2 mb-3">Link do Instagram</label>
                <Input
                value={instagram}
                placeholder="Insira a URL..."
                type='url'
                onChange={(e) => setInstagram(e.target.value)}
                 />

                <label className="text-white font-medium mt-2 mb-3">Link do Linkedin</label>
                <Input
                value={linkedin}
                placeholder="Insira a URL..."
                type='url'
                onChange={(e) => setLinkedin(e.target.value)}
                 />

                 <button type="submit"
                 className="text-white bg-blue-600 rounded-md h-9 items-center justify-center flex mb-7 mt-4 font-medium"
                 >
                    Salvar Links
                 </button>

            </form>
        
       
       
        </div>
    )
}