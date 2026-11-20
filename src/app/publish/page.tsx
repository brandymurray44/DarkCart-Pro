import Link from "next/link";
import { requireAuth } from "@/lib/authServer";

export default async function PublishAliasPage() {
  await requireAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Publish</h1>
      <p className="text-slate-400 mb-6">Redirecting to the publish workflow. You can publish AI-generated products to Shopify from the Product Creation flow.</p>
      <div className="space-x-3">
        <Link href="/product-creation/publish" className="text-purple-400 hover:underline">Product Creation Publish</Link>
        <Link href="/create/publish" className="text-purple-400 hover:underline">Quick Create Publish</Link>
      </div>
    </div>
  );
}
