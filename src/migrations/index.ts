import * as migration_20250802_154157_baseline from './20250802_154157_baseline';
import * as migration_20251026_155604_support_frontend_media_uploads from './20251026_155604_support_frontend_media_uploads';
import * as migration_20251104_222137_update_pods_at_events_title from './20251104_222137_update_pods_at_events_title';
import * as migration_20251104_230409_undo_remove_pods_at_events_title from './20251104_230409_undo_remove_pods_at_events_title';

export const migrations = [
  {
    up: migration_20250802_154157_baseline.up,
    down: migration_20250802_154157_baseline.down,
    name: '20250802_154157_baseline',
  },
  {
    up: migration_20251026_155604_support_frontend_media_uploads.up,
    down: migration_20251026_155604_support_frontend_media_uploads.down,
    name: '20251026_155604_support_frontend_media_uploads',
  },
  {
    up: migration_20251104_222137_update_pods_at_events_title.up,
    down: migration_20251104_222137_update_pods_at_events_title.down,
    name: '20251104_222137_update_pods_at_events_title',
  },
  {
    up: migration_20251104_230409_undo_remove_pods_at_events_title.up,
    down: migration_20251104_230409_undo_remove_pods_at_events_title.down,
    name: '20251104_230409_undo_remove_pods_at_events_title'
  },
];
