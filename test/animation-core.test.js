const test = require("node:test");
const assert = require("node:assert/strict");

const AnimationCore = require("../animation-core.js");

test("getZoneVisualState returns deterministic hidden state for directional effects", () => {
  assert.deepEqual(
    AnimationCore.getZoneVisualState(
      {
        effect: "fade-left",
        offsetX: 48,
        offsetY: 0,
        scaleFrom: 1,
        rotateFrom: 0,
      },
      false
    ),
    {
      opacity: 0,
      transform: "translate(-48px, 0px) scale(1) rotate(0deg)",
      filter: "blur(0px)",
    }
  );
});

test("buildStepSchedule keeps recaps after their reveal step", () => {
  const schedule = AnimationCore.buildStepSchedule(
    [
      { animation: { step: 2, duration: 500, delay: 100 } },
      { animation: { step: 1, duration: 300, delay: 0 } },
    ],
    [{ afterStep: 2, duration: 900, order: 0 }]
  );

  assert.deepEqual(
    schedule.map((event) => event.type),
    ["step", "step", "recap"]
  );
  assert.equal(schedule[1].duration, 600);
});

test("getGroupFocusLayout centers the group without collapsing member positions", () => {
  const layout = AnimationCore.getGroupFocusLayout(1000, 600, [
    { left: 100, top: 200, width: 100, height: 100 },
    { left: 300, top: 200, width: 100, height: 100 },
  ]);

  assert.deepEqual(layout, {
    translateX: 250,
    translateY: 50,
    scale: 2.4,
    centerX: 250,
    centerY: 250,
  });

  const firstCenterAfterScale = layout.centerX + layout.translateX + (150 - layout.centerX) * layout.scale;
  const secondCenterAfterScale = layout.centerX + layout.translateX + (350 - layout.centerX) * layout.scale;
  assert.equal(secondCenterAfterScale - firstCenterAfterScale, 480);
});

test("resolveTimingGroupDelay reveals a focused timing group as one event", () => {
  assert.equal(AnimationCore.resolveTimingGroupDelay(60, 80, 2, false, [60, 20, 100]), 220);
  assert.equal(AnimationCore.resolveTimingGroupDelay(60, 80, 2, true, [60, 20, 100]), 20);
});

test("mergeGroupOrder preserves non-group slots while applying the current group order", () => {
  assert.deepEqual(
    AnimationCore.mergeGroupOrder(["a", "b", "c", "d", "e"], ["d", "b", "e"]),
    ["a", "d", "c", "b", "e"]
  );
});
