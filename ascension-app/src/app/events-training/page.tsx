import { EventsFieldPageShell } from "@/components/events-field/EventsFieldPageShell";
import { EventsTrainingClient } from "@/components/events-field/EventsTrainingClient";

export default function EventsTrainingPage() {
  return (
    <EventsFieldPageShell
      title="Event Training Hub"
      subtitle="Reference materials, scenario prompts, and field checklists for CMS-regulated marketing settings."
    >
      <EventsTrainingClient />
    </EventsFieldPageShell>
  );
}
