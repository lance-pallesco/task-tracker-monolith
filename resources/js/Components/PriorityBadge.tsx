import React from 'react';
import { Badge } from '@/Components/ui/badge';
import { TaskPriority } from '@/types';

interface PriorityBadgeProps {
    priority: TaskPriority;
    className?: string;
}

const priorityConfig: Record<TaskPriority, { label: string; variant: 'low' | 'medium' | 'high' }> = {
    low: {
        label: 'Low',
        variant: 'low',
    },
    medium: {
        label: 'Medium',
        variant: 'medium',
    },
    high: {
        label: 'High',
        variant: 'high',
    },
};

export default function PriorityBadge({ priority, className }: PriorityBadgeProps) {
    const config = priorityConfig[priority] || {
        label: priority,
        variant: 'medium',
    };

    return (
        <Badge variant={config.variant} className={className}>
            {config.label}
        </Badge>
    );
}
