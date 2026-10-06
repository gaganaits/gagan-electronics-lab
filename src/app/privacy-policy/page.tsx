import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Gagan Electronics Lab",
  description:
    "Privacy policy regarding customer personal information, CAD model storage, retention rules, and data security at Gagan Electronics Lab.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-32 sm:pt-40 pb-24 max-w-4xl mx-auto px-4 sm:px-6">
      <div className="mb-10 space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block">
          Data Protection
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
          Privacy Policy & CAD Confidentiality
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Last updated: October 2026
        </p>
      </div>

      <div className="bg-white border border-stone-200/90 rounded-card-xl p-8 sm:p-12 shadow-soft space-y-8 text-xs sm:text-sm text-stone-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-stone-900">
            1. Commitment to Confidentiality
          </h2>
          <p>
            At Gagan Electronics Lab, we recognize that CAD files, 3D models, and technical drawings often represent valuable proprietary intellectual property, trade secrets, and patent-pending inventions. We treat all submitted customer materials with the highest standard of commercial discretion.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-stone-900">
            2. Information We Collect
          </h2>
          <p>
            When you interact with our website or submit a quotation request, we collect:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Contact details:</strong> Full name, company or organization, email address, phone/WhatsApp number, and physical shipping address.</li>
            <li><strong>Engineering specifications:</strong> Selected manufacturing technology, quantities, filament/resin choices, color, layer height, and project notes.</li>
            <li><strong>Digital CAD & 2D files:</strong> Uploaded .STL, .PDF, or image documentation, or Google Drive folder links provided by you.</li>
            <li><strong>Technical access logs:</strong> IP address, browser type, and submission timestamps used strictly for rate limiting, anti-abuse, and cybersecurity defense.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-stone-900">
            3. How Uploaded CAD Files are Stored and Handled
          </h2>
          <p>
            All files uploaded through our website are stored in <strong>strictly private, access-controlled object storage buckets</strong>. They are never published, never indexed by web search engines, and never made accessible via public URLs.
          </p>
          <p>
            Authorized laboratory personnel access customer files exclusively through temporary, cryptographic signed URLs that automatically expire.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-stone-900">
            4. Google Drive Links
          </h2>
          <p>
            If you provide a Google Drive link, we only access the files to evaluate your quotation and execute production. Our servers never perform automated external fetching of arbitrary web addresses, protecting both your assets and our infrastructure against security vulnerabilities.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-stone-900">
            5. File Retention & Deletion Schedule
          </h2>
          <p>
            Unless an ongoing manufacturing agreement requires continued file retention:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Unaccepted quotes: Uploaded CAD files are scheduled for automatic purge ninety (90) days after quotation expiry.</li>
            <li>Completed production orders: CAD files are archived for repeat re-order convenience for up to one hundred and eighty (180) days, after which they may be permanently expunged upon customer request.</li>
            <li>You may request immediate manual deletion of all submitted CAD files upon order completion by emailing <code>quotes@gaganelectronicslab.com</code>.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-stone-900">
            6. No Third-Party Data Sale
          </h2>
          <p>
            We do not sell, rent, monetize, or disclose your contact details or CAD data to any third-party advertisers or external marketing platforms.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-bold text-stone-900">
            7. Contact Information
          </h2>
          <p>
            For data privacy inquiries or deletion requests, please contact our data administrator at <code>quotes@gaganelectronicslab.com</code>.
          </p>
        </section>
      </div>
    </div>
  );
}
