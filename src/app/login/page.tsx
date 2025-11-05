// app/login/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('admin@admin.com');
    const [password, setPassword] = useState('admin123');
    const [error, setError] = useState('');
    const router = useRouter();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        if (res.ok) {
            router.push('/admin');
        } else {
            const data = await res.json();
            setError(data.error || 'Falha no login');
        }
    };

    return (
        <div style={{ maxWidth: 360, margin: '60px auto', fontFamily: 'sans-serif' }}>
            <h1>Login</h1>
            <form onSubmit={onSubmit}>
                <label>Email</label>
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" required
                    style={{ width: '100%', marginBottom: 8 }} />
                <label>Senha</label>
                <input value={password} onChange={e => setPassword(e.target.value)} type="password" required
                    style={{ width: '100%', marginBottom: 8 }} />
                {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
}