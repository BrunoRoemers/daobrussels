import { getId } from '@/features/shared/local-api/get-id';
import type { PodAtEvent } from '@/payload-types';
import type { FieldHook, TextField } from 'payload';

type CompositeTitle = () => TextField;

// inspiration: https://github.com/payloadcms/payload/discussions/3257#discussioncomment-9252121
export const compositeTitle: CompositeTitle = () => {
  // TODO client side component that keeps the title in sync with the pod and event
  return {
    name: 'title',
    type: 'text',
    virtual: 'pod.title',
    hidden: true,
    hooks: {
      afterRead: [generateValue],
    },
  };
};

const generateValue: FieldHook<PodAtEvent, string, unknown> = async ({ req, data, value }) => {
  const podId = getId(data?.pod);
  const eventId = getId(data?.event);

  if (!podId || !eventId) {
    // FIXME(Bruno): keep the logging until this method stops being flaky.
    console.warn(`Using fallback (${value}) for pod_at_event:`, data);
    return value ?? '';
  }

  // FIXME(Bruno): keep the logging until this method stops being flaky.
  console.log('data: ', data);
  console.log('event type: ', typeof data?.event);
  const pod = await req.payload.findByID({ id: podId, collection: 'pods', depth: 0 });
  const event = await req.payload.findByID({ id: eventId, collection: 'events', depth: 0 });

  return `${pod?.title} at ${event?.title}`;
};
