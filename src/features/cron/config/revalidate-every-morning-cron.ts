import { revalidatePath } from 'next/cache';
import type { Payload, TaskConfig } from 'payload';

export const taskSlug = 'revalidate-every-morning';
export const taskQueue = 'nightly';

export const revalidateEveryMorning: TaskConfig = {
  slug: taskSlug,
  handler: async ({ input, job, req }) => {
    console.log('revalidating the home page...');
    revalidatePath('/');

    console.log('scheduling job for tomorrow...');
    await queueJob(req.payload);

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

  await queueJob(payload);
};

const queueJob = async (payload: Payload) => {
  await payload.jobs.queue({
    queue: taskQueue,
    task: taskSlug,
    input: {},
  });
};
