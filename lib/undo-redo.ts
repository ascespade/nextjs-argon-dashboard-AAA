// Enhanced undo/redo functionality
export interface HistoryState {
  components: any[];
  timestamp: number;
  action: string;
}

export class UndoRedoManager {
  private history: HistoryState[] = [];
  private currentIndex: number = -1;
  private maxHistorySize: number = 50;

  constructor(maxSize: number = 50) {
    this.maxHistorySize = maxSize;
  }

  // Add new state to history
  addState(components: any[], action: string = 'edit') {
    const newState: HistoryState = {
      components: JSON.parse(JSON.stringify(components)), // Deep clone
      timestamp: Date.now(),
      action,
    };

    // Remove any states after current index
    this.history = this.history.slice(0, this.currentIndex + 1);

    // Add new state
    this.history.push(newState);
    this.currentIndex++;

    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
      this.currentIndex--;
    }
  }

  // Undo to previous state
  undo(): any[] | null {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.history[this.currentIndex].components;
    }
    return null;
  }

  // Redo to next state
  redo(): any[] | null {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      return this.history[this.currentIndex].components;
    }
    return null;
  }

  // Check if undo is possible
  canUndo(): boolean {
    return this.currentIndex > 0;
  }

  // Check if redo is possible
  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  // Get current state
  getCurrentState(): any[] | null {
    if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
      return this.history[this.currentIndex].components;
    }
    return null;
  }

  // Get history info
  getHistoryInfo() {
    return {
      currentIndex: this.currentIndex,
      totalStates: this.history.length,
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
      lastAction: this.history[this.currentIndex]?.action || null,
    };
  }

  // Clear history
  clear() {
    this.history = [];
    this.currentIndex = -1;
  }

  // Get history for debugging
  getHistory() {
    return this.history.map((state, index) => ({
      index,
      action: state.action,
      timestamp: state.timestamp,
      isCurrent: index === this.currentIndex,
    }));
  }
}
