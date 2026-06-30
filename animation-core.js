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

  function getGroupFocusLayout(stageWidth, stageHeight, boxes, fallbackScale = 1) {
    const validBoxes = (Array.isArray(boxes) ? boxes : []).filter(
      (box) =>
        Number.isFinite(Number(box?.left)) &&
        Number.isFinite(Number(box?.top)) &&
        Number(box?.width) > 0 &&
        Number(box?.height) > 0
    );
    if (!(stageWidth > 0) || !(stageHeight > 0) || !validBoxes.length) {
      return { translateX: 0, translateY: 0, scale: fallbackScale, centerX: 0, centerY: 0 };
    }

    const bounds = validBoxes.reduce(
      (acc, box) => ({
        left: Math.min(acc.left, Number(box.left)),
        top: Math.min(acc.top, Number(box.top)),
        right: Math.max(acc.right, Number(box.left) + Number(box.width)),
        bottom: Math.max(acc.bottom, Number(box.top) + Number(box.height)),
      }),
      { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity }
    );
    const groupWidth = Math.max(1, bounds.right - bounds.left);
    const groupHeight = Math.max(1, bounds.bottom - bounds.top);
    const centerX = bounds.left + groupWidth / 2;
    const centerY = bounds.top + groupHeight / 2;
    const targetScale = Math.min((stageWidth * 0.82) / groupWidth, (stageHeight * 0.82) / groupHeight);
    const scale = Math.max(0.62, Math.min(2.4, targetScale));
    return {
      translateX: stageWidth / 2 - centerX,
      translateY: stageHeight / 2 - centerY,
      scale,
      centerX,
      centerY,
    };
  }

  function resolveTimingGroupDelay(baseDelay, stagger, index, synchronized, memberDelays = []) {
    if (synchronized) {
      const delays = memberDelays.map(Number).filter((delay) => Number.isFinite(delay) && delay >= 0);
      return delays.length ? Math.min(...delays) : 0;
    }
    return Math.max(0, Number(baseDelay) || 0) + Math.max(0, Number(stagger) || 0) * Math.max(0, Number(index) || 0);
  }

  function mergeGroupOrder(globalIds, groupIds) {
    const validGlobalIds = Array.isArray(globalIds) ? globalIds : [];
    const globalIdSet = new Set(validGlobalIds);
    const seen = new Set();
    const orderedGroupIds = (Array.isArray(groupIds) ? groupIds : []).filter((id) => {
      if (!globalIdSet.has(id) || seen.has(id)) {
        return false;
      }
      seen.add(id);
      return true;
    });
    const groupIdSet = new Set(orderedGroupIds);
    let groupIndex = 0;
    return validGlobalIds.map((id) => (groupIdSet.has(id) ? orderedGroupIds[groupIndex++] : id));
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
    getGroupFocusLayout,
    resolveTimingGroupDelay,
    mergeGroupOrder,
    buildStepSchedule,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  globalScope.AnimationCore = api;
})(typeof globalThis !== "undefined" ? globalThis : window);
