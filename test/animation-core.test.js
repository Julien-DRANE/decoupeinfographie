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
