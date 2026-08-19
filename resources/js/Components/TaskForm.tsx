import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Task, TaskPriority, TaskStatus } from '@/types';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import InputError from '@/Components/InputError';

interface TaskFormProps {
    task?: Task;
    mode: 'create' | 'edit';
}

export default function TaskForm({ task, mode }: TaskFormProps) {
    const isEdit = mode === 'edit';

    const { data, setData, post, put, processing, errors } = useForm({
        title: task?.title || '',
        description: task?.description || '',
        status: (task?.status || 'todo') as TaskStatus,
        priority: (task?.priority || 'medium') as TaskPriority,
        due_date: task?.due_date ? task.due_date.substring(0, 10) : '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && task) {
            put(route('tasks.update', task.id));
        } else {
            post(route('tasks.store'));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                    id="title"
                    name="title"
                    type="text"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="Enter task title"
                    className="w-full"
                    required
                />
                <InputError message={errors.title} className="mt-1" />
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Provide additional details or context for this task..."
                    rows={4}
                    className="w-full"
                />
                <InputError message={errors.description} className="mt-1" />
            </div>

            {/* Grid for Status, Priority, Due Date */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {/* Status */}
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                        id="status"
                        name="status"
                        value={data.status}
                        onChange={(e) => setData('status', e.target.value as TaskStatus)}
                        className="flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-sm shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                    <InputError message={errors.status} className="mt-1" />
                </div>

                {/* Priority */}
                <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <select
                        id="priority"
                        name="priority"
                        value={data.priority}
                        onChange={(e) => setData('priority', e.target.value as TaskPriority)}
                        className="flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-sm shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    <InputError message={errors.priority} className="mt-1" />
                </div>

                {/* Due Date */}
                <div className="space-y-2">
                    <Label htmlFor="due_date">Due Date</Label>
                    <Input
                        id="due_date"
                        name="due_date"
                        type="date"
                        value={data.due_date}
                        onChange={(e) => setData('due_date', e.target.value)}
                        className="w-full"
                    />
                    <InputError message={errors.due_date} className="mt-1" />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <Link href={route('tasks.index')}>
                    <Button type="button" variant="outline">
                        Cancel
                    </Button>
                </Link>
                <Button type="submit" disabled={processing} className="bg-emerald-700 hover:bg-emerald-800 text-white">
                    {processing ? 'Saving...' : isEdit ? 'Update Task' : 'Create Task'}
                </Button>
            </div>
        </form>
    );
}
