import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — DarkCart-Pro",
  description: "DarkCart-Pro Privacy Policy describing how we collect, use, and protect your data.",
};

const lastUpdated = "January 1, 2025";

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-slate-400 text-sm">Last updated: {lastUpdated}</p>
        </div>

        <div className="space-y-8 text-slate-300 text-sm leading-relaxed">

          {/* 1. Introduction */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">1. Introduction</h2>
            <p>
              DarkCart-Pro (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to protecting your
              personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information
              when you use our AI-powered Shopify growth platform and all related services (collectively, the &ldquo;Service&rdquo;).
              Please read this policy carefully. If you do not agree with the terms, do not use the Service.
            </p>
          </section>

          {/* 2. Data We Collect */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">2. Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-1">2.1 Account & Registration Data</h3>
                <p>When you create an account, we collect your name, email address, and password hash. If you sign up via OAuth (e.g., Google), we collect the information provided by the OAuth provider.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">2.2 Shopify Store Data</h3>
                <p>When you connect your Shopify store via OAuth, we collect your store domain, store metadata, product listings, and order data accessible through the Shopify Admin API. This data is used to provide core Service features.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">2.3 Usage & Analytics Data</h3>
                <p>We collect data about how you interact with the Service, including pages visited, features used, clicks, search queries, and timestamps. This helps us improve the Service and diagnose technical issues.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">2.4 AI-Generated Content</h3>
                <p>We log AI inputs (product ideas, niche descriptions) and outputs (generated titles, descriptions, image prompts) for quality assurance, abuse detection, and model improvement purposes.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">2.5 Payment & Billing Data</h3>
                <p>Payment processing is handled by Stripe. We collect your Stripe Customer ID and subscription tier. We do not store credit card numbers or bank account details. Full payment data is subject to Stripe&rsquo;s privacy policy.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">2.6 Cookies & Tracking</h3>
                <p>We use cookies and similar tracking technologies for session management, authentication, analytics, and preference storage. See our Cookie Policy section below for full details.</p>
              </div>
            </div>
          </section>

          {/* 3. How We Use Your Data */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">3. How We Use Your Data</h2>
            <p className="mb-3">We use your information for the following purposes:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Provide, maintain, and improve the Service, including AI-powered content generation.</li>
              <li>Create and manage your account and authenticate your identity.</li>
              <li>Connect and communicate with your Shopify store via the Shopify Admin API.</li>
              <li>Process subscription payments and send billing-related communications.</li>
              <li>Send service-related notifications (e.g., password resets, security alerts).</li>
              <li>Monitor Service usage, detect abuse, and prevent fraudulent activity.</li>
              <li>Improve our AI models, features, and user experience (you may opt out of training use in writing).</li>
              <li>Comply with legal obligations, enforce our Terms of Service, and respond to lawful requests.</li>
            </ul>
          </section>

          {/* 4. Legal Basis for Processing (GDPR) */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">4. Legal Basis for Processing (GDPR — EU/EEA Users)</h2>
            <p className="mb-3">If you are located in the European Union or European Economic Area, our legal basis for processing your personal data is:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Contract performance</strong> — processing necessary to provide the Service to you under our Terms of Service.</li>
              <li><strong>Legitimate interests</strong> — fraud prevention, security, improving our Service (balanced against your rights).</li>
              <li><strong>Consent</strong> — where you have explicitly consented, such as for marketing communications or optional analytics.</li>
              <li><strong>Legal obligation</strong> — where processing is required to comply with applicable laws.</li>
            </ul>
          </section>

          {/* 5. Data Retention */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">5. Data Retention</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>Account data is retained for the duration of your account plus 90 days after deletion.</li>
              <li>Shopify store data is deleted within 30 days of account or store disconnection.</li>
              <li>AI generation logs are retained for a maximum of 12 months for abuse detection and quality assurance.</li>
              <li>Billing records are retained for a minimum of 7 years as required by tax and financial regulations.</li>
              <li>Session tokens and authentication cookies are retained for the duration of the session or as configured.</li>
            </ul>
          </section>

          {/* 6. Data Deletion */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">6. Data Deletion & Your Rights</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Access</strong> — request a copy of all personal data we hold about you.</li>
              <li><strong>Rectification</strong> — request correction of inaccurate or incomplete data.</li>
              <li><strong>Erasure</strong> — request deletion of your personal data (&ldquo;right to be forgotten&rdquo;), subject to legal retention requirements.</li>
              <li><strong>Restriction</strong> — request that we limit processing of your data while a dispute is resolved.</li>
              <li><strong>Portability</strong> — receive your data in a structured, commonly used, machine-readable format.</li>
              <li><strong>Object</strong> — object to processing based on legitimate interests.</li>
              <li><strong>Withdraw consent</strong> — withdraw consent at any time where processing is based on consent.</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, email <a href="mailto:privacy@darkcart.pro" className="text-indigo-400 hover:text-indigo-300">privacy@darkcart.pro</a>. We will respond within 30 days.</p>
          </section>

          {/* 7. CCPA Rights (California) */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">7. Your California Privacy Rights (CCPA/CPRA)</h2>
            <p className="mb-3">If you are a California resident, you have the right to:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Know what personal information is collected about you and how it is used and shared.</li>
              <li>Request deletion of your personal information.</li>
              <li>Opt out of the sale of your personal information (we do not sell personal data; if this changes, we will update this policy).</li>
              <li>Non-discrimination for exercising your privacy rights.</li>
            </ul>
            <p className="mt-3">We do not sell your personal information. Categories of information collected are listed in Section 2 above. To submit a CCPA request, contact us at <a href="mailto:privacy@darkcart.pro" className="text-indigo-400 hover:text-indigo-300">privacy@darkcart.pro</a>.</p>
          </section>

          {/* 8. Cookies */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">8. Cookie Policy</h2>
            <p className="mb-3">We use the following types of cookies:</p>
            <div className="space-y-3">
              <div className="flex justify-between items-start border-b border-slate-700 pb-2">
                <div>
                  <p className="text-white font-medium">Essential Cookies</p>
                  <p className="text-slate-400 text-xs">Required for authentication, session management, and security. Cannot be disabled.</p>
                </div>
                <span className="text-xs text-indigo-400 ml-4 shrink-0">Always Active</span>
              </div>
              <div className="flex justify-between items-start border-b border-slate-700 pb-2">
                <div>
                  <p className="text-white font-medium">Analytics Cookies</p>
                  <p className="text-slate-400 text-xs">Help us understand how visitors interact with the Service. Data is anonymized and aggregated.</p>
                </div>
                <span className="text-xs text-slate-400 ml-4 shrink-0">Optional</span>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white font-medium">Preference Cookies</p>
                  <p className="text-slate-400 text-xs">Remember your settings and preferences for future visits.</p>
                </div>
                <span className="text-xs text-slate-400 ml-4 shrink-0">Optional</span>
              </div>
            </div>
            <p className="mt-3">You can manage cookie preferences through your browser settings. Disabling non-essential cookies may affect Service functionality.</p>
          </section>

          {/* 9. Analytics */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">9. Analytics & Third-Party Services</h2>
            <p className="mb-3">We use the following third-party services that may process your data:</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <div>
                  <p className="text-white font-medium text-sm">OpenAI / Anthropic</p>
                  <p className="text-slate-400 text-xs">AI content generation. Subject to respective privacy policies.</p>
                </div>
                <a href="https://openai.com/privacy" target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300">Policy</a>
              </div>
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <div>
                  <p className="text-white font-medium text-sm">Shopify</p>
                  <p className="text-slate-400 text-xs">Store integration. Subject to Shopify&rsquo;s Privacy Policy.</p>
                </div>
                <a href="https://www.shopify.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300">Policy</a>
              </div>
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <div>
                  <p className="text-white font-medium text-sm">Stripe</p>
                  <p className="text-slate-400 text-xs">Payment processing. Subject to Stripe&rsquo;s Privacy Policy.</p>
                </div>
                <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300">Policy</a>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium text-sm">Vercel / Hosting Provider</p>
                  <p className="text-slate-400 text-xs">Hosting infrastructure. Subject to their privacy policy.</p>
                </div>
                <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300">Policy</a>
              </div>
            </div>
          </section>

          {/* 10. Data Security */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">10. Data Security</h2>
            <p>
              We implement industry-standard technical and organizational measures to protect your data, including:
              TLS/SSL encryption in transit, AES-256 encryption at rest, role-based access controls, regular security
              audits, and secure password hashing (bcrypt/argon2). No method of transmission over the internet is 100%
              secure, and we cannot guarantee absolute security. If a data breach occurs that affects your personal data,
              we will notify you within 72 hours of becoming aware of the breach, as required by applicable law.
            </p>
          </section>

          {/* 11. Children's Privacy */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">11. Children&rsquo;s Privacy</h2>
            <p>
              The Service is not intended for individuals under the age of 18. We do not knowingly collect personal data
              from children under 18. If we become aware that we have collected personal data from a child under 18, we
              will take steps to delete that data as quickly as possible. If you believe a child under 18 has provided
              us with personal data, contact us at <a href="mailto:privacy@darkcart.pro" className="text-indigo-400 hover:text-indigo-300">privacy@darkcart.pro</a>.
            </p>
          </section>

          {/* 12. International Transfers */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">12. International Data Transfers</h2>
            <p>
              Your data may be transferred to and processed in countries outside your country of residence, including
              the United States, where our servers and third-party service providers are located. When we transfer data
              internationally, we ensure appropriate safeguards are in place, such as Standard Contractual Clauses (SCCs)
              approved by the European Commission or equivalent legal mechanisms required by applicable law.
            </p>
          </section>

          {/* 13. Changes to Policy */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">13. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes by posting
              the updated policy on this page with a revised &ldquo;Last updated&rdquo; date. We encourage you to review
              this policy periodically. Your continued use of the Service after any change constitutes acceptance of
              the revised Privacy Policy.
            </p>
          </section>

          {/* 14. Contact */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">14. Contact Us</h2>
            <p>For privacy-related questions or to exercise your rights:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Email: <a href="mailto:privacy@darkcart.pro" className="text-indigo-400 hover:text-indigo-300">privacy@darkcart.pro</a></li>
              <li>Data Protection Officer: <a href="mailto:dpo@darkcart.pro" className="text-indigo-400 hover:text-indigo-300">dpo@darkcart.pro</a></li>
              <li>Address: DarkCart-Pro Privacy, 4524 SW Canyon Rd, Suite 201, Portland, OR 97221, USA</li>
            </ul>
            <p className="mt-3">EU/EEA Representative (under GDPR Article 27): DarkCart-Pro EU, Tower 42, 25 Old Broad St, London EC2N 1HQ, UK.</p>
          </section>

          <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-700">
            <Link href="/legal/terms" className="text-xs text-indigo-400 hover:text-indigo-300 transition">Terms of Service</Link>
            <Link href="/legal/refund" className="text-xs text-indigo-400 hover:text-indigo-300 transition">Refund Policy</Link>
            <Link href="/legal/dpa" className="text-xs text-indigo-400 hover:text-indigo-300 transition">Data Processing Addendum</Link>
          </div>
        </div>
      </div>
    </main>
  );
}