import React from "react";
import { render } from "@testing-library/react";
import { Modal } from "../Modal";
import { ModalDriver } from "./Modal.driver";

describe("Modal Component", () => {
  it("should render when open and handle close interaction", () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Edit File" testId="my-modal">
        <p>Modal Body Content</p>
      </Modal>,
    );

    const driver = new ModalDriver("my-modal");
    expect(driver.exists()).toBe(true);
    expect(driver.text).toContain("Modal Body Content");

    driver.clickClose();
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("should not render when isOpen is false", () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Edit File" testId="my-modal">
        <p>Hidden Content</p>
      </Modal>,
    );

    const driver = new ModalDriver("my-modal");
    expect(driver.exists()).toBe(false);
  });
});
