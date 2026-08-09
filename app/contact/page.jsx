"use client";

import Link from "next/link";
import { useState } from "react";

import { apiFetch } from "@/utils/api";

const contactOptions = [
  {
    title: "Refund Policy",
    detail: "Click to Know More",
    image: "/icons/contact/Refund.svg",
    href: "/refund",
  },
  {
    title: "Email",
    detail: "info@thekahwacompany.com",
    image: "/icons/contact/Email.svg",
    href: "mailto:info@thekahwacompany.com",
  },
  {
    title: "Track Order",
    detail: "Click to Know More",
    image: "/icons/contact/TrackOrder.svg",
    href: "/track-order",
  },
  {
    title: "Phone Number",
    detail: "+91 95822 51241",
    image: "/icons/contact/PhoneNumber.svg",
    href: "tel:+919582251241",
  },
];

const fieldClass =
  "h-11 w-full rounded-md border border-[#9aa58e]/35 bg-transparent px-5 text-base text-[#30362b] outline-none transition-colors placeholder:text-[#777d73] focus:border-transparent focus:ring-0";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      company_name: String(formData.get("company_name") || "").trim(),
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone_number: String(formData.get("phone") || "").trim(),
      comment: String(formData.get("comment") || "").trim(),
    };

    setIsSubmitting(true);
    try {
      await apiFetch("/contact-queries", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      form.reset();
      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            message: "Your query has been submitted successfully.",
            type: "success",
          },
        }),
      );
    } catch (error) {
      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            message: error?.message || "Unable to submit your query.",
            type: "error",
          },
        }),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-[#fdfefb] pt-[70px] text-[#252a23]">
      <section className="site-container pb-[92px] pt-[72px]">
        <h1 className="font-(family-name:--font-basker) text-4xl font-normal uppercase leading-none text-[#344823]">
          Contact Us
        </h1>
        <p className="mt-6 max-w-[1040px] text-base leading-relaxed text-[#333730]">
          If you have questions about your order, need help with brewing, or
          just want to chat we&apos;re here for you!
        </p>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {contactOptions.map((option) => {
            const externalAction =
              option.href.startsWith("mailto:") ||
              option.href.startsWith("tel:");
            const content = (
              <>
                <img
                  src={option.image}
                  alt=""
                  className="h-12 w-12 object-contain sm:h-14 sm:w-14"
                />
                <h2 className="mt-5 text-center text-base font-semibold leading-tight text-[#344823] sm:text-xl">
                  {option.title}
                </h2>
                <p className="mt-1 text-center text-base leading-tight text-[#30352d] text-md">
                  {option.detail}
                </p>
              </>
            );

            const cardClass =
              "group flex min-h-[154px] flex-col items-center justify-center rounded-lg bg-[#f1f4ec] px-3 py-5 transition-colors hover:bg-[#e9eee3] sm:px-5";

            return externalAction ? (
              <a key={option.title} href={option.href} className={cardClass}>
                {content}
              </a>
            ) : (
              <Link key={option.title} href={option.href} className={cardClass}>
                {content}
              </Link>
            );
          })}
        </div>

        <p className="mt-11 text-lg font-thin uppercase tracking-[0.01em] text-[#30352d] sm:text-xl">
          Mon - Friday : 9AM to 7PM IST
        </p>

        <div className="mt-11 grid items-stretch gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-lg bg-[#f1f4ec] px-6 py-8 sm:px-9 sm:py-10">
            <h2 className="max-w-[560px] md:text-3xl 2xl:text-4xl font-semibold leading-[1.2] text-[#2f4819]">
              Drop your query below and we will
              <br className="hidden sm:block" /> get back to you!
            </h2>

            <form
              className="mt-8 grid grid-cols-1 gap-x-7 gap-y-4 sm:grid-cols-2"
              onSubmit={handleSubmit}
            >
              <label className="sr-only" htmlFor="contact-company">
                Company Name
              </label>
              <input
                id="contact-company"
                name="company_name"
                className={fieldClass}
                placeholder="Company Name"
              />

              <label className="sr-only" htmlFor="contact-name">
                Name
              </label>
              <input
                id="contact-name"
                name="name"
                className={fieldClass}
                placeholder="Name"
              />

              <label className="sr-only" htmlFor="contact-email">
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                className={fieldClass}
                placeholder="Email"
              />

              <label className="sr-only" htmlFor="contact-phone">
                Phone Number
              </label>
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                className={fieldClass}
                placeholder="Phone Number"
              />

              <label className="sr-only" htmlFor="contact-comment">
                Comment
              </label>
              <textarea
                id="contact-comment"
                name="comment"
                rows={5}
                className="min-h-[124px] resize-y rounded-md border border-[#9aa58e]/35 bg-transparent px-5 py-3 text-base text-[#30362b] outline-none transition-colors placeholder:text-[#777d73] focus:border-transparent focus:ring-0 sm:col-span-2"
                placeholder="Comment"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="h-11 cursor-pointer rounded-md bg-[#52653b] px-6 text-base font-semibold text-white transition-colors hover:bg-[#6B7F42] sm:col-span-2"
              >
                Request a Call Back
              </button>
            </form>
          </div>

          <div className="min-h-[430px] overflow-hidden rounded-lg bg-[#eee7da] lg:min-h-0">
            <img
              src="/bg/TKC Website Images/Products Image.png"
              alt="The Kahwa Company product collection"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
