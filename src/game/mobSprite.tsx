import { useEffect, useMemo, useState } from "react";
import { MOB_FRAMES } from "./mobs/mobIcons";
import { mobColor } from "./mobs/mobColor";

type MobSpriteProps = {
  id: string;
  size?: number;
  fps?: number;
  color?: string;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
};

export function MobSprite({
  id,
  size = 28,
  fps = 8,
  title,
  className,
  style,
}: MobSpriteProps) {
  const frames = useMemo(() => MOB_FRAMES[id] ?? [], [id]);
  const hasAnim = frames.length > 1;

  const [i, setI] = useState(0);

  useEffect(() => {
    setI(0);
    if (!hasAnim) return;

    const ms = Math.max(50, Math.round(1000 / fps));
    const t = window.setInterval(() => {
      setI((v) => (v + 1) % frames.length);
    }, ms);

    return () => window.clearInterval(t);
  }, [hasAnim, fps, frames.length, id]);

  // fallback svg - color
  if (frames.length === 0) {
    return (
      <div
        className={className}
        title={title ?? id}
        style={{
          width: size,
          height: size,
          borderRadius: 6,
          background: mobColor(id),
          ...style,
        }}
      />
    );
  }

  return (
    <img
      src={frames[i]}
      width={size}
      height={size}
      alt={title ?? id}
      title={title ?? id}
      className={className}
      style={{ display: "block", ...style }}
      draggable={false}
    />
  );
}
