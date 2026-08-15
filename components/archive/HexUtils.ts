export const HEX_COLS = 4;
export const HEX_SIZE = 80;

export function getHexMetrics(hexSize: number) {
  const HEX_WIDTH = hexSize * 2;
  const HEX_HEIGHT = Math.sqrt(3) * hexSize;
  const COL_SPACING = HEX_WIDTH * 0.75;
  const ROW_SPACING = HEX_HEIGHT;
  return { HEX_WIDTH, HEX_HEIGHT, COL_SPACING, ROW_SPACING };
}

export function hexPoints(cx: number, cy: number, size: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 180) * (60 * i);
    return `${cx + size * Math.cos(angle)},${cy + size * Math.sin(angle)}`;
  }).join(" ");
}

export function getHexPosition(
  index: number,
  hexSize = HEX_SIZE,
  offset = { x: 0, y: 0 }
): { x: number; y: number } {
  const { COL_SPACING, ROW_SPACING } = getHexMetrics(hexSize);
  const col = index % HEX_COLS;
  const row = Math.floor(index / HEX_COLS);
  return {
    x: col * COL_SPACING + hexSize + offset.x,
    y: row * ROW_SPACING + (col % 2 === 1 ? ROW_SPACING / 2 : 0) + hexSize + offset.y,
  };
}

export function getGridDimensions(count: number, hexSize: number) {
  const { COL_SPACING, ROW_SPACING, HEX_HEIGHT } = getHexMetrics(hexSize);
  const rows = Math.ceil(count / HEX_COLS);
  return {
    width: HEX_COLS * COL_SPACING + hexSize * 2,
    height: rows * ROW_SPACING + HEX_HEIGHT,
  };
}

/** Map a hex grid index to a centered [x, y, z] position for 3D scenes. */
export function getHexPosition3D(
  index: number,
  total: number,
  spacing = 3
): [number, number, number] {
  const pos = getHexPosition(index, spacing);
  const all = Array.from({ length: total }, (_, i) => getHexPosition(i, spacing));
  const xs = all.map(p => p.x);
  const ys = all.map(p => p.y);
  const centerX = (Math.min(...xs) + Math.max(...xs)) / 2;
  const centerY = (Math.min(...ys) + Math.max(...ys)) / 2;
  return [pos.x - centerX, 0, pos.y - centerY];
}