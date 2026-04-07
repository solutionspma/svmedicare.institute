import { EventsFieldPageShell } from "@/components/events-field/EventsFieldPageShell";
import { ScheduleEventClient } from "@/components/events-field/ScheduleEventClient";

export default function ScheduleEventPage() {
  return (
    <EventsFieldPageShell
      title="Schedule an Event"
      subtitle="Submit a request for review. Entries are saved locally as pending approval until your process promotes them."
    >
      <ScheduleEventClient />
    </EventsFieldPageShell>
  );
}
