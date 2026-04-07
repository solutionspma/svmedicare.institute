import { EventsFieldPageShell } from "@/components/events-field/EventsFieldPageShell";
import { EventsCalendarClient } from "@/components/events-field/EventsCalendarClient";

export default function EventsCalendarPage() {
  return (
    <EventsFieldPageShell
      title="Events Calendar"
      subtitle="Activations from the last 30 days onward, filterable by type and location. Administrators can maintain the list on this device."
    >
      <EventsCalendarClient />
    </EventsFieldPageShell>
  );
}
