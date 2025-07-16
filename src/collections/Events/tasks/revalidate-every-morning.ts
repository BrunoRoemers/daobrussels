import type { Payload, TaskConfig } from 'payload';

export const taskSlug = 'revalidate-every-morning';
export const taskQueue = 'nightly';

export const revalidateEveryMorning: TaskConfig = {
  slug: taskSlug,
  handler: async ({ input, job, req }) => {
    console.log('Revalidate every morning TODO');

    return {
      output: null,
    };
  },
};

export const bootstrapRevalidateEveryMorning = async (payload: Payload) => {
  const { totalDocs } = await payload.count({
    collection: 'payload-jobs',
    where: {
      taskSlug: {
        equals: taskSlug,
      },
      queue: {
        equals: taskQueue,
      },
    },
  });

  if (totalDocs > 0) {
    return;
  }

  await payload.jobs.queue({
    queue: taskQueue,
    task: taskSlug,
    input: {},
  });
};
