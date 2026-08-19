<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Models\Task;
use App\Services\TaskService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    public function __construct(
        protected TaskService $taskService
    ) {
        $this->authorizeResource(Task::class, 'task');
    }

    public function index(Request $request): Response
    {
        //
        $user = $request->user();
        $filters = $request->only(['status', 'priority']);

        $tasks = $this->taskService->listTasksForCompany($user->company_id, $filters, 10);

        return inertia('Tasks/Index', [
            'tasks' => $tasks,
            'filters' => $filters,
            'company' => $user->company->only(['id', 'name']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        //
        return Inertia::render('Tasks/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request): RedirectResponse
    {
        $this->taskService->createTask($request->tenantData());
                return redirect()->route('tasks.index')
                    ->with('success', 'Task created successfully.');
    }


    /**
     * Display the specified resource.
     */
    public function show(Task $task): Response
    {
        //
        $task->load('user:id,name,email');
        return Inertia::render('Tasks/Show', [
            'task' => $task,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task): Response
    {
        //
        return Inertia::render('Tasks/Edit', [
            'task' => $task,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task): RedirectResponse
    {
        //
        $this->taskService->updateTask($task, $request->validated());
        return redirect()->route('tasks.index')
            ->with('success', 'Task updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task): RedirectResponse
    {
        //
        $this->taskService->deleteTask($task);

        return redirect()->route('tasks.index')
            ->with('success', 'Task deleted successfully.');
    }
}
