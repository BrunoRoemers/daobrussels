import * as migration_20250309_140552 from './20250309_140552';
import * as migration_20250322_212201_add_pods_to_events from './20250322_212201_add_pods_to_events';
import * as migration_20250323_001109_remove_posts_and_categories from './20250323_001109_remove_posts_and_categories';
import * as migration_20250326_214608_bring_blocks_back from './20250326_214608_bring_blocks_back';

export const migrations = [
  {
    up: migration_20250309_140552.up,
    down: migration_20250309_140552.down,
    name: '20250309_140552',
  },
  {
    up: migration_20250322_212201_add_pods_to_events.up,
    down: migration_20250322_212201_add_pods_to_events.down,
    name: '20250322_212201_add_pods_to_events',
  },
  {
    up: migration_20250323_001109_remove_posts_and_categories.up,
    down: migration_20250323_001109_remove_posts_and_categories.down,
    name: '20250323_001109_remove_posts_and_categories',
  },
  {
    up: migration_20250326_214608_bring_blocks_back.up,
    down: migration_20250326_214608_bring_blocks_back.down,
    name: '20250326_214608_bring_blocks_back'
  },
];
