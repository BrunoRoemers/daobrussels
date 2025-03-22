import * as migration_20250309_140552 from './20250309_140552';
import * as migration_20250322_212201_add_pods_to_events from './20250322_212201_add_pods_to_events';

export const migrations = [
  {
    up: migration_20250309_140552.up,
    down: migration_20250309_140552.down,
    name: '20250309_140552',
  },
  {
    up: migration_20250322_212201_add_pods_to_events.up,
    down: migration_20250322_212201_add_pods_to_events.down,
    name: '20250322_212201_add_pods_to_events'
  },
];
