import { apiOk } from "@/lib/api-response";
import { currentSeason } from "@/lib/seasons";

export function GET() {
  return apiOk({ currentSeason }, { season: currentSeason.id });
}
