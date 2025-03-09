import * as migration_20250309_140552 from './20250309_140552';

export const migrations = [
  {
    up: migration_20250309_140552.up,
    down: migration_20250309_140552.down,
    name: '20250309_140552'
  },
];
