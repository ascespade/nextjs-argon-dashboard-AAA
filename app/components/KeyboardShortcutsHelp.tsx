'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';

interface KeyboardShortcutsHelpProps {
    shortcuts: Array<{ keys: string; description: string }>;
    isOpen: boolean;
    onClose: () => void;
}

export default function KeyboardShortcutsHelp({ shortcuts, isOpen, onClose }: KeyboardShortcutsHelpProps) {
    const { t } = useI18n();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

                <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {t('editor.keyboard_shortcuts', 'Keyboard Shortcuts')}
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {shortcuts.map((shortcut, index) => (
                                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                                    <span className="text-sm text-gray-600 dark:text-gray-300">
                                        {shortcut.description}
                                    </span>
                                    <div className="flex items-center space-x-1">
                                        {shortcut.keys.split(' + ').map((key, keyIndex) => (
                                            <React.Fragment key={keyIndex}>
                                                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                                                    {key}
                                                </kbd>
                                                {keyIndex < shortcut.keys.split(' + ').length - 1 && (
                                                    <span className="text-gray-400">+</span>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {t('editor.shortcuts_tip', 'Press Escape to close this dialog')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
