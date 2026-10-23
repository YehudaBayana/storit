import { VideoDriver } from "./Video.driver";

describe("Video", () => {
  let driver: VideoDriver;

  beforeEach(() => {
    driver = new VideoDriver();
  });

  it("renders with default props", () => {
    driver.render({ dataHook: "watch-video", src: "https://example.com/video.mp4" });
    expect(driver.exists("watch-video")).toBe(true);
    expect(driver.getSrc("watch-video")).toBe("https://example.com/video.mp4");
    expect(driver.getClassName("watch-video")).toContain("aspect-video");
    expect(driver.getClassName("watch-video")).toContain("rounded-2xl");
  });

  it.each([
    ["video", "aspect-video"],
    ["square", "aspect-square"],
  ] as const)("supports %s aspect ratio", (aspectRatio, expectedClass) => {
    driver.render({ aspectRatio });
    expect(driver.getClassName()).toContain(expectedClass);
  });
});
