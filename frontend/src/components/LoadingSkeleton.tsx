const LoadingSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image skeleton */}
        <div className="lg:col-span-1">
          <div className="skeleton aspect-[3/4] rounded-2xl w-full" />
        </div>

        {/* Content skeleton */}
        <div className="lg:col-span-2 space-y-4">
          {/* Name and ID */}
          <div className="space-y-2">
            <div className="skeleton h-12 w-64 rounded-lg" />
            <div className="skeleton h-6 w-48 rounded-lg" />
          </div>

          {/* Creator info */}
          <div className="skeleton h-24 rounded-2xl" />

          {/* About section */}
          <div className="skeleton h-32 rounded-2xl" />

          {/* Backstory section */}
          <div className="skeleton h-48 rounded-2xl" />

          {/* Tags */}
          <div className="flex gap-2 flex-wrap">
            <div className="skeleton h-8 w-20 rounded-full" />
            <div className="skeleton h-8 w-24 rounded-full" />
            <div className="skeleton h-8 w-28 rounded-full" />
            <div className="skeleton h-8 w-20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
