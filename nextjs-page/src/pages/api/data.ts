// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { subHours } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { sub, formatISO } from "date-fns";

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);

type SensorData = {
  id: number;
  temperature: number;
  humidity: number;
  created_at: string;
};

type SensorDataResponse = {
  data: SensorData[];
  count: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SensorDataResponse | Object>
) {
  if (req.method === "GET") {
    const lte = utcToZonedTime(new Date(), "Asia/Seoul");
    const gte = utcToZonedTime(sub(new Date(), { days: 1 }), "Asia/Seoul");

    let { data, error } = await supabase
      .from("sensor_data")
      .select("*")
      .lte("created_at", formatISO(lte))
      .gte("created_at", formatISO(gte))
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ data });
  } else {
    res.status(405).send({ message: "Method Not Allowed" });
  }
}
