import ResetPasswordForm from "./ResetPasswordForm";

export const metadata = {
  title: "Reset Password | The Kahwa Co.",
  description: "Set a new password for your Kahwa Co. account.",
};

export default function ResetPasswordPage() {
  return (
    <main className="bg-[#fdfefb] pt-[88px] text-[#252a23]">
      <section className="site-container pb-[70px] pt-12 md:pt-20">
        <h1 className="font-basker text-[28px] font-normal uppercase leading-[1.2] text-[#344823] md:text-4xl">
          Reset password
        </h1>
        <div className="mt-8 rounded-lg bg-[#f1f4ec] px-5 py-6 md:mt-11">
          <ResetPasswordForm />
        </div>
      </section>
    </main>
  );
}
