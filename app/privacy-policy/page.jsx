import PolicyLayout from "@/components/PolicyLayout";

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout title="Privacy Policy">
      <div className="space-y-5">
        <p>Effective Date : 28th July 2026</p>
        <p>
          Welcome to The Kahwa Company (&quot;we,&quot; &quot;our,&quot; or
          &quot;us&quot;). Your privacy is important to us. This Privacy Policy
          explains how we collect, use, disclose, and protect your information
          when you visit our website.
        </p>

        <h2>1. Information We Collect</h2>
        <p>We may collect the following information:</p>
        <p>
          Name
          <br />
          Email address
          <br />
          Phone number
          <br />
          Billing and shipping address
          <br />
          Payment information (processed securely by our payment partners; we
          do not store your card details)
          <br />
          Order history
          <br />
          Device information, browser type, IP address, and cookies
        </p>

        <h2>2. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <p>
          Process and deliver your orders
          <br />
          Provide customer support
          <br />
          Send order confirmations and shipping updates
          <br />
          Improve our website and customer experience
          <br />
          Send promotional offers (only if you have opted in)
          <br />
          Prevent fraud and comply with legal obligations
        </p>

        <h2>3. Sharing Your Information</h2>
        <p>We may share your information with:</p>
        <p>
          Payment gateway providers
          <br />
          Shipping and logistics partners
          <br />
          Technology service providers
          <br />
          Government authorities when required by law
        </p>
        <p>We do not sell or rent your personal information.</p>

        <h2>4. Cookies</h2>
        <p>
          Our website uses cookies to improve your browsing experience,
          remember your preferences, and analyze website traffic. You may
          disable cookies through your browser settings.
        </p>

        <h2>5. Data Security</h2>
        <p>
          We implement reasonable security measures to protect your personal
          information. However, no method of transmission over the internet or
          electronic storage is completely secure.
        </p>

        <h2>6. Your Rights</h2>
        <p>You may request to:</p>
        <p>
          Access your personal information
          <br />
          Correct inaccurate information
          <br />
          Delete your personal information (subject to legal obligations)
          <br />
          Opt out of marketing communications
        </p>
        <p>Please contact us using the details below.</p>

        <h2>7. Third-Party Services</h2>
        <p>
          Our website may contain links to third-party websites. We are not
          responsible for their privacy practices.
        </p>

        <h2>8. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will
          be posted on this page with the revised effective date.
        </p>

        <h2>9. Contact Us</h2>
        <p>
          The Kahwa Company
          <br />
          Email: info@thekahwacompany.com
          <br />
          Website: www.thekahwacompany.com
        </p>
      </div>
    </PolicyLayout>
  );
}
