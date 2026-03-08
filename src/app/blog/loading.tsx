export default function Loading() {
  return (
    <div className="min-h-screen px-6 py-24">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="skeleton h-8 w-48" />
        <div className="skeleton h-6 w-72" />
        <div className="space-y-4 mt-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-28 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
