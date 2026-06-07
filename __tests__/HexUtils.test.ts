import { describe, it, expect } from "vitest";
import {
  HEX_COLS,
  getHexMetrics,
  hexPoints,
  getHexPosition,
  getGridDimensions,
} from "@/components/archive/HexUtils";

describe("getHexMetrics", () => {
  it("derives spacing from hex size", () => {
    const { HEX_WIDTH, HEX_HEIGHT, COL_SPACING, ROW_SPACING } = getHexMetrics(80);

    expect(HEX_WIDTH).toBe(160);
    expect(HEX_HEIGHT).toBeCloseTo(Math.sqrt(3) * 80);
    expect(COL_SPACING).toBe(120);
    expect(ROW_SPACING).toBe(HEX_HEIGHT);
  });
});

describe("hexPoints", () => {
  it("returns six comma-separated coordinate pairs", () => {
    const points = hexPoints(100, 200, 40);
    const pairs = points.split(" ");

    expect(pairs).toHaveLength(6);
    pairs.forEach((pair) => {
      expect(pair).toMatch(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/);
    });
  });
});

describe("getHexPosition", () => {
  it("places index 0 at the first column with padding", () => {
    const { x, y } = getHexPosition(0, 80);

    expect(x).toBe(80);
    expect(y).toBe(80);
  });

  it("offsets odd columns vertically for staggered rows", () => {
    const evenCol = getHexPosition(0, 80);
    const oddCol = getHexPosition(1, 80);
    const { ROW_SPACING } = getHexMetrics(80);

    expect(oddCol.y - evenCol.y).toBeCloseTo(ROW_SPACING / 2);
  });

  it("wraps to the next row after HEX_COLS items", () => {
    const firstRow = getHexPosition(0, 80);
    const secondRow = getHexPosition(HEX_COLS, 80);
    const { ROW_SPACING } = getHexMetrics(80);

    // compare same column (even) across rows — odd columns are vertically staggered
    expect(secondRow.y - firstRow.y).toBeCloseTo(ROW_SPACING);
  });

  it("applies an optional offset", () => {
    const base = getHexPosition(2, 80);
    const shifted = getHexPosition(2, 80, { x: 50, y: 100 });

    expect(shifted.x).toBe(base.x + 50);
    expect(shifted.y).toBe(base.y + 100);
  });
});

describe("getGridDimensions", () => {
  it("grows height as item count increases", () => {
    const oneRow = getGridDimensions(4, 80);
    const twoRows = getGridDimensions(5, 80);

    expect(twoRows.height).toBeGreaterThan(oneRow.height);
    expect(oneRow.width).toBe(twoRows.width);
  });
});
