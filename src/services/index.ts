/**
 * Services - Core application services
 * Exports business logic and system services
 */

export { audioManager, WebAudioManager, NativeAudioManager } from './AudioManager';
export { audioService, AudioService } from './AudioService';
export {
  StorageManager,
  createStorageManager,
  generatePresetId,
  formatDuration,
  formatDate,
} from './StorageManager';
export { storageService, StorageService } from './StorageService';
