<?php

use App\Models\Company;
use App\Models\Task;
use App\Models\User;
use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->company = Company::factory()->create(['name' => 'Acme Corp']);
    $this->user = User::factory()->for($this->company)->create();
});

it('renders the task index page with company tasks', function () {
    Task::factory()->count(3)->for($this->company)->create();

    actingAs($this->user)
        ->get(route('tasks.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Tasks/Index')
            ->has('tasks.data', 3)
            ->where('company.name', 'Acme Corp')
        );
});

it('renders the task create page', function () {
    actingAs($this->user)
        ->get(route('tasks.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Tasks/Create')
        );
});

it('creates a new task and redirects to index', function () {
    actingAs($this->user)
        ->post(route('tasks.store'), [
            'title' => 'New Feature Implementation',
            'description' => 'Detailed implementation steps',
            'status' => 'todo',
            'priority' => 'high',
            'due_date' => '2026-12-31',
        ])
        ->assertRedirect(route('tasks.index'))
        ->assertSessionHas('success');

    expect(Task::where('title', 'New Feature Implementation')->exists())->toBeTrue();
});

it('renders the task show page', function () {
    $task = Task::factory()->for($this->company)->create(['title' => 'Inspect System']);

    actingAs($this->user)
        ->get(route('tasks.show', $task))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Tasks/Show')
            ->where('task.title', 'Inspect System')
        );
});

it('renders the task edit page', function () {
    $task = Task::factory()->for($this->company)->create(['title' => 'Original Task']);

    actingAs($this->user)
        ->get(route('tasks.edit', $task))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Tasks/Edit')
            ->where('task.title', 'Original Task')
        );
});

it('updates an existing task and redirects to index', function () {
    $task = Task::factory()->for($this->company)->create([
        'title' => 'Original Task',
        'status' => 'todo',
    ]);

    actingAs($this->user)
        ->put(route('tasks.update', $task), [
            'title' => 'Updated Task Title',
            'status' => 'in_progress',
            'priority' => 'high',
        ])
        ->assertRedirect(route('tasks.index'))
        ->assertSessionHas('success');

    expect($task->fresh()->title)->toBe('Updated Task Title');
    expect($task->fresh()->status)->toBe('in_progress');
});

it('deletes a task and redirects to index', function () {
    $task = Task::factory()->for($this->company)->create();

    actingAs($this->user)
        ->delete(route('tasks.destroy', $task))
        ->assertRedirect(route('tasks.index'))
        ->assertSessionHas('success');

    expect(Task::find($task->id))->toBeNull();
});
