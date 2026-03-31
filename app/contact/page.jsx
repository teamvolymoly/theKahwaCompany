"use client";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-black mt-12">
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-black/60">
              Contact
            </p>
            <h1
              className="mt-3 text-3xl md:text-4xl font-semibold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Let’s brew something together
            </h1>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-black/50">
              Send a message
            </p>
            <form className="mt-6 grid gap-4">
              <input
                className="rounded-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-black"
                placeholder="Full name"
              />
              <input
                className="rounded-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-black"
                placeholder="Email address"
              />
              <input
                className="rounded-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-black"
                placeholder="Phone"
              />
              <textarea
                className="rounded-2xl border border-black/20 px-4 py-3 text-sm outline-none focus:border-black"
                rows={5}
                placeholder="Tell us about your inquiry"
              />
              <button className="rounded-full bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white">
                Send message
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-black/10 bg-black/5 p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-black/50">
              Contact details
            </p>
            <div className="mt-4 space-y-3 text-sm text-black/70">
              <p>info@thekahwacompany.com</p>
              <p>+91 95822 51241</p>
              <p>Srinagar, Kashmir</p>
            </div>
            <p className="mt-6 text-xs uppercase tracking-[0.3em] text-black/50">
              Support hours
            </p>
            <p className="mt-2 text-sm text-black/70">
              Mon–Sat, 10:00 AM – 7:00 PM
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
