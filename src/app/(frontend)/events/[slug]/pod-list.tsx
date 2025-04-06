import { Alert, AlertTitle } from '@/components/ui/alert';
import type { Event, PodsAtEvent } from '@/payload-types';
import { AlertTriangle } from 'lucide-react';

export type Props = {
  event: Event;
};

export const PodList = ({ event }: Props) => {
  const page = event?.pods;
  const docs = page?.docs ?? [];

  if (docs.length <= 0) {
    return <EmptyState />;
  }

  return (
    <>
      <ul className="space-y-2">
        {docs.map((doc, i) => {
          if (typeof doc === 'number') {
            return <ErrorState key={i} podId={doc} />;
          }

          return <PodCard key={i} pod={doc} />;
        })}
      </ul>
      {page?.hasNextPage && <PaginationWarning />}
    </>
  );
};

function EmptyState() {
  return (
    <Alert>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>This event doesn't have pods yet.</AlertTitle>
    </Alert>
  );
}

function ErrorState({ podId }: { podId: number }) {
  return (
    <Alert variant={'destructive'}>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Cannot show pod with id {podId}</AlertTitle>
    </Alert>
  );
}

function PodCard({ pod }: { pod: PodsAtEvent }) {
  // TODO pod is the relationship, get title from the actual pod?
  return <li>{pod.title}</li>;
}

function PaginationWarning() {
  return (
    <Alert variant={'destructive'} className="mt-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Some pods are not shown</AlertTitle>
    </Alert>
  );
}
