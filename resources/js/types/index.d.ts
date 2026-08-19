export interface Company {
    id: string;
    name: string;
    slug?: string;
    created_at?: string;
    updated_at?: string;
}

export interface User {
    id: string;
    company_id?: string;
    name: string;
    email: string;
    email_verified_at?: string;
    company?: Company;
}

export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
    id: string;
    company_id: string;
    user_id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    due_date: string | null;
    created_at: string;
    updated_at: string;
    user?: Pick<User, 'id' | 'name' | 'email'>;
    company?: Pick<Company, 'id' | 'name'>;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    flash?: {
        success?: string;
        error?: string;
    };
};
