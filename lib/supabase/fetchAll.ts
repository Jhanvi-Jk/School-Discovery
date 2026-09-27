// PostgREST caps every response at 1000 rows by default. This walks a query
// page-by-page so callers never silently lose rows past that cap.
const PAGE = 1000;

export async function fetchAllRows<T>(
  build: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: unknown }>
): Promise<T[]> {
  const out: T[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await build(from, from + PAGE - 1);
    if (error) throw error;
    if (!data || data.length === 0) break;
    out.push(...data);
    if (data.length < PAGE) break;
  }
  return out;
}

// `.in("id", [...])` puts every value in the URL, so long lists blow past
// request-size limits. Split them into small batches and run them in parallel.
export async function fetchByIds<T extends { id: string }>(
  ids: string[],
  run: (batch: string[]) => PromiseLike<{ data: T[] | null; error: unknown }>,
  batchSize = 100
): Promise<T[]> {
  const batches: string[][] = [];
  for (let i = 0; i < ids.length; i += batchSize) batches.push(ids.slice(i, i + batchSize));
  const results = await Promise.all(
    batches.map(async (b) => {
      const { data, error } = await run(b);
      if (error) throw error;
      return data ?? [];
    })
  );
  const byId = new Map<string, T>();
  results.flat().forEach((row) => byId.set(row.id, row));
  // Preserve the caller's ordering (the ids arrive already sorted)
  return ids.map((id) => byId.get(id)).filter((r): r is T => r !== undefined);
}
