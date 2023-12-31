import Head from "next/head";
import Link from "next/link";

export default function Home() {
  const isLocal = process.env.NEXT_PUBLIC_ENV === "local";
  return (
    <>
      <Head>
        <title>Temperature of home</title>
      </Head>
      <main className="min-w-fit min-h-screen flex flex-col justify-center items-center gap-10">
        <h1 className="w-96 h-96 flex justify-center items-center text-5xl bg-teal-100 rounded-3xl">
          Iot Temperature
        </h1>
        <div className="flex gap-5 justify-center items-center">
          {isLocal && (
            <Link href="/brute">
              <button className="w-36 h-20 rounded-2xl hover:bg-orange-300 bg-orange-400">
                brute
              </button>
            </Link>
          )}
          <Link href="/supabase">
            <button className="w-36 h-20 rounded-2xl hover:bg-orange-300 bg-slate-400">
              supabase
            </button>
          </Link>
          <Link href="/grid-display">
            <button className="w-36 h-20 rounded-2xl hover:bg-orange-200 bg-orange-100">
              grid-display
            </button>
          </Link>
        </div>
      </main>
    </>
  );
}
