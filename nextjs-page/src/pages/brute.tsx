import Head from "next/head";
import GraphTemperature from "@/components/graph-data";
import TextTemperature from "@/components/list-data";
import { useFetch } from "@/utils/use-fetch";

export default function Brute() {
  const { data, isLoading, isError } = useFetch();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error...</div>;
  const array = data?.data;
  if (!array) return <div>No Data</div>;

  return (
    <>
      <Head>
        <title>Temperature of home</title>
      </Head>
      <main className="flex flex-col min-h-screen max-h-screen items-center justify-center p-24 bg-slate-300">
        <div className="rounded-md border-2 border-black m-4">
          <GraphTemperature array={array} />
        </div>
        <div className="flex w-[800px]">
          <TextTemperature array={array} />
        </div>
      </main>
    </>
  );
}

export function getStaticProps() {
  return {
    notFound: process.env.NEXT_PULIC_ENV !== "local",
  };
}
