import { SensorDataDisplay } from "@/types/sensor";

export function getTemperatureDomain(array: SensorDataDisplay[] | undefined) {
  if (!array) return { temp_domain_min: 0, temp_domain_max: 30 };

  const temp_min = Math.min(...array.map((d) => d.temperature));
  const temp_max = Math.max(...array.map((d) => d.temperature));
  const variant = (temp_max - temp_min) * 0.15;

  const temp_domain_min = Math.floor(temp_min - variant);
  const temp_domain_max = Math.ceil(temp_max + variant);

  return { temp_domain_min, temp_domain_max };
}
