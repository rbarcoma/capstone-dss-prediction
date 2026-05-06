import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { User } from '@/types';
import { router, useForm, usePage } from '@inertiajs/react';

export default function Users({ users = [] }: { users: User[] }) {
    const { flash } = usePage().props as any;
    const { data, setData, post, processing, reset } = useForm({ name: '', email: '', role: 'user', password: '' });
    return (
        <div className="space-y-6 p-6">
            <div><h1 className="text-2xl font-semibold">User Management</h1><p className="text-sm text-muted-foreground">Create users, assign roles, and manage access.</p></div>
            {flash?.success && <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{flash.success}</div>}
            <Card className="rounded-lg"><CardHeader><CardTitle>Add User</CardTitle></CardHeader><CardContent><form className="grid gap-3 md:grid-cols-5" onSubmit={(event) => { event.preventDefault(); post('/admin/users', { onSuccess: () => reset() }); }}><Input placeholder="Name" value={data.name} onChange={(event) => setData('name', event.target.value)} /><Input placeholder="Email" value={data.email} onChange={(event) => setData('email', event.target.value)} /><select className="rounded-md border bg-background px-3 py-2 text-sm" value={data.role} onChange={(event) => setData('role', event.target.value)}><option value="user">User</option><option value="admin">Admin</option></select><Input placeholder="Password" type="password" value={data.password} onChange={(event) => setData('password', event.target.value)} /><Button disabled={processing}>Add</Button></form></CardContent></Card>
            <Card className="rounded-lg"><CardHeader><CardTitle>Users</CardTitle></CardHeader><CardContent className="overflow-x-auto"><table className="w-full text-sm"><tbody>{users.map((user) => <tr key={user.id} className="border-b"><td className="py-2">{user.name}</td><td>{user.email}</td><td>{user.role}</td><td className="text-right"><Button variant="destructive" size="sm" onClick={() => router.delete(`/admin/users/${user.id}`)}>Delete</Button></td></tr>)}</tbody></table></CardContent></Card>
        </div>
    );
}
