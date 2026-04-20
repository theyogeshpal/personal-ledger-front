const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />
)

export const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div>
      <Skeleton className="h-7 w-40 mb-2" />
      <Skeleton className="h-4 w-64" />
    </div>
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {[1,2,3,4].map(i => (
        <div key={i} className="card p-5 flex items-center gap-4">
          <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
          <div className="flex-1">
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-7 w-10" />
          </div>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-2 gap-4">
      {[1,2].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <Skeleton className="h-52 rounded-xl md:col-span-2" />
      <Skeleton className="h-52 rounded-xl md:col-span-3" />
    </div>
    <div className="card p-6">
      <div className="flex justify-between mb-6">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-9 w-28 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1,2,3,4].map(i => <Skeleton key={i} className="h-44 rounded-xl" />)}
      </div>
    </div>
  </div>
)

export const ProjectsSkeleton = () => (
  <div className="space-y-5">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div>
          <Skeleton className="h-5 w-24 mb-1.5" />
          <Skeleton className="h-3 w-36" />
        </div>
      </div>
      <Skeleton className="h-9 w-28 rounded-xl" />
    </div>
    <div className="flex flex-col sm:flex-row gap-3">
      <Skeleton className="h-10 rounded-xl flex-1" />
      <Skeleton className="h-10 w-36 rounded-xl" />
      <Skeleton className="h-10 w-36 rounded-xl" />
    </div>
    <div className="card overflow-hidden">
      <div className="border-b border-slate-100 px-6 py-4 flex gap-8">
        {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-3 w-16" />)}
      </div>
      {[1,2,3,4,5].map(i => (
        <div key={i} className="px-6 py-4 border-b border-slate-50 flex gap-8 items-center">
          <div className="flex-1"><Skeleton className="h-4 w-32 mb-1.5" /><Skeleton className="h-3 w-48" /></div>
          <Skeleton className="h-6 w-20 rounded-lg" />
          <Skeleton className="h-6 w-16 rounded-lg" />
          <Skeleton className="h-2 w-28 rounded-full" />
          <Skeleton className="h-5 w-16 rounded" />
          <div className="flex gap-1 ml-auto"><Skeleton className="w-8 h-8 rounded-lg" /><Skeleton className="w-8 h-8 rounded-lg" /><Skeleton className="w-8 h-8 rounded-lg" /></div>
        </div>
      ))}
    </div>
  </div>
)

export const ProjectDetailSkeleton = () => (
  <div className="max-w-[960px] mx-auto space-y-6">
    <div className="flex justify-between">
      <Skeleton className="h-5 w-16 rounded-lg" />
      <Skeleton className="h-9 w-28 rounded-xl" />
    </div>
    <div className="card p-6 md:p-8">
      <div className="flex gap-2 mb-3">
        <Skeleton className="h-6 w-20 rounded-lg" />
        <Skeleton className="h-6 w-20 rounded-lg" />
        <Skeleton className="h-6 w-28 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-72 mb-6" />
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        {[1,2,3].map(i => <Skeleton key={i} className="h-8 w-24 rounded-lg" />)}
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <Skeleton className="h-48 rounded-xl md:col-span-2" />
      <Skeleton className="h-48 rounded-xl" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Skeleton className="h-20 rounded-xl" />
      <Skeleton className="h-20 rounded-xl" />
    </div>
  </div>
)

export const RecycleBinSkeleton = () => (
  <div className="space-y-5">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <div>
          <Skeleton className="h-5 w-28 mb-1.5" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
    </div>
    <div className="card overflow-hidden">
      <div className="border-b border-slate-100 px-6 py-4 flex gap-8">
        {[1,2,3,4].map(i => <Skeleton key={i} className="h-3 w-20" />)}
      </div>
      {[1,2,3].map(i => (
        <div key={i} className="px-6 py-4 border-b border-slate-50 flex gap-8 items-center">
          <div className="flex-1"><Skeleton className="h-4 w-32 mb-1.5" /><Skeleton className="h-3 w-48" /></div>
          <Skeleton className="h-6 w-20 rounded-lg" />
          <Skeleton className="h-4 w-24" />
          <div className="flex gap-2 ml-auto"><Skeleton className="h-7 w-20 rounded-lg" /><Skeleton className="h-7 w-20 rounded-lg" /></div>
        </div>
      ))}
    </div>
  </div>
)

export default Skeleton
