const SELECTED_RECORD_STORAGE_KEY = "records:selected-record-id";

export const rememberSelectedRecordId = (recordId: string) => {
  if (!recordId) return;

  window.sessionStorage.setItem(SELECTED_RECORD_STORAGE_KEY, recordId);
};

export const getPendingSelectedRecordId = () => {
  return window.sessionStorage.getItem(SELECTED_RECORD_STORAGE_KEY);
};

export const clearPendingSelectedRecordId = () => {
  window.sessionStorage.removeItem(SELECTED_RECORD_STORAGE_KEY);
};
