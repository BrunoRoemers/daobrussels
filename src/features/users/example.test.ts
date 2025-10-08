import { expect, test } from '@jest/globals';

import { Users } from '@/features/users/user-collection';

test('adds 1 + 2 to equal 3', () => {
  expect(Users.slug).toBe('users');
});
