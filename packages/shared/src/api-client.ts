export async function apiClient<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

interface SuspenseResource<T> {
  read(): T;
}

export function createSuspenseResource<T>(
  promise: Promise<T>,
): SuspenseResource<T> {
  let status: "pending" | "success" | "error" = "pending";
  let result: T;
  let error: unknown;

  const suspender = promise.then(
    (value) => {
      status = "success";
      result = value;
    },
    (err) => {
      status = "error";
      error = err;
    },
  );

  return {
    read() {
      if (status === "pending") throw suspender;
      if (status === "error") throw error;
      return result;
    },
  };
}
