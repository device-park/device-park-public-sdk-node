export type QueryValue = string | number | boolean | null | undefined;

export function buildUrl(baseUrl: string, path: string): string {
  if (!path) {
    return baseUrl;
  }

  if (baseUrl.endsWith("/") && path.startsWith("/")) {
    return `${baseUrl}${path.slice(1)}`;
  }

  if (!baseUrl.endsWith("/") && !path.startsWith("/")) {
    return `${baseUrl}/${path}`;
  }

  return `${baseUrl}${path}`;
}

export function buildUri(baseUrl: string, path: string, query: Record<string, QueryValue> = {}): string {
  const url = new URL(buildUrl(baseUrl, path));

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) {
      continue;
    }

    url.searchParams.set(key, String(value));
  }

  return url.toString();
}
