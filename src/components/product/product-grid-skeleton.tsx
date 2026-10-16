import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/** Esqueleto do card de produto, com a mesma proporção da imagem real. */
export const ProductCardSkeleton = () => (
  <Card className="flex h-full flex-col overflow-hidden">
    <Skeleton className="aspect-[4/3] w-full rounded-none" />
    <div className="flex flex-1 flex-col gap-3 p-4">
      <div className="flex gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="mt-auto h-6 w-24" />
      <Skeleton className="h-10 w-full rounded-full" />
    </div>
  </Card>
);

export const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: count }).map((_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </div>
);
