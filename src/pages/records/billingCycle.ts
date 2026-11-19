import type { JobProfile } from "@/types";
import type { RecordService } from "@/services/records.service";
import { getRecordReferenceDate } from "@/utils";

export const getBillingCycle = (record: RecordService, profiles: JobProfile[]) => {
  const profile = profiles.find((item) => item.id && item.id === record.jobProfileId);
  const day = profile?.billingCycleStartDay;
  const date = getRecordReferenceDate({ dateTimeRecord: record.dateTimeRecord });
  if (!profile || !date || !day || !Number.isInteger(day) || day < 1 || day > 28) return null;
  const start = new Date(date.getFullYear(), date.getMonth() - (date.getDate() < day ? 1 : 0), day);
  const end = new Date(start.getFullYear(), start.getMonth() + 1, day - 1);
  const label = `Ciclo de ${profile.title}: ${start.toLocaleDateString("es-ES")} – ${end.toLocaleDateString("es-ES")}`;
  const hash = [...(profile.id ?? "")].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const key = JSON.stringify([profile.id, start.getFullYear(), start.getMonth()]);
  const monthFormatter = new Intl.DateTimeFormat("es-ES", { month: "long" });
  const startMonth = monthFormatter.format(start);
  const endMonth = monthFormatter.format(end);
  const monthLabel = startMonth === endMonth ? startMonth : `${startMonth} – ${endMonth}`;
  return {
    key,
    label,
    monthLabel: monthLabel.charAt(0).toLocaleUpperCase("es-ES") + monthLabel.slice(1),
    groupLabel: `${profile.title} · ${start.getFullYear()}`,
    color: (start.getFullYear() * 12 + start.getMonth() + hash) % 4,
  };
};
