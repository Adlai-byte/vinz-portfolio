export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-5xl mx-auto px-6 space-y-12 py-24">
        {/* Hero skeleton */}
        <div className="flex flex-col items-center space-y-4">
          <div className="skeleton h-6 w-32" />
          <div className="skeleton h-16 w-48" />
          <div className="skeleton h-6 w-40" />
        </div>
        {/* Section skeletons */}
        <div className="space-y-4">
          <div className="skeleton h-8 w-36" />
          <div className="skeleton h-24 w-full max-w-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-48 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
