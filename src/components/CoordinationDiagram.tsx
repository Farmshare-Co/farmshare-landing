/**
 * Two models of coordination, drawn rather than described.
 *
 * Left  — ownership: many plants, one balance sheet (how the Big Four did it).
 * Right — shared infrastructure: many plants, one network (how Farmshare does it).
 *
 * Inline SVG on purpose: no external assets, scales cleanly, and stays legible
 * at hero size and on a phone.
 */

const NODE_COUNT = 9;
const RADIUS = 66;
const CENTER = 100;

function ringNodes() {
  return Array.from({ length: NODE_COUNT }, (_, i) => {
    const angle = (i / NODE_COUNT) * Math.PI * 2 - Math.PI / 2;
    return {
      x: CENTER + Math.cos(angle) * RADIUS,
      y: CENTER + Math.sin(angle) * RADIUS,
    };
  });
}

export function OwnershipDiagram({ className = '' }: { className?: string }) {
  const cols = 5;
  const rows = 2;
  const boxW = 26;
  const boxH = 26;
  const gapX = 34;
  const gapY = 46;
  const startX = CENTER - ((cols - 1) * gapX) / 2;
  const startY = CENTER - ((rows - 1) * gapY) / 2;

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Ten plants enclosed inside a single balance sheet">
      {/* the single balance sheet enclosing everything */}
      <rect
        x="10" y="28" width="180" height="144" rx="12"
        fill="rgba(107,99,89,0.10)"
        stroke="currentColor"
        strokeOpacity="0.45"
        strokeWidth="2"
      />
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => (
          <rect
            key={`${r}-${c}`}
            x={startX + c * gapX - boxW / 2}
            y={startY + r * gapY - boxH / 2}
            width={boxW}
            height={boxH}
            rx="4"
            fill="currentColor"
            fillOpacity="0.35"
          />
        ))
      )}
    </svg>
  );
}

export function NetworkDiagram({ className = '' }: { className?: string }) {
  const nodes = ringNodes();

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Independent plants connected through a shared network hub">
      {/* shared ring */}
      <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="currentColor" strokeOpacity="0.22" strokeWidth="1.5" />
      {/* spokes into the shared layer */}
      {nodes.map((n, i) => (
        <line
          key={`spoke-${i}`}
          x1={CENTER} y1={CENTER} x2={n.x} y2={n.y}
          stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5"
        />
      ))}
      {/* the plants: independent, unenclosed */}
      {nodes.map((n, i) => (
        <circle key={`node-${i}`} cx={n.x} cy={n.y} r="9" fill="currentColor" />
      ))}
      {/* the shared layer itself */}
      <circle cx={CENTER} cy={CENTER} r="17" fill="currentColor" fillOpacity="0.18" />
      <circle cx={CENTER} cy={CENTER} r="17" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
