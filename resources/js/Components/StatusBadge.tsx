import React from 'react';
import { Badge } from '@/Components/ui/badge';
import { TaskStatus } from '@/types';

interface StatusBadgeProps {
    status: TaskStatus;
    className?: string;
}

const statusConfig: Record<TaskStatus, { label: string; variant: 'todo' | 'in_progress' | 'done' }> = {
    todo: {
        label: 'To Do',
        variant: 'todo',
    },
    in_progress: {
        label: 'In Progress',
        variant: 'in_progress',
    },
    done: {
        label: 'Done',
        variant: 'done',
    },
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
    const config = statusConfig[status] || {
        label: status,
        variant: 'todo',
    };

    return (
        <Badge variant={config.variant} className={className}>
            {config.label}
        </Badge>
    );
}
