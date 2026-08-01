const storySections = [
  {
    title: "Our Story",
    paragraphs: [
      "Every great story begins with a simple moment. Ours began with a cup of Kahwa.",
      "Growing up, our grandmother ended each day with a warm cup of Kahwa before bedtime. It wasn’t just a drink, it was a quiet ritual, a moment to slow down, reflect, and unwind.",
      "Watching that tradition become a part of everyday life inspired us to create The Kahwa Company.",
    ],
  },
  {
    title: "Why We Started",
    paragraphs: [
      "Our vision was simple.",
      "To preserve the timeless charm of Kahwa while bringing a fresh sense of imagination to every blend.",
      "We wanted to create teas that honour tradition while offering a refined experience for modern lifestyles.",
    ],
  },
  {
    title: "Crafted With Purpose",
    paragraphs: [
      "Every blend is thoughtfully crafted using whole leaf teas and carefully selected herbs, flowers, fruits, and spices.",
      "We believe exceptional tea begins with exceptional ingredients, creating every cup with balance, flavour, and care.",
    ],
  },
  {
    title: "Our Promise",
    paragraphs: [
      "From responsibly sourcing ingredients to blending and packaging every product, we pay attention to every detail.",
      "Because every cup should reflect the same care with which it was created.",
    ],
  },
  {
    title: "More Than Tea",
    paragraphs: [
      "Whether you’re beginning your morning, taking a mindful pause during the day, or winding down in the evening, we hope our teas become a meaningful part of your daily ritual,",
      "Just as Kahwa was for our grandmother.",
    ],
  },
];

export default function AboutPage() {
  return (
    <main className="bg-[#fdfef9] pt-[70px] text-[#45483f]">
      <section
        className="h-[250px] sm:h-[300px] lg:h-[345px]"
        aria-label="The Kahwa Company story"
        style={{
          backgroundColor: "#fafafa",
          backgroundImage:
            "conic-gradient(#ededed 25%, #fafafa 0 50%, #ededed 0 75%, #fafafa 0)",
          backgroundPosition: "0 0",
          backgroundSize: "116px 116px",
        }}
      />

      <section className="px-5 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:pb-[82px]">
        <div className="mx-auto max-w-[700px] text-center">
          {storySections.map((section, index) => (
            <div key={section.title}>
              <article>
                <h1
                  className="text-[24px] font-normal uppercase leading-tight text-[#3f532b] sm:text-[32px]"
                  style={{ fontFamily: "var(--font-basker)" }}
                >
                  {section.title}
                </h1>

                <div
                  className="mt-7 space-y-5 text-[11px] uppercase leading-[1.35] text-[#55584f] sm:text-[13px]"
                  style={{ fontFamily: "var(--font-basker)" }}
                >
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </article>

              {index < storySections.length - 1 ? (
                <div
                  className="mx-auto my-5 h-[68px] w-px bg-[#788863] sm:my-[18px] sm:h-[76px]"
                  aria-hidden="true"
                />
              ) : null}
            </div>
          ))}

          <div className="mt-9">
            <h2
              className="text-[24px] uppercase leading-tight text-[#829a5e] sm:text-[32px]"
              style={{ fontFamily: "var(--font-basker)" }}
            >
              Thank You
            </h2>
            <p className="mt-4 text-sm text-[#363a32] sm:text-base">
              Thank you for being part of our journey.
            </p>
            <p className="mt-3 text-base font-bold text-[#334722] sm:text-lg">
              The Kahwa Company
            </p>
            <p
              className="mt-3 text-xs uppercase text-[#45483f] sm:text-sm"
              style={{ fontFamily: "var(--font-basker)" }}
            >
              Where Tradition Meets Imagination
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
