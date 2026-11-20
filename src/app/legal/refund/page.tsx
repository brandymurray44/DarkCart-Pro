import { CommandCenter, Header, MainContent } from "@/components/layout";

export const metadata = {
  title: "Refund Policy - DarkCart-Pro",
  description: "Refund Policy for DarkCart-Pro Shopify SaaS application",
};

export default function RefundPolicyPage() {
  return (
    <CommandCenter>
      <Header>
        <div className="flex items-center gap-4">
          <a href="/" className="text-purple-400 hover:text-purple-300">
            ← HOME
          </a>
          <h1 className="text-3xl font-bold text-white tracking-wider">
            REFUND POLICY
          </h1>
        </div>
      </Header>

      <MainContent>
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 space-y-6 text-slate-300">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Overview</h2>
              <p>
                At DarkCart-Pro, we want you to be completely satisfied with our Service. This Refund Policy outlines the terms and conditions for refunds on our subscription-based services. Please read this policy carefully before purchasing any subscription plan.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. 30-Day Money-Back Guarantee</h2>
              <p>
                We offer a 30-day money-back guarantee for all new subscriptions. If you are not satisfied with the Service within the first 30 days of your subscription, you may request a full refund. This guarantee applies only to the initial subscription period and does not apply to renewal subscriptions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Eligibility for Refunds</h2>
              <p className="mb-2">To be eligible for a refund, the following conditions must be met:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>The refund request must be submitted within 30 days of the initial subscription purchase</li>
                <li>The account must be in good standing with no violations of our Terms of Service</li>
                <li>The request must be submitted by the account owner or authorized billing contact</li>
                <li>For subscription renewals, refund requests must be submitted within 7 days of the renewal date</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. How to Request a Refund</h2>
              <p className="mb-2">To request a refund, please follow these steps:</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Contact our support team at support@darkcart-pro.com</li>
                <li>Include your account email address and Shopify store domain</li>
                <li>Provide a brief explanation of why you are requesting a refund</li>
                <li>Our team will review your request within 3-5 business days</li>
                <li>If approved, the refund will be processed within 7-10 business days</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Refund Processing</h2>
              <p>
                Approved refunds will be issued to the original payment method used for the purchase. Please allow 7-10 business days for the refund to appear in your account, depending on your financial institution's processing times. We are not responsible for any delays caused by payment processors or financial institutions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Non-Refundable Items</h2>
              <p className="mb-2">The following are not eligible for refunds:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Subscription renewals after the initial 30-day period</li>
                <li>Partial months of service</li>
                <li>Setup fees or one-time charges (if applicable)</li>
                <li>Accounts terminated for violation of Terms of Service</li>
                <li>Requests made after the eligibility period has expired</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Subscription Cancellation</h2>
              <p>
                You may cancel your subscription at any time through your account settings or by contacting our support team. Cancellation will take effect at the end of your current billing period. You will continue to have access to the Service until the end of your paid period. We do not provide prorated refunds for partial billing periods.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Service Issues</h2>
              <p>
                If you experience technical issues or service interruptions that significantly impact your ability to use the Service, please contact our support team. We will work with you to resolve the issue. In cases where we cannot resolve the issue to your satisfaction, we may offer a partial refund or service credit at our discretion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Dispute Resolution</h2>
              <p>
                If you are not satisfied with our refund decision, you may escalate the matter by contacting our support team for further review. We are committed to resolving disputes fairly and in good faith. For unresolved disputes, you may pursue resolution through your payment provider's dispute process.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Changes to This Policy</h2>
              <p>
                We reserve the right to modify this Refund Policy at any time. Changes will be effective immediately upon posting to the Service. Your continued use of the Service after any changes indicates your acceptance of the new terms. We encourage you to review this policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Contact Information</h2>
              <p>
                If you have any questions about this Refund Policy or would like to request a refund, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-slate-900/50 border border-slate-600 rounded-lg">
                <p className="text-white">Email: support@darkcart-pro.com</p>
                <p className="text-white">Subject: Refund Request - [Your Store Domain]</p>
              </div>
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