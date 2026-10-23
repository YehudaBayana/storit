import { PlayerBarDriver } from "./PlayerBar.driver";

describe("PlayerBar", () => {
  let driver: PlayerBarDriver;

  beforeEach(() => {
    driver = new PlayerBarDriver();
  });

  it("renders with default props and is visible", () => {
    driver.render({ dataHook: "audio-player-bar", visible: true, children: null });
    expect(driver.exists("audio-player-bar")).toBe(true);
    expect(driver.getClassName("audio-player-bar")).toContain("opacity-100");
  });

  it("applies hidden classes when not visible", () => {
    driver.render({ dataHook: "hidden-bar", visible: false, children: null });
    expect(driver.getClassName("hidden-bar")).toContain("opacity-0");
    expect(driver.getClassName("hidden-bar")).toContain("pointer-events-none");
  });
});
