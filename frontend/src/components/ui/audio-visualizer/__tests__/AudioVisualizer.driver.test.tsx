import { AudioVisualizerDriver } from "./AudioVisualizer.driver";

describe("AudioVisualizer", () => {
  let driver: AudioVisualizerDriver;

  beforeEach(() => {
    driver = new AudioVisualizerDriver();
  });

  it("renders with default props and displays paused label", () => {
    driver.render({ dataHook: "eq-bars" });
    expect(driver.exists("eq-bars")).toBe(true);
    expect(driver.getAccessibleLabel("eq-bars")).toBe("Audio paused");
  });

  it("updates label when playing", () => {
    driver.render({ isPlaying: true, dataHook: "playing-bars" });
    expect(driver.getAccessibleLabel("playing-bars")).toBe("Audio playing");
  });

  it.each([
    ["sm", "h-4"],
    ["md", "h-5"],
    ["lg", "h-6"],
  ] as const)("supports %s size", (size, expectedClass) => {
    driver.render({ size });
    expect(driver.getClassName()).toContain(expectedClass);
  });
});
