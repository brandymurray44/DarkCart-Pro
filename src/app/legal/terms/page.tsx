import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — DarkCart-Pro",
  description: "DarkCart-Pro Terms of Service governing the use of our AI-powered Shopify growth platform.",
};

const lastUpdated = "January 1, 2025";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link href="/dashboard" className="text-indigo-400 hover:text-indigo-300 mb-8 inline-flex items-center gap-2 text-sm transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-indigo-500/50 rounded text-xs font-bold uppercase tracking-widest text-indigo-400 mb-4">
            Legal
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
          <p className="text-slate-400 text-sm">Last updated: {lastUpdated}</p>
        </div>

        <div className="space-y-8 text-slate-300 text-sm leading-relaxed">

          {/* 1. Acceptance */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using DarkCart-Pro (&ldquo;Service&rdquo;), you agree to be bound by these Terms of Service
              (&ldquo;Terms&rdquo;). If you do not agree to these Terms, do not use the Service. These Terms constitute a
              legally binding agreement between you and DarkCart-Pro (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;).
            </p>
          </section>

          {/* 2. Description of Service */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">2. Description of Service</h2>
            <p>
              DarkCart-Pro is an AI-powered Shopify growth engine that provides trend intelligence, competitor analysis,
              product generation, and Shopify store integration. Features include trend scraping, competitor monitoring,
              AI-generated product descriptions, and Shopify store publishing. We reserve the right to modify, suspend, or
              discontinue any part of the Service at any time.
            </p>
          </section>

          {/* 3. Account & Eligibility */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">3. Account & Eligibility</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>You must be at least 18 years old and able to form legally binding contracts.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You agree to provide accurate, current, and complete information during registration.</li>
              <li>One account per person unless express written permission is granted by the Company.</li>
              <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
            </ul>
          </section>

          {/* 4. Subscription & Billing */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">4. Subscription & Billing</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>Paid subscriptions are billed monthly or annually in advance based on the plan selected.</li>
              <li>All fees are non-refundable except as required by applicable law or our Refund Policy.</li>
              <li>Subscription fees may change; we will provide at least 30 days&rsquo; notice before any price change takes effect.</li>
              <li>Failure to pay fees when due may result in suspension of your account and termination at our discretion.</li>
              <li>All amounts are denominated and charged in USD unless otherwise specified.</li>
            </ul>
          </section>

          {/* 5. Acceptable Use */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">5. Acceptable Use</h2>
            <p className="mb-3">You agree NOT to use the Service to:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Violate any applicable local, state, national, or international law or regulation.</li>
              <li>Infringe on the intellectual property rights of any third party, including publishing counterfeit products.</li>
              <li>Scraping, crawling, or extracting data from the Service in violation of our data license terms.</li>
              <li>Attempting to gain unauthorized access to any account, system, or network connected to the Service.</li>
              <li>Using automated scripts, bots, or scraping tools without express written permission from the Company.</li>
              <li>Transmitting any harmful code, viruses, or malicious content through the Service.</li>
              <li>Harassing, defaming, or collecting personal data of other users without their consent.</li>
            </ul>
          </section>

          {/* 6. Prohibited Actions */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">6. Prohibited Actions</h2>
            <p className="mb-3">Without limiting the Acceptable Use provisions, you may not:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Resell, sublicense, or redistribute the Service without express written permission.</li>
              <li>Use the Service to publish content that is deceptive, misleading, or violates consumer protection laws.</li>
              <li>Attempt to reverse-engineer, decompile, or disassemble any part of the Service.</li>
              <li>Use the Service in any manner that could interfere with, impair, or disrupt other users&rsquo; access.</li>
              <li>Impersonate any person or entity or falsely represent your affiliation with any person or entity.</li>
            </ul>
          </section>

          {/* 7. Intellectual Property */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">7. Intellectual Property</h2>
            <p>
              The Service, including all software, designs, text, graphics, logos, and content generated by the Service
              (&ldquo;Company IP&rdquo;), is owned by or licensed to the Company and is protected by copyright, trademark,
              and other intellectual property laws. You retain ownership of any content you submit to the Service. By using
              the Service, you grant us a non-exclusive, worldwide, royalty-free license to use your content solely to
              provide and improve the Service. AI-generated content produced for you may be used by the Company for
              training and improvement purposes unless you opt out in writing.
            </p>
          </section>

          {/* 8. Third-Party Services */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">8. Third-Party Services</h2>
            <p>
              The Service may integrate with or link to third-party services, including but not limited to Shopify,
              OpenAI, Anthropic, and social media platforms. These third-party services are governed by their own terms
              and privacy policies. We do not endorse, guarantee, or assume responsibility for any third-party service,
              and your use of third-party services is at your own risk.
            </p>
          </section>

          {/* 9. Data & Privacy */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">9. Data & Privacy</h2>
            <p>
              Your use of the Service is also governed by our Privacy Policy. By using the Service, you consent to the
              collection, use, and processing of your data as described in the Privacy Policy. You represent that you
              have the legal authority to share any data you submit through the Service and that doing so does not violate
              any third-party rights or applicable laws.
            </p>
          </section>

          {/* 10. Disclaimers */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">10. Disclaimers</h2>
            <p className="mb-3">THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES
              OF ANY KIND, EXPRESS OR IMPLIED. TO THE MAXIMUM EXTENT PERMITTED BY LAW:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>We do not warrant that the Service will be uninterrupted, secure, or error-free.</li>
              <li>We do not warrant that the results obtained from the Service will be accurate, reliable, or suitable for your specific needs.</li>
              <li>Trend data, competitor analysis, and AI-generated content are for informational purposes only and do not constitute professional business, legal, or financial advice.</li>
              <li>You assume full responsibility for any decisions made based on the Service&rsquo;s outputs.</li>
              <li>AI-generated content may contain errors, omissions, or biases — you are responsible for reviewing and validating all such content before publication.</li>
            </ul>
          </section>

          {/* 11. Limitation of Liability */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">11. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, DARKCART-PRO AND ITS OFFICERS, DIRECTORS, EMPLOYEES, CONTRACTORS,
              AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
              INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, REVENUE, DATA, OR USE, ARISING OUT OF OR RELATED TO YOUR
              USE OF THE SERVICE — REGARDLESS OF WHETHER SUCH DAMAGES WERE FORESEEABLE OR WHETHER THE COMPANY WAS ADVISED
              OF THE POSSIBILITY OF SUCH DAMAGES. IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED THE AMOUNT OF FEES PAID
              BY YOU TO THE COMPANY IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
            </p>
          </section>

          {/* 12. Indemnification */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">12. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless the Company and its officers, directors, employees,
              contractors, and agents from and against any claims, liabilities, damages, losses, costs, and expenses
              (including reasonable attorneys&rsquo; fees) arising out of or related to: (a) your use of the Service;
              (b) your violation of these Terms; (c) your violation of any third-party right; or (d) your unlawful,
              fraudulent, or prohibited conduct.
            </p>
          </section>

          {/* 13. Termination */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">13. Termination</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>You may terminate your account at any time by contacting support or canceling through your Settings.</li>
              <li>We may suspend or terminate your account immediately, without prior notice, for any conduct that violates these Terms or that we deem harmful to the Service or its users.</li>
              <li>Upon termination, your right to use the Service ceases immediately and any data associated with your account may be deleted at our discretion.</li>
              <li>Termination does not relieve you of any obligations accrued prior to termination, including payment of fees.</li>
            </ul>
          </section>

          {/* 14. Modifications to Terms */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">14. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will provide notice of material changes by
              posting the updated Terms on this page with a revised &ldquo;Last updated&rdquo; date. Your continued use of
              the Service after such modifications constitutes your acceptance of the revised Terms. If you do not agree
              to the modified Terms, you must discontinue use of the Service.
            </p>
          </section>

          {/* 15. Governing Law */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">15. Governing Law & Dispute Resolution</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, USA,
              without regard to its conflict of law provisions. Any dispute arising out of or relating to these Terms
              or your use of the Service shall first be attempted to be resolved through good-faith negotiation. If the
              dispute cannot be resolved within 30 days of negotiation, either party may pursue binding arbitration
              under the rules of the American Arbitration Association (AAA). You acknowledge and agree that you are
              waiving your right to participate in a class action lawsuit or class-wide arbitration.
            </p>
          </section>

          {/* 16. Severability */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">16. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable or invalid, such provision shall be limited
              or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force
              and effect.
            </p>
          </section>

          {/* 17. Contact */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">17. Contact Information</h2>
            <p>
              For questions about these Terms, contact us at:
            </p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Email: <a href="mailto:legal@darkcart.pro" className="text-indigo-400 hover:text-indigo-300">legal@darkcart.pro</a></li>
              <li>Address: DarkCart-Pro Legal, 123 Commerce Ave, Suite 100, Dover, DE 19901, USA</li>
            </ul>
          </section>

          {/* Footer nav */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-700">
            <Link href="/legal/privacy" className="text-xs text-indigo-400 hover:text-indigo-300 transition">Privacy Policy</Link>
            <Link href="/legal/refund" className="text-xs text-indigo-400 hover:text-indigo-300 transition">Refund Policy</Link>
            <Link href="/legal/dpa" className="text-xs text-indigo-400 hover:text-indigo-300 transition">Data Processing Addendum</Link>
          </div>
        </div>
      </div>
    </main>
  );
}