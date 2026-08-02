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
        className="relative flex h-[250px] items-center justify-center overflow-hidden bg-[#efe8dc] bg-cover bg-center sm:h-[300px] lg:h-[345px]"
        aria-label="The Kahwa Company story"
        style={{ backgroundImage: 'url("/bg/Rectangle 4245.png")' }}
      >
        <div className="absolute inset-0 bg-white/10" aria-hidden="true" />
        <h1
          className="relative z-10 max-w-[900px] px-6 text-center text-4xl font-normal uppercase leading-[1.12] text-[#292b27]"
          style={{ fontFamily: "var(--font-basker)" }}
        >
          Our Story, Rooted in Tradition
        </h1>
      </section>

      <section className="px-5 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:pb-[82px]">
        <div className="mx-auto max-w-[700px] text-center">
          {storySections.map((section, index) => (
            <div key={section.title}>
              <article>
                <h2
                  className="text-4xl font-normal uppercase leading-tight text-[#3f532b]"
                  style={{ fontFamily: "var(--font-basker)" }}
                >
                  {section.title}
                </h2>

                <div
                  className="mt-7 space-y-5 text-base uppercase leading-[1.45] text-[#55584f]"
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
              className="text-4xl uppercase leading-tight text-[#829a5e]"
              style={{ fontFamily: "var(--font-basker)" }}
            >
              Thank You
            </h2>
            <p className="mt-4 text-base text-[#363a32]">
              Thank you for being part of our journey.
            </p>
            <p className="mt-3 text-base font-bold text-[#334722]">
              The Kahwa Company
            </p>
            <p
              className="mt-3 text-base uppercase text-[#45483f]"
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
