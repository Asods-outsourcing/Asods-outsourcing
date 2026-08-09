import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Terms of Service - ASODS Outsourcing Services',
  description: 'ASODS Outsourcing Services Terms of Service covering user responsibilities, acceptable use, and service terms.',
}

export default function TermsOfService() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section 
          className="py-16 bg-cover bg-center bg-fixed relative"
          style={{
            backgroundImage: "url('/hero-privacy.jpg')",
            backgroundAttachment: 'fixed',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            willChange: 'background-image',
          }}
        >
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-black/40"></div>

          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-100">
              Please read these terms carefully before using ASODS services.
            </p>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            {/* Legal Disclaimer */}
            <div className="mb-12 p-6 bg-blue-50 border-l-4 border-blue-500 rounded">
              <p className="text-sm text-blue-900">
                <strong>⚠️ Legal Disclaimer:</strong> This Terms of Service page is draft text generated for structural completeness and compliance purposes. It has not been reviewed by legal counsel and should not be considered final legal documentation. Please review and have qualified legal professionals revise all language, particularly sections addressing liability and user responsibilities, before treating this as binding legal text or using it for regulatory verification (including Google OAuth consent screens).
              </p>
            </div>

            <div className="prose prose-lg max-w-none space-y-8 text-gray-700">
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>
                  1. Acceptance of Terms
                </h2>
                <p>
                  By accessing and using the ASODS Outsourcing website and services (collectively, the "Platform"), you accept and agree to be bound by this Terms of Service agreement. If you do not agree to these terms, you may not use the Platform. These terms apply to all users, including employers seeking staffing services, candidates looking for employment opportunities, and any other person accessing the Platform.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>
                  2. Description of Service
                </h2>
                <p>
                  ASODS Outsourcing Services ("ASODS," "we," "us," or "our") operates a recruitment and staffing platform that connects qualified candidates with employers seeking workforce solutions. Our Platform enables employers to:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Post job opportunities</li>
                  <li>Submit staffing requests for contract or permanent positions</li>
                  <li>Review candidate profiles and applications</li>
                  <li>Manage the hiring and deployment process</li>
                </ul>
                <p className="mt-4">And enables candidates to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Create candidate profiles</li>
                  <li>Submit resumes and CVs</li>
                  <li>Browse and apply for available positions</li>
                  <li>Track application status</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>
                  3. User Accounts and Responsibilities
                </h2>
                
                <h3 className="text-xl font-bold mb-3 mt-6" style={{ color: '#0D1B2A' }}>
                  3.1 Account Creation
                </h3>
                <p>
                  To use certain features of the Platform, you must create an account. You agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain the confidentiality of your account credentials</li>
                  <li>Be responsible for all activities that occur under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                  <li>Use only one account per person/organization</li>
                </ul>

                <h3 className="text-xl font-bold mb-3 mt-6" style={{ color: '#0D1B2A' }}>
                  3.2 Employer Responsibilities
                </h3>
                <p>
                  Employers using the Platform agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Provide accurate descriptions of positions and staffing requirements</li>
                  <li>Treat all candidates fairly and without discrimination</li>
                  <li>Comply with all applicable employment laws and regulations</li>
                  <li>Verify candidate qualifications and references</li>
                  <li>Not use candidate data for purposes unrelated to employment</li>
                  <li>Comply with salary, benefits, and working conditions as applicable by law</li>
                </ul>

                <h3 className="text-xl font-bold mb-3 mt-6" style={{ color: '#0D1B2A' }}>
                  3.3 Candidate Responsibilities
                </h3>
                <p>
                  Candidates using the Platform agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Provide truthful and accurate information on their profile and CV</li>
                  <li>Not misrepresent qualifications, experience, or credentials</li>
                  <li>Submit genuine applications for positions they are interested in</li>
                  <li>Respond professionally to employer communications</li>
                  <li>Not apply for multiple positions with the same employer simultaneously unless requested</li>
                  <li>Honor commitments made through the Platform</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>
                  4. Acceptable Use
                </h2>
                <p>
                  You agree to use the Platform only for lawful purposes. You specifically agree not to:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Harass, threaten, defame, or abuse any user</li>
                  <li>Discriminate against any user based on protected characteristics (race, gender, religion, disability, age, nationality, etc.)</li>
                  <li>Post false, misleading, or defamatory content</li>
                  <li>Attempt to gain unauthorized access to the Platform or its systems</li>
                  <li>Interfere with or disrupt the normal operation of the Platform</li>
                  <li>Engage in any form of fraud, scam, or deception</li>
                  <li>Solicit or conduct unauthorized transactions outside the Platform</li>
                  <li>Use the Platform for human trafficking, forced labor, or any illegal activity</li>
                  <li>Share sensitive personal data without consent</li>
                  <li>Use automated tools (bots, scrapers) to access or collect data from the Platform without authorization</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>
                  5. Candidate Data and CV Submissions
                </h2>
                <p>
                  By uploading a CV or providing personal information on the Platform, candidates grant ASODS and participating employers the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Review and assess qualifications for employment purposes</li>
                  <li>Contact you regarding available opportunities</li>
                  <li>Store your information for recruitment purposes</li>
                  <li>Share your CV with employers who have relevant opportunities</li>
                </ul>
                <p className="mt-4">
                  <strong>Important:</strong> By submitting your CV, you confirm that all information is accurate and that you have the right to share all information provided. ASODS is not responsible for inaccurate or misleading information you provide. Candidates retain ownership of their CVs and personal information and may request deletion in accordance with our Privacy Policy.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>
                  6. Employer Staffing Requests and Service Terms
                </h2>
                <p>
                  Employers submitting staffing requests ("Requests") agree to:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Provide accurate and complete information about staffing needs</li>
                  <li>Respect candidates' privacy and use submitted information only for recruitment purposes</li>
                  <li>Comply with all employment laws, including but not limited to fair hiring practices</li>
                  <li>Not use the Platform to circumvent employment protections or minimize workers' legal rights</li>
                  <li>Not engage in discriminatory hiring practices</li>
                  <li>Pay competitive, fair wages in accordance with applicable laws</li>
                  <li>Provide safe working conditions and comply with occupational health and safety regulations</li>
                </ul>
                <p className="mt-4">
                  ASODS acts as a service facilitator to connect employers and candidates. ASODS does not guarantee employment, placement, or any specific outcome. ASODS is not a party to employment contracts between employers and candidates and is not responsible for disputes arising from employment relationships.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>
                  7. Limitation of Liability
                </h2>
                <p>
                  <strong>To the fullest extent permitted by law:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>ASODS provides the Platform "as is" and "as available" without warranties of any kind, express or implied</li>
                  <li>ASODS does not warrant that the Platform will be uninterrupted, error-free, or free from harmful components</li>
                  <li>ASODS does not guarantee the accuracy, reliability, or completeness of any information on the Platform</li>
                  <li>ASODS does not guarantee employment, placement outcomes, or successful matching of candidates with employers</li>
                  <li>ASODS is not responsible for the accuracy of candidate qualifications or employer job descriptions</li>
                  <li>ASODS is not liable for disputes, misrepresentations, or failures arising from employment relationships</li>
                  <li>ASODS is not responsible for external links, third-party services, or content outside our direct control</li>
                </ul>
                <p className="mt-4">
                  <strong>In no event shall ASODS be liable for indirect, incidental, special, consequential, or punitive damages, including lost profits, lost data, or business interruption, even if advised of the possibility of such damages.</strong>
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>
                  8. Intellectual Property
                </h2>
                <p>
                  All content on the ASODS Platform, including text, graphics, logos, images, and software, is the property of ASODS or its licensors and is protected by copyright and other intellectual property laws. You may not reproduce, modify, or distribute any content without our written permission. Users may download and print content solely for personal, non-commercial use.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>
                  9. Termination of Access
                </h2>
                <p>
                  ASODS reserves the right to suspend or terminate your account and access to the Platform at any time without notice if:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>You violate these Terms of Service</li>
                  <li>You engage in unlawful or fraudulent activity</li>
                  <li>You harass or abuse other users</li>
                  <li>Your account is used for unauthorized purposes</li>
                  <li>You repeatedly violate Platform policies</li>
                </ul>
                <p className="mt-4">
                  Upon termination, your right to use the Platform ceases immediately. Any provisions that by their nature should survive termination (including limitations of liability and intellectual property rights) shall continue in effect.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>
                  10. Changes to Terms
                </h2>
                <p>
                  ASODS reserves the right to update, modify, or change these Terms of Service at any time. Changes will be posted on this page with an updated "Last Updated" date. Your continued use of the Platform after changes are posted constitutes your acceptance of the updated Terms. We encourage you to review these terms periodically to ensure you are aware of any changes.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>
                  11. Governing Law and Dispute Resolution
                </h2>
                <p>
                  These Terms of Service are governed by and construed in accordance with the laws of Nigeria. Any disputes arising from these terms or use of the Platform shall be resolved in the courts of Nigeria. By using the Platform, you consent to the jurisdiction and venue of Nigerian courts.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>
                  12. Severability
                </h2>
                <p>
                  If any provision of these Terms is found to be invalid or unenforceable, that provision shall be severed and the remaining provisions shall continue in full force and effect.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>
                  13. Entire Agreement
                </h2>
                <p>
                  These Terms of Service, together with our Privacy Policy, constitute the entire agreement between you and ASODS regarding use of the Platform and supersede any prior agreements or understandings.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#0D1B2A' }}>
                  14. Contact Information
                </h2>
                <p>
                  If you have questions about these Terms of Service, please contact us:
                </p>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p><strong>ASODS Outsourcing Services</strong></p>
                  <p>Lagos, Nigeria</p>
                  <p>Email: legal@asods.com</p>
                  <p>Phone: +234 705 225 8590</p>
                </div>
              </div>

              <div className="text-sm text-gray-500 mt-12 pt-8 border-t">
                <p><strong>Last Updated:</strong> August 2026</p>
                <p className="mt-2 text-xs">
                  <strong>Status:</strong> Draft - Not reviewed by legal counsel. Please consult qualified legal professionals before using as binding terms.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
