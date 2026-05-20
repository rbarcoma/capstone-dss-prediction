import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { User } from '@/types';
import { router, useForm, usePage } from '@inertiajs/react';
import { KeyRound, Pencil, ShieldCheck, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

type RbacRole = {
    label: string;
    scope: string;
};

type RbacModule = {
    key: string;
    label: string;
};

export default function Users({
    users = [],
    roles,
    modules,
}: {
    users: User[];
    roles: Record<string, RbacRole>;
    modules: Record<string, RbacModule[]>;
}) {
    const { flash, auth } = usePage().props as any;

    const [openAddModal, setOpenAddModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteError, setDeleteError] = useState('');

    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    const [itemsPerPage, setItemsPerPage] = useState(10);
    const latestUserId = users[0]?.id;
    const defaultUserPermissions = modules.user?.map((item) => item.key) ?? [];

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
        permissions: defaultUserPermissions,
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
        permissions: defaultUserPermissions,
    });

    const moduleLabel = (key: string) => {
        return Object.values(modules)
            .flat()
            .find((module) => module.key === key)?.label ?? key;
    };

    const moduleOptionsForRole = (role: string) => modules[role] ?? [];

    const defaultPermissionsForRole = (role: string) => {
        return moduleOptionsForRole(role).map((module) => module.key);
    };

    const togglePermission = (
        permission: string,
        permissions: string[],
        update: (value: string[]) => void,
    ) => {
        update(
            permissions.includes(permission)
                ? permissions.filter((item) => item !== permission)
                : [...permissions, permission],
        );
    };

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const userName = user.name?.toLowerCase() ?? '';
            const userEmail = user.email?.toLowerCase() ?? '';
            const createdAt = new Date(user.created_at).toLocaleString().toLowerCase();
            const role = user.role ?? 'user';
            const roleDetails = roles[role];
            const permissions = user.permissions ?? defaultPermissionsForRole(role);
            const roleText = [
                roleDetails?.label,
                roleDetails?.scope,
                ...permissions.map(moduleLabel),
            ]
                .join(' ')
                .toLowerCase();

            const matchesSearch =
                userName.includes(search.toLowerCase()) ||
                userEmail.includes(search.toLowerCase()) ||
                createdAt.includes(search.toLowerCase()) ||
                roleText.includes(search.toLowerCase());

            const matchesRole =
                roleFilter === 'all' || user.role === roleFilter;

            return matchesSearch && matchesRole;
        });
    }, [users, roles, search, roleFilter, modules]);

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
        setEditData(
            'permissions',
            user.permissions ?? defaultPermissionsForRole(user.role ?? 'user'),
        );

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
        setDeleteError('');
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
                setDeleteError('');
            },
            onError: (errors) => {
                setDeleteError(errors.password ?? 'Unable to delete user.');
            },
        });
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">RBAC</h1>
                    <p className="text-sm text-muted-foreground">
                        Role-based access control for system users and permissions.
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

            <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(roles).map(([key, role]) => (
                    <Card key={key} className="rounded-lg">
                        <CardHeader className="flex-row items-center justify-between gap-3 pb-2">
                            <div>
                                <CardTitle>{role.label} Role</CardTitle>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {role.scope}
                                </p>
                            </div>
                            {key === 'admin' ? (
                                <ShieldCheck className="size-5 text-emerald-600" />
                            ) : (
                                <KeyRound className="size-5 text-emerald-600" />
                            )}
                        </CardHeader>
                        <CardContent>
                            <ul className="grid gap-2 text-sm text-muted-foreground">
                                {moduleOptionsForRole(key).map((module) => (
                                    <li key={module.key} className="flex gap-2">
                                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        <span>{module.label}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="rounded-lg">
                <CardHeader>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <CardTitle>RBAC Table</CardTitle>

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
                                {Object.entries(roles).map(([key, role]) => (
                                    <option key={key} value={key}>
                                        {role.label}
                                    </option>
                                ))}
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
                                <th className="px-3 py-3 font-semibold">Access Scope</th>
                                <th className="px-3 py-3 font-semibold">Permissions</th>
                                <th className="px-3 py-3 font-semibold">Created At</th>
                                <th className="px-3 py-3 text-right font-semibold">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedUsers.length > 0 ? (
                                paginatedUsers.map((user) => {
                                    const role = roles[user.role ?? 'user'];
                                    const permissions =
                                        user.permissions ??
                                        defaultPermissionsForRole(user.role ?? 'user');
                                    const isLatestUser = user.id === latestUserId;

                                    return (
                                        <tr
                                            key={user.id}
                                            className={`border-b ${isLatestUser ? 'bg-emerald-50 font-bold' : ''}`}
                                        >
                                            <td className="px-3 py-2">{user.name}</td>
                                            <td className="px-3 py-2">{user.email}</td>
                                            <td className="px-3 py-2">
                                                {role?.label ?? user.role}
                                            </td>
                                            <td className="px-3 py-2">
                                                {role?.scope ?? 'Custom access'}
                                            </td>
                                            <td className="px-3 py-2">
                                                {permissions.map(moduleLabel).join(', ')}
                                            </td>
                                            <td className="px-3 py-2">
                                                {new Date(user.created_at).toLocaleString()}
                                            </td>
                                            <td className="px-3 py-2">
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
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={7}
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
                            Showing {paginatedUsers.length} of {filteredUsers.length} RBAC assignments
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
                                <h2 className="text-xl font-semibold">Add RBAC User</h2>
                                <p className="text-sm text-muted-foreground">
                                    Create an account and assign its system role.
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
                            <div className="grid gap-2">
                                <label className="text-sm font-medium" htmlFor="rbac-add-name">
                                    Name
                                </label>
                                <Input
                                    id="rbac-add-name"
                                    placeholder="Enter full name"
                                    value={data.name}
                                    onChange={(event) =>
                                        setData('name', event.target.value)
                                    }
                                />
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium" htmlFor="rbac-add-email">
                                    Email
                                </label>
                                <Input
                                    id="rbac-add-email"
                                    placeholder="Enter email address"
                                    type="email"
                                    value={data.email}
                                    onChange={(event) =>
                                        setData('email', event.target.value)
                                    }
                                />
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium" htmlFor="rbac-add-role">
                                    Role
                                </label>
                                <select
                                    id="rbac-add-role"
                                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                    value={data.role}
                                    onChange={(event) => {
                                        const role = event.target.value;
                                        setData('role', role);
                                        setData('permissions', defaultPermissionsForRole(role));
                                    }}
                                >
                                    {Object.entries(roles).map(([key, role]) => (
                                        <option key={key} value={key}>
                                            {role.label} - {role.scope}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="rounded-2xl border border-slate-200 p-4">
                                <p className="font-medium">Module Permissions</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Select only the modules this account can access.
                                </p>

                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                    {moduleOptionsForRole(data.role).map((module) => (
                                        <label
                                            key={module.key}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={data.permissions.includes(module.key)}
                                                onChange={() =>
                                                    togglePermission(
                                                        module.key,
                                                        data.permissions,
                                                        (value) => setData('permissions', value),
                                                    )
                                                }
                                            />
                                            <span>{module.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium" htmlFor="rbac-add-password">
                                    Password
                                </label>
                                <Input
                                    id="rbac-add-password"
                                    placeholder="Enter password"
                                    type="password"
                                    value={data.password}
                                    onChange={(event) =>
                                        setData('password', event.target.value)
                                    }
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpenAddModal(false)}
                                >
                                    Cancel
                                </Button>

                                <Button disabled={processing}>
                                    {processing ? 'Adding...' : 'Create Assignment'}
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
                                    Update the user account and assigned role.
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
                            <div className="grid gap-2">
                                <label className="text-sm font-medium" htmlFor="rbac-edit-name">
                                    Name
                                </label>
                                <Input
                                    id="rbac-edit-name"
                                    placeholder="Enter full name"
                                    value={editData.name}
                                    onChange={(event) =>
                                        setEditData('name', event.target.value)
                                    }
                                />
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium" htmlFor="rbac-edit-email">
                                    Email
                                </label>
                                <Input
                                    id="rbac-edit-email"
                                    placeholder="Enter email address"
                                    type="email"
                                    value={editData.email}
                                    onChange={(event) =>
                                        setEditData('email', event.target.value)
                                    }
                                />
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium" htmlFor="rbac-edit-role">
                                    Role
                                </label>
                                <select
                                    id="rbac-edit-role"
                                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                                    value={editData.role}
                                    onChange={(event) => {
                                        const role = event.target.value;
                                        setEditData('role', role);
                                        setEditData('permissions', defaultPermissionsForRole(role));
                                    }}
                                >
                                    {Object.entries(roles).map(([key, role]) => (
                                        <option key={key} value={key}>
                                            {role.label} - {role.scope}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="rounded-2xl border border-slate-200 p-4">
                                <p className="font-medium">Module Permissions</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Select only the modules this account can access.
                                </p>

                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                    {moduleOptionsForRole(editData.role).map((module) => (
                                        <label
                                            key={module.key}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={editData.permissions.includes(module.key)}
                                                disabled={
                                                    selectedUser.id === auth.user.id &&
                                                    module.key === 'admin.rbac'
                                                }
                                                onChange={() =>
                                                    togglePermission(
                                                        module.key,
                                                        editData.permissions,
                                                        (value) => setEditData('permissions', value),
                                                    )
                                                }
                                            />
                                            <span>{module.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

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
                                    {updating ? 'Updating...' : 'Update Assignment'}
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
                                    setDeleteError('');
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
                                onChange={(event) => {
                                    setDeletePassword(event.target.value);
                                    setDeleteError('');
                                }}
                            />
                            {deleteError && (
                                <p className="mt-2 text-sm text-red-600">{deleteError}</p>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setOpenDeleteModal(false);
                                    setSelectedUser(null);
                                    setDeletePassword('');
                                    setDeleteError('');
                                }}
                            >
                                Cancel
                            </Button>

                            <Button
                                variant="destructive"
                                disabled={!deletePassword}
                                onClick={confirmDelete}
                            >
                                Delete Assignment
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
