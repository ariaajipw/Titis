// src/components/dashboard/TaskSkeleton.jsx

const SkeletonLine = ({ className }) => (
  <div className={`bg-zinc-700/50 rounded animate-pulse ${className}`} />
);

export const TaskSkeleton = () => (
  <div className="bg-zinc-800/70 border border-zinc-700/50 rounded-xl p-4 space-y-3">
    <SkeletonLine className="h-5 w-20 rounded-full" />
    <SkeletonLine className="h-4 w-full" />
    <SkeletonLine className="h-4 w-3/4" />
    <SkeletonLine className="h-3 w-5/6" />
    <div className="flex items-center justify-between pt-2">
      <SkeletonLine className="h-3 w-24" />
      <SkeletonLine className="h-6 w-6 rounded-full" />
    </div>
  </div>
);
