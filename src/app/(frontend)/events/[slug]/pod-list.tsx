import EventService from '@/collections/Events/service';
import type PodAtEventService from '@/collections/PodsAtEvents/service';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export type Props = {
  event: EventService;
};

export const PodList = ({ event }: Props) => {
  if (!event.hasPods) {
    return <Error message="This event doesn't have pods yet." />;
  }

  return (
    <>
      <ul className="grid gap-6 xl:grid-cols-2">
        {event.pods.map((pod, i) => {
          return <PodCard key={i} pod={pod} />;
        })}
      </ul>
      {event.hasMorePods && <Error message="Some pods are not shown." />}
    </>
  );
};

function Error({ message }: { message: string }) {
  return (
    <Alert>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>{message}</AlertTitle>
    </Alert>
  );
}

function PodCard({ pod }: { pod: PodAtEventService }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{pod.title}</CardTitle>
        <CardDescription>{pod.host?.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{pod.description}</p>
      </CardContent>
    </Card>
  );
}
