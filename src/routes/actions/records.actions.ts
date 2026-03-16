import type { ActionFunctionArgs } from "react-router";
import { authFirebase } from "@/apis/firebase";
import { updateJobProfile } from "@/services/jobsProfile.service";
import {
  saveRecord,
  updateRecord,
  type RecordService,
} from "@/services/records.service";
import {
  getActiveUtilityIdsForProfile,
  getUtilitiesCatalogFromFirestore,
  type UtilityFieldValue,
} from "@/services/utilities.service";

const UTILITY_FIELD_PREFIX = "utility__";

const UTILITY_DB_KEY_FALLBACK: Record<string, string> = {
  nombre_produccion: "production_name",
  ruta_origen_destino: "route_origin_destination",
};

const resolveUtilityStorageKey = (
  utilityId: string,
  definition: { dbKey?: string; db_key?: string }
) => {
  return definition.dbKey ?? definition.db_key ?? UTILITY_DB_KEY_FALLBACK[utilityId] ?? utilityId;
};

type ParseRecordFormResult =
  | {
      error: string;
    }
  | {
      data: RecordService;
      jobProfileId: string;
      titleJobProfile: string;
    };

const parseRecordFormData = async (formData: FormData): Promise<ParseRecordFormResult> => {
  const jobProfileId = formData.get("jobProfileId") as string;
  const titleJobProfile = formData.get("titleJobProfile") as string;
  const dateTimeRecord = formData.get("dateTimeRecord") as string;
  const workStartTime = formData.get("workStartTime") as string;
  const workEndTime = formData.get("workEndTime") as string;
  const estimatedHourlyRate = formData.get("estimatedHourlyRate") as string;
  const branchId = (formData.get("branchId") as string) || "";
  const jobPositionId = (formData.get("jobPositionId") as string) || "";
  const utilitiesCatalog = await getUtilitiesCatalogFromFirestore();
  const activeUtilityIds = getActiveUtilityIdsForProfile(
    utilitiesCatalog,
    branchId || null,
    jobPositionId || null
  );

  const selectedUtilityIds = Array.from(
    new Set(
      formData
        .getAll("selectedUtilityIds")
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.trim())
        .filter(Boolean)
    )
  );

  const invalidSelectedUtilities = selectedUtilityIds.filter(
    (utilityId) => !activeUtilityIds.includes(utilityId)
  );

  if (invalidSelectedUtilities.length > 0) {
    return {
      error: "La selección de utilidades no es válida para el perfil seleccionado.",
    };
  }

  const utilitiesValues: Record<string, UtilityFieldValue> = {};
  const missingSelectedUtilities: string[] = [];
  const invalidNumberUtilities: string[] = [];

  selectedUtilityIds.forEach((utilityId) => {
    const definition = utilitiesCatalog.utility_definitions[utilityId];
    if (!definition) {
      return;
    }

    const rawValue = String(formData.get(`${UTILITY_FIELD_PREFIX}${utilityId}`) ?? "").trim();
    if (!rawValue) {
      if (definition.required ?? definition.refquired) {
        missingSelectedUtilities.push(utilityId);
      }
      return;
    }

    if (definition.type === "number") {
      const parsedNumber = Number(rawValue);
      if (Number.isNaN(parsedNumber)) {
        invalidNumberUtilities.push(utilityId);
        return;
      }

      const storageKey = resolveUtilityStorageKey(utilityId, definition);
      utilitiesValues[storageKey] = parsedNumber;
      return;
    }

    const storageKey = resolveUtilityStorageKey(utilityId, definition);
    utilitiesValues[storageKey] = rawValue;
  });

  if (missingSelectedUtilities.length > 0) {
    const labels = missingSelectedUtilities.map(
      (utilityId) => utilitiesCatalog.utility_definitions[utilityId]?.label ?? utilityId
    );

    return {
      error: `Faltan utilidades requeridas: ${labels.join(", ")}`,
    };
  }

  if (invalidNumberUtilities.length > 0) {
    const labels = invalidNumberUtilities.map(
      (utilityId) => utilitiesCatalog.utility_definitions[utilityId]?.label ?? utilityId
    );

    return {
      error: `Las siguientes utilidades deben tener un número válido: ${labels.join(", ")}`,
    };
  }

  if (!titleJobProfile || !dateTimeRecord || !workStartTime || !workEndTime) {
    return {
      error: "Todos los campos son requeridos",
    };
  }

  return {
    data: {
      titleJobProfile,
      dateTimeRecord,
      workStartTime,
      workEndTime,
      estimatedHourlyRate: Number(estimatedHourlyRate),
      jobProfileId,
      branchId,
      jobPositionId,
      utilitiesValues,
    },
    jobProfileId,
    titleJobProfile,
  };
};

export async function add({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const parsedRecord = await parseRecordFormData(formData);

  if ("error" in parsedRecord) {
    return parsedRecord;
  }

  const userId = authFirebase.currentUser?.uid;
  if (!userId) {
    return {
      error: "No hay un usuario autenticado",
    };
  }

  const savedRecord = await saveRecord(parsedRecord.data);
  if (!savedRecord) {
    return {
      error: "No se pudo guardar el registro",
    };
  }

  return {
    success: true,
    message: "Registro guardado correctamente",
    record: savedRecord,
    jobProfileId: parsedRecord.jobProfileId,
    titleJobProfile: parsedRecord.titleJobProfile,
  };
}

export async function update({ request, params }: ActionFunctionArgs) {
  const recordId = params.id;
  if (!recordId) {
    return {
      error: "No se encontró el registro a actualizar",
    };
  }

  const formData = await request.formData();
  const parsedRecord = await parseRecordFormData(formData);

  if ("error" in parsedRecord) {
    return parsedRecord;
  }

  const userId = authFirebase.currentUser?.uid;
  if (!userId) {
    return {
      error: "No hay un usuario autenticado",
    };
  }

  const updated = await updateRecord(userId, recordId, parsedRecord.data);
  if (!updated) {
    return {
      error: "No se pudo actualizar el registro",
    };
  }

  await updateJobProfile(parsedRecord.jobProfileId, {
    estimatedHourlyRate: parsedRecord.data.estimatedHourlyRate,
  });

  return {
    success: true,
    message: "Registro actualizado correctamente",
    recordId,
    jobProfileId: parsedRecord.jobProfileId,
    titleJobProfile: parsedRecord.titleJobProfile,
  };
}
