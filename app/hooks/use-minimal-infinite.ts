import { useState, useEffect, useCallback } from "react";

interface MinimalInfiniteOptions {
  pageSize?: number;
}

interface MinimalInfiniteReturn<T> {
  data: T[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  loadMore: () => void;
  total: number;
}

export function useMinimalInfinite<T, QueryArg>(
  useQuery: (arg: QueryArg) => {
    data?: { data: T[]; total: number; pages: number };
    isLoading: boolean;
    isFetching: boolean;
  },
  baseArg: Omit<QueryArg, "page" | "limit">,
  options: MinimalInfiniteOptions = {}
): MinimalInfiniteReturn<T> {
  const { pageSize = 20 } = options;

  const [page, setPage] = useState(1);
  const [allData, setAllData] = useState<T[]>([]);

  // Query current page
  const { data, isLoading, isFetching } = useQuery({
    ...baseArg,
    page,
    limit: pageSize,
  } as QueryArg);

  // Update data when new page loads
  useEffect(() => {
    if (!data?.data) return;

    if (page === 1) {
      setAllData([...(data?.data || [])]);
    } else {
      setAllData((prev) => [...prev, ...(data?.data || [])]);
    }
  }, [data, page]);

  // Reset when base args change
  useEffect(() => {
    setPage(1);
    setAllData([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(baseArg)]);

  const loadMore = useCallback(() => {
    if (isFetching) return;
    setPage((prev) => prev + 1);
  }, [isFetching]);

  const hasMore = data ? page < data.pages : false;

  return {
    data: allData,
    loading: isLoading && page === 1,
    loadingMore: isFetching && page > 1,
    hasMore: hasMore,
    loadMore,
    total: data?.total || 0,
  };
}
