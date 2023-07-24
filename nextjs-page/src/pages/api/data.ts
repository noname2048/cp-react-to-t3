// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import { sub, formatISO } from "date-fns";
// import { utcToZonedTime } from "date-fns-tz";
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase-client";
import { SensorDataResponse } from "@/types/sensor";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SensorDataResponse | Object>
) {
  if (req.method === "GET") {
    const { limit = "1500" } = req.query;
    const parsedLimit = parseInt(limit as string);

    // const lte = utcToZonedTime(new Date(), "Asia/Seoul");
    // const gte = utcToZonedTime(sub(new Date(), { days: 1 }), "Asia/Seoul");

    let { data, error } = await supabase
      .from("sensor_data")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(parsedLimit);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ data });
  } else {
    res.status(405).send({ message: "Method Not Allowed" });
  }
}
