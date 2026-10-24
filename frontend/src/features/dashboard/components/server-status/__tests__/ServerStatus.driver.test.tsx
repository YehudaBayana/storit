import { ServerStatusDriver } from "./ServerStatus.driver";

describe("ServerStatus", () => {
  let driver: ServerStatusDriver;

  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation((requestUrl: string) => {
      if (requestUrl.includes("/version")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            commitHash: "abc1234",
            commitDate: "2026-10-24 19:00:00 +0000",
          }),
        } as Response);
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({
          status: "OK",
          version: "1.0",
          uptime: "1h",
          timestamp: "",
          services: { database: "connected", cache: "connected" },
        }),
      } as Response);
    });
    driver = new ServerStatusDriver();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    Reflect.deleteProperty(global, "fetch");
  });

  it("exposes health status and opens its details panel", async () => {
    driver.render("health-indicator");
    await driver.flushHealthCheck();

    expect(driver.getConnectionStatus("health-indicator")).toContain("Backend Connected");
    expect(driver.isPanelOpen("health-indicator")).toBe(false);
    driver.togglePanel("health-indicator");
    expect(driver.isPanelOpen("health-indicator")).toBe(true);
    expect(driver.getCommitHash("health-indicator")).toBe("abc1234");
    expect(driver.getCommitDate("health-indicator")).toBe("2026-10-24 19:00:00 +0000");
  });
});
