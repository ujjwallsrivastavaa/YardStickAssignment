import { Skeleton } from "@/components/ui/skeleton";

const TableSkeleton = () => {
  return (
    <div className="w-full border rounded-md p-4">
      {/* Table Header Skeleton */}
      <div className="flex justify-between mb-4">
        <Skeleton className="h-6 w-1/3" />
      </div>

      {/* Table Body Skeleton */}
      <div className="grid grid-cols-5 gap-4">
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} className="h-4 w-full" />
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {[...Array(5)].map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-5 gap-4">
            {[...Array(5)].map((_, colIndex) => (
              <Skeleton key={colIndex} className="h-4 w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;
