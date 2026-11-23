import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container-x pb-24 pt-36" aria-busy="true" aria-label="Carregando cardápio">
      <Skeleton className="h-16 w-2/3 max-w-xl" />
      <Skeleton className="mt-4 h-5 w-1/2 max-w-md" />
      <div className="mt-12 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className="aspect-[3/4] rounded-3xl" />
        ))}
      </div>
    </div>
  );
}
