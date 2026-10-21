import { useCallback, useEffect, useState } from "react";

// hook عام: بينفّذ دالة جلب ويرجّع data/loading/error/reload
export function useAsync(fn, deps = [], initial = null) {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const load = useCallback(async () => {
    try {
      setLoading(true);
      setData(await fn());
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}
