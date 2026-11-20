import Link from "next/link";

export default function TestDrivePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white p-8">
      <h1 className="text-4xl font-bold mb-4">DARKCART-PRO — Test Drive</h1>
      <p className="text-slate-400 mb-6">Explore a sandbox of features: trends, competitor spy, AI product generation, and publishing to Shopify.</p>

      <div className="space-y-3">
        <Link href="/dashboard" className="text-purple-400 hover:underline">Command Center (Dashboard)</Link>
        <Link href="/trends" className="text-purple-400 hover:underline">Trend Recon</Link>
        <Link href="/editor" className="text-purple-400 hover:underline">AI Editor</Link>
        <Link href="/product-creation/publish" className="text-purple-400 hover:underline">Publish Flow</Link>
      </div>
    </div>
  );
}
