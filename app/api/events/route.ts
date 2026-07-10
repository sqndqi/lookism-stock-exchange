import { apiOk } from "@/lib/api-response";
import { marketEvents } from "@/lib/events";

export function GET() {
  return apiOk({ events: marketEvents }, { eventCount: marketEvents.length });
}
