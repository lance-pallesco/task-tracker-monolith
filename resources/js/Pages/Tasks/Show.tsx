import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Task } from '@/types';
import StatusBadge from '@/Components/StatusBadge';
import PriorityBadge from '@/Components/PriorityBadge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';

interface ShowProps {
    task: Task;
}

export default function Show({ task }: ShowProps) {
    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
            router.delete(route('tasks.destroy', task.id));
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'None specified';
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

    const formatTimestamp = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return dateString;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Task: ${task.title}`} />

            <div className="max-w-3xl mx-auto space-y-6">
                {/* Top Breadcrumb & Back Link */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider">
                        <Link
                            href={route('tasks.index')}
                            className="text-emerald-700 hover:text-emerald-800"
                        >
                            Tasks
                        </Link>
                        <span className="text-slate-400">/</span>
                        <span className="text-slate-500">Details</span>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Link href={route('tasks.edit', task.id)}>
                            <Button variant="outline" size="sm">
                                Edit Task
                            </Button>
                        </Link>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </div>
                </div>

                {/* Main Card */}
                <Card className="border border-slate-200 shadow-sm">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-2xl font-bold text-slate-900">
                                    {task.title}
                                </CardTitle>
                                <p className="text-xs font-mono text-slate-400">
                                    ID: {task.id}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <StatusBadge status={task.status} />
                                <PriorityBadge priority={task.priority} />
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-6 space-y-6">
                        {/* Description */}
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                                Description
                            </h4>
                            <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                                {task.description || (
                                    <span className="text-slate-400 italic">
                                        No description provided.
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-4 border-t border-slate-100">
                            {/* Due Date */}
                            <div className="bg-white border border-slate-200 rounded-lg p-3">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                                    Due Date
                                </span>
                                <span className="text-sm font-semibold text-slate-800">
                                    {formatDate(task.due_date)}
                                </span>
                            </div>

                            {/* Assignee / Creator */}
                            <div className="bg-white border border-slate-200 rounded-lg p-3">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                                    Assigned To / Created By
                                </span>
                                <span className="text-sm font-semibold text-slate-800 block">
                                    {task.user?.name || 'Unassigned'}
                                </span>
                                {task.user?.email && (
                                    <span className="text-xs text-slate-500">
                                        {task.user.email}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Audit Timestamps */}
                        <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 flex flex-col sm:flex-row sm:justify-between gap-1">
                            <span>Created: {formatTimestamp(task.created_at)}</span>
                            <span>Last Updated: {formatTimestamp(task.updated_at)}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
