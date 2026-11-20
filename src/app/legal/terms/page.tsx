import { CommandCenter, Header, MainContent } from "@/components/layout";

export const metadata = {
  title: "Terms of Service - DarkCart-Pro",
  description: "Terms of Service for DarkCart-Pro Shopify SaaS application",
};

export default function TermsOfServicePage() {
  return (
    <CommandCenter>
      <Header>
        <div className="flex items-center gap-4">
          <a href="/" className="text-purple-400 hover:text-purple-300">
            ← HOME
          </a>
          <h1 className="text-3xl font-bold text-white tracking-wider">
            TERMS OF SERVICE
          </h1>
        </div>
      </Header>

      <MainContent>
        <div className="max-w-4xl mx-auto prose prose-invert">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 space-y-6 text-slate-300">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using DarkCart-Pro ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
              <p>
                DarkCart-Pro is an AI-powered Shopify intelligence and growth engine that provides merchants with tools for trend discovery, competitor analysis, product generation, and content creation. The Service integrates with your Shopify store via OAuth and provides various AI-powered features.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>
              <p>
                To access certain features of the Service, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate and complete information when creating your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Subscription and Billing</h2>
              <p>
                DarkCart-Pro offers a subscription-based service with recurring charges. By subscribing, you authorize us to charge your payment method on a recurring basis. Subscription fees are billed in advance and are non-refundable except as required by law or as explicitly stated in our Refund Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Acceptable Use</h2>
              <p>
                You agree not to use the Service for any unlawful purpose or in any way that could damage, disable, or impair the Service. You shall not attempt to gain unauthorized access to any portion of the Service or any systems or networks connected to the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Intellectual Property</h2>
              <p>
                The Service and its original content, features, and functionality are and will remain the exclusive property of DarkCart-Pro and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used without our prior written consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Limitation of Liability</h2>
              <p>
                In no event shall DarkCart-Pro, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Changes to Terms</h2>
              <p>
                We reserve the right to modify or replace these Terms of Service at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at support@darkcart-pro.com.
              </p>
            </section>

            <div className="text-sm text-slate-400 pt-6 border-t border-slate-700">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </MainContent>
    </CommandCenter>
  );
}