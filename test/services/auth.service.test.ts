import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const providerInstances: Array<{ setCustomParameters: ReturnType<typeof vi.fn> }> = [];

  class MockGoogleAuthProvider {
    public setCustomParameters = vi.fn();

    constructor() {
      providerInstances.push(this);
    }
  }

  return {
    providerInstances,
    GoogleAuthProvider: MockGoogleAuthProvider,
    onAuthStateChanged: vi.fn(),
    signInWithPopup: vi.fn(),
    signOut: vi.fn(),
    updateProfile: vi.fn(),
    doc: vi.fn(),
    setDoc: vi.fn(),
    authFirebase: {
      currentUser: {
        uid: "user-123",
        email: "user@example.com",
      },
    } as {
      currentUser: {
        uid: string;
        email: string;
      } | null;
    },
    firestore: { app: "fake-db" },
  };
});

vi.mock("firebase/auth", () => ({
  GoogleAuthProvider: mocks.GoogleAuthProvider,
  onAuthStateChanged: mocks.onAuthStateChanged,
  signInWithPopup: mocks.signInWithPopup,
  signOut: mocks.signOut,
  updateProfile: mocks.updateProfile,
}));

vi.mock("firebase/firestore", () => ({
  doc: mocks.doc,
  setDoc: mocks.setDoc,
}));

vi.mock("../../src/apis/firebase", () => ({
  authFirebase: mocks.authFirebase,
  firestore: mocks.firestore,
}));

import {
  authStateChanged,
  signInWithGoogle,
  signOutGoogle,
  updateAccount,
} from "../../src/services/auth.service";

describe("auth.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.providerInstances.length = 0;
    mocks.authFirebase.currentUser = {
      uid: "user-123",
      email: "user@example.com",
    };
    mocks.doc.mockImplementation((_firestore: unknown, ...segments: string[]) => ({
      path: segments.join("/"),
    }));
    mocks.setDoc.mockResolvedValue(undefined);
    mocks.signInWithPopup.mockResolvedValue(undefined);
    mocks.signOut.mockResolvedValue(undefined);
    mocks.updateProfile.mockResolvedValue(undefined);
  });

  it("signInWithGoogle crea provider con prompt select_account y llama a signInWithPopup", async () => {
    await signInWithGoogle();

    expect(mocks.providerInstances).toHaveLength(1);
    expect(mocks.providerInstances[0].setCustomParameters).toHaveBeenCalledWith({
      prompt: "select_account",
    });
    expect(mocks.signInWithPopup).toHaveBeenCalledWith(
      mocks.authFirebase,
      mocks.providerInstances[0]
    );
  });

  it("signOutGoogle delega en signOut", async () => {
    await signOutGoogle();

    expect(mocks.signOut).toHaveBeenCalledWith(mocks.authFirebase);
  });

  it("updateAccount no hace nada si no hay usuario autenticado", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mocks.authFirebase.currentUser = null;

    const result = await updateAccount({ displayName: "Juan" });

    expect(result).toBeUndefined();
    expect(mocks.updateProfile).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error general en auth.service.updateAccount: No hay un usuario autenticado"
    );
  });

  it("updateAccount actualiza perfil y documento de usuario con merge", async () => {
    await updateAccount({
      displayName: "Juan",
      photoURL: "https://example.com/avatar.png",
    });

    expect(mocks.updateProfile).toHaveBeenCalledWith(mocks.authFirebase.currentUser, {
      displayName: "Juan",
      photoURL: "https://example.com/avatar.png",
    });
    expect(mocks.setDoc).toHaveBeenCalledWith(
      { path: "users/user-123" },
      {
        uid: "user-123",
        email: "user@example.com",
        displayName: "Juan",
        photoURL: "https://example.com/avatar.png",
      },
      { merge: true }
    );
  });

  it("authStateChanged reenvía usuario y null al callback", () => {
    const callback = vi.fn();
    const fakeUser = { uid: "user-9" };

    mocks.onAuthStateChanged.mockImplementation(
      (_auth: unknown, listener: (user: unknown) => void) => {
        listener(fakeUser);
        listener(null);
      }
    );

    authStateChanged(callback);

    expect(callback).toHaveBeenNthCalledWith(1, fakeUser);
    expect(callback).toHaveBeenNthCalledWith(2, null);
  });
});
