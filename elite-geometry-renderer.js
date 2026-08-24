(function initEliteGeometryRenderer(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.STUDY_ELITE_GEOMETRY_RENDERER = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createEliteGeometryRenderer() {
  "use strict";

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function text(x, y, value, className = "label") {
    return `<text x="${x}" y="${y}" class="${className}">${escapeHtml(value)}</text>`;
  }

  function baseSvg(body, label) {
    return `<svg viewBox="0 0 360 230" role="img" aria-label="${escapeHtml(label)}" xmlns="http://www.w3.org/2000/svg">
      <defs><marker id="eliteArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" class="arrow-head"/></marker></defs>
      ${body}
    </svg>`;
  }

  function renderInsetRectangle(data) {
    return baseSvg(`
      <rect x="45" y="35" width="270" height="160" rx="3" class="shape fill-path"/>
      <rect x="95" y="75" width="170" height="80" rx="2" class="shape inner"/>
      <line x1="45" y1="210" x2="315" y2="210" class="measure" marker-end="url(#eliteArrow)"/>
      <line x1="315" y1="210" x2="45" y2="210" class="measure" marker-end="url(#eliteArrow)"/>
      ${text(180, 226, `${data.outerWidth} m`, "measure-label")}
      ${text(25, 120, `${data.outerHeight} m`, "measure-label rotate")}
      ${text(180, 119, `남은 넓이 ${data.innerArea} m²`, "center-label")}
      ${text(70, 64, "폭 x", "accent-label")}
    `, data.alt);
  }

  function renderRightTriangle(data) {
    const variant = data.variant || "basic";
    const extra = variant === "altitude"
      ? `<line x1="118" y1="48" x2="190" y2="185" class="helper"/>${text(184, 204, "D")}`
      : variant === "bisector"
        ? `<line x1="300" y1="185" x2="150" y2="185" class="helper"/>${text(144, 205, "D")}`
        : "";
    return baseSvg(`
      <path d="M55 185 L300 185 L118 48 Z" class="shape triangle"/>
      <path d="M118 170 L133 170 L133 185" class="right-angle"/>
      ${extra}
      ${text(108, 37, "C")}${text(38, 205, "A")}${text(306, 205, "B")}
      ${data.leftLabel ? text(72, 112, data.leftLabel, "measure-label") : ""}
      ${data.rightLabel ? text(235, 105, data.rightLabel, "measure-label") : ""}
      ${data.baseLabel ? text(178, 220, data.baseLabel, "measure-label") : ""}
    `, data.alt);
  }

  function renderTwoRoads(data) {
    return baseSvg(`
      <line x1="180" y1="35" x2="180" y2="195" class="shape"/>
      <line x1="45" y1="195" x2="315" y2="195" class="ground"/>
      <line x1="180" y1="195" x2="70" y2="90" class="ground"/>
      <line x1="180" y1="35" x2="45" y2="195" class="sight"/>
      <line x1="180" y1="35" x2="70" y2="90" class="sight"/>
      <path d="M180 180 L195 180 L195 195" class="right-angle"/>
      ${text(172, 216, "O")}${text(28, 216, "A")}${text(56, 83, "B")}${text(188, 42, "깃대 꼭대기", "small-label")}
      ${text(78, 176, `tan ${data.angleA}=1/2`, "measure-label")}${text(100, 92, `tan ${data.angleB}=1`, "measure-label")}
    `, data.alt);
  }

  function renderTriangleAltitude(data) {
    return baseSvg(`
      <path d="M45 190 L315 190 L165 45 Z" class="shape triangle"/>
      <line x1="165" y1="45" x2="165" y2="190" class="helper"/>
      <path d="M165 175 L180 175 L180 190" class="right-angle"/>
      ${text(30, 210, "A")}${text(157, 35, "B")}${text(320, 210, "C")}${text(158, 211, "D")}
      ${text(69, 172, "tan∠BAD=1/2", "measure-label")}${text(237, 172, "tan∠BCD=1/3", "measure-label")}
    `, data.alt);
  }

  function renderCollinearPole(data) {
    return baseSvg(`
      <line x1="25" y1="190" x2="335" y2="190" class="ground"/>
      <line x1="248" y1="190" x2="248" y2="35" class="shape"/>
      <line x1="248" y1="35" x2="45" y2="190" class="sight"/>
      <line x1="248" y1="35" x2="130" y2="190" class="sight"/>
      <line x1="248" y1="35" x2="310" y2="190" class="sight"/>
      ${text(38, 211, "A")}${text(123, 211, "B")}${text(304, 211, "C")}${text(241, 211, "O")}
      ${text(76, 184, "10 m", "measure-label")}${text(207, 184, "14 m", "measure-label")}
      ${text(55, 150, "tan=1/4", "small-label")}${text(125, 125, "tan=1/2", "small-label")}${text(275, 135, "tan=5/4", "small-label")}
    `, data.alt);
  }

  function circleBase(extra, data) {
    return baseSvg(`<circle cx="180" cy="115" r="82" class="shape circle"/>${extra}`, data.alt);
  }

  function renderSecants(data) {
    return circleBase(`
      <line x1="18" y1="70" x2="268" y2="145" class="shape"/>
      <line x1="18" y1="70" x2="269" y2="62" class="shape"/>
      ${text(8, 63, "P")}${text(100, 91, "A")}${text(260, 154, "B")}${text(99, 76, "C")}${text(270, 59, "D")}
      ${text(48, 93, "PA=5", "measure-label")}${text(147, 74, "PC=x", "measure-label")}${text(182, 57, "CD=x+2", "measure-label")}
    `, data);
  }

  function renderTangentQuadrilateral(data) {
    const tangentAt = data.tangentAt || "A";
    if (tangentAt === "C") {
      return circleBase(`
        <path d="M105 67 L252 80 L238 168 L112 175 Z" class="shape polygon"/>
        <line x1="238" y1="168" x2="326" y2="207" class="tangent"/>
        <line x1="105" y1="67" x2="238" y2="168" class="helper"/>
        ${text(91, 61, "A")}${text(255, 75, "B")}${text(242, 168, "C")}${text(96, 191, "D")}
        ${text(174, 83, "70°", "accent-label")}${text(278, 191, "50°", "accent-label")}
      `, data);
    }
    return circleBase(`
      <path d="M103 70 L252 82 L238 171 L110 174 Z" class="shape polygon"/>
      <line x1="45" y1="22" x2="145" y2="110" class="tangent"/>
      <line x1="103" y1="70" x2="238" y2="171" class="helper"/>
      ${data.bisector ? '<line x1="252" y1="82" x2="110" y2="174" class="helper"/>' : ""}
      ${text(88, 64, "A")}${text(255, 78, "B")}${text(242, 174, "C")}${text(95, 190, "D")}
      ${text(66, 49, data.angleAB || "35°", "accent-label")}${text(105, 104, data.angleAD || "50°", "accent-label")}
      ${data.bisector ? text(222, 118, "각을 똑같이 나눔", "small-label") : ""}
    `, data);
  }

  function renderTangentSecant(data) {
    return circleBase(`
      <line x1="25" y1="180" x2="260" y2="68" class="tangent"/>
      <line x1="25" y1="180" x2="280" y2="145" class="shape"/>
      ${text(12, 198, "P")}${text(126, 162, "A")}${text(280, 160, "B")}${text(122, 98, "접점 T")}
      ${text(62, 122, `PT=${data.tangentLength}`, "measure-label")}${text(62, 179, "원 밖 a", "measure-label")}${text(202, 160, "원 안 b", "measure-label")}
    `, data);
  }

  function renderIntersectingChords(data) {
    return circleBase(`
      <line x1="105" y1="52" x2="251" y2="171" class="shape"/>
      <line x1="104" y1="174" x2="259" y2="66" class="shape"/>
      ${text(92, 45, "A")}${text(256, 185, "B")}${text(88, 190, "C")}${text(264, 61, "D")}${text(179, 123, "P")}
      ${text(128, 85, `AB=${data.chordAB}`, "measure-label")}${text(220, 99, `CD=${data.chordCD}`, "measure-label")}
    `, data);
  }

  function render(data) {
    if (!data || typeof data !== "object") return "";
    switch (data.kind) {
      case "inset-rectangle": return renderInsetRectangle(data);
      case "right-triangle": return renderRightTriangle(data);
      case "two-roads-pole": return renderTwoRoads(data);
      case "triangle-altitude": return renderTriangleAltitude(data);
      case "collinear-pole": return renderCollinearPole(data);
      case "circle-secants": return renderSecants(data);
      case "circle-tangent-quadrilateral": return renderTangentQuadrilateral(data);
      case "circle-tangent-secant": return renderTangentSecant(data);
      case "circle-intersecting-chords": return renderIntersectingChords(data);
      default: return "";
    }
  }

  return Object.freeze({ render });
});
