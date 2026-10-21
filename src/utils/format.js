export const toDateInput = (value) => (value ? String(value).slice(0, 10) : "");

export const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString() : "—";
