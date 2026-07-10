import { apiOk } from "@/lib/api-response";
import { getSourceRecords } from "@/lib/sources";

export function GET() {
  const sources = getSourceRecords();
  return apiOk({ sources }, {
    sourceCount: sources.length,
    staleCount: sources.filter((source) => source.status !== "active").length,
    cacheMode: "manual-fixtures-plus-cached-source-data"
  });
}
