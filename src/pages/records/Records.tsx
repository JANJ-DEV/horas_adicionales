import RecordCard from "./components/RecordCard";
import RecordReveal from "./components/RecordReveal";
import { useEffect, useState } from "react";
import { subscribeToBranches } from "@/services/branches.service";
import { subscribeToJobProfiles } from "@/services/jobsProfile.service";
import type { Branch, JobProfile } from "@/types";
import type { RecordsPeriod } from "@/utils";
import RecordsPeriodSelector from "./components/RecordsPeriodSelector";
import RecordsListGrid from "./components/RecordsListGrid";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { Link } from "react-router";
import { UNASSIGNED_PROFILE } from "./profileSelection";
import useAuth from "@/context/hooks/auth.hook";
import { MdViewList, MdViewAgenda, MdWorkOutline } from "react-icons/md";
import { useRecordsFiltering } from "./hooks/useRecordsFiltering";
import { clearPendingSelectedRecordId, getPendingSelectedRecordId } from "./recordNavigation";

const PAGE_SIZE = 9;
const VIEW_MODE_STORAGE_KEY = "records:view-mode";

type ViewMode = "card" | "list";

const getStoredViewMode = (): ViewMode => {
  if (typeof window === "undefined") return "card";
  try {
    const stored = localStorage.getItem(VIEW_MODE_STORAGE_KEY);
    return stored === "list" ? "list" : "card";
  } catch {
    return "card";
  }
};

const setStoredViewMode = (mode: ViewMode) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode);
  } catch {
    // localStorage no disponible
  }
};

const Records = () => {
  const { currentUser } = useAuth();
  const [jobProfiles, setJobProfiles] = useState<JobProfile[]>([]);
  const [profilesOwner, setProfilesOwner] = useState<string | undefined>();
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);
  const [profilesError, setProfilesError] = useState(false);
  const profilesReady = !isLoadingProfiles && !profilesError && profilesOwner === currentUser?.uid;
  const visibleProfiles = profilesReady ? jobProfiles : [];
  const {
    selectedProfileId,
    hasUnassignedRecords,
    profile,
    selectedPeriod,
    recordsByPeriod,
    isLoading,
    isError,
    errorMessage,
    hasCurrentUser,
    handleDeleteRecord,
    handlerViewDetails,
    handlePeriodChange,
    handleProfileChange,
    sinceDate,
    setSinceDate,
    cycleOptions,
    selectedCycle,
    setSelectedCycle,
  } = useRecordsFiltering(visibleProfiles, profilesReady);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [hasJobProfiles, setHasJobProfiles] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [pendingSelectedRecordId, setPendingSelectedRecordId] = useState<string | null>(() =>
    getPendingSelectedRecordId()
  );
  const [viewMode, setViewMode] = useState<ViewMode>(() => getStoredViewMode());

  useEffect(() => {
    if (!hasCurrentUser || !currentUser?.uid) {
      return;
    }
    const userId = currentUser.uid;

    const unsubscribe = subscribeToJobProfiles(
      (profiles) => {
        setProfilesOwner(userId);
        setJobProfiles(profiles);
        setHasJobProfiles(profiles.length > 0);
        setProfilesError(false);
        setIsLoadingProfiles(false);
      },
      () => {
        setProfilesOwner(userId);
        setProfilesError(true);
        setJobProfiles([]);
        setIsLoadingProfiles(false);
      },
      () => {
        setIsLoadingProfiles(false);
      }
    );

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [hasCurrentUser, currentUser?.uid]);

  useEffect(() => {
    const unsubscribe = subscribeToBranches((nextBranches) => {
      setBranches(nextBranches);
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  const branchNameById = Object.fromEntries(
    branches.map((branch) => [branch.id, branch.name])
  ) as Record<string, string>;

  const jobPositionNameByCompositeKey = branches.reduce<Record<string, string>>((acc, branch) => {
    (branch.jobsPositions ?? []).forEach((job) => {
      acc[`${branch.id}:${job.id}`] = job.name;
    });

    return acc;
  }, {});

  const pendingSelectedRecordIndex = pendingSelectedRecordId
    ? recordsByPeriod.findIndex((record) => record.id === pendingSelectedRecordId)
    : -1;
  const effectiveVisibleCount =
    pendingSelectedRecordIndex >= 0
      ? Math.max(visibleCount, pendingSelectedRecordIndex + 1)
      : visibleCount;

  const hasMore = effectiveVisibleCount < recordsByPeriod.length;

  const loadMoreRecords = () => {
    setVisibleCount((current) => {
      if (current >= recordsByPeriod.length) return current;
      return Math.min(current + PAGE_SIZE, recordsByPeriod.length);
    });
  };

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: loadMoreRecords,
    hasMore,
    resetKey: effectiveVisibleCount,
    disabled: !hasCurrentUser || isLoading || isError,
  });

  const visibleRecords = recordsByPeriod.slice(0, effectiveVisibleCount);

  const handlePeriodChangeWithPaginationReset = (nextPeriod: RecordsPeriod) => {
    handlePeriodChange(nextPeriod);
    setVisibleCount(PAGE_SIZE);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    setStoredViewMode(mode);
  };

  const renderViewModeToggle = () => (
    <div className="flex gap-1 rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] p-1">
      <button
        type="button"
        onClick={() => handleViewModeChange("card")}
        className={`rounded-full p-2 transition duration-200 ${
          viewMode === "card"
            ? "bg-[var(--accent)] text-slate-950"
            : "text-[var(--text-muted)] hover:text-[var(--text)]"
        }`}
        title="Vista de tarjetas"
        aria-label="Vista de tarjetas"
        aria-pressed={viewMode === "card"}
      >
        <MdViewAgenda size={20} />
      </button>
      <button
        type="button"
        onClick={() => handleViewModeChange("list")}
        className={`rounded-full p-2 transition duration-200 ${
          viewMode === "list"
            ? "bg-[var(--accent)] text-slate-950"
            : "text-[var(--text-muted)] hover:text-[var(--text)]"
        }`}
        title="Vista de listado"
        aria-label="Vista de listado"
        aria-pressed={viewMode === "list"}
      >
        <MdViewList size={20} />
      </button>
    </div>
  );

  useEffect(() => {
    if (
      !pendingSelectedRecordId ||
      !hasCurrentUser ||
      isLoading ||
      isLoadingProfiles ||
      profilesError ||
      isError
    ) {
      return;
    }

    if (pendingSelectedRecordIndex === -1) {
      clearPendingSelectedRecordId();
      window.setTimeout(() => {
        setPendingSelectedRecordId(null);
      }, 0);
      return;
    }

    const variant = viewMode === "card" ? "desktop" : "mobile";
    const targetElement = document.querySelector<HTMLElement>(
      `[data-record-anchor="${pendingSelectedRecordId}"][data-record-variant="${variant}"]`
    );

    if (!targetElement) {
      return;
    }

    if (effectiveVisibleCount > visibleCount) {
      window.setTimeout(() => {
        setVisibleCount((current) => Math.max(current, effectiveVisibleCount));
      }, 0);
    }

    targetElement.scrollIntoView({ behavior: "auto", block: "center" });
    clearPendingSelectedRecordId();
    window.setTimeout(() => {
      setPendingSelectedRecordId(null);
    }, 0);
  }, [
    pendingSelectedRecordId,
    pendingSelectedRecordIndex,
    hasCurrentUser,
    isLoading,
    isLoadingProfiles,
    profilesError,
    isError,
    effectiveVisibleCount,
    visibleCount,
    viewMode,
  ]);

  return (
    <section className="flex min-w-0 min-h-[60vh] flex-col gap-4 overflow-x-clip">
      {hasCurrentUser && (
        <>
          <div className="app-surface grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 p-3 md:flex md:flex-wrap md:justify-between md:gap-4 md:p-4">
            <label className="order-1 flex min-w-0 items-center gap-2 text-sm text-[var(--text)] md:order-none">
              <MdWorkOutline
                aria-hidden="true"
                className="shrink-0 text-xl text-[var(--accent)] md:hidden"
              />
              <span className="sr-only md:not-sr-only md:font-semibold">Cambiar perfil</span>
              <select
                aria-label="Cambiar perfil"
                value={selectedProfileId ?? ""}
                disabled={isLoadingProfiles || profilesError || !selectedProfileId}
                onChange={(event) => {
                  handleProfileChange(event.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
                className="w-full min-w-0 rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] px-2 py-2 text-[var(--text)] md:w-auto md:px-3"
              >
                {!selectedProfileId && (
                  <option value="">
                    {isLoadingProfiles ? "Cargando perfiles..." : "Selecciona un perfil"}
                  </option>
                )}
                {visibleProfiles.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
                {hasUnassignedRecords && <option value={UNASSIGNED_PROFILE}>Sin perfil</option>}
              </select>
            </label>
            <div className="order-3 col-span-2 min-w-0 md:order-none">
              <RecordsPeriodSelector
                value={selectedPeriod}
                onChange={handlePeriodChangeWithPaginationReset}
                sinceDate={sinceDate}
                cycleOptions={cycleOptions}
                selectedCycle={selectedCycle}
                onChangeCycle={(cycle) => {
                  setSelectedCycle(cycle);
                  setVisibleCount(PAGE_SIZE);
                }}
                onChangeSinceDate={(date) => {
                  setSinceDate(date);
                  setVisibleCount(PAGE_SIZE);
                }}
                disabled={!selectedProfileId}
              />
            </div>
            <div className="order-2 flex items-center justify-end md:order-none">
              {renderViewModeToggle()}
            </div>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            Los colores identifican ciclos de facturación según el perfil. En la lista, sitúa el
            cursor sobre la fecha para ver el intervalo. Los perfiles sin ciclo configurado se
            muestran sin color.
          </p>
          {selectedPeriod === "custom_cycle" && profile && !profile.billingCycleStartDay && (
            <p className="text-sm text-[var(--text-muted)]">
              Este perfil no tiene ciclo de facturación configurado.{" "}
              <Link className="text-[var(--accent)] underline" to="/jobs-profiles">
                Configurar perfil
              </Link>
              .
            </p>
          )}
        </>
      )}

      {hasCurrentUser && isLoading && (
        <aside className="app-card flex flex-col gap-4 p-4">
          <p className="text-sm font-semibold text-[var(--accent-warm)]">Cargando registros...</p>
        </aside>
      )}
      {hasCurrentUser && isError && errorMessage && (
        <aside className="app-card flex flex-col gap-4 p-4">
          <p className="text-sm font-semibold text-[var(--danger)]">{errorMessage}</p>
        </aside>
      )}
      {hasCurrentUser && profilesError && (
        <aside className="app-card p-4 text-[var(--danger)]">
          No se pudieron cargar los perfiles. Vuelve a intentarlo.
        </aside>
      )}

      {!isLoading &&
        !isError &&
        !isLoadingProfiles &&
        !profilesError &&
        hasCurrentUser &&
        recordsByPeriod.length === 0 &&
        !hasJobProfiles &&
        !hasUnassignedRecords && (
          <aside className="app-surface p-4 text-[var(--text)]">
            <h3 className="font-[var(--font-display)] text-base font-semibold text-[var(--accent-warm)]">
              Tu cuenta esta lista para empezar
            </h3>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Solo falta crear tu primer perfil de trabajo para poder registrar jornadas.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                to="/jobs-profiles/add"
                className="inline-flex rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-slate-950 transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] hover:text-white"
              >
                Crear primer perfil
              </Link>
              <Link
                to="/jobs-profiles"
                className="inline-flex rounded-lg border border-[var(--border)] bg-[var(--bg-soft)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition duration-300 hover:border-[var(--border-strong)] hover:text-[var(--accent)]"
              >
                Ver perfiles
              </Link>
            </div>
          </aside>
        )}

      {!isLoading &&
        !isError &&
        !isLoadingProfiles &&
        !profilesError &&
        hasCurrentUser &&
        recordsByPeriod.length === 0 &&
        (hasJobProfiles || hasUnassignedRecords) && (
          <aside className="app-card p-4 text-[var(--text-muted)]">
            No hay registros para este perfil y período.
          </aside>
        )}

      {viewMode === "list" ? (
        <RecordsListGrid
          records={visibleRecords}
          jobProfiles={visibleProfiles}
          branchNameById={branchNameById}
          jobPositionNameByCompositeKey={jobPositionNameByCompositeKey}
          onViewDetails={handlerViewDetails}
          onDeleteRecord={handleDeleteRecord}
        />
      ) : (
        <section className="grid min-w-0 gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {visibleRecords.map((record) => (
            <RecordReveal key={record.id} recordId={record.id}>
              <RecordCard
                record={record}
                jobProfiles={visibleProfiles}
                branchName={record.branchId ? (branchNameById[record.branchId] ?? "") : ""}
                jobPositionName={
                  record.branchId && record.jobPositionId
                    ? (jobPositionNameByCompositeKey[
                        `${record.branchId}:${record.jobPositionId}`
                      ] ?? "")
                    : ""
                }
                handlerViewDetails={handlerViewDetails}
                handleDeleteRecord={handleDeleteRecord}
              />
            </RecordReveal>
          ))}
        </section>
      )}

      {hasCurrentUser && !isLoading && !isError && hasMore && (
        <div
          ref={sentinelRef}
          className="flex w-full flex-col items-center gap-2 py-2 text-center text-xs text-[var(--text-muted)]"
        >
          <p>
            Mostrando {visibleRecords.length} de {recordsByPeriod.length} registros.
          </p>
          <button
            type="button"
            onClick={loadMoreRecords}
            className="rounded-lg border border-[var(--border)] px-3 py-2 font-semibold text-[var(--text)] hover:border-[var(--accent)]"
          >
            Cargar más registros
          </button>
        </div>
      )}

      {hasCurrentUser &&
        !isLoading &&
        !isError &&
        !isLoadingProfiles &&
        !hasMore &&
        visibleRecords.length > 0 && (
          <p className="text-center text-xs text-[var(--text-soft)]">
            Has llegado al final de los registros.
          </p>
        )}
    </section>
  );
};

export default Records;
