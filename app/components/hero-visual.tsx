type HeroVisualVariant = "three-d" | "legacy";

export function HeroVisual({ variant }: { variant?: string }) {
  const selectedVariant: HeroVisualVariant = variant === "legacy" ? "legacy" : "three-d";
  return selectedVariant === "three-d" ? <ThreeDimensionalHeroVisual /> : <LegacyHeroVisual />;
}

function ThreeDimensionalHeroVisual() {
  return (
    <div className="hero-visual hero-visual-3d" aria-label="三维 AI 轨道球">
      <div className="three-d-stars" aria-hidden="true" />
      <div className="cosmic-nebula" aria-hidden="true" />
      <div className="three-d-stage" aria-hidden="true">
        <span className="cosmic-axis" />
        <div className="three-d-floor">
          <span className="floor-ring floor-ring-one" />
          <span className="floor-ring floor-ring-two" />
          <span className="floor-ring floor-ring-three" />
          <span className="floor-core" />
        </div>
        <div className="three-d-orbit orbit-outer"><span className="orbit-path"><i className="orbit-node node-outer" /></span></div>
        <div className="three-d-orbit orbit-alpha"><span className="orbit-path"><i className="orbit-node node-alpha" /></span></div>
        <div className="three-d-orbit orbit-beta"><span className="orbit-path"><i className="orbit-node node-beta" /></span></div>
        <div className="three-d-orbit orbit-gamma"><span className="orbit-path"><i className="orbit-node node-gamma" /></span></div>
        <div className="three-d-sphere">
          <span className="sphere-atmosphere" />
          <span className="sphere-particles" />
          <span className="sphere-grid sphere-grid-latitude" />
          <span className="sphere-grid sphere-grid-longitude" />
          <strong>AI</strong>
        </div>
      </div>
      <div className="visual-note note-top">TRACE / 3D</div>
      <div className="visual-note note-bottom">STATUS · ONLINE</div>
    </div>
  );
}

function LegacyHeroVisual() {
  return (
    <div className="hero-visual" aria-label="抽象智能节点网络">
      <div className="visual-grid" />
      <div className="orbit orbit-one"><i /></div>
      <div className="orbit orbit-two"><i /></div>
      <div className="core-orb">
        <span className="core-label">BUILDING</span>
        <strong>AI × PRODUCT</strong>
        <small>Human-centered systems</small>
      </div>
      <div className="visual-note note-top">TRACE / 0027</div>
      <div className="visual-note note-bottom">STATUS · ONLINE</div>
    </div>
  );
}
