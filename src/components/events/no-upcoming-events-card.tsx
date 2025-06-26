import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export const NoUpcomingEventsCard = () => {
  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle>No upcoming events</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Let's get something going... reach out in the chat to coordinate!</p>
      </CardContent>
    </Card>
  );
};
