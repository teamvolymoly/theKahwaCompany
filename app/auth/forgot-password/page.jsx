import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ForgotPasswordForm from "./ForgotPasswordForm";

export const metadata = {
  title: "Forgotten Password | The Kahwa Co.",
  description: "Request a password reset for your Kahwa Co. account.",
};

export default function ForgotPasswordPage() {
  return (
    <main className="bg-[#fdfefb] pt-[88px] text-[#252a23]">
      <section className="site-container pb-[70px] pt-12 md:pt-20">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-basker text-[28px] font-normal uppercase leading-[1.2] text-[#344823] md:text-4xl">
            Forgotten password
          </h1>
          <Link
            href="/auth/login"
            className="inline-flex w-fit shrink-0 items-center gap-2 text-base font-semibold text-[#6b7f42] underline underline-offset-4 transition-colors hover:text-[#344823] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#52653b]"
          >
            Back to log in
            <ChevronRight size={20} strokeWidth={1.8} aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-8 rounded-lg bg-[#f1f4ec] px-5 py-6 md:mt-11">
          <ForgotPasswordForm />
        </div>
      </section>
    </main>
  );
}
