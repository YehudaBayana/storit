import { httpClient } from "@/core/http/httpClient";
import { ApiError } from "@/core/http/ApiError";

describe("httpClient", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it("performs GET request and parses JSON", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });

    const result = await httpClient<{ success: boolean }>("/api/test");
    expect(result).toEqual({ success: true });
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/test"),
      expect.objectContaining({ method: "GET", credentials: "include" }),
    );
  });

  it("throws ApiError on non-2xx status", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ message: "Bad Request" }),
    });

    await expect(httpClient("/api/test")).rejects.toThrow(ApiError);
  });

  it("handles 204 No Content correctly", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 204,
    });

    const result = await httpClient("/api/test", { method: "DELETE" });
    expect(result).toBeUndefined();
  });
});
