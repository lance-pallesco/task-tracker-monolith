<?php

use App\Models\Company;
use App\Models\Task;
use App\Models\User;
use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->companyA = Company::factory()->create(['name' => 'Acme Corp']);
    $this->companyB = Company::factory()->create(['name' => 'Globex Inc']);

    $this->userA = User::factory()->for($this->companyA)->create();
    $this->userB = User::factory()->for($this->companyB)->create();
});

it('scopes the task index to only tasks belonging to the user company', function () {
    Task::factory()->for($this->companyA)->create(['title' => 'Company A Secret Task']);
    Task::factory()->for($this->companyB)->create(['title' => 'Company B Secret Task']);

    actingAs($this->userA)
        ->get(route('tasks.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Tasks/Index')
            ->has('tasks.data', 1)
            ->where('tasks.data.0.title', 'Company A Secret Task')
        );
});

it('forbids a user from viewing another company task', function () {
    $taskB = Task::factory()->for($this->companyB)->create();

    actingAs($this->userA)
        ->get(route('tasks.show', $taskB))
        ->assertForbidden();
});

it('forbids a user from updating another company task', function () {
    $taskB = Task::factory()->for($this->companyB)->create();

    actingAs($this->userA)
        ->put(route('tasks.update', $taskB), [
            'title' => 'Hacked Task Title',
            'status' => 'done',
            'priority' => 'high',
        ])
        ->assertForbidden();

    expect($taskB->fresh()->title)->not->toBe('Hacked Task Title');
});

it('forbids a user from deleting another company task', function () {
    $taskB = Task::factory()->for($this->companyB)->create();

    actingAs($this->userA)
        ->delete(route('tasks.destroy', $taskB))
        ->assertForbidden();

    expect(Task::find($taskB->id))->not->toBeNull();
});

it('automatically binds created tasks to the authenticated user company', function () {
    actingAs($this->userA)
        ->post(route('tasks.store'), [
            'title' => 'Brand New Task',
            'description' => 'Important task details',
            'status' => 'todo',
            'priority' => 'high',
        ])
        ->assertRedirect(route('tasks.index'));

    $createdTask = Task::where('title', 'Brand New Task')->first();
    expect($createdTask)->not->toBeNull();
    expect($createdTask->company_id)->toBe($this->companyA->id);
    expect($createdTask->user_id)->toBe($this->userA->id);
});
