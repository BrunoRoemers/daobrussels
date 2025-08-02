import * as migration_20250802_154157_baseline from './20250802_154157_baseline';

export const migrations = [
  {
    up: migration_20250802_154157_baseline.up,
    down: migration_20250802_154157_baseline.down,
    name: '20250802_154157_baseline'
  },
];
