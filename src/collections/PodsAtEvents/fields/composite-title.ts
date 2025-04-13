import type { FieldHook, TextField } from 'payload';

type CompositeTitle = () => TextField;

// inspiration: https://github.com/payloadcms/payload/discussions/3257#discussioncomment-9252121
export const compositeTitle: CompositeTitle = () => {
  // TODO client side component that keeps the title in sync with the pod and event
  return {
    name: 'title',
    type: 'text',
    hidden: true,
    hooks: {
      beforeChange: [generateValue],
      afterRead: [generateValue],
    },
  };
};

const generateValue: FieldHook = async ({ req, data }) => {
  const pod = await req.payload.findByID({ id: data?.pod, collection: 'pods', depth: 0 });
  const event = await req.payload.findByID({ id: data?.event, collection: 'events', depth: 0 });

  return `${pod?.title} at ${event?.title}`;
};
