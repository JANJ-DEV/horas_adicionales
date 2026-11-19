import { describe, expect, it } from "vitest";
import { getBillingCycle } from "../../../src/pages/records/billingCycle";
import type { JobProfile } from "../../../src/types";

const profiles = [
  { id: "p1", title: "Empresa", billingCycleStartDay: 10 },
  { id: "p2", title: "Otra", billingCycleStartDay: 20 },
] as JobProfile[];
const record = (date: string, jobProfileId = "p1") => ({
  dateTimeRecord: date,
  titleJobProfile: "Empresa",
  jobProfileId,
});

describe("ciclos por perfil", () => {
  it("calcula los límites inclusivos al cruzar un año", () => {
    expect(getBillingCycle(record("2026-01-09T12:00:00"), profiles)?.label).toContain(
      "10/12/2025 – 9/1/2026"
    );
    expect(getBillingCycle(record("2026-01-10T12:00:00"), profiles)?.label).toContain(
      "10/1/2026 – 9/2/2026"
    );
  });
  it("aplica el inicio del perfil y no asigna ciclos a perfiles no configurados", () => {
    expect(getBillingCycle(record("2026-01-10T12:00:00", "p2"), profiles)?.label).toContain(
      "20/12/2025 – 19/1/2026"
    );
    expect(getBillingCycle(record("2026-01-10T12:00:00", "unknown"), profiles)).toBeNull();
  });
  it("usa el mismo color para registros del mismo ciclo y otro para el siguiente", () => {
    expect(getBillingCycle(record("2026-01-10T12:00:00"), profiles)?.color).toBe(
      getBillingCycle(record("2026-02-09T12:00:00"), profiles)?.color
    );
    expect(getBillingCycle(record("2026-01-10T12:00:00"), profiles)?.color).not.toBe(
      getBillingCycle(record("2026-02-10T12:00:00"), profiles)?.color
    );
  });
});
