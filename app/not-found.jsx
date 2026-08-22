import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[630px] items-center justify-center bg-[#fdfefb] px-5 pt-[70px] text-[#11140f] sm:px-8">
      <div className="grid w-full max-w-[980px] items-center gap-8 py-16 md:grid-cols-[420px_minmax(0,480px)] md:gap-14">
        <img
          src="/icons/TeaImage.svg"
          alt="A warm cup of Kahwa"
          className="mx-auto w-full max-w-[390px] object-contain"
        />
        <div className="text-center md:text-left">
          <p className="text-[104px] font-bold leading-[0.85] text-[#a02a2a] sm:text-[132px]">
            404
          </p>
          <h1 className="mt-7 text-[30px] font-semibold leading-[1.12] sm:text-[38px]">
            We can&apos;t find the page
            <br />
            your are looking for
          </h1>
          <Link
            href="/"
            className="mx-auto mt-9 flex h-12 w-full max-w-[245px] items-center justify-center rounded-lg bg-[#52653b] text-base font-semibold text-white transition-colors hover:bg-[#6B7F42] md:mx-0"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
