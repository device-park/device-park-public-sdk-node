/**
 * Base class for SDK API services.
 */
export abstract class AbstractApiService {
  protected buildUri(baseUrl: string, path: string, queryParams: Record<string, unknown> = {}): string {
    const url = new URL(path, baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);

    for (const [key, value] of Object.entries(queryParams)) {
      if (value === undefined || value === null) {
        continue;
      }

      url.searchParams.set(key, String(value));
    }

    return url.toString();
  }
}
