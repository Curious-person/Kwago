import React from "react";
import { render, screen } from "@testing-library/react";
import { LoadingState } from "./LoadingState";
import { describe, it, expect } from "vitest";

/**
 * Unit Tests for LoadingState Component
 *
 * Tests that the loading state displays skeleton cards correctly
 * and provides visual feedback while data is loading.
 *
 * Requirements: 7.3, 7.4
 */
describe("LoadingState Component", () => {
  it("should render skeleton cards while loading", () => {
    const { container } = render(<LoadingState count={3} />);

    // Check that the component renders without errors
    const animatedContainer = container.querySelector(".animate-pulse");
    expect(animatedContainer).toBeInTheDocument();
  });

  it("should display the correct number of skeleton cards", () => {
    const { container } = render(<LoadingState count={3} />);

    // Find all skeleton card containers
    const skeletonCards = container.querySelectorAll(".rounded-3xl");
    expect(skeletonCards.length).toBe(3);
  });

  it("should display default count of 3 skeleton cards when count prop not provided", () => {
    const { container } = render(<LoadingState />);

    // Find all skeleton card containers
    const skeletonCards = container.querySelectorAll(".rounded-3xl");
    expect(skeletonCards.length).toBe(3);
  });

  it("should display custom count of skeleton cards", () => {
    const { container } = render(<LoadingState count={5} />);

    // Find all skeleton card containers
    const skeletonCards = container.querySelectorAll(".rounded-3xl");
    expect(skeletonCards.length).toBe(5);
  });

  it("should have animate-pulse class for animation", () => {
    const { container } = render(<LoadingState count={1} />);

    // Check for animate-pulse class
    const animatedContainer = container.querySelector(".animate-pulse");
    expect(animatedContainer).toBeInTheDocument();
  });

  it("should display responsive grid layout", () => {
    const { container } = render(<LoadingState count={3} />);

    // Check for responsive grid classes
    const gridContainer = container.querySelector(".grid");
    expect(gridContainer).toHaveClass(
      "grid-cols-1",
      "md:grid-cols-2",
      "lg:grid-cols-3",
    );
  });

  it("should display skeleton elements for each card section", () => {
    const { container } = render(<LoadingState count={1} />);

    // Check for skeleton elements
    const skeletonElements = container.querySelectorAll(".bg-zinc-200");
    // Should have: header, category name, product count, 3 images, 2 buttons
    expect(skeletonElements.length).toBeGreaterThanOrEqual(8);
  });

  it("should have proper spacing between skeleton cards", () => {
    const { container } = render(<LoadingState count={3} />);

    // Check for gap class
    const gridContainer = container.querySelector(".grid");
    expect(gridContainer).toHaveClass("gap-8");
  });
});
