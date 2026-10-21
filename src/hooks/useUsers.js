import { listUsersApi } from "../services/usersApi.js";
import { useAsync } from "./useAsync.js";

export function useUsers(type) {
  const { data, loading, error, reload } = useAsync(() => listUsersApi(type), [type], []);
  return { items: data ?? [], loading, error, reload };
}
