import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy — DarkCart-Pro",
  description: "DarkCart-Pro Refund Policy covering subscription terms, cancellation, and refund eligibility.",
};

const lastUpdated = "January 1, 2025";

export default function RefundPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300 mb-8 inline-flex items-center gap-2 text-sm transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-indigo-500/50 rounded text-xs font-bold uppercase tracking-widest text-indigo-400 mb-4">
            Legal
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Refund Policy</h1>
          <p className="text-slate-400 text-sm">Last updated: {lastUpdated}</p>
        </div>

        <div className="space-y-8 text-slate-300 text-sm leading-relaxed">

          {/* 1. Overview */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">1. Overview</h2>
            <p>
              DarkCart-Pro (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) offers digital software services delivered
              immediately upon subscription activation. Because our Service is a digital product that becomes accessible
              immediately upon purchase, our refund policy reflects the nature of digital goods. This policy outlines
              your rights and our obligations regarding refunds and subscription management.
            </p>
          </section>

          {/* 2. Subscription Terms */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">2. Subscription Terms</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>All paid subscriptions are billed in advance — monthly or annually depending on the selected plan.</li>
              <li>Subscriptions renew automatically at the end of each billing period unless canceled before the renewal date.</li>
              <li>All fees are quoted and charged in USD unless otherwise indicated.</li>
              <li>Pricing for future billing periods may change; you will be notified at least 30 days in advance of any price changes.</li>
              <li>The subscription fee covers access to the features included in your selected plan, as described on our website and in the Terms of Service.</li>
            </ul>
          </section>

          {/* 3. Cancellation */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">3. Cancellation</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>You may cancel your subscription at any time from your Settings page or by contacting support.</li>
              <li>Canceled subscriptions remain active until the end of the current paid billing period.</li>
              <li>After cancellation, your account will be downgraded to the free tier at the end of the billing period.</li>
              <li>Canceling your subscription does not entitle you to a refund for the current billing period.</li>
              <li>You will retain access to all paid features until the end of the paid period.</li>
            </ul>
          </section>

          {/* 4. Refund Eligibility */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">4. Refund Eligibility</h2>
            <p className="mb-3">Under most circumstances, subscription fees are non-refundable once charged. However, we recognize certain situations warrant a refund:</p>
            <div className="space-y-3">
              <div className="p-4 bg-green-900/20 border border-green-700/50 rounded-lg">
                <p className="text-white font-semibold mb-1">Eligible for Refund</p>
                <ul className="space-y-1 list-disc list-inside text-xs">
                  <li>You are charged for a plan upgrade within the first 48 hours and have not used any premium features.</li>
                  <li>You are billed after canceling your subscription before the renewal date (billing error).</li>
                  <li>You experience a verified technical failure that prevents access to the Service for more than 72 continuous hours.</li>
                  <li>You are charged the wrong amount due to a system error.</li>
                </ul>
              </div>
              <div className="p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
                <p className="text-white font-semibold mb-1">Not Eligible for Refund</p>
                <ul className="space-y-1 list-disc list-inside text-xs">
                  <li>You changed your mind after subscribing.</li>
                  <li>You did not use the Service or found it not suitable for your needs.</li>
                  <li>You cancel your subscription after the renewal date but within the billing period.</li>
                  <li>You want to switch to a lower-tier plan mid-billing-cycle (downgrades take effect at renewal).</li>
                  <li>You were banned or suspended for Terms of Service violations.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 5. Refund Process */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">5. How to Request a Refund</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>Submit a refund request by emailing <a href="mailto:billing@darkcart.pro" className="text-indigo-400 hover:text-indigo-300">billing@darkcart.pro</a> with your account email and reason for the request.</li>
              <li>Refund requests are reviewed within 5 business days.</li>
              <li>If approved, refunds are processed to the original payment method within 5–10 business days (Stripe processing times apply).</li>
              <li>Approved refunds typically appear within 5–10 business days after the refund is issued.</li>
              <li>Partial refunds are not provided for partial billing periods.</li>
            </ul>
          </section>

          {/* 6. Chargebacks & Disputes */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">6. Chargebacks & Payment Disputes</h2>
            <p>
              If you initiate a credit card chargeback or payment dispute with your bank or payment provider without
              first contacting us to resolve the issue, we reserve the right to suspend or terminate your account.
              We strongly encourage you to contact us before initiating any chargeback, as most billing issues can be
              resolved directly. Chargebacks that are found to be invalid or unfounded may result in account termination
              and the recovery of associated fees.
            </p>
          </section>

          {/* 7. Plan Changes & Downgrades */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">7. Plan Changes & Downgrades</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Upgrades</strong> — You may upgrade to a higher-tier plan at any time. The prorated difference is charged immediately. The upgrade takes effect immediately.</li>
              <li><strong>Downgrades</strong> — You may select a lower-tier plan, but the change takes effect at the end of your current billing period. No refund is provided for the remaining time on the higher tier.</li>
              <li>Plan changes do not affect the remaining duration of your current billing cycle.</li>
            </ul>
          </section>

          {/* 8. Exceptions */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">8. Exceptions & Special Circumstances</h2>
            <p className="mb-3">
              We may, at our sole discretion, approve refunds in exceptional circumstances not covered above. These
              are evaluated on a case-by-case basis. Examples include:
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Significant service outage affecting your access for an extended period beyond our SLA.</li>
              <li>Verified billing errors resulting in duplicate charges.</li>
              <li> Exceptional circumstances at the discretion of our billing team.</li>
            </ul>
            <p className="mt-3">
              To request an exception, contact <a href="mailto:billing@darkcart.pro" className="text-indigo-400 hover:text-indigo-300">billing@darkcart.pro</a> with a detailed explanation. Exceptions are reviewed by our support team and are final.
            </p>
          </section>

          {/* 9. Free Tier */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">9. Free Tier</h2>
            <p>
              Our free tier provides limited access to the Service at no cost. No payment information is required to
              use the free tier. There are no refunds associated with the free tier as no fees are charged.
              Free tier users are not entitled to any SLA, guaranteed uptime, or premium support.
            </p>
          </section>

          {/* 10. Changes to This Policy */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">10. Changes to This Policy</h2>
            <p>
              We reserve the right to modify this Refund Policy at any time. Material changes will be communicated
              by posting the updated policy on this page with a revised &ldquo;Last updated&rdquo; date. Refund requests
              made before the change will be governed by the policy in effect at the time of purchase.
            </p>
          </section>

          {/* 11. Contact */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">11. Contact Us</h2>
            <p>For billing and refund-related inquiries:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Email: <a href="mailto:billing@darkcart.pro" className="text-indigo-400 hover:text-indigo-300">billing@darkcart.pro</a></li>
              <li>Response time: Within 5 business days</li>
            </ul>
          </section>

          <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-700">
            <Link href="/legal/terms" className="text-xs text-indigo-400 hover:text-indigo-300 transition">Terms of Service</Link>
            <Link href="/legal/privacy" className="text-xs text-indigo-400 hover:text-indigo-300 transition">Privacy Policy</Link>
            <Link href="/legal/dpa" className="text-xs text-indigo-400 hover:text-indigo-300 transition">Data Processing Addendum</Link>
          </div>
        </div>
      </div>
    </main>
  );
}