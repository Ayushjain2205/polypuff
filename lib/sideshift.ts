const SIDESHIFT_API_BASE_URL = "https://sideshift.ai/api/v2";

type Primitive = string | number | boolean;

type RequestInitOverrides = Omit<RequestInit, "body" | "headers" | "method">;

interface SideshiftRequestOptions extends RequestInitOverrides {
  requiresSecret?: boolean;
  searchParams?: Record<string, Primitive | undefined>;
  body?: BodyInit | Record<string, unknown> | null;
  headers?: HeadersInit;
  method?: RequestInit["method"];
}

function getSecretHeader(ensureSecret: boolean): Record<string, string> {
  const secret = process.env.SIDESHIFT_SECRET;

  if (ensureSecret && !secret) {
    throw new Error(
      "Missing SideShift secret. Set the SIDESHIFT_SECRET environment variable."
    );
  }

  return secret ? { "x-sideshift-secret": secret } : {};
}

function buildUrl(
  path: string,
  searchParams?: Record<string, Primitive | undefined>
) {
  const url = new URL(path.replace(/^\//, ""), `${SIDESHIFT_API_BASE_URL}/`);

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

export class SideshiftApiError extends Error {
  status: number;
  payload: unknown;

  constructor(status: number, message: string, payload: unknown) {
    super(message);
    this.name = "SideshiftApiError";
    this.status = status;
    this.payload = payload;
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");

  if (!response.ok) {
    const payload = isJson ? await response.json() : await response.text();
    const message =
      typeof payload === "string"
        ? payload
        : payload?.message || JSON.stringify(payload);

    throw new SideshiftApiError(response.status, message, payload);
  }

  if (!isJson) {
    // @ts-expect-error - allow returning non-JSON payloads when necessary.
    return response.text();
  }

  return response.json() as Promise<T>;
}

export async function sideshiftFetch<T = unknown>(
  path: string,
  options: SideshiftRequestOptions = {}
): Promise<T> {
  const {
    requiresSecret = false,
    searchParams,
    body,
    headers: customHeaders,
    method,
    ...rest
  } = options;

  const url = buildUrl(path, searchParams);

  const initHeaders = new Headers(customHeaders);
  const secretHeaders = getSecretHeader(requiresSecret);
  Object.entries(secretHeaders).forEach(([key, value]) => {
    initHeaders.set(key, value);
  });

  const init: RequestInit = {
    method: method ?? (body ? "POST" : "GET"),
    headers: initHeaders,
    ...rest,
  };

  if (body !== undefined && body !== null) {
    if (
      typeof body === "string" ||
      body instanceof FormData ||
      body instanceof URLSearchParams
    ) {
      init.body = body;
    } else {
      init.body = JSON.stringify(body);
      if (!initHeaders.has("Content-Type")) {
        initHeaders.set("Content-Type", "application/json");
      }
    }
  }

  const response = await fetch(url, init);
  return parseResponse<T>(response);
}

export function getAffiliateId(): string | undefined {
  const affiliateId =
    process.env.SIDESHIFT_AFFILIATE_ID ?? process.env.SIDESHIFT_AFFILIATE;
  return affiliateId || undefined;
}
