export default function PolicyLayout({ title, children }) {
  return (
    <main className="bg-[#fdfefb] pt-[70px] text-[#252a23]">
      <section className="mx-auto max-w-[1164px] px-5 pb-20 pt-[72px] sm:px-8">
        <h1 className="font-(family-name:--font-basker) text-[36px] font-normal uppercase leading-none text-[#344823] sm:text-[42px]">
          {title}
        </h1>
        <div className="mt-9 rounded-lg bg-[#f1f4ec] px-4 py-5 text-[13px] leading-[1.28] text-[#282c26] sm:px-5 sm:text-sm sm:leading-[1.3]">
          {children}
        </div>
      </section>
    </main>
  );
}
