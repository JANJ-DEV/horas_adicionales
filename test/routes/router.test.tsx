import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createBrowserRouter: vi.fn((routes) => ({ routes, kind: "router-instance" })),
  recordAddAction: vi.fn(),
  jobsAddAction: vi.fn(),
  jobsUpdateAction: vi.fn(),
}));

vi.mock("react-router", () => ({
  createBrowserRouter: mocks.createBrowserRouter,
}));

vi.mock("../../src/routes/lazy.load", () => ({
  App: () => null,
  PublicLayout: () => null,
  RecordsLayout: () => null,
  Records: () => null,
  AddNewRecord: () => null,
  DetailsRecord: () => null,
  JobProfilesLayout: () => null,
  JobProfiles: () => null,
  CreateJobProfile: () => null,
  JobProfileDetails: () => null,
  AccountLayout: () => null,
  Account: () => null,
  UpdateAccount: () => null,
  PageNotFound: () => null,
}));

vi.mock("../../src/routes/actions", () => ({
  recordActions: {
    add: mocks.recordAddAction,
  },
  jobsProfileActions: {
    add: mocks.jobsAddAction,
    update: mocks.jobsUpdateAction,
  },
}));

import router, { routers } from "../../src/routes/router";
import { accountRouter } from "../../src/routes/account.router";
import { jobProfilesRouter } from "../../src/routes/job_profiles.router";
import { publicRouter } from "../../src/routes/public.router";
import { recordsRouter } from "../../src/routes/records.router";

describe("routes composition", () => {
  it("publicRouter expone home e index bajo el layout publico", () => {
    expect(publicRouter).toHaveLength(1);
    expect(publicRouter[0].path).toBe("/");
    expect(publicRouter[0].children).toHaveLength(2);
    expect(publicRouter[0].children?.[0]).toEqual(
      expect.objectContaining({
        index: true,
      })
    );
    expect(publicRouter[0].children?.[1]).toEqual(
      expect.objectContaining({
        path: "home",
      })
    );
  });

  it("recordsRouter define index, add y details con la action correcta", () => {
    expect(recordsRouter[0].path).toBe("/records");
    expect(recordsRouter[0].children).toHaveLength(3);
    expect(recordsRouter[0].children?.[1]).toEqual(
      expect.objectContaining({
        path: "add",
        action: mocks.recordAddAction,
      })
    );
    expect(recordsRouter[0].children?.[2]).toEqual(
      expect.objectContaining({
        path: "details/:id",
      })
    );
  });

  it("jobProfilesRouter y accountRouter enlazan las actions esperadas", () => {
    expect(jobProfilesRouter[0].children?.[1]).toEqual(
      expect.objectContaining({
        path: "add",
        action: mocks.jobsAddAction,
      })
    );
    expect(accountRouter[0].children?.[1]).toEqual(
      expect.objectContaining({
        path: "update",
        action: mocks.jobsUpdateAction,
      })
    );
  });

  it("router.tsx compone los routers y agrega fallback 404", () => {
    expect(routers.map((route) => route.path)).toEqual([
      "/",
      "/records",
      "/jobs-profiles",
      "/account",
      "*",
    ]);
    expect(mocks.createBrowserRouter).toHaveBeenCalledWith(routers);
    expect(router).toEqual({
      routes: routers,
      kind: "router-instance",
    });
  });
});
