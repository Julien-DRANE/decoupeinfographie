const GROUP_FOCUS_PRESETS = {
  discrete: {
    label: "Discret",
    key: "discrete",
    presentation: {
      enabled: true,
      settledOpacity: 0.34,
      settledScale: 0.9,
      activeScale: 1.04,
      settledBlur: 1,
      activeBlur: 0,
      settledOpacityStep: 0.05,
      settledScaleStep: 0.015,
      settledBlurStep: 0.8,
    },
  },
  standard: {
    label: "Standard",
    key: "standard",
    presentation: {
      enabled: true,
      settledOpacity: 0.41,
      settledScale: 0.94,
      activeScale: 1.06,
      settledBlur: 1,
      activeBlur: 0,
      settledOpacityStep: 0.06,
      settledScaleStep: 0.02,
      settledBlurStep: 1,
    },
  },
  strong: {
    label: "Fort",
    key: "strong",
    presentation: {
      enabled: true,
      settledOpacity: 0.28,
      settledScale: 0.88,
      activeScale: 1.1,
      settledBlur: 2,
      activeBlur: 0,
      settledOpacityStep: 0.08,
      settledScaleStep: 0.025,
      settledBlurStep: 1.2,
    },
  },
  dense: {
    label: "Infographie dense",
    key: "dense",
    presentation: {
      enabled: true,
      settledOpacity: 0.24,
      settledScale: 0.84,
      activeScale: 1.12,
      settledBlur: 3,
      activeBlur: 0,
      settledOpacityStep: 0.1,
      settledScaleStep: 0.03,
      settledBlurStep: 1.4,
    },
  },
};

const GROUP_FOCUS_DEFAULTS = {
  presetKey: "standard",
  enabled: true,
  settledOpacity: 0.41,
  settledScale: 0.94,
  activeScale: 1.06,
  settledBlur: 1,
  activeBlur: 0,
  settledOpacityStep: 0.06,
  settledScaleStep: 0.02,
  settledBlurStep: 1,
};

function createDefaultGroupPresentation() {
  return { ...GROUP_FOCUS_DEFAULTS };
}

function sanitizeGroupPresentation(presentation = {}) {
  const defaults = GROUP_FOCUS_DEFAULTS;
  return {
    presetKey: typeof presentation.presetKey === "string" ? presentation.presetKey : defaults.presetKey,
    enabled: typeof presentation.enabled === "boolean" ? presentation.enabled : defaults.enabled,
    settledOpacity: clamp(
      Number.isFinite(Number(presentation.settledOpacity)) ? Number(presentation.settledOpacity) : defaults.settledOpacity,
      0.1,
      1
    ),
    settledScale: clamp(
      Number.isFinite(Number(presentation.settledScale)) ? Number(presentation.settledScale) : defaults.settledScale,
      0.5,
      1
    ),
    activeScale: clamp(
      Number.isFinite(Number(presentation.activeScale)) ? Number(presentation.activeScale) : defaults.activeScale,
      1,
      1.4
    ),
    settledBlur: clamp(
      Number.isFinite(Number(presentation.settledBlur)) ? Number(presentation.settledBlur) : defaults.settledBlur,
      0,
      8
    ),
    activeBlur: clamp(
      Number.isFinite(Number(presentation.activeBlur)) ? Number(presentation.activeBlur) : defaults.activeBlur,
      0,
      4
    ),
    settledOpacityStep: clamp(
      Number.isFinite(Number(presentation.settledOpacityStep))
        ? Number(presentation.settledOpacityStep)
        : defaults.settledOpacityStep,
      0,
      0.3
    ),
    settledScaleStep: clamp(
      Number.isFinite(Number(presentation.settledScaleStep))
        ? Number(presentation.settledScaleStep)
        : defaults.settledScaleStep,
      0,
      0.1
    ),
    settledBlurStep: clamp(
      Number.isFinite(Number(presentation.settledBlurStep))
        ? Number(presentation.settledBlurStep)
        : defaults.settledBlurStep,
      0,
      5
    ),
  };
}

function applyGroupFocusPreset(presetKey) {
  const preset = GROUP_FOCUS_PRESETS[presetKey] ?? GROUP_FOCUS_PRESETS.standard;
  return sanitizeGroupPresentation({
    presetKey: preset.key,
    ...preset.presentation,
    enabled: true,
  });
}

function getGroupFocusPresetLabel(presetKey) {
  return GROUP_FOCUS_PRESETS[presetKey]?.label ?? "Standard";
}
