"use client";

import { useState } from "react";
import { db, storage } from "@/app/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [texto, setTexto] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    async function enviar() {
        if (!file) return alert("Selecione uma imagem!");
        setLoading(true);

        try {
            const storageRef = ref(storage, `uploads/${Date.now()}-${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);

            await addDoc(collection(db, "posts"), {
                texto,
                imagem: url,
                criadoEm: new Date().toISOString()
            });

            setTexto("");
            setFile(null);
            alert("Enviado!");
        } catch {
            alert("Erro ao enviar 😢");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ padding: 40 }}>
            <h1>Upload de Arquivo</h1>

            <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />

            <br /><br />

            <input
                type="text"
                placeholder="Texto descritivo"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
            />

            <br /><br />

            <button onClick={enviar} disabled={loading}>
                {loading ? "Enviando..." : "Enviar"}
            </button>
        </div>
    );
}
