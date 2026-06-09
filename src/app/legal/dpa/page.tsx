import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Processing Addendum — DarkCart-Pro",
  description: "DarkCart-Pro Data Processing Addendum governing data controller/processor roles, security, and EU rights.",
};

const lastUpdated = "January 1, 2025";

export default function DpaPage() {
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
          <h1 className="text-4xl font-bold text-white mb-2">Data Processing Addendum</h1>
          <p className="text-slate-400 text-sm">Last updated: {lastUpdated}</p>
        </div>

        <div className="space-y-8 text-slate-300 text-sm leading-relaxed">

          {/* Intro */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">Introduction</h2>
            <p>
              This Data Processing Addendum (&ldquo;DPA&rdquo;) forms part of the Terms of Service between DarkCart-Pro
              (&ldquo;Data Processor&rdquo;) and the customer (&ldquo;Data Controller&rdquo;) and governs the processing of
              personal data of EU/EEA data subjects under the EU General Data Protection Regulation (GDPR) 2016/679 and
              applicable national data protection laws. This DPA is incorporated by reference into the Terms of Service.
              In the event of any conflict between this DPA and the Terms of Service, this DPA shall prevail with respect
              to data protection obligations.
            </p>
          </section>

          {/* 1. Roles */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">1. Roles of the Parties</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Data Controller</strong> — You (the Customer) determine the purposes and means of processing personal data through your use of the Service. You are responsible for establishing the legal basis for processing.</li>
              <li><strong>Data Processor</strong> — DarkCart-Pro processes personal data only on your documented instructions as the Data Controller, for the purpose of providing the Service as described in the Terms of Service and this DPA.</li>
              <li>Where DarkCart-Pro determines the purposes and means of processing independently, it acts as a Data Controller, not a Data Processor, for those specific processing activities.</li>
            </ul>
          </section>

          {/* 2. Subject Matter & Purpose */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">2. Subject Matter & Purpose of Processing</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Subject matter</strong> — The processing of personal data of EU/EEA data subjects in connection with the DarkCart-Pro Service.</li>
              <li><strong>Purpose</strong> — Provision of AI-powered Shopify growth tools including trend intelligence, competitor analysis, product generation, and Shopify store integration.</li>
              <li><strong>Duration</strong> — Processing continues for the duration of your subscription and as required by legal obligations after termination.</li>
            </ul>
          </section>

          {/* 3. Nature of Processing */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">3. Nature & Scope of Processing</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong>Collection</strong> — Acquiring data through your account registration, Shopify OAuth connection, and usage of the Service.</li>
              <li><strong>Storage</strong> — Retaining data in secure databases for the duration specified in our Privacy Policy.</li>
              <li><strong>AI Processing</strong> — Using AI models (OpenAI, Anthropic, and similar) to generate content. Inputs may be used for model training unless you opt out in writing.</li>
              <li><strong>Transmission</strong> — Transmitting data to third-party services (Shopify, payment providers, AI providers) as necessary to provide the Service.</li>
              <li><strong>Deletion</strong> — Erasing or anonymizing data upon account deletion or upon your request, subject to legal retention requirements.</li>
            </ul>
          </section>

          {/* 4. Categories of Data */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">4. Categories of Personal Data</h2>
            <div className="space-y-3">
              <div className="border-b border-slate-700 pb-2">
                <p className="text-white font-semibold">Account Data</p>
                <p className="text-slate-400 text-xs">Name, email address, password hash, authentication tokens.</p>
              </div>
              <div className="border-b border-slate-700 pb-2">
                <p className="text-white font-semibold">Shopify Store Data</p>
                <p className="text-slate-400 text-xs">Store domain, product listings, order data, customer data accessible via Shopify Admin API.</p>
              </div>
              <div className="border-b border-slate-700 pb-2">
                <p className="text-white font-semibold">Usage & Behavioral Data</p>
                <p className="text-slate-400 text-xs">Page views, feature interactions, timestamps, device and browser metadata.</p>
              </div>
              <div className="border-b border-slate-700 pb-2">
                <p className="text-white font-semibold">AI Input/Output Logs</p>
                <p className="text-slate-400 text-xs">Prompts submitted to AI models and generated outputs for quality assurance.</p>
              </div>
              <div className="border-b border-slate-700 pb-2">
                <p className="text-white font-semibold">Billing Data</p>
                <p className="text-slate-400 text-xs">Stripe Customer ID, subscription tier, billing history. Full payment details are held by Stripe.</p>
              </div>
              <div>
                <p className="text-white font-semibold">Special Categories</p>
                <p className="text-slate-400 text-xs">We do not knowingly process special category data (racial origin, political opinions, religious beliefs, biometric data, health data, sexual orientation) unless voluntarily provided by you. If such data is processed, additional safeguards apply.</p>
              </div>
            </div>
          </section>

          {/* 5. Data Controller Obligations */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">5. Data Controller Obligations</h2>
            <p className="mb-3">As Data Controller, you agree to:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Ensure you have a lawful basis for all personal data processed through the Service.</li>
              <li>Ensure that data subjects have been informed of the processing of their data, including through a compliant privacy notice.</li>
              <li>Not submit personal data of EU/EEA data subjects that constitutes special category data without appropriate safeguards in place.</li>
              <li>Respond to data subject rights requests in a timely manner and notify us of any requests we need to assist with.</li>
              <li>Ensure that any third-party integrations you configure (beyond those we already use) comply with applicable data protection laws.</li>
            </ul>
          </section>

          {/* 6. Data Processor Obligations */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">6. Data Processor Obligations</h2>
            <p className="mb-3">As Data Processor, DarkCart-Pro agrees to:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Process personal data only on your documented instructions, unless required to do so by EU/EEA law to which we are subject (in which case we will notify you unless that law prohibits us from doing so).</li>
              <li>Ensure that personnel authorized to process personal data are subject to obligations of confidentiality.</li>
              <li>Implement appropriate technical and organizational security measures as detailed in Section 8.</li>
              <li>Assist the Data Controller in fulfilling obligations to respond to data subject rights requests (access, rectification, erasure, portability, restriction, objection) within 15 days of notification.</li>
              <li>Delete or return all personal data upon termination of the Service agreement, subject to legal retention requirements.</li>
              <li>Maintain records of processing activities as required by GDPR Article 30.</li>
              <li>Notify the Data Controller without undue delay, and in any event within 48 hours, upon becoming aware of a personal data breach.</li>
            </ul>
          </section>

          {/* 7. Sub-Processors */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">7. Sub-Processors</h2>
            <p className="mb-3">
              DarkCart-Pro uses the following sub-processors to deliver the Service. We maintain an up-to-date list
              of authorized sub-processors and will notify you of any material changes at least 30 days in advance:
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-start border-b border-slate-700 pb-2">
                <div>
                  <p className="text-white font-medium text-sm">Vercel</p>
                  <p className="text-slate-400 text-xs">Cloud hosting and infrastructure. USA.</p>
                </div>
                <span className="text-xs text-slate-400">Infrastructure</span>
              </div>
              <div className="flex justify-between items-start border-b border-slate-700 pb-2">
                <div>
                  <p className="text-white font-medium text-sm">OpenAI</p>
                  <p className="text-slate-400 text-xs">AI text generation. USA. <a href="https://openai.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">DPA</a></p>
                </div>
                <span className="text-xs text-slate-400">AI Processing</span>
              </div>
              <div className="flex justify-between items-start border-b border-slate-700 pb-2">
                <div>
                  <p className="text-white font-medium text-sm">Anthropic</p>
                  <p className="text-slate-400 text-xs">AI text generation. USA. <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">DPA</a></p>
                </div>
                <span className="text-xs text-slate-400">AI Processing</span>
              </div>
              <div className="flex justify-between items-start border-b border-slate-700 pb-2">
                <div>
                  <p className="text-white font-medium text-sm">Shopify</p>
                  <p className="text-slate-400 text-xs">E-commerce platform integration. Canada. <a href="https://www.shopify.com/legal/dpa" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">DPA</a></p>
                </div>
                <span className="text-xs text-slate-400">Platform</span>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white font-medium text-sm">Stripe</p>
                  <p className="text-slate-400 text-xs">Payment processing. USA. <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">DPA</a></p>
                </div>
                <span className="text-xs text-slate-400">Payments</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Additional sub-processors may be added as the Service evolves. You may object to a new sub-processor
              by notifying us within 15 days of receiving notice of the change. If objection cannot be resolved,
              you may terminate the affected portion of the Service.
            </p>
          </section>

          {/* 8. Security */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">8. Security Measures</h2>
            <p className="mb-3">DarkCart-Pro implements the following technical and organizational security measures:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                ["TLS 1.2+ encryption", "All data in transit over HTTPS."],
                ["AES-256 encryption", "Data at rest on all storage systems."],
                ["Role-based access", "Personnel access limited to necessity."],
                ["MFA enforcement", "Administrative accounts require MFA."],
                ["Penetration testing", "Regular third-party security audits."],
                ["Vulnerability patching", "Critical patches applied within 72 hours."],
                ["Backup encryption", "All backups encrypted with separate keys."],
                ["Audit logging", "All data access and modifications logged."],
              ].map(([title, desc]) => (
                <div key={title} className="p-3 bg-slate-700/50 rounded border border-slate-700">
                  <p className="text-white text-sm font-semibold">{title}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-400">
              We are continuously working to improve our security posture. Our current SOC 2 Type II assessment is in progress;
              please contact <a href="mailto:security@darkcart.pro" className="text-indigo-400 hover:text-indigo-300">security@darkcart.pro</a> to request our security whitepaper.
            </p>
          </section>

          {/* 9. International Transfers */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">9. International Data Transfers</h2>
            <p>
              Personal data of EU/EEA data subjects may be transferred outside the European Economic Area, including
              to the United States. Such transfers are conducted under:
            </p>
            <ul className="mt-2 space-y-2 list-disc list-inside">
              <li>Standard Contractual Clauses (SCCs) adopted by the European Commission (EU 2021/914).</li>
              <li>Additional safeguards as required by GDPR Chapter V for transfers to third countries.</li>
              <li>Data transferred to AI providers (OpenAI, Anthropic) is subject to their respective DPAs and, where applicable, SCCs.</li>
            </ul>
          </section>

          {/* 10. Data Subject Rights */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">10. Data Subject Rights (GDPR Articles 15–22)</h2>
            <p className="mb-3">DarkCart-Pro will assist the Data Controller in responding to data subject requests for:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                "Right of Access (Art. 15)",
                "Right to Rectification (Art. 16)",
                "Right to Erasure (Art. 17)",
                "Right to Restriction (Art. 18)",
                "Right to Portability (Art. 20)",
                "Right to Object (Art. 21)",
                "Rights re: automated decisions (Art. 22)",
              ].map((right) => (
                <div key={right} className="text-xs px-3 py-2 bg-slate-700/50 rounded border border-slate-700 text-slate-300">
                  {right}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-400">
              DarkCart-Pro will respond to Data Controller requests for assistance within 10 business days. The Data Controller
              remains responsible for primary compliance with data subject rights requests.
            </p>
          </section>

          {/* 11. Data Breach */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">11. Personal Data Breach Notification</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>DarkCart-Pro will notify the Data Controller without undue delay, and in any event within 48 hours, upon becoming aware of a personal data breach.</li>
              <li>Notification will include: nature of breach, categories and approximate number of data subjects affected, categories and approximate number of personal data records, likely consequences, and measures taken or proposed to address the breach.</li>
              <li>If full details are not available within 48 hours, an initial notification will be provided with a commitment to provide complete information as soon as possible.</li>
              <li>The Data Controller is responsible for notifying the relevant supervisory authority ( DPA) within 72 hours and, where required, informing affected data subjects.</li>
            </ul>
          </section>

          {/* 12. Audit */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">12. Audit Rights</h2>
            <p>
              The Data Controller may request an audit of DarkCart-Pro&rsquo;s data processing compliance no more than once
              per calendar year, at the Data Controller&rsquo;s expense, with reasonable prior written notice (at least 30 days),
              during normal business hours, and subject to confidentiality obligations. Instead of an on-site audit, DarkCart-Pro
              will make available our most recent security certifications (SOC 2, ISO 27001, or equivalent) and complete a
              written questionnaire covering our security and data processing practices.
            </p>
          </section>

          {/* 13. Termination */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">13. Termination & Post-Termination</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>Upon termination or expiration of the Terms of Service, DarkCart-Pro will, at the Data Controller&rsquo;s choice, delete or return all personal data.</li>
              <li>Personal data may be retained beyond termination only as required by applicable legal obligations (e.g., tax law requiring 7-year billing record retention).</li>
              <li>Retention of anonymized, aggregated data that cannot be linked back to individual data subjects does not require deletion or return.</li>
            </ul>
          </section>

          {/* 14. Contact */}
          <section className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-3">14. Contact</h2>
            <p>For DPA-related inquiries or to exercise sub-processor objection rights:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Email: <a href="mailto:privacy@darkcart.pro" className="text-indigo-400 hover:text-indigo-300">privacy@darkcart.pro</a></li>
              <li>EU Representative: DarkCart-Pro EU, Tower 42, 25 Old Broad St, London EC2N 1HQ, UK</li>
              <li>Data Protection Officer: <a href="mailto:dpo@darkcart.pro" className="text-indigo-400 hover:text-indigo-300">dpo@darkcart.pro</a></li>
            </ul>
          </section>

          <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-700">
            <Link href="/legal/terms" className="text-xs text-indigo-400 hover:text-indigo-300 transition">Terms of Service</Link>
            <Link href="/legal/privacy" className="text-xs text-indigo-400 hover:text-indigo-300 transition">Privacy Policy</Link>
            <Link href="/legal/refund" className="text-xs text-indigo-400 hover:text-indigo-300 transition">Refund Policy</Link>
          </div>
        </div>
      </div>
    </main>
  );
}