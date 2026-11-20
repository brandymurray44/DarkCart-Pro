import { CommandCenter, Header, MainContent } from "@/components/layout";

export const metadata = {
  title: "Privacy Policy - DarkCart-Pro",
  description: "Privacy Policy for DarkCart-Pro Shopify SaaS application",
};

export default function PrivacyPolicyPage() {
  return (
    <CommandCenter>
      <Header>
        <div className="flex items-center gap-4">
          <a href="/" className="text-purple-400 hover:text-purple-300">
            ← HOME
          </a>
          <h1 className="text-3xl font-bold text-white tracking-wider">
            PRIVACY POLICY
          </h1>
        </div>
      </Header>

      <MainContent>
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 space-y-6 text-slate-300">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
              <p>
                At DarkCart-Pro, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Shopify SaaS application. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
              <p className="mb-2">We collect information that you provide directly to us, including:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Account information (email address, name)</li>
                <li>Shopify store information (domain, access tokens, shop metadata)</li>
                <li>Product data and content generated through the Service</li>
                <li>Usage data and analytics</li>
                <li>Payment information (processed securely through Shopify Billing)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
              <p className="mb-2">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide, maintain, and improve the Service</li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices, updates, and support messages</li>
                <li>Respond to your comments, questions, and customer service requests</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Data Storage and Security</h2>
              <p>
                We use industry-standard security measures to protect your information. Your data is stored securely using Neon/Postgres database with encryption. We implement appropriate technical and organizational security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Shopify Integration</h2>
              <p>
                Our Service integrates with Shopify through OAuth. When you connect your Shopify store, we receive access to certain data as permitted by the scopes you authorize. We only access the data necessary to provide the Service functionality. We do not share your Shopify data with third parties without your consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. AI Services</h2>
              <p>
                DarkCart-Pro uses AI providers (OpenAI, Anthropic) to generate content. The content you provide as input and the generated output may be processed by these third-party AI services. We do not use your data to train AI models without your explicit consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Data Sharing and Disclosure</h2>
              <p>We may share your information in the following situations:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>With service providers who perform services on our behalf</li>
                <li>To comply with legal obligations</li>
                <li>To protect and defend our rights and property</li>
                <li>With your consent or at your direction</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Your Data Rights</h2>
              <p className="mb-2">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access and receive a copy of your personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to or restrict processing of your data</li>
                <li>Data portability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Cookies and Tracking</h2>
              <p>
                We use cookies and similar tracking technologies to track activity on our Service and store certain information. Cookies are files with small amounts of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Children's Privacy</h2>
              <p>
                Our Service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">12. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at privacy@darkcart-pro.com or through our contact form on the website.
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