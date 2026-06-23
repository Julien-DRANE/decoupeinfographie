(function initAnimationCore(globalScope) {
  "use strict";

  function getZoneVisualState(animation, revealed) {
    if (revealed) {
      return {
        opacity: 1,
        transform: "translate(0px, 0px) scale(1) rotate(0deg)",
        filter: "blur(0px)",
      };
    }

    return {
      opacity: 0,
      transform: buildTransform(
        hiddenOffsetX(animation.effect, animation.offsetX),
        hiddenOffsetY(animation.effect, animation.offsetY),
        hiddenScale(animation.effect, animation.scaleFrom),
        hiddenRotation(animation.effect, animation.rotateFrom)
      ),
      filter: `blur(${hiddenBlur(animation.effect)}px)`,
    };
  }

  function hiddenOffsetX(effect, offsetX) {
    if (effect === "fade-left") return -Math.abs(offsetX || 48);
    if (effect === "fade-right") return Math.abs(offsetX || 48);
    if (effect === "mist-left") return -Math.abs(offsetX || 80);
    if (effect === "mist-right") return Math.abs(offsetX || 80);
    if (effect === "drift-left") return -Math.abs(offsetX || 56);
    if (effect === "drift-right") return Math.abs(offsetX || 56);
    return offsetX;
  }

  function hiddenOffsetY(effect, offsetY) {
    if (effect === "fade-up") return Math.abs(offsetY || 24);
    if (effect === "fade-down") return -Math.abs(offsetY || 24);
    if (effect === "mist-up") return Math.abs(offsetY || 54);
    if (effect === "mist-left" || effect === "mist-right") return offsetY || 10;
    if (effect === "drift-left" || effect === "drift-right") return offsetY || 8;
    return offsetY;
  }

  function hiddenScale(effect, scaleFrom) {
    if (effect === "fade") return 1;
    if (effect === "pop") return Math.min(scaleFrom || 0.84, 0.9);
    if (effect === "zoom") return Math.min(scaleFrom || 0.82, 0.92);
    if (effect === "mist-left" || effect === "mist-right" || effect === "mist-up") return Math.min(scaleFrom || 1.03, 1.05);
    if (effect === "drift-left" || effect === "drift-right") return Math.min(scaleFrom || 1, 1);
    return scaleFrom;
  }

  function hiddenRotation(effect, rotateFrom) {
    if (effect === "pop") return rotateFrom || -6;
    if (effect === "drift-left") return rotateFrom || -2;
    if (effect === "drift-right") return rotateFrom || 2;
    return rotateFrom;
  }

  function hiddenBlur(effect) {
    if (effect === "mist-left" || effect === "mist-right" || effect === "mist-up") return 14;
    if (effect === "zoom") return 4;
    if (effect === "drift-left" || effect === "drift-right") return 2;
    return 0;
  }

  function buildTransform(x, y, scale, rotate) {
    return `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotate}deg)`;
  }

  function buildStepSchedule(items, recapGroups = []) {
    const steps = new Map();

    items.forEach((item) => {
      const animation = item.animation ?? item.data?.animation;
      if (!animation) return;
      const step = Math.max(1, Number(animation.step) || 1);
      const duration = Math.max(0, Number(animation.duration) || 0);
      const delay = Math.max(0, Number(animation.delay) || 0);
      steps.set(step, Math.max(steps.get(step) ?? 0, duration + delay));
    });

    const stepEvents = [...steps.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([step, duration]) => ({ type: "step", step, duration }));
    const recapEvents = recapGroups.map((group) => ({
      type: "recap",
      step: group.afterStep,
      duration: group.duration,
      group,
    }));

    return [...stepEvents, ...recapEvents].sort((a, b) => {
      if (a.step !== b.step) return a.step - b.step;
      if (a.type !== b.type) return a.type === "step" ? -1 : 1;
      return (a.group?.order ?? 0) - (b.group?.order ?? 0);
    });
  }

  const api = {
    getZoneVisualState,
    hiddenOffsetX,
    hiddenOffsetY,
    hiddenScale,
    hiddenRotation,
    hiddenBlur,
    buildTransform,
    buildStepSchedule,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  globalScope.AnimationCore = api;
})(typeof globalThis !== "undefined" ? globalThis : window);
