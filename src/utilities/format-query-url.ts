import type { SelectType, Where } from 'payload';
import { stringify } from 'qs-esm';

export const formatQueryUrl = (
  url: string,
  query: { where?: Where; select?: SelectType },
): string => `${url}?${stringify(query)}`;
