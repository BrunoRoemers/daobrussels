import type { TaskConfig } from 'payload';

export const revalidateEveryMorning: TaskConfig = {
  slug: 'revalidate-every-morning',
  handler: async ({ input, job, req }) => {
    console.log('Revalidate every morning TODO');

    return {
      output: null,
    };
  },
};
