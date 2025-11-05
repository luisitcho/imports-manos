// app/admin/page.tsx
'use client';
import React from 'react';

type Product = {
    _id?: string;
    name: string;
    description?: string;
    price: number;
    images: string[];
    stock: number;
    active: boolean;
    category?: string;
};

export default function AdminPage() {
    const [products, setProducts] = React.useState<Product[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [form, setForm] = React.useState<Product>({
        name: '',
        description: '',
        price: 0,
        images: [],
        stock: 0,
        active: true,
        category: '',
    });
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const [msg, setMsg] = React.useState('');

    const load = async () => {
        setLoading(true);
        const res = await fetch('/api/products', { cache: 'no-store' });
        const data = await res.json();
        setProducts(data);
        setLoading(false);
    };

    React.useEffect(() => { load(); }, []);

    const resetForm = () => {
        setForm({ name: '', description: '', price: 0, images: [], stock: 0, active: true, category: '' });
        setEditingId(null);
    };

    const save = async () => {
        setMsg('');
        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `/api/products/${editingId}` : '/api/products';
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });
        if (res.ok) {
            await load();
            resetForm();
            setMsg('Salvo com sucesso.');
        } else {
            setMsg('Erro ao salvar.');
        }
    };

    const edit = (p: Product) => {
        setForm({ ...p });
        setEditingId(p._id!);
    };

    const del = async (id: string) => {
        if (!confirm('Excluir este produto?')) return;
        const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        if (res.ok) {
            await load();
            setMsg('Excluído.');
        } else {
            setMsg('Erro ao excluir.');
        }
    };

    const onUpload = async (file: File) => {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (res.ok && data.url) {
            setForm((f) => ({ ...f, images: [...(f.images || []), data.url] }));
        } else {
            alert('Falha no upload');
        }
    };

    return (
        <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Admin • Produtos</h1>
                <form onSubmit={async (e) => { e.preventDefault(); await fetch('/api/auth/logout', { method: 'POST' }); location.href = '/login'; }}>
                    <button type="submit">Sair</button>
                </form>
            </div>

            <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8, marginBottom: 16 }}>
                <h2>{editingId ? 'Editar Produto' : 'Novo Produto'}</h2>
                <div style={{ display: 'grid', gap: 8 }}>
                    <input placeholder="Nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    <textarea placeholder="Descrição" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                    <input placeholder="Preço" type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
                    <input placeholder="Estoque" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} />
                    <input placeholder="Categoria" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
                    <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} />
                        Ativo
                    </label>

                    <div>
                        <strong>Imagens:</strong>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                            {form.images?.map((url, i) => (
                                <div key={i} style={{ position: 'relative' }}>
                                    <img src={url} alt="img" width={100} height={100} style={{ objectFit: 'cover', border: '1px solid #eee' }} />
                                    <button type="button" onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }))}
                                        style={{ position: 'absolute', top: 0, right: 0 }}>
                                        x
                                    </button>
                                </div>
                            ))}
                        </div>
                        <input type="file" accept="image/*" onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) onUpload(file);
                        }} />
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={save}>{editingId ? 'Salvar alterações' : 'Criar produto'}</button>
                        {editingId && <button onClick={resetForm} type="button">Cancelar</button>}
                    </div>
                    {msg && <div style={{ color: 'green' }}>{msg}</div>}
                </div>
            </div>

            <h2>Lista</h2>
            {loading ? <div>Carregando...</div> : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Nome</th>
                            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Preço</th>
                            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>Estoque</th>
                            <th style={{ borderBottom: '1px solid #ccc' }}>Imagens</th>
                            <th style={{ borderBottom: '1px solid #ccc' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p._id}>
                                <td style={{ borderBottom: '1px solid #eee' }}>{p.name}</td>
                                <td style={{ borderBottom: '1px solid #eee' }}>R$ {p.price.toFixed(2)}</td>
                                <td style={{ borderBottom: '1px solid #eee' }}>{p.stock}</td>
                                <td style={{ borderBottom: '1px solid #eee' }}>
                                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                                        {p.images?.slice(0, 3).map((url, i) => (
                                            <img key={i} src={url} width={40} height={40} style={{ objectFit: 'cover', border: '1px solid #eee' }} />
                                        ))}
                                    </div>
                                </td>
                                <td style={{ borderBottom: '1px solid #eee', textAlign: 'center' }}>
                                    <button onClick={() => edit(p)}>Editar</button>{' '}
                                    <button onClick={() => del(p._id!)}>Excluir</button>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr><td colSpan={5} style={{ padding: 12, textAlign: 'center', color: '#777' }}>Nenhum produto</td></tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}