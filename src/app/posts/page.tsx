"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

type Post = {
    id: string;
    texto: string;
    imagem: string;
    criadoEm: string;
};

export default function PostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        async function carregar() {
            const snap = await getDocs(collection(db, "posts"));
            const dados = snap.docs.map(doc => ({
                id: doc.id,
                ...(doc.data() as Omit<Post, "id">),
            }));
            setPosts(dados);
        }
        carregar();
    }, []);

    return (
        <div style={{ padding: 40 }}>
            <h1>Posts</h1>

            {posts.length === 0 && <p>Nenhum post enviado ainda.</p>}

            {posts.map((post) => (
                <div key={post.id} style={{ marginBottom: 30 }}>
                    <img
                        src={post.imagem}
                        alt={post.texto}
                        style={{ width: 200, borderRadius: 8 }}
                    />
                    <p>{post.texto}</p>
                    <small>{new Date(post.criadoEm).toLocaleString()}</small>
                </div>
            ))}
        </div>
    );
}
