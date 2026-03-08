export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-2xl mx-auto space-y-4">
        <div className="skeleton h-10 w-full" />
        <div className="skeleton h-[380px] w-full" />
        <div className="skeleton h-32 w-full" />
      </div>
    </div>
  );
}
