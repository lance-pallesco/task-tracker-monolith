<?php

namespace App\Services;

use App\Models\Task;
use Illuminate\Pagination\LengthAwarePaginator;

class TaskService
{
    /**
     * Create a new class instance.
     */
    public function listTasksForCompany(string $companyId, array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        return Task::forCompany($companyId)
            ->with('user:id,name,email')
            ->when($filters['status'] ?? null, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($filters['priority'] ?? null, function ($query, $priority) {
                $query->where('priority', $priority);
            })
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    public function createTask(array $tenantData): Task
    {
        return Task::create($tenantData);
    }

    public function updateTask(Task $task, array $data): Task
    {
        $task->update($data);
        return $task;
    }
  
    public function deleteTask(Task $task): bool
    {
        return $task->delete();
    }
}
