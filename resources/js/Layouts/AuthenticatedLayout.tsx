import React, { PropsWithChildren, ReactNode, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import Dropdown from '@/Components/Dropdown';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const page = usePage<PageProps>();
    const user = page.props.auth.user;
    const flash = page.props.flash;
    const company = user.company;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Top Navigation Bar */}
            <nav className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <div className="flex items-center space-x-6">
                            {/* App Title & Workspace Badge */}
                            <Link href={route('tasks.index')} className="flex items-center space-x-3">
                                <div className="h-8 w-8 rounded-lg bg-emerald-700 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                                    TT
                                </div>
                                <div className="leading-tight">
                                    <span className="font-bold text-base text-slate-900 block">
                                        Task Tracker
                                    </span>
                                    {company?.name && (
                                        <span className="text-xs text-slate-500 font-medium">
                                            {company.name}
                                        </span>
                                    )}
                                </div>
                            </Link>

                            <div className="hidden sm:flex sm:space-x-4 border-l border-slate-200 pl-6 h-6 items-center">
                                <Link
                                    href={route('tasks.index')}
                                    className={`text-sm font-medium transition-colors ${
                                        route().current('tasks.*')
                                            ? 'text-emerald-700 font-semibold'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    Tasks
                                </Link>
                            </div>
                        </div>

                        {/* User Menu */}
                        <div className="hidden sm:flex sm:items-center sm:space-x-3">
                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                                        >
                                            <span>{user.name}</span>
                                            <span className="text-[10px] text-slate-400 font-semibold">▼</span>
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content align="right" width="48">
                                        <div className="px-4 py-2 border-b border-slate-100 text-xs text-slate-500">
                                            Signed in as <span className="font-semibold text-slate-700 block">{user.email}</span>
                                        </div>
                                        <Dropdown.Link href={route('profile.edit')}>
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (prev) => !prev
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none text-xs font-semibold uppercase border border-slate-200"
                            >
                                {showingNavigationDropdown ? 'Close' : 'Menu'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {showingNavigationDropdown && (
                    <div className="border-t border-slate-200 bg-white px-4 py-3 sm:hidden space-y-2">
                        <div className="pb-2 border-b border-slate-100">
                            <div className="text-sm font-semibold text-slate-800">
                                {user.name}
                            </div>
                            <div className="text-xs text-slate-500">
                                {user.email}
                            </div>
                        </div>
                        <Link
                            href={route('tasks.index')}
                            className="block text-sm py-1 font-medium text-slate-700 hover:text-emerald-700"
                        >
                            Tasks
                        </Link>
                        <Link
                            href={route('profile.edit')}
                            className="block text-sm py-1 font-medium text-slate-700 hover:text-emerald-700"
                        >
                            Profile
                        </Link>
                        <Link
                            method="post"
                            href={route('logout')}
                            as="button"
                            className="block w-full text-left text-sm py-1 font-medium text-rose-600 hover:text-rose-800"
                        >
                            Log Out
                        </Link>
                    </div>
                )}
            </nav>

            {/* Flash Messages */}
            {flash?.success && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                    <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-800 font-medium flex items-center justify-between">
                        <span>{flash.success}</span>
                    </div>
                </div>
            )}
            {flash?.error && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                    <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-800 font-medium flex items-center justify-between">
                        <span>{flash.error}</span>
                    </div>
                </div>
            )}

            {/* Optional Header */}
            {header && (
                <div className="bg-white border-b border-slate-200 py-6">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
