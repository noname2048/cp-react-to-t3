import { SensorDataDisplay } from "@/types/sensor";

const round_max = (f: number) => Math.ceil(f * 100) / 100;
const round_min = (f: number) => Math.floor(f * 100) / 100;

export function getTemperatureDomain(array: SensorDataDisplay[] | undefined) {
  if (!array) return { temp_domain_min: 0, temp_domain_max: 30 };

  const temp_min = Math.min(...array.map((d) => d.temperature));
  const temp_max = Math.max(...array.map((d) => d.temperature));
  const variant = (temp_max - temp_min) * 0.15;

  const temp_domain_min = Math.floor(temp_min - variant);
  const temp_domain_max = Math.ceil(temp_max + variant);

  return { temp_domain_min, temp_domain_max };
}
