import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Privacy Policy - ASODS Outsourcing',
  description: 'ASODS Outsourcing privacy policy and data protection practices.',
}

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <main>
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <h1 className="text-4xl font-bold mb-8" style={{ color: '#0D1B2A' }}>
              Privacy Policy
            </h1>

            <div className="prose prose-lg max-w-none space-y-8 text-gray-700">
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>
                  1. Introduction
                </h2>
                <p>
                  ASODS Outsourcing Limited ("we," "us," or "our") operates the ASODS website and services. This Privacy Policy explains how we collect, use, disclose, and otherwise process your personal information.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>
                  2. Information We Collect
                </h2>
                <p>We collect information in the following ways:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li><strong>Direct Submission:</strong> When you submit a staffing request, contact form, or create an account, we collect your name, email, phone number, company name, and any other information you provide.</li>
                  <li><strong>Cookies & Analytics:</strong> We use cookies and similar technologies to understand how you use our site, improve user experience, and track engagement.</li>
                  <li><strong>Device Information:</strong> We automatically collect information about your device, browser type, IP address, and pages visited.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>
                  3. How We Use Your Information
                </h2>
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Respond to your inquiries and process staffing requests</li>
                  <li>Send you updates about your request status and our services</li>
                  <li>Improve and personalize your experience on our website</li>
                  <li>Send marketing communications (which you can opt out of anytime)</li>
                  <li>Comply with legal obligations and regulations</li>
                  <li>Prevent fraud and maintain security</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>
                  4. Data Sharing & Disclosure
                </h2>
                <p>
                  We do not sell or rent your personal information. We may share your information with:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li><strong>Service Providers:</strong> Trusted partners who help us operate our business (e.g., hosting, analytics, email services)</li>
                  <li><strong>Legal Obligations:</strong> When required by law or to protect our legal rights</li>
                  <li><strong>Business Partners:</strong> With your consent, to fulfill staffing requests or provide services</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>
                  5. Data Retention
                </h2>
                <p>
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless longer retention is required by law. Generally, we retain staffing request data for 2 years after completion.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>
                  6. Your Rights
                </h2>
                <p>
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Access your personal information</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your data (subject to legal obligations)</li>
                  <li>Opt out of marketing communications</li>
                  <li>Withdraw consent to data processing</li>
                </ul>
                <p className="mt-4">
                  To exercise these rights, contact us at <strong>privacy@asods.com</strong>.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>
                  7. Security
                </h2>
                <p>
                  We implement industry-standard security measures to protect your data, including encryption, secure servers, and access controls. However, no security system is completely impenetrable. We cannot guarantee absolute security.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>
                  8. Third-Party Links
                </h2>
                <p>
                  Our website may contain links to third-party websites. We are not responsible for the privacy practices of external sites. We encourage you to review their privacy policies before sharing information.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>
                  9. Children's Privacy
                </h2>
                <p>
                  Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If we become aware of data collection from a minor, we will delete it immediately.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>
                  10. Changes to This Policy
                </h2>
                <p>
                  We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last Updated" date. Your continued use of our services indicates acceptance of the updated policy.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>
                  11. Contact Us
                </h2>
                <p>
                  If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p><strong>ASODS Outsourcing Limited</strong></p>
                  <p>Lagos, Nigeria</p>
                  <p>Email: privacy@asods.com</p>
                  <p>Phone: +234 (0) XXX XXX XXXX</p>
                </div>
              </div>

              <div className="text-sm text-gray-500 mt-12 pt-8 border-t">
                <p>Last Updated: August 2026</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
