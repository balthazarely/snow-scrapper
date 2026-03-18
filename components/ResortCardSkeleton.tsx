export default function ResortCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white dark:bg-zinc-800 shadow-sm overflow-hidden animate-pulse">
      <div className="h-1 w-full bg-zinc-100 dark:bg-zinc-700" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-1/2 bg-zinc-100 dark:bg-zinc-700 rounded-full" />
        <div className="grid grid-cols-3 gap-2">
          <div className="h-6 bg-zinc-100 dark:bg-zinc-700 rounded-full" />
          <div className="h-6 bg-zinc-100 dark:bg-zinc-700 rounded-full" />
          <div className="h-6 bg-zinc-100 dark:bg-zinc-700 rounded-full" />
        </div>
      </div>
    </div>
  );
}
