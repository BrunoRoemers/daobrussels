import * as migration_20250309_140552 from './20250309_140552';
import * as migration_20250322_212201_add_pods_to_events from './20250322_212201_add_pods_to_events';
import * as migration_20250323_001109_remove_posts_and_categories from './20250323_001109_remove_posts_and_categories';
import * as migration_20250326_214608_bring_blocks_back from './20250326_214608_bring_blocks_back';
import * as migration_20250409_002239_user_roles from './20250409_002239_user_roles';
import * as migration_20250410_222642_description_for_pod_at_event from './20250410_222642_description_for_pod_at_event';
import * as migration_20250713_170606_simplify_media_collection from './20250713_170606_simplify_media_collection';
import * as migration_20250715_220041_add_task_queue from './20250715_220041_add_task_queue';

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
    name: '20250326_214608_bring_blocks_back',
  },
  {
    up: migration_20250409_002239_user_roles.up,
    down: migration_20250409_002239_user_roles.down,
    name: '20250409_002239_user_roles',
  },
  {
    up: migration_20250410_222642_description_for_pod_at_event.up,
    down: migration_20250410_222642_description_for_pod_at_event.down,
    name: '20250410_222642_description_for_pod_at_event',
  },
  {
    up: migration_20250713_170606_simplify_media_collection.up,
    down: migration_20250713_170606_simplify_media_collection.down,
    name: '20250713_170606_simplify_media_collection',
  },
  {
    up: migration_20250715_220041_add_task_queue.up,
    down: migration_20250715_220041_add_task_queue.down,
    name: '20250715_220041_add_task_queue'
  },
];
