import { useState, useCallback, useRef, useEffect } from "react";

export type FetchPageFn<T> = (params: {
  page: number;
  limit: number;
  [key: string]: unknown;
}) => Promise<{
  data: T[];
  total: number;
  pages: number;
}>;

interface MinimalInfiniteOptions {
  pageSize?: number;
}

interface MinimalInfiniteReturn<T> {
  data: T[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  total: number;
  error: boolean;
  loadMore: () => Promise<void>;
  // Optimistic update functions
  optimisticUpdate: (id: number | string, updater: (item: T) => T) => void;
  optimisticDelete: (id: number | string) => void;
  optimisticAdd: (item: T) => void;
  refresh: () => Promise<void>;
}

export function useMinimalInfinite<T>(
  fetchPage: FetchPageFn<T>,
  baseArgs: Record<string, unknown> = {},
  options: MinimalInfiniteOptions = {}
): MinimalInfiniteReturn<T> {
  const { pageSize = 20 } = options;

  // State
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(false);

  // Refs for control
  const isFetchingRef = useRef(false);
  const mountedRef = useRef(true);
  const currentBaseArgs = useRef<string>("");

  // Main load function
  const loadNextPage = useCallback(async () => {
    if (isFetchingRef.current || !hasMore || error) return;

    const isFirstPage = page === 1;

    isFetchingRef.current = true;
    if (isFirstPage) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      console.log("🚀 Fetching page", page, "with args:", {
        ...baseArgs,
        page,
        limit: pageSize,
      });

      const result = await fetchPage({
        page,
        limit: pageSize,
        ...baseArgs,
      });

      if (!mountedRef.current) return;

      console.log(
        "📥 Received",
        result.data.length,
        "items for page",
        page,
        "of",
        result.pages,
        "total pages"
      );

      // Filter duplicates by ID (simple approach)
      const uniqueItems = result.data.filter((item: unknown) => {
        const itemId = (item as { id?: unknown }).id;
        const exists = data.some(
          (existing: unknown) => (existing as { id?: unknown }).id === itemId
        );
        return !exists;
      });

      console.log("✅ Adding", uniqueItems.length, "unique items");

      if (isFirstPage) {
        setData([...result.data]);
        setTotal(result.total);
      } else {
        setData((prev) => [...prev, ...uniqueItems]);
      }

      // Check if we have more - only based on total pages, not items per page
      console.log(
        "🔍 Checking hasMore: current page",
        page,
        "total pages",
        result.pages
      );
      if (page >= result.pages) {
        console.log("🔚 No more pages - setting hasMore to false");
        setHasMore(false);
      } else {
        console.log("▶️ More pages available - moving to page", page + 1);
        setPage((prev) => prev + 1);
      }

      setError(false);
    } catch (e) {
      console.error("❌ Error fetching page", page, e);
      setError(true);
    } finally {
      isFetchingRef.current = false;
      if (mountedRef.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, [fetchPage, baseArgs, page, pageSize, hasMore, error, data]);

  // Load more function for manual triggering
  const loadMore = useCallback(async () => {
    await loadNextPage();
  }, [loadNextPage]);

  // Refresh function - reload everything from page 1
  const refresh = useCallback(async () => {
    console.log("🔄 Full refresh triggered");

    setError(false);
    setHasMore(true);
    setPage(1);
    setData([]);
    setTotal(0);

    // Force reload from page 1
    isFetchingRef.current = false;
    await loadNextPage();
  }, [loadNextPage]);

  // Optimistic update functions
  const optimisticUpdate = useCallback(
    (id: number | string, updater: (item: T) => T) => {
      console.log("⚡ Optimistic update for item", id);
      setData((prev) =>
        prev.map((item) => {
          const itemId = (item as { id?: unknown }).id;
          return itemId === id ? updater(item) : item;
        })
      );
    },
    []
  );

  const optimisticDelete = useCallback((id: number | string) => {
    console.log("⚡ Optimistic delete for item", id);
    setData((prev) =>
      prev.filter((item) => {
        const itemId = (item as { id?: unknown }).id;
        return itemId !== id;
      })
    );
    setTotal((prev) => Math.max(0, prev - 1));
  }, []);

  const optimisticAdd = useCallback((item: T) => {
    console.log("⚡ Optimistic add item");
    setData((prev) => [...prev, item]); // Add to end of list
    setTotal((prev) => prev + 1);
  }, []);

  // Reset and load when baseArgs change
  useEffect(() => {
    const baseArgsKey = JSON.stringify(baseArgs);

    if (currentBaseArgs.current !== baseArgsKey) {
      console.log("🔄 Base args changed, resetting");
      currentBaseArgs.current = baseArgsKey;

      // Reset state
      setError(false);
      setHasMore(true);
      setPage(1);
      setData([]);
      setTotal(0);
    }
  }, [baseArgs]);

  // Initial load
  useEffect(() => {
    if (data.length === 0 && !loading && !error) {
      loadNextPage();
    }
  }, [data.length, loading, error, loadNextPage]);

  // Cleanup
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  console.log("📊 STATE:", {
    dataLength: data.length,
    total,
    page,
    hasMore,
    loading,
    loadingMore,
    error,
    ratio: total > 0 ? ((data.length / total) * 100).toFixed(1) + "%" : "N/A",
  });

  return {
    data,
    loading,
    loadingMore,
    hasMore,
    total,
    error,
    loadMore,
    optimisticUpdate,
    optimisticDelete,
    optimisticAdd,
    refresh,
  };
}
