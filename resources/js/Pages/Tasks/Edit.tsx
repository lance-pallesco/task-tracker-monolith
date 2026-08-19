import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TaskForm from '@/Components/TaskForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import { Task } from '@/types';

interface EditProps {
    task: Task;
}

export default function Edit({ task }: EditProps) {
    return (
        <AuthenticatedLayout>
            <Head title={`Edit: ${task.title}`} />

            <div className="max-w-2xl mx-auto space-y-6">
                {/* Top Navigation / Breadcrumb */}
                <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider">
                    <Link
                        href={route('tasks.index')}
                        className="text-emerald-700 hover:text-emerald-800"
                    >
                        Tasks
                    </Link>
                    <span className="text-slate-400">/</span>
                    <span className="text-slate-500">Edit Task</span>
                </div>

                {/* Form Card */}
                <Card className="border border-slate-200 shadow-sm">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="text-xl font-bold text-slate-900">
                            Edit Task
                        </CardTitle>
                        <CardDescription>
                            Update the task title, description, status, priority, or due date.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <TaskForm task={task} mode="edit" />
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
