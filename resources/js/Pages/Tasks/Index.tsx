import React, { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Task, PaginatedData, TaskStatus, TaskPriority } from '@/types';
import StatusBadge from '@/Components/StatusBadge';
import PriorityBadge from '@/Components/PriorityBadge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';

interface Props {
    tasks: PaginatedData<Task>;
    filters: {
        status?: TaskStatus;
        priority?: TaskPriority;
    };
    company: {
        id: string;
        name: string;
    };
}

export default function Index({ tasks, filters, company }: Props) {
    const [searchQuery, setSearchQuery] = useState('');

    // Compute summary metrics from current dataset
    const metrics = useMemo(() => {
        const data = tasks.data;
        return {
            total: tasks.total,
            inProgress: data.filter((t) => t.status === 'in_progress').length,
            todo: data.filter((t) => t.status === 'todo').length,
            done: data.filter((t) => t.status === 'done').length,
            highPriority: data.filter((t) => t.priority === 'high').length,
        };
    }, [tasks]);

    // Client-side search filtering on current page
    const filteredTasks = useMemo(() => {
        if (!searchQuery.trim()) return tasks.data;
        const query = searchQuery.toLowerCase();
        return tasks.data.filter(
            (t) =>
                t.title.toLowerCase().includes(query) ||
                (t.description && t.description.toLowerCase().includes(query)) ||
                (t.user?.name && t.user.name.toLowerCase().includes(query))
        );
    }, [tasks.data, searchQuery]);

    const handleFilterChange = (key: string, value: string) => {
        router.get(
            route('tasks.index'),
            { ...filters, [key]: value || undefined },
            { preserveState: true, replace: true }
        );
    };

    const handleResetFilters = () => {
        setSearchQuery('');
        router.get(route('tasks.index'), {}, { preserveState: true, replace: true });
    };

    const handleDelete = (taskId: string, taskTitle: string) => {
        if (confirm(`Are you sure you want to delete "${taskTitle}"?`)) {
            router.delete(route('tasks.destroy', taskId), {
                preserveScroll: true,
            });
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'No due date';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Tasks Dashboard" />

            <div className="space-y-6">
                {/* Top Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Task Tracker
                        </h1>
                        <p className="text-sm text-slate-500 mt-0.5">
                            Workspace: <span className="font-semibold text-emerald-800">{company.name}</span>
                        </p>
                    </div>
                    <div>
                        <Link href={route('tasks.create')}>
                            <Button className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-sm">
                                + New Task
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Metric Summary Cards Grid */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {/* Total Tasks */}
                    <Card className="border border-slate-200 bg-white">
                        <CardContent className="p-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Total Tasks
                            </p>
                            <p className="mt-2 text-2xl font-extrabold text-slate-900">
                                {metrics.total}
                            </p>
                        </CardContent>
                    </Card>

                    {/* In Progress */}
                    <Card className="border border-amber-200 bg-amber-50/40">
                        <CardContent className="p-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
                                In Progress
                            </p>
                            <p className="mt-2 text-2xl font-extrabold text-amber-900">
                                {metrics.inProgress}
                            </p>
                        </CardContent>
                    </Card>

                    {/* To Do / Planning */}
                    <Card className="border border-blue-200 bg-blue-50/40">
                        <CardContent className="p-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
                                To Do
                            </p>
                            <p className="mt-2 text-2xl font-extrabold text-blue-900">
                                {metrics.todo}
                            </p>
                        </CardContent>
                    </Card>

                    {/* High Priority */}
                    <Card className="border border-rose-200 bg-rose-50/40">
                        <CardContent className="p-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-rose-700">
                                High Priority
                            </p>
                            <p className="mt-2 text-2xl font-extrabold text-rose-900">
                                {metrics.highPriority}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Completed */}
                    <Card className="border border-emerald-200 bg-emerald-50/40 col-span-2 sm:col-span-1 lg:col-span-1">
                        <CardContent className="p-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                                Completed
                            </p>
                            <p className="mt-2 text-2xl font-extrabold text-emerald-900">
                                {metrics.done}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filter and Search Bar */}
                <Card className="border border-slate-200 shadow-xs">
                    <CardContent className="p-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            {/* Search Input */}
                            <div className="flex-1 max-w-md">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search task title, description, assignee..."
                                    className="h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-sm shadow-xs placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                                />
                            </div>

                            {/* Dropdown Filters & Reset */}
                            <div className="flex flex-wrap items-center gap-3">
                                {/* Status Filter */}
                                <select
                                    value={filters.status || ''}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                    className="h-9 rounded-md border border-slate-300 bg-white px-3 py-1 text-sm text-slate-700 shadow-xs focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="todo">To Do</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="done">Done</option>
                                </select>

                                {/* Priority Filter */}
                                <select
                                    value={filters.priority || ''}
                                    onChange={(e) => handleFilterChange('priority', e.target.value)}
                                    className="h-9 rounded-md border border-slate-300 bg-white px-3 py-1 text-sm text-slate-700 shadow-xs focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                                >
                                    <option value="">All Priorities</option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>

                                {/* Reset Button */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleResetFilters}
                                    className="h-9 text-xs font-semibold text-slate-600 hover:text-slate-900"
                                >
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tasks Table Card */}
                <Card className="border border-slate-200 shadow-xs overflow-hidden">
                    <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-bold text-slate-900">
                                Tasks
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Showing {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/75">
                                    <TableHead className="w-16">ID</TableHead>
                                    <TableHead className="w-44">Assignee</TableHead>
                                    <TableHead>Task Title & Description</TableHead>
                                    <TableHead className="w-32">Status</TableHead>
                                    <TableHead className="w-28">Priority</TableHead>
                                    <TableHead className="w-36">Due Date</TableHead>
                                    <TableHead className="w-32 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTasks.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-32 text-center text-slate-500">
                                            No tasks found. Create a new task to get started!
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredTasks.map((task, index) => {
                                        const shortId = `#${task.id ? task.id.substring(0, 4) : index + 1}`;
                                        return (
                                            <TableRow key={task.id} className="hover:bg-slate-50/60">
                                                {/* ID */}
                                                <TableCell className="font-mono text-xs font-semibold text-slate-400">
                                                    {shortId}
                                                </TableCell>

                                                {/* Assignee */}
                                                <TableCell className="font-medium text-slate-800">
                                                    {task.user?.name || 'Unassigned'}
                                                </TableCell>

                                                {/* Title & Description */}
                                                <TableCell>
                                                    <div className="space-y-0.5">
                                                        <Link
                                                            href={route('tasks.show', task.id)}
                                                            className="font-bold text-slate-900 hover:text-emerald-700 transition-colors"
                                                        >
                                                            {task.title}
                                                        </Link>
                                                        {task.description && (
                                                            <p className="text-xs text-slate-500 line-clamp-1">
                                                                {task.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </TableCell>

                                                {/* Status Badge */}
                                                <TableCell>
                                                    <StatusBadge status={task.status} />
                                                </TableCell>

                                                {/* Priority Badge */}
                                                <TableCell>
                                                    <PriorityBadge priority={task.priority} />
                                                </TableCell>

                                                {/* Due Date */}
                                                <TableCell className="text-xs text-slate-600">
                                                    {formatDate(task.due_date)}
                                                </TableCell>

                                                {/* Actions */}
                                                <TableCell className="text-right">
                                                    <div className="inline-flex items-center justify-end space-x-2">
                                                        <Link
                                                            href={route('tasks.show', task.id)}
                                                            className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                                                        >
                                                            View
                                                        </Link>
                                                        <span className="text-slate-300">|</span>
                                                        <Link
                                                            href={route('tasks.edit', task.id)}
                                                            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <span className="text-slate-300">|</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(task.id, task.title)}
                                                            className="text-xs font-semibold text-rose-600 hover:text-rose-800"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {tasks.links && tasks.links.length > 3 && (
                        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 bg-slate-50/50">
                            <div className="text-xs text-slate-500">
                                Page {tasks.current_page} of {tasks.last_page} ({tasks.total} total)
                            </div>
                            <div className="flex space-x-1">
                                {tasks.links.map((link, idx) => {
                                    if (!link.url) {
                                        return (
                                            <span
                                                key={idx}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                className="px-3 py-1 text-xs text-slate-400 cursor-not-allowed border border-transparent"
                                            />
                                        );
                                    }
                                    return (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`px-3 py-1 text-xs rounded border transition-colors ${
                                                link.active
                                                    ? 'bg-emerald-700 border-emerald-700 text-white font-bold'
                                                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                            }`}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
