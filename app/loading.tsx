import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-abyss p-8 text-white">
      <div className="mx-auto grid w-[min(1200px,100%)] gap-5">
        <Skeleton className="h-24" />
        <Skeleton className="h-96" />
        <div className="grid gap-5 md:grid-cols-3">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    </main>
  );
}

