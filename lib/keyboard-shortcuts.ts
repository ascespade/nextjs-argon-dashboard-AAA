// Keyboard shortcuts for the editor
export interface KeyboardShortcut {
    key: string;
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
    action: () => void;
    description: string;
}

export class KeyboardShortcutManager {
    private shortcuts: KeyboardShortcut[] = [];
    private isEnabled: boolean = true;

    constructor() {
        this.bindGlobalHandler();
    }

    // Add a keyboard shortcut
    addShortcut(shortcut: KeyboardShortcut) {
        this.shortcuts.push(shortcut);
    }

    // Remove a keyboard shortcut
    removeShortcut(key: string) {
        this.shortcuts = this.shortcuts.filter(s => s.key !== key);
    }

    // Enable/disable shortcuts
    setEnabled(enabled: boolean) {
        this.isEnabled = enabled;
    }

    // Bind global keydown handler
    private bindGlobalHandler() {
        document.addEventListener('keydown', (event) => {
            if (!this.isEnabled) return;

            // Don't trigger shortcuts when typing in input fields
            const target = event.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
                return;
            }

            this.handleKeydown(event);
        });
    }

    // Handle keydown event
    private handleKeydown(event: KeyboardEvent) {
        const matchingShortcut = this.shortcuts.find(shortcut => {
            return shortcut.key.toLowerCase() === event.key.toLowerCase() &&
                !!shortcut.ctrlKey === event.ctrlKey &&
                !!shortcut.shiftKey === event.shiftKey &&
                !!shortcut.altKey === event.altKey &&
                !!shortcut.metaKey === event.metaKey;
        });

        if (matchingShortcut) {
            event.preventDefault();
            matchingShortcut.action();
        }
    }

    // Get all shortcuts
    getShortcuts(): KeyboardShortcut[] {
        return [...this.shortcuts];
    }

    // Get shortcuts for help menu
    getShortcutsForHelp(): Array<{ keys: string, description: string }> {
        return this.shortcuts.map(shortcut => ({
            keys: this.formatShortcutKeys(shortcut),
            description: shortcut.description
        }));
    }

    // Format shortcut keys for display
    private formatShortcutKeys(shortcut: KeyboardShortcut): string {
        const parts: string[] = [];

        if (shortcut.ctrlKey) parts.push('Ctrl');
        if (shortcut.metaKey) parts.push('Cmd');
        if (shortcut.altKey) parts.push('Alt');
        if (shortcut.shiftKey) parts.push('Shift');
        parts.push(shortcut.key.toUpperCase());

        return parts.join(' + ');
    }

    // Cleanup
    destroy() {
        document.removeEventListener('keydown', this.handleKeydown);
    }
}

// Default editor shortcuts
export const createDefaultShortcuts = (
    onSave: () => void,
    onUndo: () => void,
    onRedo: () => void,
    onZoomIn: () => void,
    onZoomOut: () => void,
    onResetZoom: () => void,
    onToggleEditMode: () => void
): KeyboardShortcut[] => [
        {
            key: 's',
            ctrlKey: true,
            action: onSave,
            description: 'Save page'
        },
        {
            key: 'z',
            ctrlKey: true,
            action: onUndo,
            description: 'Undo'
        },
        {
            key: 'y',
            ctrlKey: true,
            action: onRedo,
            description: 'Redo'
        },
        {
            key: 'z',
            ctrlKey: true,
            shiftKey: true,
            action: onRedo,
            description: 'Redo (alternative)'
        },
        {
            key: '=',
            ctrlKey: true,
            action: onZoomIn,
            description: 'Zoom in'
        },
        {
            key: '-',
            ctrlKey: true,
            action: onZoomOut,
            description: 'Zoom out'
        },
        {
            key: '0',
            ctrlKey: true,
            action: onResetZoom,
            description: 'Reset zoom'
        },
        {
            key: 'e',
            ctrlKey: true,
            action: onToggleEditMode,
            description: 'Toggle edit mode'
        }
    ];
