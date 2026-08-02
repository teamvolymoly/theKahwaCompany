export default function PolicyLayout({ title, children }) {
  return (
    <main className="bg-[#fdfefb] pt-[70px] text-[#252a23]">
      <section className="mx-auto max-w-[1164px] px-5 pb-20 pt-[72px] sm:px-8">
        <h1 className="font-(family-name:--font-basker) text-4xl font-normal uppercase leading-none text-[#344823]">
          {title}
        </h1>
        <div className="mt-9 rounded-lg bg-[#f1f4ec] px-4 py-5 text-base leading-[1.5] text-[#282c26] sm:px-5">
          {children}
        </div>
      </section>
    </main>
  );
}
