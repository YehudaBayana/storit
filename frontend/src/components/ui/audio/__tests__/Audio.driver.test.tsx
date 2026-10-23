import { AudioDriver } from "./Audio.driver";

describe("Audio", () => {
  let driver: AudioDriver;

  beforeEach(() => {
    driver = new AudioDriver();
  });

  it("renders with configurable dataHook and src", () => {
    driver.render({ dataHook: "player-audio", src: "https://example.com/audio.mp3" });
    expect(driver.exists("player-audio")).toBe(true);
    expect(driver.getSrc("player-audio")).toBe("https://example.com/audio.mp3");
  });
});
