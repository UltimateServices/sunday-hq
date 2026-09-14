import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-3 py-16">
      <p className="text-[10px] tracking-[0.2em] text-gold uppercase">Sunday HQ</p>
      <h1 className="text-2xl font-semibold">Route not found</h1>
      <p className="text-sm text-muted">If this is a planned board, add the stub — do not hide the gap.</p>
      <Link href="/" className="text-sm text-info hover:underline">
        Back to Home
      </Link>
    </div>
  );
}
