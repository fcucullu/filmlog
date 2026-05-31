export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#111] text-[#ededed]">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-[#8B8B8B] text-sm mb-10">Last updated: May 2025</p>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">What data we collect</h2>
          <p className="text-[#8B8B8B] text-sm leading-relaxed">
            When you sign in with Google, we receive your name, email address, and profile picture
            from Google. We store this information to identify your account. We also store the film
            rolls and shots you log within the app.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">How we use your data</h2>
          <p className="text-[#8B8B8B] text-sm leading-relaxed">
            Your data is used solely to provide the FilmLog service — logging rolls of film,
            recording shot details, and calculating exposure information. We do not use your data
            for advertising or any purpose beyond operating the app.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Google OAuth</h2>
          <p className="text-[#8B8B8B] text-sm leading-relaxed">
            FilmLog uses Google OAuth for authentication. By signing in with Google, you agree to
            Google&apos;s{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E5A100] hover:underline"
            >
              Privacy Policy
            </a>
            . We only request access to your basic profile information (name, email, and photo).
            We do not access your Google Drive, Gmail, or any other Google services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Data storage</h2>
          <p className="text-[#8B8B8B] text-sm leading-relaxed">
            All data is stored securely on{" "}
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E5A100] hover:underline"
            >
              Supabase
            </a>
            , a hosted Postgres database platform. Data is encrypted in transit (HTTPS) and at
            rest. Supabase is SOC 2 Type II compliant.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">We do not sell your data</h2>
          <p className="text-[#8B8B8B] text-sm leading-relaxed">
            We never sell, rent, or share your personal information with third parties for
            commercial purposes. Your data belongs to you.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Data deletion</h2>
          <p className="text-[#8B8B8B] text-sm leading-relaxed">
            You can request deletion of your account and all associated data at any time by
            contacting us. We will process your request within 30 days.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Contact</h2>
          <p className="text-[#8B8B8B] text-sm leading-relaxed">
            If you have questions about this privacy policy, contact us at{" "}
            <a
              href="mailto:francisco.cucullu@gmail.com"
              className="text-[#E5A100] hover:underline"
            >
              francisco.cucullu@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
