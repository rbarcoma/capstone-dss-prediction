import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { User } from '@/types';
import { router, useForm, usePage } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';


export default function Users({ users = [] }: { users: User[] }) {
    const { flash, auth } = usePage().props as any;

    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [deletePassword, setDeletePassword] = useState('');

    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    const [itemsPerPage, setItemsPerPage] = useState(10);

    const {
        data,
        setData,
        post,
        processing,
        reset,
    } = useForm({
        name: '',
        email: '',
        role: 'user',
        password: '',
    });

    const {
        data: editData,
        setData: setEditData,
        put,
        processing: updating,
        reset: resetEdit,
    } = useForm({
        name: '',
        email: '',
        role: 'user',
    });

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const userName = user.name?.toLowerCase() ?? '';
            const userEmail = user.email?.toLowerCase() ?? '';

            const matchesSearch =
                userName.includes(search.toLowerCase()) ||
                userEmail.includes(search.toLowerCase());

            const matchesRole =
                roleFilter === 'all' || user.role === roleFilter;

            return matchesSearch && matchesRole;
        });
    }, [users, search, roleFilter]);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    const submitUser = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post('/admin/users', {
            onSuccess: () => {
                reset();
                setOpenAddModal(false);
            },
        });
    };

    const openEditUser = (user: User) => {
        setSelectedUser(user);

        setEditData('name', user.name ?? '');
        setEditData('email', user.email ?? '');
        setEditData('role', user.role ?? 'user');

        setOpenEditModal(true);
    };

    const updateUser = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedUser) return;

        put(`/admin/users/${selectedUser.id}`, {
            onSuccess: () => {
                resetEdit();
                setSelectedUser(null);
                setOpenEditModal(false);
            },
        });
    };

    const openDeleteConfirmation = (user: User) => {
        setSelectedUser(user);
        setDeletePassword('');
        setOpenDeleteModal(true);
    };

    const confirmDelete = () => {
        if (!selectedUser) return;

        router.delete(`/admin/users/${selectedUser.id}`, {
            data: {
                password: deletePassword,
            },
            onSuccess: () => {
                setOpenDeleteModal(false);
                setSelectedUser(null);
                setDeletePassword('');
            },
        });
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">User Management</h1>
                    <p className="text-sm text-muted-foreground">
                        Create users, assign roles, and manage access.
                    </p>
                </div>

                <Button onClick={() => setOpenAddModal(true)}>+ Add User</Button>
            </div>

            {flash?.success && (
                <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
                    {flash.success}
                </div>
            )}

            {flash?.error && (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                    {flash.error}
                </div>
            )}

            <Card className="rounded-lg">
                <CardHeader>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <CardTitle>Users Table</CardTitle>

                        <div className="flex flex-col gap-2 md:flex-row">
                            <Input
                                className="w-full md:w-64"
                                placeholder="Search name or email..."
                                value={search}
                                onChange={(event) => {
                                    setSearch(event.target.value);
                                    setCurrentPage(1);
                                }}
                            />

                            <select
                                className="rounded-md border bg-background px-3 py-2 text-sm"
                                value={roleFilter}
                                onChange={(event) => {
                                    setRoleFilter(event.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="all">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                            </select>

                            <select
                                className="rounded-md border bg-background px-3 py-2 text-sm"
                                value={itemsPerPage}
                                onChange={(event) => {
                                    setItemsPerPage(Number(event.target.value));
                                    setCurrentPage(1);
                                }}
                            >
                                <option value={10}>10</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/40 text-left">
                                <th className="px-3 py-3 font-semibold">Name</th>
                                <th className="px-3 py-3 font-semibold">Email</th>
                                <th className="px-3 py-3 font-semibold">Role</th>
                                <th className="px-3 py-3 text-right font-semibold">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedUsers.length > 0 ? (
                                paginatedUsers.map((user) => (
                                    <tr key={user.id} className="border-b">
                                        <td className="px-3 py-1">{user.name}</td>
                                        <td className="px-3 py-1">{user.email}</td>
                                        <td className="px-3 py-1 capitalize">
                                            {user.role}
                                        </td>
                                        <td className="px-3 py-1">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => openEditUser(user)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>

                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    disabled={user.id === auth.user.id}
                                                    onClick={() => openDeleteConfirmation(user)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-3 py-8 text-center text-muted-foreground"
                                    >
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {paginatedUsers.length} of {filteredUsers.length} users
                        </p>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                Previous
                            </Button>

                            <span className="text-sm">
                                Page {currentPage} of {totalPages || 1}
                            </span>

                            <Button
                                variant="outline"
                                size="sm"
                                disabled={
                                    currentPage === totalPages || totalPages === 0
                                }
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {openAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold">Add User</h2>
                                <p className="text-sm text-muted-foreground">
                                    Fill in the details to create a new user.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setOpenAddModal(false)}
                                className="rounded-md px-2 py-1 text-xl text-gray-500 hover:bg-gray-100"
                            >
                                ×
                            </button>
                        </div>

                        <form className="space-y-4" onSubmit={submitUser}>
                            <Input
                                placeholder="Name"
                                value={data.name}
                                onChange={(event) =>
                                    setData('name', event.target.value)
                                }
                            />

                            <Input
                                placeholder="Email"
                                type="email"
                                value={data.email}
                                onChange={(event) =>
                                    setData('email', event.target.value)
                                }
                            />

                            <select
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                value={data.role}
                                onChange={(event) =>
                                    setData('role', event.target.value)
                                }
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>

                            <Input
                                placeholder="Password"
                                type="password"
                                value={data.password}
                                onChange={(event) =>
                                    setData('password', event.target.value)
                                }
                            />

                            <div className="flex justify-end gap-2 pt-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpenAddModal(false)}
                                >
                                    Cancel
                                </Button>

                                <Button disabled={processing}>
                                    {processing ? 'Adding...' : 'Add User'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {openEditModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold">Edit User</h2>
                                <p className="text-sm text-muted-foreground">
                                    Update user information.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setOpenEditModal(false);
                                    setSelectedUser(null);
                                }}
                                className="rounded-md px-2 py-1 text-xl text-gray-500 hover:bg-gray-100"
                            >
                                ×
                            </button>
                        </div>

                        <form className="space-y-4" onSubmit={updateUser}>
                            <Input
                                placeholder="Name"
                                value={editData.name}
                                onChange={(event) =>
                                    setEditData('name', event.target.value)
                                }
                            />

                            <Input
                                placeholder="Email"
                                type="email"
                                value={editData.email}
                                onChange={(event) =>
                                    setEditData('email', event.target.value)
                                }
                            />

                            <select
                                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                value={editData.role}
                                onChange={(event) =>
                                    setEditData('role', event.target.value)
                                }
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>

                            <div className="flex justify-end gap-2 pt-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setOpenEditModal(false);
                                        setSelectedUser(null);
                                    }}
                                >
                                    Cancel
                                </Button>

                                <Button disabled={updating}>
                                    {updating ? 'Updating...' : 'Update User'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {openDeleteModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                        <div className="mb-5 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-red-600">
                                Confirm Delete
                            </h2>

                            <button
                                type="button"
                                onClick={() => {
                                    setOpenDeleteModal(false);
                                    setSelectedUser(null);
                                    setDeletePassword('');
                                }}
                                className="rounded-md px-2 py-1 text-xl text-gray-500 hover:bg-gray-100"
                            >
                                ×
                            </button>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            Are you sure you want to delete{' '}
                            <span className="font-semibold text-black">
                                {selectedUser.email}
                            </span>
                            ? Enter your password to confirm.
                        </p>

                        <div className="mt-5">
                            <Input
                                type="password"
                                placeholder="Enter your password"
                                value={deletePassword}
                                onChange={(event) =>
                                    setDeletePassword(event.target.value)
                                }
                            />
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setOpenDeleteModal(false);
                                    setSelectedUser(null);
                                    setDeletePassword('');
                                }}
                            >
                                Cancel
                            </Button>

                            <Button
                                variant="destructive"
                                disabled={!deletePassword}
                                onClick={confirmDelete}
                            >
                                Delete User
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}








