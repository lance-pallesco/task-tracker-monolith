import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TaskForm from '@/Components/TaskForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';

export default function Create() {
    return (
        <AuthenticatedLayout>
            <Head title="Create Task" />

            <div className="max-w-2xl mx-auto space-y-6">
                {/* Top Navigation / Breadcrumb */}
                <div>
                    <Link
                        href={route('tasks.index')}
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 uppercase tracking-wider"
                    >
                        Back to Tasks
                    </Link>
                </div>

                {/* Form Card */}
                <Card className="border border-slate-200 shadow-sm">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <CardTitle className="text-xl font-bold text-slate-900">
                            Create New Task
                        </CardTitle>
                        <CardDescription>
                            Fill in the details below to add a new task to your company workspace.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <TaskForm mode="create" />
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
