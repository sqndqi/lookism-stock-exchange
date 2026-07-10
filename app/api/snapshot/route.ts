import { apiOk } from "@/lib/api-response";
import snapshot from "@/public/data/market-snapshot.json";

export function GET() {
  return apiOk({ snapshot }, {
    generatedAt: snapshot.generatedAt,
    engineVersion: snapshot.engineVersion,
    assetCount: snapshot.assetCount
  });
}
