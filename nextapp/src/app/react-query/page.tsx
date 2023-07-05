"use client";

import getQueryClient from "@/app/utils/getQueryClient";
import Hydrate from "@/app/utils/hydrate.client";
import { dehydrate } from "react-query";
import ListData from "./list-data";
import { SensorData } from "@/app/types";

async function getData() {
  const res = await fetch("http://localhost:8000/data");
  return (await res.json()) as SensorData[];
}

export default async function Page() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(["hydrate-data"], getData);
  const dehydrateState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydrateState}>
      <ListData />
    </Hydrate>
  );
}
