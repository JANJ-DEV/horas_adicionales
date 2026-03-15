import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ActionFunctionArgs } from "react-router";

const mocks = vi.hoisted(() => ({
  saveRecord: vi.fn(),
  getUtilitiesCatalogFromFirestore: vi.fn(),
  getActiveUtilityIdsForProfile: vi.fn(),
  authFirebase: {
    currentUser: { uid: "user-123" },
  } as { currentUser: { uid: string } | null },
}));

vi.mock("@/apis/firebase", () => ({
  authFirebase: mocks.authFirebase,
}));

vi.mock("@/services/records.service", () => ({
  saveRecord: mocks.saveRecord,
}));

vi.mock("@/services/utilities.service", () => ({
  getUtilitiesCatalogFromFirestore: mocks.getUtilitiesCatalogFromFirestore,
  getActiveUtilityIdsForProfile: mocks.getActiveUtilityIdsForProfile,
}));

import { add } from "../../../src/routes/actions/records.actions";

const buildCatalog = (overrides: Record<string, unknown> = {}) => ({
  global_utilities: [],
  branch_utilities: {},
  utility_definitions: {},
  ...overrides,
});

const buildRequest = (entries: Array<[string, string]>) => {
  const formData = new FormData();

  entries.forEach(([key, value]) => {
    formData.append(key, value);
  });

  return new Request("http://localhost/records/add", {
    method: "POST",
    body: formData,
  });
};

const buildActionArgs = (request: Request): ActionFunctionArgs => ({
  request,
  params: {},
  context: undefined,
  unstable_pattern: "/records/add",
});

describe("records.actions add", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.authFirebase.currentUser = { uid: "user-123" };
    mocks.saveRecord.mockImplementation(async (payload) => payload);
    mocks.getUtilitiesCatalogFromFirestore.mockResolvedValue(buildCatalog());
    mocks.getActiveUtilityIdsForProfile.mockReturnValue([]);
  });

  it("rechaza utilidades no habilitadas para el perfil", async () => {
    mocks.getActiveUtilityIdsForProfile.mockReturnValue(["valid_utility"]);

    const result = await add(
      buildActionArgs(
        buildRequest([
          ["titleJobProfile", "Turno noche"],
          ["dateTimeRecord", "2026-03-14"],
          ["workStartTime", "08:00"],
          ["workEndTime", "17:00"],
          ["estimatedHourlyRate", "15"],
          ["selectedUtilityIds", "invalid_utility"],
        ])
      )
    );

    expect(result).toEqual({
      error: "La selección de utilidades no es válida para el perfil seleccionado.",
    });
    expect(mocks.saveRecord).not.toHaveBeenCalled();
  });

  it("reporta utilidades requeridas faltantes usando required o refquired", async () => {
    mocks.getUtilitiesCatalogFromFirestore.mockResolvedValue(
      buildCatalog({
        utility_definitions: {
          utility_a: { label: "Producción", type: "text", required: true },
          utility_b: { label: "Ruta", type: "text", refquired: true },
        },
      })
    );
    mocks.getActiveUtilityIdsForProfile.mockReturnValue(["utility_a", "utility_b"]);

    const result = await add(
      buildActionArgs(
        buildRequest([
          ["titleJobProfile", "Turno noche"],
          ["dateTimeRecord", "2026-03-14"],
          ["workStartTime", "08:00"],
          ["workEndTime", "17:00"],
          ["estimatedHourlyRate", "15"],
          ["selectedUtilityIds", "utility_a"],
          ["selectedUtilityIds", "utility_b"],
          ["utility__utility_a", ""],
          ["utility__utility_b", "   "],
        ])
      )
    );

    expect(result).toEqual({
      error: "Faltan utilidades requeridas: Producción, Ruta",
    });
    expect(mocks.saveRecord).not.toHaveBeenCalled();
  });

  it("reporta utilidades numericas invalidas con su etiqueta", async () => {
    mocks.getUtilitiesCatalogFromFirestore.mockResolvedValue(
      buildCatalog({
        utility_definitions: {
          extra_hours: { label: "Horas extra", type: "number", required: true },
        },
      })
    );
    mocks.getActiveUtilityIdsForProfile.mockReturnValue(["extra_hours"]);

    const result = await add(
      buildActionArgs(
        buildRequest([
          ["titleJobProfile", "Turno noche"],
          ["dateTimeRecord", "2026-03-14"],
          ["workStartTime", "08:00"],
          ["workEndTime", "17:00"],
          ["estimatedHourlyRate", "15"],
          ["selectedUtilityIds", "extra_hours"],
          ["utility__extra_hours", "no-numero"],
        ])
      )
    );

    expect(result).toEqual({
      error: "Las siguientes utilidades deben tener un número válido: Horas extra",
    });
    expect(mocks.saveRecord).not.toHaveBeenCalled();
  });

  it("falla si faltan campos obligatorios del registro", async () => {
    const result = await add(
      buildActionArgs(
        buildRequest([
          ["titleJobProfile", ""],
          ["dateTimeRecord", "2026-03-14"],
          ["workStartTime", "08:00"],
          ["workEndTime", "17:00"],
          ["estimatedHourlyRate", "15"],
        ])
      )
    );

    expect(result).toEqual({
      error: "Todos los campos son requeridos",
    });
    expect(mocks.saveRecord).not.toHaveBeenCalled();
  });

  it("falla si no hay usuario autenticado", async () => {
    mocks.authFirebase.currentUser = null;

    const result = await add(
      buildActionArgs(
        buildRequest([
          ["jobProfileId", "profile-1"],
          ["titleJobProfile", "Turno noche"],
          ["dateTimeRecord", "2026-03-14"],
          ["workStartTime", "08:00"],
          ["workEndTime", "17:00"],
          ["estimatedHourlyRate", "15"],
        ])
      )
    );

    expect(result).toEqual({
      error: "No hay un usuario autenticado",
    });
    expect(mocks.saveRecord).not.toHaveBeenCalled();
  });

  it("construye el payload correcto y guarda el registro", async () => {
    mocks.getUtilitiesCatalogFromFirestore.mockResolvedValue(
      buildCatalog({
        utility_definitions: {
          extra_hours: { label: "Horas extra", type: "number", dbKey: "extra_hours_total" },
          nombre_produccion: { label: "Producción", type: "text" },
          comments: { label: "Comentarios", type: "text", db_key: "internal_comments" },
        },
      })
    );
    mocks.getActiveUtilityIdsForProfile.mockReturnValue([
      "extra_hours",
      "nombre_produccion",
      "comments",
    ]);

    const result = await add(
      buildActionArgs(
        buildRequest([
          ["jobProfileId", "profile-1"],
          ["titleJobProfile", "Turno noche"],
          ["dateTimeRecord", "2026-03-14"],
          ["workStartTime", "08:00"],
          ["workEndTime", "17:00"],
          ["estimatedHourlyRate", "15.5"],
          ["branchId", "branch-1"],
          ["jobPositionId", "job-9"],
          ["selectedUtilityIds", "extra_hours"],
          ["selectedUtilityIds", "nombre_produccion"],
          ["selectedUtilityIds", "comments"],
          ["selectedUtilityIds", "comments"],
          ["utility__extra_hours", "3"],
          ["utility__nombre_produccion", "Proyecto Atlas"],
          ["utility__comments", "Cobertura completa"],
        ])
      )
    );

    expect(mocks.getActiveUtilityIdsForProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        utility_definitions: expect.any(Object),
      }),
      "branch-1",
      "job-9"
    );
    expect(mocks.saveRecord).toHaveBeenCalledWith({
      jobProfileId: "profile-1",
      titleJobProfile: "Turno noche",
      dateTimeRecord: "2026-03-14",
      workStartTime: "08:00",
      workEndTime: "17:00",
      estimatedHourlyRate: 15.5,
      branchId: "branch-1",
      jobPositionId: "job-9",
      utilitiesValues: {
        extra_hours_total: 3,
        production_name: "Proyecto Atlas",
        internal_comments: "Cobertura completa",
      },
    });
    expect(result).toEqual({
      success: true,
      message: "Registro guardado correctamente",
      record: {
        jobProfileId: "profile-1",
        titleJobProfile: "Turno noche",
        dateTimeRecord: "2026-03-14",
        workStartTime: "08:00",
        workEndTime: "17:00",
        estimatedHourlyRate: 15.5,
        branchId: "branch-1",
        jobPositionId: "job-9",
        utilitiesValues: {
          extra_hours_total: 3,
          production_name: "Proyecto Atlas",
          internal_comments: "Cobertura completa",
        },
      },
      jobProfileId: "profile-1",
    });
  });
});
