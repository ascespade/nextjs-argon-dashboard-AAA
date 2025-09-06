// Auto-save functionality for the editor
export class AutoSaveManager {
  private saveTimeout: NodeJS.Timeout | null = null;
  private lastSaveTime: number = 0;
  private isSaving: boolean = false;
  private saveInterval: number = 30000; // 30 seconds

  constructor(
    private saveFunction: () => Promise<void>,
    private onSaveStart?: () => void,
    private onSaveComplete?: () => void,
    private onSaveError?: (error: Error) => void
  ) {}

  // Trigger auto-save
  triggerSave() {
    if (this.isSaving) return;

    // Clear existing timeout
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    // Set new timeout
    this.saveTimeout = setTimeout(async () => {
      await this.performSave();
    }, this.saveInterval);
  }

  // Perform the actual save
  private async performSave() {
    if (this.isSaving) return;

    this.isSaving = true;
    this.onSaveStart?.();

    try {
      await this.saveFunction();
      this.lastSaveTime = Date.now();
      this.onSaveComplete?.();
    } catch (error) {
      this.onSaveError?.(error as Error);
    } finally {
      this.isSaving = false;
    }
  }

  // Force immediate save
  async forceSave() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    await this.performSave();
  }

  // Get last save time
  getLastSaveTime(): number {
    return this.lastSaveTime;
  }

  // Check if currently saving
  isCurrentlySaving(): boolean {
    return this.isSaving;
  }

  // Update save interval
  setSaveInterval(interval: number) {
    this.saveInterval = interval;
  }

  // Cleanup
  destroy() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
  }
}
