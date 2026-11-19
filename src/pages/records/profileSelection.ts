export const UNASSIGNED_PROFILE = "__unassigned__";

const profileStorageKey = (userId: string) => `records:selected-profile:${userId}`;

export const getStoredProfile = (userId: string | undefined): string => {
  if (!userId) return "";
  try {
    return localStorage.getItem(profileStorageKey(userId)) ?? "";
  } catch {
    return "";
  }
};

export const storeProfile = (userId: string | undefined, profileId: string) => {
  if (!userId || !profileId) return;
  try {
    localStorage.setItem(profileStorageKey(userId), profileId);
  } catch {
    /* Storage is optional. */
  }
};
