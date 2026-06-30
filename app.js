const FORMATS = {
  "16-9": { label: "16:9", width: 1600, height: 900 },
  "16-10": { label: "16:10", width: 1600, height: 1000 },
  "4-3": { label: "4:3", width: 1600, height: 1200 },
  "3-2": { label: "3:2", width: 1500, height: 1000 },
  "1-1": { label: "1:1", width: 1400, height: 1400 },
  "21-9": { label: "21:9", width: 2100, height: 900 },
  "9-16": { label: "9:16", width: 900, height: 1600 },
  "a4-landscape": { label: "A4 paysage", width: 2100, height: 1485 },
  "a4-portrait": { label: "A4 portrait", width: 1485, height: 2100 },
};

const presets = {
  balanced: {
    label: "Equilibre",
    mode: "components",
    threshold: 28,
    minArea: 1800,
    padding: 16,
    mergeDistance: 18,
  },
  framed: {
    label: "Infographie a cadres",
    mode: "layout",
    threshold: 22,
    minArea: 1400,
    padding: 20,
    mergeDistance: 10,
    bridgeX: 18,
    bridgeY: 14,
    rowFillGap: 14,
    columnFillGap: 28,
  },
  fine: {
    label: "Elements fins",
    mode: "components",
    threshold: 18,
    minArea: 700,
    padding: 10,
    mergeDistance: 10,
  },
  blocks: {
    label: "Gros blocs",
    mode: "components",
    threshold: 34,
    minArea: 3200,
    padding: 22,
    mergeDistance: 26,
  },
  dense: {
    label: "Infographie dense",
    mode: "layout",
    threshold: 24,
    minArea: 1000,
    padding: 12,
    mergeDistance: 8,
    bridgeX: 12,
    bridgeY: 10,
    rowFillGap: 10,
    columnFillGap: 16,
  },
  separated: {
    label: "Zones bien separees",
    mode: "components",
    threshold: 30,
    minArea: 1500,
    padding: 18,
    mergeDistance: 0,
  },
};

const state = {
  sourceImage: null,
  imageName: "infographie",
  zones: [],
  groups: [],
  selectedGroupId: null,
  selectedFocusGroupId: null,
  selectedRecapGroupId: null,
  expandedFocusGroupIds: [],
  detectionProfile: presets.balanced,
  selectedZoneId: null,
  selectedZoneIds: [],
  animationSettings: {
    format: "16-9",
    startTrigger: "key",
    stepMode: "key",
    autoStepGap: 220,
    showGuide: true,
  },
  stepEditor: {
    step: 1,
    effect: "fade-up",
    duration: 700,
    stagger: 80,
  },
  previewRuntime: null,
  previewEdit: {
    dragging: false,
    mode: null,
    zoneId: null,
    handle: null,
    startX: 0,
    startY: 0,
    startBox: null,
    pointerMoved: false,
    createMode: false,
    draftBox: null,
  },
  zoneOrderDrag: {
    zoneId: null,
    overZoneId: null,
    placement: "before",
  },
  previewOrderLabels: [],
  detectionDiagnostics: null,
};

const imageInput = document.querySelector("#imageInput");
const projectInput = document.querySelector("#projectInput");
const detectButton = document.querySelector("#detectButton");
const downloadAllButton = document.querySelector("#downloadAllButton");
const exportZipButton = document.querySelector("#exportZipButton");
const openProjectButton = document.querySelector("#openProjectButton");
const saveProjectButton = document.querySelector("#saveProjectButton");
const addZoneModeButton = document.querySelector("#addZoneModeButton");
const selectAllZonesButton = document.querySelector("#selectAllZonesButton");
const deselectAllZonesButton = document.querySelector("#deselectAllZonesButton");
const exportHtmlButton = document.querySelector("#exportHtmlButton");
const playPreviewButton = document.querySelector("#playPreviewButton");
const resetPreviewButton = document.querySelector("#resetPreviewButton");
const undoButton = document.querySelector("#undoButton");
const fullscreenPreviewButton = document.querySelector("#fullscreenPreviewButton");
const createTimingGroupButton = document.querySelector("#createTimingGroupButton");
const removeSelectedFromTimingGroupButton = document.querySelector("#removeSelectedFromTimingGroupButton");
const createFocusGroupButton = document.querySelector("#createFocusGroupButton");
const removeSelectedFromFocusGroupButton = document.querySelector("#removeSelectedFromFocusGroupButton");
const createRecapGroupButton = document.querySelector("#createRecapGroupButton");
const removeSelectedFromRecapGroupButton = document.querySelector("#removeSelectedFromRecapGroupButton");
const presetCascadeButton = document.querySelector("#presetCascadeButton");
const presetOrganicButton = document.querySelector("#presetOrganicButton");
const presetFloralButton = document.querySelector("#presetFloralButton");
const presetConstellationButton = document.querySelector("#presetConstellationButton");

const previewCanvas = document.querySelector("#previewCanvas");
const previewContext = previewCanvas.getContext("2d");
const toggleZoneLockButton = document.querySelector("#toggleZoneLockButton");
const zonesGrid = document.querySelector("#zonesGrid");
const timingGroupsList = document.querySelector("#timingGroupsList");
const focusGroupsList = document.querySelector("#focusGroupsList");
const recapGroupsList = document.querySelector("#recapGroupsList");
const zonesOrderList = document.querySelector("#zonesOrderList");
const controlsPanel = document.querySelector(".controls");
const animationStage = document.querySelector("#animationStage");
const animationStageViewport = document.querySelector("#animationStageViewport");

const statusText = document.querySelector("#statusText");
const summaryText = document.querySelector("#summaryText");
const diagnosticsText = document.querySelector("#diagnosticsText");
const animationStatusText = document.querySelector("#animationStatusText");

const presetSelect = document.querySelector("#presetSelect");
const presetHint = document.querySelector("#presetHint");
const formatSelect = document.querySelector("#formatSelect");
const formatHint = document.querySelector("#formatHint");
const startTriggerSelect = document.querySelector("#startTriggerSelect");
const stepModeSelect = document.querySelector("#stepModeSelect");
const guideToggle = document.querySelector("#guideToggle");
const stepEditorInput = document.querySelector("#stepEditorInput");
const stepEffectSelect = document.querySelector("#stepEffectSelect");
const stepDurationRange = document.querySelector("#stepDurationRange");
const stepStaggerRange = document.querySelector("#stepStaggerRange");
const applyStepSettingsButton = document.querySelector("#applyStepSettingsButton");
const stepEditorSummary = document.querySelector("#stepEditorSummary");

const thresholdRange = document.querySelector("#thresholdRange");
const minAreaRange = document.querySelector("#minAreaRange");
const paddingRange = document.querySelector("#paddingRange");
const mergeDistanceRange = document.querySelector("#mergeDistanceRange");
const autoStepGapRange = document.querySelector("#autoStepGapRange");

const thresholdValue = document.querySelector("#thresholdValue");
const minAreaValue = document.querySelector("#minAreaValue");
const paddingValue = document.querySelector("#paddingValue");
const mergeDistanceValue = document.querySelector("#mergeDistanceValue");
const autoStepGapValue = document.querySelector("#autoStepGapValue");
const stepDurationValue = document.querySelector("#stepDurationValue");
const stepStaggerValue = document.querySelector("#stepStaggerValue");

const inspectorEmptyState = document.querySelector("#inspectorEmptyState");
const inspectorForm = document.querySelector("#inspectorForm");
const selectedZoneTitle = document.querySelector("#selectedZoneTitle");
const selectedZoneMeta = document.querySelector("#selectedZoneMeta");
const splitZoneAutoButton = document.querySelector("#splitZoneAutoButton");
const splitZoneVerticalButton = document.querySelector("#splitZoneVerticalButton");
const splitZoneHorizontalButton = document.querySelector("#splitZoneHorizontalButton");
const splitZone2ColsButton = document.querySelector("#splitZone2ColsButton");
const splitZone3ColsButton = document.querySelector("#splitZone3ColsButton");
const splitZone4ColsButton = document.querySelector("#splitZone4ColsButton");
const duplicateZoneButton = document.querySelector("#duplicateZoneButton");
const deleteZoneButton = document.querySelector("#deleteZoneButton");
const resetSubdivideButton = document.querySelector("#resetSubdivideButton");
const splitZoneSummary = document.querySelector("#splitZoneSummary");
const zoneEnabledCheckbox = document.querySelector("#zoneEnabledCheckbox");
const zoneStepInput = document.querySelector("#zoneStepInput");
const zoneEffectSelect = document.querySelector("#zoneEffectSelect");
const zoneDurationRange = document.querySelector("#zoneDurationRange");
const zoneDelayRange = document.querySelector("#zoneDelayRange");
const zoneOffsetXRange = document.querySelector("#zoneOffsetXRange");
const zoneOffsetYRange = document.querySelector("#zoneOffsetYRange");
const zoneScaleRange = document.querySelector("#zoneScaleRange");
const zoneRotateRange = document.querySelector("#zoneRotateRange");

const zoneDurationValue = document.querySelector("#zoneDurationValue");
const zoneDelayValue = document.querySelector("#zoneDelayValue");
const zoneOffsetXValue = document.querySelector("#zoneOffsetXValue");
const zoneOffsetYValue = document.querySelector("#zoneOffsetYValue");
const zoneScaleValue = document.querySelector("#zoneScaleValue");
const zoneRotateValue = document.querySelector("#zoneRotateValue");

const zoneCardTemplate = document.querySelector("#zoneCardTemplate");

const undoHistory = [];
const UNDO_HISTORY_LIMIT = 40;
let restoringUndoState = false;
let lastUndoCheckpoint = { label: null, time: 0 };

function cloneZonesForUndo(zones) {
  return zones.map((zone) => ({
    ...zone,
    animation: { ...zone.animation },
    subdivisionParent: zone.subdivisionParent ? structuredCloneProjectData(zone.subdivisionParent) : null,
    subdivisionChildren: zone.subdivisionChildren ? structuredCloneProjectData(zone.subdivisionChildren) : null,
  }));
}

function createUndoSnapshot() {
  return {
    zones: cloneZonesForUndo(state.zones),
    groups: structuredCloneProjectData(state.groups),
    selectedGroupId: state.selectedGroupId,
    selectedFocusGroupId: state.selectedFocusGroupId,
    selectedRecapGroupId: state.selectedRecapGroupId,
    expandedFocusGroupIds: [...state.expandedFocusGroupIds],
    selectedZoneId: state.selectedZoneId,
    selectedZoneIds: [...state.selectedZoneIds],
    animationSettings: { ...state.animationSettings },
    stepEditor: { ...state.stepEditor },
    detectionProfile: structuredCloneProjectData(state.detectionProfile),
    detectionDiagnostics: state.detectionDiagnostics
      ? structuredCloneProjectData(state.detectionDiagnostics)
      : null,
    detectionControls: {
      preset: presetSelect.value,
      threshold: thresholdRange.value,
      minArea: minAreaRange.value,
      padding: paddingRange.value,
      mergeDistance: mergeDistanceRange.value,
    },
  };
}

function getUndoSnapshotSignature(snapshot) {
  return JSON.stringify({
    ...snapshot,
    zones: snapshot.zones.map(({ dataUrl, ...zone }) => zone),
  });
}

function checkpointUndo(label, options = {}) {
  if (restoringUndoState || !state.sourceImage) {
    return;
  }
  const now = Date.now();
  if (options.coalesce && lastUndoCheckpoint.label === label && now - lastUndoCheckpoint.time < 600) {
    lastUndoCheckpoint.time = now;
    return;
  }

  const snapshot = createUndoSnapshot();
  const signature = getUndoSnapshotSignature(snapshot);
  if (undoHistory.at(-1)?.signature !== signature) {
    undoHistory.push({ snapshot, signature, label });
    if (undoHistory.length > UNDO_HISTORY_LIMIT) {
      undoHistory.shift();
    }
  }
  lastUndoCheckpoint = { label, time: now };
  updateUndoButtonState();
}

function clearUndoHistory() {
  undoHistory.length = 0;
  lastUndoCheckpoint = { label: null, time: 0 };
  updateUndoButtonState();
}

function updateUndoButtonState() {
  undoButton.disabled = undoHistory.length === 0;
  undoButton.title = undoHistory.length ? `Annuler: ${undoHistory.at(-1).label}` : "Aucune action a annuler";
}

function undoLastAction() {
  if (!undoHistory.length) {
    return;
  }
  const currentSignature = getUndoSnapshotSignature(createUndoSnapshot());
  let entry = undoHistory.pop();
  while (entry && entry.signature === currentSignature && undoHistory.length) {
    entry = undoHistory.pop();
  }
  if (!entry || entry.signature === currentSignature) {
    updateUndoButtonState();
    return;
  }

  restoringUndoState = true;
  resetPreviewPlayback(false);
  state.zones = cloneZonesForUndo(entry.snapshot.zones);
  state.groups = structuredCloneProjectData(entry.snapshot.groups);
  state.selectedGroupId = entry.snapshot.selectedGroupId;
  state.selectedFocusGroupId = entry.snapshot.selectedFocusGroupId;
  state.selectedRecapGroupId = entry.snapshot.selectedRecapGroupId;
  state.expandedFocusGroupIds = [...entry.snapshot.expandedFocusGroupIds];
  state.selectedZoneId = entry.snapshot.selectedZoneId;
  state.selectedZoneIds = [...entry.snapshot.selectedZoneIds];
  state.animationSettings = { ...entry.snapshot.animationSettings };
  state.stepEditor = { ...entry.snapshot.stepEditor };
  state.detectionProfile = structuredCloneProjectData(entry.snapshot.detectionProfile);
  state.detectionDiagnostics = entry.snapshot.detectionDiagnostics
    ? structuredCloneProjectData(entry.snapshot.detectionDiagnostics)
    : null;
  presetSelect.value = entry.snapshot.detectionControls.preset;
  thresholdRange.value = entry.snapshot.detectionControls.threshold;
  minAreaRange.value = entry.snapshot.detectionControls.minArea;
  paddingRange.value = entry.snapshot.detectionControls.padding;
  mergeDistanceRange.value = entry.snapshot.detectionControls.mergeDistance;
  downloadAllButton.disabled = state.zones.length === 0;

  syncDetectionLabels();
  updateDetectionDiagnostics();
  syncAnimationFormControls();
  syncAnimationLabels();
  updateFormatLabel();
  drawAnnotatedPreview();
  renderZones(state.zones);
  renderAnimationStage();
  updateInspector();
  loadStepEditorFromZones(false);
  renderGroupsPanel();
  renderZonesOrderPanel();
  updateAnimationControlsState();
  restoringUndoState = false;
  lastUndoCheckpoint = { label: null, time: 0 };
  updateUndoButtonState();
  setAnimationStatus(`Action annulee: ${entry.label}.`);
}

function getZoneTimingGroupId(animation = {}) {
  if (typeof animation.timingGroupId === "string" && animation.timingGroupId) {
    return animation.timingGroupId;
  }
  if (typeof animation.groupId === "string" && animation.groupId) {
    return animation.groupId;
  }
  return null;
}

function getZoneFocusGroupId(animation = {}) {
  return typeof animation.focusGroupId === "string" && animation.focusGroupId ? animation.focusGroupId : null;
}

function getZoneRecapGroupId(animation = {}) {
  return typeof animation.recapGroupId === "string" && animation.recapGroupId ? animation.recapGroupId : null;
}

function getZoneRevealAtEnd(animation = {}) {
  return Boolean(animation.revealAtEnd);
}

function getGroupById(groupId) {
  return state.groups.find((group) => group.id === groupId) ?? null;
}

function getGroupsByKind(kind) {
  return state.groups.filter((group) => group.kind === kind);
}

function getTimingGroupForZone(zone) {
  const timingGroupId = getZoneTimingGroupId(zone?.animation);
  return timingGroupId ? state.groups.find((group) => group.id === timingGroupId && group.kind === "timing") ?? null : null;
}

function expandZonesToTimingGroups(zones) {
  const zoneIds = new Set();
  zones.forEach((zone) => {
    const timingGroup = getTimingGroupForZone(zone);
    (timingGroup?.zoneIds ?? [zone.id]).forEach((zoneId) => zoneIds.add(zoneId));
  });
  return state.zones.filter((zone) => zoneIds.has(zone.id) && zone.animation.enabled);
}

function getEffectiveFocusGroupId(zone) {
  const timingGroup = getTimingGroupForZone(zone);
  if (timingGroup) {
    const inheritedFocusGroupId = timingGroup.zoneIds
      .map((zoneId) => state.zones.find((item) => item.id === zoneId))
      .map((item) => getZoneFocusGroupId(item?.animation))
      .find(Boolean);
    if (inheritedFocusGroupId) {
      return inheritedFocusGroupId;
    }
  }
  return getZoneFocusGroupId(zone?.animation);
}

function getFocusGroupRevealIndex(group, currentStep) {
  if (!group || group.kind !== "focus") {
    return -1;
  }

  let latestIndex = -1;
  group.zoneIds.forEach((zoneId, index) => {
    const zone = state.zones.find((item) => item.id === zoneId);
    const step = Math.max(1, Number(zone?.animation.step) || 1);
    if (step <= currentStep && index > latestIndex) {
      latestIndex = index;
    }
  });
  return latestIndex;
}

function getFocusAppearanceForDepth(presentation, depth) {
  const sanitized = sanitizeGroupPresentation(presentation);
  if (!sanitized.enabled) {
    return null;
  }

  if (depth <= 0) {
    return {
      opacity: 1,
      scale: sanitized.activeScale,
      blur: sanitized.activeBlur,
    };
  }

  const extraDepth = Math.max(0, depth - 1);
  return {
    opacity: clamp(sanitized.settledOpacity - extraDepth * sanitized.settledOpacityStep, 0.08, 1),
    scale: clamp(sanitized.settledScale - extraDepth * sanitized.settledScaleStep, 0.55, 1),
    blur: clamp(sanitized.settledBlur + extraDepth * sanitized.settledBlurStep, 0, 12),
  };
}

syncDetectionLabels();
syncAnimationLabels();
applyPreset("balanced");
updateFormatLabel();
updateAnimationControlsState();
updateInspector();
updateStepEditorUI();
renderGroupsPanel();
renderZonesOrderPanel();
renderAnimationStage();

thresholdRange.addEventListener("input", () => {
  syncDetectionLabels();
  markPresetAsCustom();
});

minAreaRange.addEventListener("input", () => {
  syncDetectionLabels();
  markPresetAsCustom();
});

paddingRange.addEventListener("input", () => {
  syncDetectionLabels();
  markPresetAsCustom();
});

mergeDistanceRange.addEventListener("input", () => {
  syncDetectionLabels();
  markPresetAsCustom();
});

autoStepGapRange.addEventListener("input", () => {
  checkpointUndo("pause entre etapes", { coalesce: true });
  state.animationSettings.autoStepGap = Number(autoStepGapRange.value);
  syncAnimationLabels();
  updateAnimationControlsState();
});

presetSelect.addEventListener("change", () => {
  if (presetSelect.value === "custom") {
    presetHint.textContent = "Personnalise";
    return;
  }
  applyPreset(presetSelect.value);
});

formatSelect.addEventListener("change", () => {
  checkpointUndo("format de sortie");
  state.animationSettings.format = formatSelect.value;
  updateFormatLabel();
  renderAnimationStage();
});

startTriggerSelect.addEventListener("change", () => {
  checkpointUndo("declenchement de l'animation");
  state.animationSettings.startTrigger = startTriggerSelect.value;
  updateAnimationControlsState();
});

stepModeSelect.addEventListener("change", () => {
  checkpointUndo("mode de progression");
  state.animationSettings.stepMode = stepModeSelect.value;
  updateAnimationControlsState();
});

guideToggle.addEventListener("change", () => {
  checkpointUndo("affichage du guide");
  state.animationSettings.showGuide = guideToggle.checked;
  renderAnimationStage();
});

stepEditorInput.addEventListener("input", () => {
  state.stepEditor.step = Math.max(1, Number(stepEditorInput.value) || 1);
  loadStepEditorFromZones(false);
});

stepEffectSelect.addEventListener("change", () => {
  state.stepEditor.effect = stepEffectSelect.value;
  updateStepEditorUI();
});

stepDurationRange.addEventListener("input", () => {
  state.stepEditor.duration = Number(stepDurationRange.value);
  updateStepEditorUI();
});

stepStaggerRange.addEventListener("input", () => {
  state.stepEditor.stagger = Number(stepStaggerRange.value);
  updateStepEditorUI();
});

applyStepSettingsButton.addEventListener("click", () => {
  applyStepSettings();
});

splitZoneAutoButton.addEventListener("click", () => {
  subdivideSelectedZone("auto");
});

splitZoneVerticalButton.addEventListener("click", () => {
  subdivideSelectedZone("vertical");
});

splitZoneHorizontalButton.addEventListener("click", () => {
  subdivideSelectedZone("horizontal");
});

splitZone2ColsButton.addEventListener("click", () => {
  subdivideSelectedZone("columns-2");
});

splitZone3ColsButton.addEventListener("click", () => {
  subdivideSelectedZone("columns-3");
});

splitZone4ColsButton.addEventListener("click", () => {
  subdivideSelectedZone("columns-4");
});

resetSubdivideButton.addEventListener("click", () => {
  resetSubdivisionForSelection();
});

controlsPanel.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") {
    return;
  }

  const target = event.target;
  if (!(target instanceof HTMLElement) || target === imageInput) {
    return;
  }

  if (!state.sourceImage || detectButton.disabled) {
    return;
  }

  event.preventDefault();
  runDetection();
});

imageInput.addEventListener("change", async (event) => {
  const [file] = event.target.files ?? [];
  if (!file) {
    return;
  }

  try {
    const image = await loadImageFromFile(file);
    state.sourceImage = image;
    state.imageName = file.name.replace(/\.[^.]+$/, "") || "infographie";
    state.zones = [];
    state.groups = [];
    state.selectedGroupId = null;
    state.selectedFocusGroupId = null;
    state.selectedRecapGroupId = null;
    state.selectedZoneId = null;
    state.selectedZoneIds = [];
    state.detectionDiagnostics = null;
    clearUndoHistory();

    drawSourceImage();
    renderZones([]);
    renderAnimationStage();
    updateInspector();
    updateStepEditorUI();
    renderGroupsPanel();
    renderZonesOrderPanel();

    detectButton.disabled = false;
    downloadAllButton.disabled = true;
    exportZipButton.disabled = true;
    updateDetectionDiagnostics();
    updateAnimationControlsState();

    setStatus(
      "Image chargee. Lance la detection ou ajuste les reglages avant analyse. La touche Entree valide aussi les reglages.",
      `${image.width} x ${image.height} px`
    );
  } catch (error) {
    console.error(error);
    setStatus("Impossible de charger cette image.", "");
  }
});

openProjectButton.addEventListener("click", () => {
  projectInput.click();
});

projectInput.addEventListener("change", async (event) => {
  const [file] = event.target.files ?? [];
  projectInput.value = "";
  if (!file) {
    return;
  }

  try {
    const raw = await file.text();
    const project = JSON.parse(raw);
    await loadProjectFromPayload(project);
    clearUndoHistory();
  } catch (error) {
    console.error(error);
    setStatus("Impossible d'ouvrir ce projet JSON.", "Verifie que le fichier n'est pas corrompu.");
  }
});

saveProjectButton.addEventListener("click", async () => {
  if (!state.sourceImage) {
    return;
  }
  await saveProjectAsJson();
});

detectButton.addEventListener("click", () => {
  if (state.sourceImage) {
    runDetection();
  }
});

downloadAllButton.addEventListener("click", async () => {
  for (const zone of state.zones) {
    await triggerDownload(zone.fileName, zone.dataUrl);
    await delay(100);
  }
});

exportZipButton.addEventListener("click", async () => {
  await exportProjectZip();
});

selectAllZonesButton.addEventListener("click", () => {
  updateAllZonesEnabled(true);
});

deselectAllZonesButton.addEventListener("click", () => {
  updateAllZonesEnabled(false);
});

playPreviewButton.addEventListener("click", () => {
  startPreviewPlayback();
});

undoButton.addEventListener("click", () => {
  undoLastAction();
});

resetPreviewButton.addEventListener("click", () => {
  checkpointUndo("reinitialisation de l'animation");
  syncAnimationStepsToZoneOrder();
  renderZones(state.zones);
  renderAnimationStage();
  renderGroupsPanel();
  renderZonesOrderPanel();
  updateInspector();
  updateAnimationControlsState();
  setAnimationStatus("Animation reinitialisee selon l'ordre actuel des zones.");
});

exportHtmlButton.addEventListener("click", () => {
  exportOverlayHtml();
});

presetCascadeButton.addEventListener("click", () => applyPresentationPreset("cascade"));
presetOrganicButton.addEventListener("click", () => applyPresentationPreset("organic"));
presetFloralButton.addEventListener("click", () => applyPresentationPreset("floral"));
presetConstellationButton.addEventListener("click", () => applyPresentationPreset("constellation"));

fullscreenPreviewButton.addEventListener("click", async () => {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    await animationStageViewport.requestFullscreen();
  } catch (error) {
    console.error(error);
    setAnimationStatus("Le mode plein ecran n'est pas disponible dans ce navigateur.");
  }
});

toggleZoneLockButton.addEventListener("click", () => {
  toggleSelectedZoneLock();
});

duplicateZoneButton.addEventListener("click", () => {
  duplicateSelectedZone();
});

deleteZoneButton.addEventListener("click", () => {
  deleteSelectedZones();
});

addZoneModeButton.addEventListener("click", () => {
  toggleAddZoneMode();
});

createTimingGroupButton.addEventListener("click", () => {
  createNewTimingGroup();
});

removeSelectedFromTimingGroupButton.addEventListener("click", () => {
  removeSelectedZoneFromTimingGroup();
});

createFocusGroupButton.addEventListener("click", () => {
  createNewFocusGroup();
});

removeSelectedFromFocusGroupButton.addEventListener("click", () => {
  removeSelectedZoneFromFocusGroup();
});

createRecapGroupButton.addEventListener("click", () => {
  createNewRecapGroup();
});

removeSelectedFromRecapGroupButton.addEventListener("click", () => {
  removeSelectedZoneFromRecapGroup();
});

animationStage.addEventListener("click", (event) => {
  if (state.previewRuntime && state.previewRuntime.active) {
    event.preventDefault();
    state.previewRuntime.handleInteraction("click");
    return;
  }

  const zoneElement = event.target.closest(".animation-zone");
  if (zoneElement) {
    selectZone(zoneElement.dataset.zoneId, event.ctrlKey || event.metaKey);
  }
});

previewCanvas.addEventListener("mousedown", (event) => {
  checkpointUndo("edition de zone sur le canvas");
  handlePreviewCanvasPointerDown(event);
});
previewCanvas.addEventListener("mousemove", handlePreviewCanvasPointerMove);
previewCanvas.addEventListener("mouseleave", handlePreviewCanvasPointerLeave);
zonesOrderList.addEventListener("dragover", handleZoneOrderListDragOver);
zonesOrderList.addEventListener("drop", handleZoneOrderListDrop);
window.addEventListener("mouseup", handlePreviewCanvasPointerUp);

window.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && !event.shiftKey && event.key.toLowerCase() === "z") {
    event.preventDefault();
    event.stopPropagation();
    undoLastAction();
    return;
  }

  const target = event.target;
  if (
    target instanceof HTMLElement &&
    (target.tagName === "INPUT" || target.tagName === "SELECT" || target.tagName === "TEXTAREA")
  ) {
    return;
  }

  if (state.previewRuntime && state.previewRuntime.active) {
    state.previewRuntime.handleInteraction("key");
    return;
  }

  if ((event.key === "Delete" || event.key === "Backspace") && state.selectedZoneIds.length) {
    event.preventDefault();
    deleteSelectedZones();
    return;
  }

  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key) && state.selectedZoneIds.length) {
    event.preventDefault();
    nudgeSelectedZones(event.key, event.shiftKey ? 10 : 1);
  }
});

zoneEnabledCheckbox.addEventListener("change", () => {
  updateSelectedZoneAnimation({ enabled: zoneEnabledCheckbox.checked });
});

zoneStepInput.addEventListener("input", () => {
  updateSelectedZoneAnimation({ step: Math.max(1, Number(zoneStepInput.value) || 1) });
});

zoneEffectSelect.addEventListener("change", () => {
  updateSelectedZoneAnimation({ effect: zoneEffectSelect.value });
});

zoneDurationRange.addEventListener("input", () => {
  updateSelectedZoneAnimation({ duration: Number(zoneDurationRange.value) }, false);
});

zoneDelayRange.addEventListener("input", () => {
  updateSelectedZoneAnimation({ delay: Number(zoneDelayRange.value) }, false);
});

zoneOffsetXRange.addEventListener("input", () => {
  updateSelectedZoneAnimation({ offsetX: Number(zoneOffsetXRange.value) }, false);
});

zoneOffsetYRange.addEventListener("input", () => {
  updateSelectedZoneAnimation({ offsetY: Number(zoneOffsetYRange.value) }, false);
});

zoneScaleRange.addEventListener("input", () => {
  updateSelectedZoneAnimation({ scaleFrom: Number(zoneScaleRange.value) / 100 }, false);
});

zoneRotateRange.addEventListener("input", () => {
  updateSelectedZoneAnimation({ rotateFrom: Number(zoneRotateRange.value) }, false);
});

function syncDetectionLabels() {
  thresholdValue.textContent = thresholdRange.value;
  minAreaValue.textContent = minAreaRange.value;
  paddingValue.textContent = `${paddingRange.value} px`;
  mergeDistanceValue.textContent = `${mergeDistanceRange.value} px`;
}

function syncAnimationLabels() {
  autoStepGapValue.textContent = `${autoStepGapRange.value} ms`;
  stepDurationValue.textContent = `${stepDurationRange.value} ms`;
  stepStaggerValue.textContent = `${stepStaggerRange.value} ms`;
  const zone = getSelectedZone();
  if (!zone) {
    return;
  }
  zoneDurationValue.textContent = `${zone.animation.duration} ms`;
  zoneDelayValue.textContent = `${zone.animation.delay} ms`;
  zoneOffsetXValue.textContent = `${zone.animation.offsetX} px`;
  zoneOffsetYValue.textContent = `${zone.animation.offsetY} px`;
  zoneScaleValue.textContent = `${Math.round(zone.animation.scaleFrom * 100)} %`;
  zoneRotateValue.textContent = `${zone.animation.rotateFrom} deg`;
}

function updateFormatLabel() {
  formatHint.textContent = FORMATS[state.animationSettings.format].label;
}

function applyPreset(presetKey) {
  const preset = presets[presetKey];
  if (!preset) {
    presetHint.textContent = "Personnalise";
    return;
  }

  state.detectionProfile = preset;
  thresholdRange.value = String(preset.threshold);
  minAreaRange.value = String(preset.minArea);
  paddingRange.value = String(preset.padding);
  mergeDistanceRange.value = String(preset.mergeDistance);
  presetHint.textContent = preset.label;
  presetSelect.value = presetKey;
  syncDetectionLabels();
}

function markPresetAsCustom() {
  if (presetSelect.value !== "custom") {
    presetSelect.value = "custom";
  }
  presetHint.textContent = "Personnalise";
}

function setStatus(message, summary) {
  statusText.textContent = message;
  summaryText.textContent = summary;
}

function updateDetectionDiagnostics() {
  if (!state.detectionDiagnostics) {
    diagnosticsText.textContent = "Aucune analyse lancee.";
    return;
  }

  const diagnostics = state.detectionDiagnostics;
  diagnosticsText.textContent = [
    `Mode ${diagnostics.mode}`,
    `seuil ${diagnostics.threshold}`,
    `${formatNumber(diagnostics.foregroundPixels)} px avant-plan (${Math.round(diagnostics.foregroundRatio * 1000) / 10} %)`,
    `${diagnostics.candidateCount} candidat(s)`,
    `${diagnostics.keptCount} conserve(s)`,
  ].join(" • ");
}

function setAnimationStatus(message) {
  animationStatusText.textContent = message;
}

function drawSourceImage() {
  if (!state.sourceImage) {
    previewContext.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    return;
  }

  previewCanvas.width = state.sourceImage.width;
  previewCanvas.height = state.sourceImage.height;
  previewContext.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
  previewContext.drawImage(state.sourceImage, 0, 0);
}

function drawAnnotatedPreview() {
  if (!state.sourceImage) {
    return;
  }

  drawSourceImage();
  state.previewOrderLabels = [];
  previewContext.save();
  previewContext.lineWidth = 3;
  previewContext.font = "600 18px 'Space Grotesk', sans-serif";
  previewContext.textBaseline = "top";

  state.zones.forEach((zone, index) => {
    const isSelected = state.selectedZoneIds.includes(zone.id);
    previewContext.fillStyle = zone.animation.enabled
      ? isSelected
        ? "rgba(32, 100, 203, 0.18)"
        : "rgba(217, 93, 57, 0.18)"
      : "rgba(31, 27, 22, 0.1)";
    previewContext.strokeStyle = zone.animation.enabled
      ? isSelected
        ? "rgba(32, 100, 203, 0.95)"
        : "rgba(217, 93, 57, 0.95)"
      : "rgba(31, 27, 22, 0.35)";
    previewContext.fillRect(zone.x, zone.y, zone.width, zone.height);
    previewContext.strokeRect(zone.x, zone.y, zone.width, zone.height);

    const zoneOrderNumber = (zone.animation.order ?? index) + 1;
    const label = zone.locked ? `${zoneOrderNumber} LOCK` : `${zoneOrderNumber}`;
    const labelWidth = zone.locked ? 82 : Math.max(36, previewContext.measureText(label).width + 18);
    const labelRect = {
      x: zone.x + 8,
      y: zone.y + 8,
      width: labelWidth,
      height: 30,
      zoneId: zone.id,
    };
    state.previewOrderLabels.push(labelRect);
    previewContext.fillStyle = "rgba(31, 27, 22, 0.88)";
    previewContext.fillRect(labelRect.x, labelRect.y, labelRect.width, labelRect.height);
    previewContext.fillStyle = "#fff";
    previewContext.fillText(label, zone.x + 17, zone.y + 13);

    if (isSelected && !zone.locked) {
      drawPreviewResizeHandles(zone);
    }
  });

  if (!state.previewEdit.createMode) {
    drawPreviewDeleteAction();
  }

  if (state.previewEdit.createMode && state.previewEdit.draftBox) {
    drawDraftPreviewBox(state.previewEdit.draftBox);
  }

  previewContext.restore();
}

function drawPreviewResizeHandles(zone) {
  const handles = getPreviewHandleRects(zone);
  previewContext.save();
  previewContext.fillStyle = "#ffffff";
  previewContext.strokeStyle = "rgba(32, 100, 203, 0.95)";
  previewContext.lineWidth = 2;
  Object.values(handles).forEach((handle) => {
    previewContext.fillRect(handle.x, handle.y, handle.size, handle.size);
    previewContext.strokeRect(handle.x, handle.y, handle.size, handle.size);
  });
  previewContext.restore();
}

function drawDraftPreviewBox(box) {
  previewContext.save();
  previewContext.fillStyle = "rgba(32, 100, 203, 0.14)";
  previewContext.strokeStyle = "rgba(32, 100, 203, 0.95)";
  previewContext.setLineDash([10, 6]);
  previewContext.lineWidth = 2;
  previewContext.fillRect(box.x, box.y, box.width, box.height);
  previewContext.strokeRect(box.x, box.y, box.width, box.height);
  previewContext.restore();
}

function drawPreviewDeleteAction() {
  const rect = getPreviewDeleteActionRect();
  if (!rect) {
    return;
  }

  previewContext.save();
  previewContext.fillStyle = "rgba(31, 27, 22, 0.9)";
  previewContext.strokeStyle = "rgba(255, 255, 255, 0.6)";
  previewContext.lineWidth = 1;
  drawRoundedRect(previewContext, rect.x, rect.y, rect.width, rect.height, 16);
  previewContext.fill();
  previewContext.stroke();
  previewContext.fillStyle = "#fff";
  previewContext.font = "600 15px 'Space Grotesk', sans-serif";
  previewContext.textBaseline = "middle";
  previewContext.fillText(rect.label, rect.x + 16, rect.y + rect.height / 2);
  previewContext.restore();
}

function handlePreviewCanvasPointerDown(event) {
  if (!state.sourceImage || !state.zones.length) {
    if (!state.sourceImage) {
      return;
    }
  }

  const point = getCanvasPoint(event);

  if (!state.previewEdit.createMode) {
    const orderLabelHit = getPreviewOrderLabelHit(point);
    if (orderLabelHit) {
      promptZoneOrderChange(orderLabelHit.zoneId);
      event.preventDefault();
      return;
    }

    const deleteActionRect = getPreviewDeleteActionRect();
    if (deleteActionRect && isPointInRect(point, deleteActionRect)) {
      deleteSelectedZones();
      event.preventDefault();
      return;
    }
  }

  if (state.previewEdit.createMode) {
    state.previewEdit.dragging = true;
    state.previewEdit.mode = "create";
    state.previewEdit.zoneId = null;
    state.previewEdit.handle = null;
    state.previewEdit.startX = point.x;
    state.previewEdit.startY = point.y;
    state.previewEdit.startBox = null;
    state.previewEdit.pointerMoved = false;
    state.previewEdit.draftBox = {
      x: Math.round(point.x),
      y: Math.round(point.y),
      width: 1,
      height: 1,
    };
    drawAnnotatedPreview();
    event.preventDefault();
    return;
  }

  let handleHit = getPreviewHandleHit(point);
  if (handleHit && handleHit.zone.locked) {
    unlockZoneForCanvasEdit(handleHit.zone);
    handleHit = getPreviewHandleHit(point);
  }
  if (handleHit && !handleHit.zone.locked) {
    if (state.selectedZoneId !== handleHit.zone.id) {
      selectZone(handleHit.zone.id, event.ctrlKey || event.metaKey);
    }
    state.previewEdit = {
      dragging: true,
      mode: "resize",
      zoneId: handleHit.zone.id,
      handle: handleHit.handle,
      startX: point.x,
      startY: point.y,
      startBox: {
        x: handleHit.zone.x,
        y: handleHit.zone.y,
        width: handleHit.zone.width,
        height: handleHit.zone.height,
      },
      pointerMoved: false,
      createMode: false,
      draftBox: null,
    };
    event.preventDefault();
    return;
  }

  const zone = findZoneAtCanvasPoint(point);
  if (zone) {
    unlockZoneForCanvasEdit(zone);
    selectZone(zone.id, event.ctrlKey || event.metaKey);
    state.previewEdit = {
      dragging: true,
      mode: "move",
      zoneId: zone.id,
      handle: null,
      startX: point.x,
      startY: point.y,
      startBox: {
        x: zone.x,
        y: zone.y,
        width: zone.width,
        height: zone.height,
      },
      pointerMoved: false,
      createMode: false,
      draftBox: null,
    };
    event.preventDefault();
  }
}

function unlockZoneForCanvasEdit(zone) {
  if (!zone.locked) {
    return;
  }
  zone.locked = false;
  drawAnnotatedPreview();
  renderZones(state.zones);
  updateInspector();
  updateAnimationControlsState();
}

function handlePreviewCanvasPointerMove(event) {
  if (!state.sourceImage || !state.zones.length) {
    return;
  }

  const point = getCanvasPoint(event);
  if (state.previewEdit.dragging) {
    if (state.previewEdit.mode === "create") {
      state.previewEdit.draftBox = normalizeDraftBox(state.previewEdit.startX, state.previewEdit.startY, point.x, point.y);
      state.previewEdit.pointerMoved = true;
      drawAnnotatedPreview();
      return;
    }

    const zone = state.zones.find((item) => item.id === state.previewEdit.zoneId);
    if (!zone || zone.locked) {
      resetPreviewEditState();
      return;
    }

    if (state.previewEdit.mode === "move") {
      const nextX = clamp(
        state.previewEdit.startBox.x + point.x - state.previewEdit.startX,
        0,
        previewCanvas.width - zone.width
      );
      const nextY = clamp(
        state.previewEdit.startBox.y + point.y - state.previewEdit.startY,
        0,
        previewCanvas.height - zone.height
      );
      zone.x = Math.round(nextX);
      zone.y = Math.round(nextY);
      state.previewEdit.pointerMoved = true;
      previewCanvas.style.cursor = "grabbing";
      drawAnnotatedPreview();
      updateInspector();
      return;
    }

    const nextBox = computeResizedBox(state.previewEdit.startBox, state.previewEdit.handle, point.x - state.previewEdit.startX, point.y - state.previewEdit.startY);
    zone.x = nextBox.x;
    zone.y = nextBox.y;
    zone.width = nextBox.width;
    zone.height = nextBox.height;
    zone.area = nextBox.width * nextBox.height;
    state.previewEdit.pointerMoved = true;
    drawAnnotatedPreview();
    updateInspector();
    return;
  }

  const deleteActionRect = !state.previewEdit.createMode ? getPreviewDeleteActionRect() : null;
  const orderLabelHit = !state.previewEdit.createMode ? getPreviewOrderLabelHit(point) : null;
  if (orderLabelHit) {
    previewCanvas.style.cursor = "pointer";
    return;
  }

  if (deleteActionRect && isPointInRect(point, deleteActionRect)) {
    previewCanvas.style.cursor = "pointer";
    return;
  }

  const handleHit = getPreviewHandleHit(point);
  if (handleHit && !handleHit.zone.locked) {
    previewCanvas.style.cursor = cursorForPreviewHandle(handleHit.handle);
    return;
  }

  if (state.previewEdit.createMode) {
    previewCanvas.style.cursor = "crosshair";
    return;
  }

  const zone = findZoneAtCanvasPoint(point);
  previewCanvas.style.cursor = zone ? "grab" : "default";
}

function handlePreviewCanvasPointerLeave() {
  if (!state.previewEdit.dragging) {
    previewCanvas.style.cursor = "default";
  }
}

function handlePreviewCanvasPointerUp() {
  if (!state.previewEdit.dragging) {
    return;
  }

  const zone = state.zones.find((item) => item.id === state.previewEdit.zoneId);
  const moved = state.previewEdit.pointerMoved;
  const mode = state.previewEdit.mode;
  const draftBox = state.previewEdit.draftBox ? { ...state.previewEdit.draftBox } : null;
  resetPreviewEditState();
  previewCanvas.style.cursor = state.previewEdit.createMode ? "crosshair" : "default";

  if (mode === "create") {
    if (moved && draftBox && draftBox.width >= 16 && draftBox.height >= 16) {
      createManualZone(draftBox);
    } else {
      drawAnnotatedPreview();
    }
    return;
  }

  if (!zone || !moved) {
    drawAnnotatedPreview();
    return;
  }

  refreshZoneAsset(zone);
  drawAnnotatedPreview();
  renderZones(state.zones);
  renderAnimationStage();
  updateInspector();
  renderGroupsPanel();
  renderZonesOrderPanel();
  updateAnimationControlsState();
}

function toggleSelectedZoneLock() {
  const zone = getSelectedZone();
  if (!zone) {
    return;
  }
  checkpointUndo("verrouillage de zone");
  zone.locked = !zone.locked;
  drawAnnotatedPreview();
  renderZones(state.zones);
  updateInspector();
  updateAnimationControlsState();
}

function toggleAddZoneMode() {
  state.previewEdit.createMode = !state.previewEdit.createMode;
  state.previewEdit.draftBox = null;
  state.previewEdit.dragging = false;
  state.previewEdit.mode = null;
  addZoneModeButton.textContent = state.previewEdit.createMode ? "Terminer l'ajout" : "Ajouter une zone";
  addZoneModeButton.classList.toggle("active", state.previewEdit.createMode);
  previewCanvas.style.cursor = state.previewEdit.createMode ? "crosshair" : "default";
  if (state.previewEdit.createMode) {
    setStatus(
      "Mode ajout manuel actif.",
      "Trace une nouvelle zone dans l'aperçu de detection avec la souris."
    );
  } else if (state.sourceImage) {
    setStatus("Mode ajout manuel desactive.", `${state.zones.length} zone(s) actuellement disponibles.`);
  }
  drawAnnotatedPreview();
}

function getCanvasPoint(event) {
  const rect = previewCanvas.getBoundingClientRect();
  const scaleX = previewCanvas.width / Math.max(rect.width, 1);
  const scaleY = previewCanvas.height / Math.max(rect.height, 1);
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

function normalizeDraftBox(startX, startY, endX, endY) {
  const left = clamp(Math.min(startX, endX), 0, previewCanvas.width);
  const top = clamp(Math.min(startY, endY), 0, previewCanvas.height);
  const right = clamp(Math.max(startX, endX), 0, previewCanvas.width);
  const bottom = clamp(Math.max(startY, endY), 0, previewCanvas.height);
  return {
    x: Math.round(left),
    y: Math.round(top),
    width: Math.max(1, Math.round(right - left)),
    height: Math.max(1, Math.round(bottom - top)),
  };
}

function getPreviewInteractionSize() {
  const rect = previewCanvas.getBoundingClientRect();
  const scale = previewCanvas.width / Math.max(rect.width, 1);
  return Math.max(8, Math.round(10 * scale));
}

function getPreviewHandleRects(zone) {
  const size = getPreviewInteractionSize();
  const half = size / 2;
  const centerX = zone.x + zone.width / 2;
  const centerY = zone.y + zone.height / 2;
  return {
    nw: { x: zone.x - half, y: zone.y - half, size },
    ne: { x: zone.x + zone.width - half, y: zone.y - half, size },
    sw: { x: zone.x - half, y: zone.y + zone.height - half, size },
    se: { x: zone.x + zone.width - half, y: zone.y + zone.height - half, size },
    n: { x: centerX - half, y: zone.y - half, size },
    s: { x: centerX - half, y: zone.y + zone.height - half, size },
    w: { x: zone.x - half, y: centerY - half, size },
    e: { x: zone.x + zone.width - half, y: centerY - half, size },
  };
}

function getSelectedZonesBounds() {
  const zones = getSelectedZones();
  if (!zones.length) {
    return null;
  }

  const left = Math.min(...zones.map((zone) => zone.x));
  const top = Math.min(...zones.map((zone) => zone.y));
  const right = Math.max(...zones.map((zone) => zone.x + zone.width));
  const bottom = Math.max(...zones.map((zone) => zone.y + zone.height));

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  };
}

function getPreviewDeleteActionRect() {
  const bounds = getSelectedZonesBounds();
  if (!bounds) {
    return null;
  }

  const label = state.selectedZoneIds.length > 1 ? "Supprimer la selection" : "Supprimer";
  const width = state.selectedZoneIds.length > 1 ? 188 : 120;
  const height = 34;
  const margin = 8;
  const preferredY = bounds.y >= height + margin * 2 ? bounds.y - height - margin : bounds.y + margin;

  return {
    x: clamp(bounds.x + bounds.width - width, margin, previewCanvas.width - width - margin),
    y: clamp(preferredY, margin, previewCanvas.height - height - margin),
    width,
    height,
    label,
  };
}

function getPreviewOrderLabelHit(point) {
  for (let index = state.previewOrderLabels.length - 1; index >= 0; index -= 1) {
    const rect = state.previewOrderLabels[index];
    if (isPointInRect(point, rect)) {
      return rect;
    }
  }
  return null;
}

function getPreviewHandleHit(point) {
  const zone = getSelectedZone();
  if (!zone) {
    return null;
  }

  const handles = getPreviewHandleRects(zone);
  for (const [handle, rect] of Object.entries(handles)) {
    if (point.x >= rect.x && point.x <= rect.x + rect.size && point.y >= rect.y && point.y <= rect.y + rect.size) {
      return { zone, handle };
    }
  }
  return null;
}

function findZoneAtCanvasPoint(point) {
  const ordered = [...state.zones].sort((a, b) => (b.animation.order ?? 0) - (a.animation.order ?? 0));
  return (
    ordered.find(
      (zone) =>
        point.x >= zone.x &&
        point.x <= zone.x + zone.width &&
        point.y >= zone.y &&
        point.y <= zone.y + zone.height
    ) ?? null
  );
}

function cursorForPreviewHandle(handle) {
  if (handle === "n" || handle === "s") return "ns-resize";
  if (handle === "e" || handle === "w") return "ew-resize";
  if (handle === "nw" || handle === "se") return "nwse-resize";
  return "nesw-resize";
}

function isPointInRect(point, rect) {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

function drawRoundedRect(context, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.lineTo(x + width - safeRadius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  context.lineTo(x + width, y + height - safeRadius);
  context.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
  context.lineTo(x + safeRadius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  context.lineTo(x, y + safeRadius);
  context.quadraticCurveTo(x, y, x + safeRadius, y);
  context.closePath();
}

function computeResizedBox(startBox, handle, deltaX, deltaY) {
  const minSize = 16;
  let left = startBox.x;
  let top = startBox.y;
  let right = startBox.x + startBox.width;
  let bottom = startBox.y + startBox.height;

  if (handle.includes("w")) {
    left = clamp(left + deltaX, 0, right - minSize);
  }
  if (handle.includes("e")) {
    right = clamp(right + deltaX, left + minSize, previewCanvas.width);
  }
  if (handle.includes("n")) {
    top = clamp(top + deltaY, 0, bottom - minSize);
  }
  if (handle.includes("s")) {
    bottom = clamp(bottom + deltaY, top + minSize, previewCanvas.height);
  }

  return {
    x: Math.round(left),
    y: Math.round(top),
    width: Math.round(right - left),
    height: Math.round(bottom - top),
  };
}

function resetPreviewEditState() {
  state.previewEdit = {
    dragging: false,
    mode: null,
    zoneId: null,
    handle: null,
    startX: 0,
    startY: 0,
    startBox: null,
    pointerMoved: false,
    createMode: state.previewEdit.createMode,
    draftBox: null,
  };
}

function refreshZoneAsset(zone) {
  const rebuiltBox = enrichLocalZoneGeometry(
    {
      x: zone.x,
      y: zone.y,
      width: zone.width,
      height: zone.height,
      area: zone.width * zone.height,
    },
    zone
  );
  const rebuilt = createZoneAsset(rebuiltBox, 0, zone.animation);
  zone.x = rebuilt.x;
  zone.y = rebuilt.y;
  zone.width = rebuilt.width;
  zone.height = rebuilt.height;
  zone.area = rebuilt.area;
  zone.shape = rebuilt.shape;
  zone.shapeConfidence = rebuilt.shapeConfidence;
  zone.dataUrl = rebuilt.dataUrl;
  zone.sourceWidth = rebuilt.sourceWidth;
  zone.sourceHeight = rebuilt.sourceHeight;
}

function createManualZone(box) {
  checkpointUndo("ajout d'une zone");
  const enriched = enrichLocalZoneGeometry(
    {
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height,
      area: box.width * box.height,
    },
    null
  );
  const zone = createZoneAsset(enriched, state.zones.length);
  zone.animation.order = state.zones.length;
  zone.animation.step = state.zones.length + 1;
  state.zones.push(zone);
  state.selectedZoneId = zone.id;
  state.selectedZoneIds = [zone.id];
  state.stepEditor.step = zone.animation.step;
  drawAnnotatedPreview();
  renderZones(state.zones);
  renderAnimationStage();
  updateInspector();
  loadStepEditorFromZones(true);
  renderGroupsPanel();
  renderZonesOrderPanel();
  updateAnimationControlsState();
  setStatus("Zone ajoutee manuellement.", `${zone.width} x ${zone.height} px • origine (${zone.x}, ${zone.y})`);
}

function duplicateSelectedZone() {
  const source = getSelectedZone();
  if (!source) {
    return;
  }
  checkpointUndo("duplication de zone");

  const offset = 28;
  const box = {
    x: clamp(source.x + offset, 0, Math.max(0, previewCanvas.width - source.width)),
    y: clamp(source.y + offset, 0, Math.max(0, previewCanvas.height - source.height)),
    width: source.width,
    height: source.height,
    area: source.width * source.height,
    shape: source.shape,
    shapeConfidence: source.shapeConfidence,
  };
  const animation = {
    ...source.animation,
    order: state.zones.length,
    step: state.zones.length + 1,
    timingGroupId: null,
    focusGroupId: null,
    recapGroupId: null,
    groupId: null,
  };
  const duplicate = createZoneAsset(box, state.zones.length, animation);
  duplicate.locked = false;
  state.zones.push(duplicate);
  state.selectedZoneId = duplicate.id;
  state.selectedZoneIds = [duplicate.id];
  state.stepEditor.step = duplicate.animation.step;

  drawAnnotatedPreview();
  renderZones(state.zones);
  renderAnimationStage();
  updateInspector();
  loadStepEditorFromZones(true);
  renderGroupsPanel();
  renderZonesOrderPanel();
  updateAnimationControlsState();
  setStatus("Zone dupliquee.", "Glisse la copie dans l'aperçu de detection pour la repositionner.");
}

function deleteSelectedZones() {
  const zoneIds = [...state.selectedZoneIds];
  if (!zoneIds.length) {
    return;
  }
  checkpointUndo("suppression de zone");

  const orderedIds = getZonesInOrder().map((zone) => zone.id);
  const firstDeletedIndex = orderedIds.findIndex((id) => zoneIds.includes(id));

  zoneIds.forEach((zoneId) => {
    removeZoneFromAnyGroup(zoneId, false);
  });

  state.zones = state.zones.filter((zone) => !zoneIds.includes(zone.id));
  normalizeZoneOrder();

  const remainingOrdered = getZonesInOrder();
  const nextZone =
    remainingOrdered[firstDeletedIndex] ??
    remainingOrdered[Math.max(0, firstDeletedIndex - 1)] ??
    null;

  state.selectedZoneId = nextZone?.id ?? null;
  state.selectedZoneIds = nextZone ? [nextZone.id] : [];
  state.stepEditor.step = nextZone?.animation.step ?? 1;
  downloadAllButton.disabled = state.zones.length === 0;
  exportZipButton.disabled = countEnabledZones() === 0;

  drawAnnotatedPreview();
  renderZones(state.zones);
  renderAnimationStage();
  updateInspector();
  loadStepEditorFromZones(true);
  renderGroupsPanel();
  renderZonesOrderPanel();
  updateAnimationControlsState();

  setStatus(
    zoneIds.length > 1 ? "Selection supprimee." : "Zone supprimee.",
    `${state.zones.length} zone(s) restante(s) dans le projet.`
  );
}

function nudgeSelectedZones(key, distance) {
  const selectedZones = getSelectedZones().filter((zone) => !zone.locked);
  if (!selectedZones.length) {
    setStatus("Aucune zone deplacable.", "Deverrouille la zone selectionnee pour la deplacer au clavier.");
    return;
  }
  checkpointUndo("deplacement de zone", { coalesce: true });

  const delta = {
    ArrowLeft: { x: -distance, y: 0 },
    ArrowRight: { x: distance, y: 0 },
    ArrowUp: { x: 0, y: -distance },
    ArrowDown: { x: 0, y: distance },
  }[key];

  selectedZones.forEach((zone) => {
    zone.x = clamp(zone.x + delta.x, 0, Math.max(0, state.sourceImage.width - zone.width));
    zone.y = clamp(zone.y + delta.y, 0, Math.max(0, state.sourceImage.height - zone.height));
    refreshZoneAsset(zone);
  });

  drawAnnotatedPreview();
  renderZones(state.zones);
  renderAnimationStage();
  updateInspector();
  renderZonesOrderPanel();
  updateAnimationControlsState();
  setStatus(
    `${selectedZones.length} zone(s) deplacee(s).`,
    "Fleches: 1 px • Maj + fleche: 10 px."
  );
}

function removeZoneFromAnyGroup(zoneId, rerender = false) {
  removeZoneFromGroupsOfKind(zoneId, "timing", false);
  removeZoneFromGroupsOfKind(zoneId, "focus", false);
  removeZoneFromGroupsOfKind(zoneId, "recap", false);

  if (rerender) {
    renderGroupsPanel();
    updateAnimationControlsState();
  }
}

function runDetection() {
  checkpointUndo("nouvelle detection");
  setStatus("Analyse en cours...", "Extraction des composantes visuelles.");

  const threshold = Number(thresholdRange.value);
  const minArea = Number(minAreaRange.value);
  const padding = Number(paddingRange.value);
  const mergeDistance = Number(mergeDistanceRange.value);
  const profile = state.detectionProfile ?? presets.balanced;

  const workingCanvas = document.createElement("canvas");
  workingCanvas.width = state.sourceImage.width;
  workingCanvas.height = state.sourceImage.height;
  const workingContext = workingCanvas.getContext("2d", { willReadFrequently: true });
  workingContext.drawImage(state.sourceImage, 0, 0);

  const { data, width, height } = workingContext.getImageData(0, 0, workingCanvas.width, workingCanvas.height);
  const detection = DetectionCore.detectZonesFromImageData(data, width, height, profile, {
    threshold,
    minArea,
    padding,
    mergeDistance,
  });
  const { background, mask } = detection;
  const filtered = detection.filteredBoxes;
  state.detectionDiagnostics = detection.diagnostics;
  state.zones = filtered
    .sort((a, b) => {
      if (Math.abs(a.y - b.y) > 20) {
        return a.y - b.y;
      }
      return a.x - b.x;
    })
    .map((box, index) => createZoneAsset(box, index, null, { mask, imageWidth: width, threshold, background }));

  state.selectedZoneId = state.zones[0]?.id ?? null;
  state.selectedZoneIds = state.selectedZoneId ? [state.selectedZoneId] : [];
  state.stepEditor.step = state.zones[0]?.animation.step ?? 1;

  drawAnnotatedPreview();
  renderZones(state.zones);
  renderAnimationStage();
  updateInspector();
  loadStepEditorFromZones(true);
  renderGroupsPanel();
  normalizeZoneOrder();
  renderZonesOrderPanel();
  updateAnimationControlsState();
  updateDetectionDiagnostics();

  downloadAllButton.disabled = state.zones.length === 0;

  if (state.zones.length === 0) {
    setStatus(
      "Aucune zone exploitable detectee. Essaie d'augmenter la sensibilite ou de reduire la taille minimale.",
      `Fond estime: rgb(${background.r}, ${background.g}, ${background.b})`
    );
    setAnimationStatus("Aucune zone disponible pour l'animation.");
    return;
  }

  const totalPixels = state.zones.reduce((sum, zone) => sum + zone.width * zone.height, 0);
  setStatus(
    `${state.zones.length} zone(s) detectee(s) et prete(s) a l'export.`,
    `Mode: ${profile.label} • Fond estime: rgb(${background.r}, ${background.g}, ${background.b}) • Surface totale recadree: ${formatNumber(totalPixels)} px`
  );
  setAnimationStatus(
    `${countEnabledZones()} zone(s) sont dans la slide. Change le format, les etapes et les effets puis exporte.`
  );
}

function createZoneAsset(box, index, animationOverride = null, sourceContext = null) {
  const cropCanvas = document.createElement("canvas");
  cropCanvas.width = box.width;
  cropCanvas.height = box.height;
  const cropContext = cropCanvas.getContext("2d", { willReadFrequently: true });
  cropContext.clearRect(0, 0, cropCanvas.width, cropCanvas.height);
  cropContext.drawImage(
    state.sourceImage,
    box.x,
    box.y,
    box.width,
    box.height,
    0,
    0,
    box.width,
    box.height
  );

  if (box.shape === "round") {
    applyRoundZoneTransparency(cropContext, cropCanvas.width, cropCanvas.height, box, sourceContext);
  }

  return {
    ...box,
    id: makeId(index),
    fileName: `${state.imageName}-zone-${String(index + 1).padStart(2, "0")}.png`,
    dataUrl: cropCanvas.toDataURL("image/png"),
    sourceWidth: cropCanvas.width,
    sourceHeight: cropCanvas.height,
    locked: false,
    subdivisionParent: null,
    subdivisionChildren: null,
      animation: animationOverride
      ? { ...animationOverride }
      : {
        enabled: true,
        step: index + 1,
        order: index,
        effect: "fade-up",
        duration: 700,
        delay: 0,
        timingGroupId: null,
        focusGroupId: null,
        recapGroupId: null,
        groupId: null,
        revealAtEnd: false,
        offsetX: 0,
        offsetY: 24,
        scaleFrom: 0.96,
        rotateFrom: 0,
      },
  };
}

function renderZones(zones) {
  zonesGrid.innerHTML = "";

  if (zones.length === 0) {
    const emptyState = document.createElement("article");
    emptyState.className = "empty-state";
    emptyState.textContent = "Les zones detectees apparaitront ici apres analyse.";
    zonesGrid.append(emptyState);
    return;
  }

  const fragment = document.createDocumentFragment();
  const orderedZones = [...zones].sort((a, b) => {
    const orderA = a.animation.order ?? 0;
    const orderB = b.animation.order ?? 0;
    return orderA - orderB;
  });
  orderedZones.forEach((zone, index) => {
    const zoneOrderNumber = (zone.animation.order ?? index) + 1;
    const card = zoneCardTemplate.content.firstElementChild.cloneNode(true);
    const preview = card.querySelector(".zone-preview");
    const toggle = card.querySelector(".zone-enabled-toggle");
    const title = card.querySelector(".zone-title");
    const dimensions = card.querySelector(".zone-dimensions");
    const position = card.querySelector(".zone-position");
    const step = card.querySelector(".zone-step");
    const deferredState = card.querySelector(".zone-deferred-state");
    const focusState = card.querySelector(".zone-focus-state");
    const recapState = card.querySelector(".zone-recap-state");
    const editButton = card.querySelector(".zone-edit");
    const downloadButton = card.querySelector(".zone-download");
    const deferredButton = card.querySelector(".zone-group-deferred");
    const timingGroupButton = card.querySelector(".zone-group-timing");
    const focusGroupButton = card.querySelector(".zone-group-focus");
    const resetModesButton = card.querySelector(".zone-reset-modes");

    if (state.selectedZoneIds.includes(zone.id)) {
      card.classList.add("selected");
    }

    preview.src = zone.dataUrl;
    preview.alt = `Zone ${zoneOrderNumber}`;
    toggle.checked = zone.animation.enabled;
    title.textContent = `Zone ${zoneOrderNumber}`;
    dimensions.textContent = `${zone.width} x ${zone.height} px`;
    position.textContent = `Origine: (${zone.x}, ${zone.y})`;
    step.textContent = zone.animation.enabled
      ? `${zone.locked ? "Verrouillee • " : ""}Etape ${zone.animation.step} • ${labelForEffect(zone.animation.effect)}${
          getZoneRevealAtEnd(zone.animation) ? " • Attenuee jusqu'a la fin" : ""
        }`
      : "Retiree de la slide";

    toggle.addEventListener("change", (event) => {
      checkpointUndo("activation de zone");
      zone.animation.enabled = event.target.checked;
      drawAnnotatedPreview();
      renderZones(state.zones);
      renderAnimationStage();
      updateInspector();
      updateAnimationControlsState();
    });

    editButton.addEventListener("click", (event) => {
      selectZone(zone.id, event.ctrlKey || event.metaKey);
    });

    preview.addEventListener("click", (event) => {
      selectZone(zone.id, event.ctrlKey || event.metaKey);
    });

    downloadButton.addEventListener("click", () => {
      triggerDownload(zone.fileName, zone.dataUrl);
    });

    const hasMultiSelection = state.selectedZoneIds.length >= 2;
    const isDeferredReveal = getZoneRevealAtEnd(zone.animation);
    const isFocusZone = Boolean(getEffectiveFocusGroupId(zone));
    const isRecapZone = Boolean(getZoneRecapGroupId(zone.animation));
    const hasGroupOrMode = Boolean(
      getZoneTimingGroupId(zone.animation) ||
        getZoneFocusGroupId(zone.animation) ||
        getZoneRecapGroupId(zone.animation) ||
        isDeferredReveal
    );
    deferredState.textContent = isDeferredReveal ? "Attenuee jusqu'a la fin" : "Reveal normal";
    deferredState.classList.toggle("active", isDeferredReveal);
    focusState.textContent = isFocusZone ? "Mode focus actif" : "Mode focus inactif";
    focusState.classList.toggle("active", isFocusZone);
    recapState.textContent = isRecapZone ? "Recap actif" : "Aucun recap";
    recapState.classList.toggle("active", isRecapZone);
    timingGroupButton.disabled = !hasMultiSelection;
    deferredButton.textContent = isDeferredReveal ? "Attenuation active" : "Attenuer";
    deferredButton.classList.toggle("active", isDeferredReveal);
    deferredButton.disabled = !zone.animation.enabled || isFocusZone;
    deferredButton.setAttribute("aria-pressed", String(isDeferredReveal));
    focusGroupButton.disabled = !zone.animation.enabled;
    focusGroupButton.textContent = isFocusZone ? "Focus actif" : "Mode focus";
    focusGroupButton.classList.toggle("active", isFocusZone);
    focusGroupButton.setAttribute("aria-pressed", String(isFocusZone));
    resetModesButton.disabled = !hasGroupOrMode;
    resetModesButton.title = "Retirer cette zone de tous les groupes et modes";
    deferredButton.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleZoneDeferredReveal(zone.id);
    });
    timingGroupButton.addEventListener("click", (event) => {
      event.stopPropagation();
      createNewTimingGroup();
    });
    focusGroupButton.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleZoneFocusMode(zone.id);
    });
    resetModesButton.addEventListener("click", (event) => {
      event.stopPropagation();
      resetZoneGroupsAndModes(zone.id);
    });

    fragment.append(card);
  });

  zonesGrid.append(fragment);
}

function toggleZoneFocusMode(zoneId) {
  const zone = state.zones.find((item) => item.id === zoneId);
  if (!zone || !zone.animation.enabled) {
    return;
  }
  checkpointUndo("mode focus");

  const focusZones = expandZonesToTimingGroups([zone]);
  const activeFocusGroupIds = new Set(focusZones.map((item) => getZoneFocusGroupId(item.animation)).filter(Boolean));
  if (activeFocusGroupIds.size) {
    focusZones.forEach((item, index) => {
      removeZoneFromGroupsOfKind(item.id, "focus", index === focusZones.length - 1);
    });
    setAnimationStatus("Groupe d'apparition retire du mode focus.");
    return;
  }

  state.selectedZoneId = zone.id;
  state.selectedZoneIds = focusZones.map((item) => item.id);
  const timingGroup = getTimingGroupForZone(zone);
  const group = {
    id: makeId(state.groups.length + 1),
    kind: "focus",
    name: timingGroup ? `Focus ${timingGroup.name}` : `Focus zone ${(zone.animation.order ?? 0) + 1}`,
    presentation: createDefaultGroupPresentation(),
    zoneIds: [],
  };
  focusZones.forEach((item) => {
    removeZoneFromGroupsOfKind(item.id, "focus", false, group.id);
    item.animation.revealAtEnd = false;
    item.animation.focusGroupId = group.id;
    group.zoneIds.push(item.id);
  });
  state.groups.push(group);
  state.selectedFocusGroupId = group.id;
  renderZones(state.zones);
  renderAnimationStage();
  updateInspector();
  renderGroupsPanel();
  updateAnimationControlsState();
  setAnimationStatus(timingGroup ? "Groupe d'apparition place en mode focus." : "Zone placee en mode focus.");
}

function toggleZoneDeferredReveal(zoneId) {
  const zone = state.zones.find((item) => item.id === zoneId);
  if (!zone || !zone.animation.enabled || getEffectiveFocusGroupId(zone)) {
    if (zone && getEffectiveFocusGroupId(zone)) {
      setAnimationStatus("Retire le mode focus avant d'atténuer la zone.");
    }
    return;
  }
  checkpointUndo("mode attenuation");

  zone.animation.revealAtEnd = !getZoneRevealAtEnd(zone.animation);
  renderZones(state.zones);
  renderAnimationStage();
  updateInspector();
  updateAnimationControlsState();
  setAnimationStatus(zone.animation.revealAtEnd ? "Zone attenuee jusqu'a la fin." : "Attenuation retiree.");
}

function resetZoneGroupsAndModes(zoneId) {
  const zone = state.zones.find((item) => item.id === zoneId);
  if (!zone) {
    return;
  }
  checkpointUndo("reset groupes et modes");

  const timingGroup = getTimingGroupForZone(zone);
  if (timingGroup) {
    syncZoneOrderToTimingGroupMemberOrder(timingGroup);
  }
  removeZoneFromGroupsOfKind(zone.id, "timing", false);
  removeZoneFromGroupsOfKind(zone.id, "focus", false);
  removeZoneFromGroupsOfKind(zone.id, "recap", false);
  zone.animation.revealAtEnd = false;
  syncAnimationStepsToZoneOrder();

  drawAnnotatedPreview();
  renderZones(state.zones);
  renderAnimationStage();
  updateInspector();
  renderGroupsPanel();
  renderZonesOrderPanel();
  updateAnimationControlsState();
  setAnimationStatus("Groupes et modes de la zone reinitialises.");
}

function renderAnimationStage() {
  resetPreviewPlayback(false);
  animationStage.innerHTML = "";

  const format = FORMATS[state.animationSettings.format];
  animationStage.style.aspectRatio = `${format.width} / ${format.height}`;
  animationStage.style.setProperty("--stage-width", String(format.width));
  animationStage.style.setProperty("--stage-height", String(format.height));

  if (!state.sourceImage) {
    const placeholder = document.createElement("div");
    placeholder.className = "empty-inspector";
    placeholder.textContent = "La scene d'animation apparaitra ici apres detection.";
    placeholder.style.margin = "24px";
    animationStage.append(placeholder);
    return;
  }

  const fit = getContainRect(
    state.sourceImage.width,
    state.sourceImage.height,
    format.width,
    format.height
  );

  getEnabledZonesSorted().forEach((zone) => {
    const element = document.createElement("img");
    element.className = "animation-zone";
    element.dataset.zoneId = zone.id;
    element.src = zone.dataUrl;
    element.alt = zone.fileName;

    if (state.selectedZoneIds.includes(zone.id)) {
      element.classList.add("selected");
    }

    const placement = getZonePlacement(zone, fit, format);
    applyRectStyles(element, placement, format);
    applyZoneEditorAppearance(element, zone);
    animationStage.append(element);
  });
}

function selectZone(zoneId, appendSelection = false) {
  if (appendSelection) {
    if (state.selectedZoneIds.includes(zoneId)) {
      state.selectedZoneIds = state.selectedZoneIds.filter((id) => id !== zoneId);
      if (state.selectedZoneId === zoneId) {
        state.selectedZoneId = state.selectedZoneIds[0] ?? null;
      }
    } else {
      state.selectedZoneIds = [...state.selectedZoneIds, zoneId];
      state.selectedZoneId = zoneId;
    }
  } else {
    state.selectedZoneId = zoneId;
    state.selectedZoneIds = [zoneId];
  }

  const zone = getSelectedZone();
  if (zone) {
    state.stepEditor.step = zone.animation.step;
    loadStepEditorFromZones(true);
  }
  renderZones(state.zones);
  renderAnimationStage();
  updateInspector();
  renderGroupsPanel();
  renderZonesOrderPanel();
  updateAnimationControlsState();
}

function updateInspector() {
  const zone = getSelectedZone();
  if (!zone) {
    inspectorEmptyState.classList.remove("hidden");
    inspectorForm.classList.add("hidden");
    splitZoneSummary.textContent = "Reanalyse uniquement cette zone pour obtenir des sous-zones plus fines.";
    return;
  }

  inspectorEmptyState.classList.add("hidden");
  inspectorForm.classList.remove("hidden");

  selectedZoneTitle.textContent = zone.fileName;
  selectedZoneMeta.textContent = `${zone.width} x ${zone.height} px • origine (${zone.x}, ${zone.y})${zone.locked ? " • verrouillee" : ""}`;
  zoneEnabledCheckbox.checked = zone.animation.enabled;
  zoneStepInput.value = zone.animation.step;
  zoneEffectSelect.value = zone.animation.effect;
  zoneDurationRange.value = zone.animation.duration;
  zoneDelayRange.value = zone.animation.delay;
  zoneOffsetXRange.value = zone.animation.offsetX;
  zoneOffsetYRange.value = zone.animation.offsetY;
  zoneScaleRange.value = Math.round(zone.animation.scaleFrom * 100);
  zoneRotateRange.value = zone.animation.rotateFrom;
  splitZoneSummary.textContent =
    "Utile quand une zone detectee est trop large et que tu veux la redecouper localement sans relancer toute l'image.";
  syncAnimationLabels();
}

function updateSelectedZoneAnimation(patch, rerender = true) {
  const zone = getSelectedZone();
  if (!zone) {
    return;
  }
  checkpointUndo("reglage de zone", { coalesce: true });

  zone.animation = {
    ...zone.animation,
    ...patch,
  };

  syncAnimationLabels();
  if (rerender) {
    renderZones(state.zones);
  }
  renderAnimationStage();
  updateInspector();
  loadStepEditorFromZones(false);
  renderGroupsPanel();
  renderZonesOrderPanel();
  updateAnimationControlsState();
}

function updateAllZonesEnabled(enabled) {
  checkpointUndo(enabled ? "activation de toutes les zones" : "desactivation de toutes les zones");
  state.zones.forEach((zone) => {
    zone.animation.enabled = enabled;
  });
  drawAnnotatedPreview();
  renderZones(state.zones);
  renderAnimationStage();
  updateInspector();
  loadStepEditorFromZones(false);
  renderGroupsPanel();
  renderZonesOrderPanel();
  updateAnimationControlsState();
}

function updateAnimationControlsState() {
  const hasZones = state.zones.length > 0;
  const enabledCount = countEnabledZones();
  const hasEnabledZones = enabledCount > 0;
  const enabledStepCount = hasEnabledZones ? getResolvedEnabledStepCount() : 0;
  const selectedZone = getSelectedZone();
  const hasSelectedZone = Boolean(selectedZone);
  const hasMultiSelection = getSelectedZones().length >= 2;

  selectAllZonesButton.disabled = !hasZones;
  deselectAllZonesButton.disabled = !hasZones;
  toggleZoneLockButton.disabled = !hasSelectedZone;
  toggleZoneLockButton.textContent = selectedZone?.locked ? "Deverrouiller la zone" : "Verrouiller la zone";
  saveProjectButton.disabled = !state.sourceImage;
  playPreviewButton.disabled = !hasEnabledZones;
  resetPreviewButton.disabled = !hasZones;
  exportHtmlButton.disabled = !hasEnabledZones;
  createTimingGroupButton.disabled = !hasMultiSelection;
  removeSelectedFromTimingGroupButton.disabled =
    !hasSelectedZone || getSelectedZones().every((zone) => !getZoneTimingGroupId(zone.animation));
  createFocusGroupButton.disabled = !hasSelectedZone;
  removeSelectedFromFocusGroupButton.disabled =
    !hasSelectedZone || getSelectedZones().every((zone) => !getEffectiveFocusGroupId(zone));
  createRecapGroupButton.disabled = !hasMultiSelection;
  removeSelectedFromRecapGroupButton.disabled =
    !hasSelectedZone || getSelectedZones().every((zone) => !getZoneRecapGroupId(zone.animation));
  autoStepGapRange.disabled = state.animationSettings.stepMode !== "auto";
  applyStepSettingsButton.disabled = !hasEnabledZones || getZonesForStep(state.stepEditor.step).length === 0;
  splitZoneAutoButton.disabled = !hasSelectedZone;
  splitZoneVerticalButton.disabled = !hasSelectedZone;
  splitZoneHorizontalButton.disabled = !hasSelectedZone;
  splitZone2ColsButton.disabled = !hasSelectedZone;
  splitZone3ColsButton.disabled = !hasSelectedZone;
  splitZone4ColsButton.disabled = !hasSelectedZone;
  duplicateZoneButton.disabled = !hasSelectedZone;
  deleteZoneButton.disabled = !hasSelectedZone;
  resetSubdivideButton.disabled = !selectedZone?.subdivisionParent;
  exportZipButton.disabled = !hasEnabledZones;

  if (hasEnabledZones) {
    let message = `${enabledCount} zone(s) dans la slide • ${enabledStepCount} etape(s) • demarrage ${labelForStartTrigger(
      state.animationSettings.startTrigger
    )} • progression ${labelForStepMode(state.animationSettings.stepMode)}.`;
    if (state.animationSettings.stepMode === "auto" && enabledStepCount <= 1) {
      message += " La pause inter-etapes ne s'applique pas tant qu'il n'y a qu'une seule etape.";
    }
    setAnimationStatus(message);
  } else if (hasZones) {
    setAnimationStatus("Aucune zone n'est actuellement incluse dans la slide.");
  }
}

function renderZonesOrderPanel() {
  zonesOrderList.innerHTML = "";

  if (!state.zones.length) {
    const emptyState = document.createElement("article");
    emptyState.className = "empty-state";
    emptyState.textContent = "La liste des zones apparaitra ici apres detection.";
    zonesOrderList.append(emptyState);
    return;
  }

  const fragment = document.createDocumentFragment();
  getZonesInOrder().forEach((zone, index) => {
    const row = document.createElement("div");
    row.className = "zone-order-row";
    row.dataset.zoneId = zone.id;
    if (state.selectedZoneIds.includes(zone.id)) {
      row.classList.add("selected");
    }
    if (!zone.animation.enabled) {
      row.classList.add("inactive");
    }
    if (state.zoneOrderDrag.zoneId === zone.id) {
      row.classList.add("drag-source");
    }
    if (state.zoneOrderDrag.overZoneId === zone.id) {
      row.classList.add(state.zoneOrderDrag.placement === "after" ? "drop-after" : "drop-before");
    }
    row.addEventListener("dragover", (event) => {
      if (!state.zoneOrderDrag.zoneId || state.zoneOrderDrag.zoneId === zone.id) {
        return;
      }
      event.preventDefault();
      const placement = getZoneOrderDropPlacement(event, row);
      state.zoneOrderDrag.overZoneId = zone.id;
      state.zoneOrderDrag.placement = placement;
      updateZoneOrderDropIndicator();
    });
    row.addEventListener("drop", (event) => {
      if (!state.zoneOrderDrag.zoneId || state.zoneOrderDrag.zoneId === zone.id) {
        return;
      }
      event.preventDefault();
      const placement = getZoneOrderDropPlacement(event, row);
      moveZoneOrderToTarget(state.zoneOrderDrag.zoneId, zone.id, placement);
      resetZoneOrderDragState();
    });
    row.addEventListener("click", () => {
      selectZone(zone.id);
    });

    const main = document.createElement("div");
    main.className = "zone-order-main";

    const handle = document.createElement("button");
    handle.type = "button";
    handle.className = "zone-order-handle";
    handle.draggable = true;
    handle.setAttribute("aria-label", `Glisser pour deplacer la zone ${index + 1}`);
    handle.innerHTML = "<span></span><span></span><span></span>";
    handle.addEventListener("click", (event) => {
      event.stopPropagation();
    });
    handle.addEventListener("dragstart", (event) => {
      state.zoneOrderDrag.zoneId = zone.id;
      state.zoneOrderDrag.overZoneId = null;
      state.zoneOrderDrag.placement = "before";
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", zone.id);
      }
      row.classList.add("drag-source");
      zonesOrderList.classList.add("drag-active");
    });
    handle.addEventListener("dragend", () => {
      resetZoneOrderDragState();
    });

    const thumb = document.createElement("img");
    thumb.className = "zone-order-thumb";
    thumb.src = zone.dataUrl;
    thumb.alt = zone.fileName;

    const labelWrap = document.createElement("div");
    labelWrap.className = "zone-order-copy";

    const button = document.createElement("button");
    const zoneOrderNumber = (zone.animation.order ?? index) + 1;

    button.className = "zone-order-label";
    button.innerHTML = `<strong>Zone ${zoneOrderNumber}</strong>`;
    button.addEventListener("click", () => {
      selectZone(zone.id);
    });

    const meta = document.createElement("p");
    meta.className = "zone-order-meta";
    meta.textContent = `Etape ${zone.animation.step} • ${labelForEffect(zone.animation.effect)} • ${zone.width} x ${zone.height} px`;

    labelWrap.append(button, meta);
    main.append(handle, thumb, labelWrap);

    const badge = document.createElement("button");
    badge.type = "button";
    badge.className = "zone-order-badge";
    badge.textContent = zone.animation.enabled ? `${zoneOrderNumber}` : "Off";
    badge.title = "Cliquer pour modifier le numero de zone";
    badge.addEventListener("click", (event) => {
      event.stopPropagation();
      promptZoneOrderChange(zone.id);
    });

    row.append(main, badge);
    fragment.append(row);
  });

  zonesOrderList.append(fragment);
}

function getZonesInOrder() {
  return [...state.zones].sort((a, b) => {
    const orderA = a.animation.order ?? 0;
    const orderB = b.animation.order ?? 0;
    return orderA - orderB;
  });
}

function normalizeZoneOrder() {
  getZonesInOrder().forEach((zone, index) => {
    zone.animation.order = index;
  });
}

function moveZoneOrder(zoneId, direction) {
  const ordered = getZonesInOrder();
  const index = ordered.findIndex((zone) => zone.id === zoneId);
  const nextIndex = index + direction;
  if (index < 0 || nextIndex < 0 || nextIndex >= ordered.length) {
    return;
  }
  checkpointUndo("ordre des zones");

  const [zone] = ordered.splice(index, 1);
  ordered.splice(nextIndex, 0, zone);
  ordered.forEach((item, position) => {
    item.animation.order = position;
  });
  syncGroupMemberOrderToZoneOrder();
  syncAnimationStepsToZoneOrder();

  renderZones(state.zones);
  renderAnimationStage();
  renderZonesOrderPanel();
  renderGroupsPanel();
  updateInspector();
  updateAnimationControlsState();
}

function moveZoneOrderToTarget(draggedZoneId, targetZoneId, placement = "before") {
  const ordered = getZonesInOrder();
  const draggedIndex = ordered.findIndex((zone) => zone.id === draggedZoneId);
  if (draggedIndex < 0) {
    return;
  }
  checkpointUndo("ordre des zones");

  const [draggedZone] = ordered.splice(draggedIndex, 1);
  const targetIndex = ordered.findIndex((zone) => zone.id === targetZoneId);
  if (targetIndex < 0) {
    ordered.push(draggedZone);
  } else {
    const insertionIndex = placement === "after" ? targetIndex + 1 : targetIndex;
    ordered.splice(insertionIndex, 0, draggedZone);
  }

  ordered.forEach((zone, index) => {
    zone.animation.order = index;
  });
  syncGroupMemberOrderToZoneOrder();
  syncAnimationStepsToZoneOrder();
  renderZones(state.zones);
  renderAnimationStage();
  renderZonesOrderPanel();
  renderGroupsPanel();
  updateInspector();
  updateAnimationControlsState();
}

function moveZoneOrderToPosition(zoneId, targetPosition) {
  const ordered = getZonesInOrder();
  const currentIndex = ordered.findIndex((zone) => zone.id === zoneId);
  if (currentIndex < 0) {
    return;
  }
  checkpointUndo("ordre des zones");

  const clampedIndex = clamp(Math.round(targetPosition) - 1, 0, ordered.length - 1);
  const [zone] = ordered.splice(currentIndex, 1);
  ordered.splice(clampedIndex, 0, zone);
  ordered.forEach((item, index) => {
    item.animation.order = index;
  });
  syncGroupMemberOrderToZoneOrder();
  syncAnimationStepsToZoneOrder();
  drawAnnotatedPreview();
  renderZones(state.zones);
  renderAnimationStage();
  renderZonesOrderPanel();
  renderGroupsPanel();
  updateInspector();
  updateAnimationControlsState();
}

function promptZoneOrderChange(zoneId) {
  const zone = state.zones.find((item) => item.id === zoneId);
  if (!zone) {
    return;
  }

  const currentPosition = (zone.animation.order ?? 0) + 1;
  const value = window.prompt(`Nouveau numero de zone (1-${state.zones.length})`, String(currentPosition));
  if (value === null) {
    return;
  }

  const targetPosition = Number(value);
  if (!Number.isFinite(targetPosition)) {
    setStatus("Numero invalide.", "Entre un nombre correspondant au rang voulu.");
    return;
  }

  moveZoneOrderToPosition(zone.id, targetPosition);
  setStatus("Ordre des zones mis a jour.", `Zone deplacee en position ${clamp(Math.round(targetPosition), 1, state.zones.length)}.`);
}

function handleZoneOrderListDragOver(event) {
  if (!state.zoneOrderDrag.zoneId) {
    return;
  }
  event.preventDefault();
}

function handleZoneOrderListDrop(event) {
  if (!state.zoneOrderDrag.zoneId) {
    return;
  }

  const row = event.target.closest(".zone-order-row");
  if (row) {
    return;
  }

  event.preventDefault();
  moveZoneOrderToEnd(state.zoneOrderDrag.zoneId);
  resetZoneOrderDragState();
}

function moveZoneOrderToEnd(zoneId) {
  const ordered = getZonesInOrder().filter((zone) => zone.id !== zoneId);
  const zone = state.zones.find((item) => item.id === zoneId);
  if (!zone) {
    return;
  }
  checkpointUndo("ordre des zones");

  ordered.push(zone);
  ordered.forEach((item, index) => {
    item.animation.order = index;
  });
  syncGroupMemberOrderToZoneOrder();
  syncAnimationStepsToZoneOrder();
  renderZones(state.zones);
  renderAnimationStage();
  renderZonesOrderPanel();
  renderGroupsPanel();
  updateInspector();
  updateAnimationControlsState();
}

function getZoneOrderDropPlacement(event, row) {
  const rect = row.getBoundingClientRect();
  return event.clientY >= rect.top + rect.height / 2 ? "after" : "before";
}

function resetZoneOrderDragState() {
  state.zoneOrderDrag.zoneId = null;
  state.zoneOrderDrag.overZoneId = null;
  state.zoneOrderDrag.placement = "before";
  clearZoneOrderDropIndicator();
  zonesOrderList.classList.remove("drag-active");
}

function updateZoneOrderDropIndicator() {
  clearZoneOrderDropIndicator();
  const row = zonesOrderList.querySelector(`[data-zone-id="${state.zoneOrderDrag.overZoneId}"]`);
  if (!row) {
    return;
  }
  row.classList.add(state.zoneOrderDrag.placement === "after" ? "drop-after" : "drop-before");
}

function clearZoneOrderDropIndicator() {
  zonesOrderList.querySelectorAll(".zone-order-row").forEach((row) => {
    row.classList.remove("drop-before", "drop-after", "drag-source");
  });
}

function syncGroupMemberOrderToZoneOrder() {
  [...getGroupsByKind("timing"), ...getGroupsByKind("recap")].forEach((group) => {
    group.zoneIds.sort((a, b) => {
      const zoneA = state.zones.find((zone) => zone.id === a);
      const zoneB = state.zones.find((zone) => zone.id === b);
      const orderA = zoneA?.animation.order ?? Number.MAX_SAFE_INTEGER;
      const orderB = zoneB?.animation.order ?? Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    });
  });
}

function syncAnimationStepsToZoneOrder() {
  const assignedTimingGroupIds = new Set();
  let nextStep = 1;
  getZonesInOrder().forEach((zone) => {
    const timingGroup = getTimingGroupForZone(zone);
    if (!timingGroup) {
      zone.animation.step = nextStep;
      nextStep += 1;
      return;
    }
    if (assignedTimingGroupIds.has(timingGroup.id)) {
      return;
    }

    timingGroup.step = nextStep;
    timingGroup.zoneIds.forEach((zoneId) => {
      const member = state.zones.find((item) => item.id === zoneId);
      if (member) {
        member.animation.step = nextStep;
      }
    });
    assignedTimingGroupIds.add(timingGroup.id);
    nextStep += 1;
  });
}

function syncZoneOrderToTimingGroupMemberOrder(group) {
  if (!group || group.kind !== "timing") {
    return;
  }
  const orderedZones = getZonesInOrder();
  const mergedIds = AnimationCore.mergeGroupOrder(
    orderedZones.map((zone) => zone.id),
    group.zoneIds
  );
  mergedIds.forEach((zoneId, index) => {
    const zone = state.zones.find((item) => item.id === zoneId);
    if (zone) {
      zone.animation.order = index;
    }
  });
  syncGroupMemberOrderToZoneOrder();
  syncAnimationStepsToZoneOrder();
}

function applyPresentationPreset(mode) {
  const orderedZones = getZonesInOrder().filter((zone) => zone.animation.enabled);
  if (!orderedZones.length) {
    return;
  }
  checkpointUndo("preset de presentation");

  const format = FORMATS[state.animationSettings.format];
  const fit = state.sourceImage
    ? getContainRect(state.sourceImage.width, state.sourceImage.height, format.width, format.height)
    : { x: 0, y: 0, width: format.width, height: format.height };

  const timingGroups = getGroupsByKind("timing");

  if (!timingGroups.length) {
    orderedZones.forEach((zone, index) => {
      zone.animation.step = index + 1;
      zone.animation.timingGroupId = null;
      zone.animation.groupId = null;
    });
  }

  const groups = timingGroups.length
    ? [...timingGroups]
    : orderedZones.map((zone, index) => ({
        id: `virtual-${zone.id}`,
        kind: "timing",
        name: `Apparition ${index + 1}`,
        step: index + 1,
        stagger: 0,
        zoneIds: [zone.id],
      }));

  const totalMembers = groups.reduce((sum, group) => sum + group.zoneIds.length, 0);
  let globalIndex = 0;

  groups.forEach((group, groupIndex) => {
    const members = group.zoneIds
      .map((zoneId) => state.zones.find((zone) => zone.id === zoneId))
      .filter(Boolean)
      .sort((a, b) => (a.animation.order ?? 0) - (b.animation.order ?? 0));

    if (!members.length) {
      return;
    }

    group.step = groupIndex + 1;
    if (mode === "cascade") {
      group.stagger = 120;
      members.forEach((zone, index) => {
        applyPresentationMotionPreset(zone, members, groupIndex, index, globalIndex, totalMembers, fit, format, "cascade");
        globalIndex += 1;
      });
    } else if (mode === "organic") {
      group.stagger = 170;
      members.forEach((zone, index) => {
        applyPresentationMotionPreset(zone, members, groupIndex, index, globalIndex, totalMembers, fit, format, "organic");
        globalIndex += 1;
      });
    } else if (mode === "floral") {
      group.stagger = 150;
      members.forEach((zone, index) => {
        applyPresentationMotionPreset(zone, members, groupIndex, index, globalIndex, totalMembers, fit, format, "floral");
        globalIndex += 1;
      });
    } else if (mode === "constellation") {
      group.stagger = 190;
      members.forEach((zone, index) => {
        applyPresentationMotionPreset(
          zone,
          members,
          groupIndex,
          index,
          globalIndex,
          totalMembers,
          fit,
          format,
          "constellation"
        );
        globalIndex += 1;
      });
    }

    members.forEach((zone) => {
      zone.animation.step = group.step;
      if (timingGroups.length) {
        zone.animation.timingGroupId = group.id;
        zone.animation.groupId = group.id;
      }
    });
  });

  renderZones(state.zones);
  renderAnimationStage();
  renderGroupsPanel();
  renderZonesOrderPanel();
  updateInspector();
  updateAnimationControlsState();
  setAnimationStatus(
    `Preset de presentation ${labelForPresentationPreset(
      mode
    )} applique avec offsets, rotation, zoom et decalage temporel.`
  );
}

function applyEffectPreset(zone, effect, delay) {
  zone.animation.effect = effect;
  zone.animation.delay = delay;
  zone.animation.duration =
    effect.startsWith("mist") ? 1100 : effect.startsWith("drift") ? 950 : effect === "constellation" ? 900 : 820;
  const defaults = getEffectDefaults(effect);
  if (defaults.offsetX !== null) zone.animation.offsetX = defaults.offsetX;
  if (defaults.offsetY !== null) zone.animation.offsetY = defaults.offsetY;
  if (defaults.scaleFrom !== null) zone.animation.scaleFrom = defaults.scaleFrom;
  if (defaults.rotateFrom !== null) zone.animation.rotateFrom = defaults.rotateFrom;
}

function applyEffectPresetValues(zone, effect, values) {
  applyEffectPreset(zone, effect, values.delay);
  zone.animation.duration = values.duration;
  zone.animation.offsetX = values.offsetX;
  zone.animation.offsetY = values.offsetY;
  zone.animation.scaleFrom = values.scaleFrom;
  zone.animation.rotateFrom = values.rotateFrom;
}

function applyPresentationMotionPreset(zone, members, groupIndex, index, globalIndex, totalMembers, fit, format, mode) {
  const count = Math.max(1, members.length);
  const normalizedIndex = count <= 1 ? 0.5 : index / (count - 1);
  const globalRatio = totalMembers <= 1 ? 0.5 : globalIndex / Math.max(totalMembers - 1, 1);
  const wave = Math.sin((normalizedIndex + groupIndex * 0.17 + globalRatio * 0.65) * Math.PI * 2);
  const orbit = Math.cos((normalizedIndex + groupIndex * 0.11 + globalRatio * 0.5) * Math.PI * 2);
  const placement = getZonePlacement(zone, fit, format);
  const centerX = placement.x + placement.width / 2;
  const centerY = placement.y + placement.height / 2;
  const sceneCenterX = format.width / 2;
  const sceneCenterY = format.height / 2;
  const radialX = (centerX - sceneCenterX) / Math.max(sceneCenterX, 1);
  const radialY = (centerY - sceneCenterY) / Math.max(sceneCenterY, 1);
  const sideBias = centerX < sceneCenterX ? -1 : 1;

  if (mode === "cascade") {
    const effect = ["fade-up", "fade-right", "zoom", "fade-left", "pop", "fade-down"][globalIndex % 6];
    applyEffectPresetValues(zone, effect, {
      delay: Math.round(globalIndex * 55 + index * 30 + Math.abs(radialX) * 40),
      duration: 720 + (globalIndex % 4) * 90,
      offsetX: Math.round(radialX * 34 + orbit * 18 + sideBias * 8),
      offsetY: Math.round(36 + Math.abs(radialY) * 28 + normalizedIndex * 18),
      scaleFrom: clamp(0.88 + normalizedIndex * 0.08 + Math.abs(wave) * 0.05, 0.84, 1.1),
      rotateFrom: Math.round(radialX * 8 + wave * 7 + sideBias * 2),
    });
    return;
  }

  if (mode === "organic") {
    const effect = ["mist-up", "drift-left", "drift-right", "zoom", "mist-left", "mist-right"][globalIndex % 6];
    applyEffectPresetValues(zone, effect, {
      delay: Math.round(globalIndex * 70 + (wave + 1) * 40 + index * 25),
      duration: 900 + (globalIndex % 5) * 85,
      offsetX: Math.round(radialX * 52 + orbit * 28 + wave * 14),
      offsetY: Math.round(18 + radialY * 24 + Math.abs(wave) * 40),
      scaleFrom: clamp(0.92 + Math.abs(radialX) * 0.08 + Math.abs(orbit) * 0.06, 0.88, 1.12),
      rotateFrom: Math.round(radialX * 10 + orbit * 8 + wave * 4),
    });
    return;
  }

  if (mode === "floral") {
    const petalAngle = normalizedIndex * Math.PI * 2 + groupIndex * 0.42 + globalRatio * Math.PI;
    const radius = 24 + (globalIndex % 4) * 10 + Math.abs(radialY) * 18;
    const effect = ["mist-left", "mist-right", "pop", "zoom", "mist-up", "fade-up"][globalIndex % 6];
    applyEffectPresetValues(zone, effect, {
      delay: Math.round(globalIndex * 65 + (1 - normalizedIndex) * 55 + Math.abs(orbit) * 25),
      duration: 860 + (globalIndex % 6) * 75,
      offsetX: Math.round(Math.cos(petalAngle) * radius + radialX * 22),
      offsetY: Math.round(Math.sin(petalAngle) * radius + radialY * 24),
      scaleFrom: clamp(0.82 + Math.abs(Math.sin(petalAngle)) * 0.18 + Math.abs(wave) * 0.04, 0.8, 1.1),
      rotateFrom: Math.round(Math.cos(petalAngle) * 12 + wave * 6),
    });
    return;
  }

  const starAngle = normalizedIndex * Math.PI * 2 + groupIndex * 0.25 + globalRatio * Math.PI * 1.5;
  const spread = 34 + (globalIndex % 5) * 10 + Math.abs(radialX) * 24 + Math.abs(radialY) * 24;
  const effect = ["fade", "zoom", "mist-up", "fade-left", "fade-right", "pop", "drift-left", "drift-right"][
    globalIndex % 8
  ];
  applyEffectPresetValues(zone, effect, {
    delay: Math.round(globalIndex * 80 + Math.abs(orbit) * 55 + index * 20),
    duration: 840 + (globalIndex % 5) * 95,
    offsetX: Math.round(Math.cos(starAngle) * spread),
    offsetY: Math.round(Math.sin(starAngle) * spread * 0.68),
    scaleFrom: clamp(0.84 + Math.abs(wave) * 0.16 + Math.abs(radialX) * 0.04, 0.8, 1.14),
    rotateFrom: Math.round(Math.sin(starAngle) * 14 + orbit * 4),
  });
}

function loadStepEditorFromZones(forceSyncFields) {
  const zones = getZonesForStep(state.stepEditor.step);
  if (!zones.length) {
    updateStepEditorUI();
    updateAnimationControlsState();
    return;
  }

  if (forceSyncFields) {
    state.stepEditor.effect = zones[0].animation.effect;
    state.stepEditor.duration = zones[0].animation.duration;
    state.stepEditor.stagger = inferStepStagger(zones);
  }

  updateStepEditorUI();
  updateAnimationControlsState();
}

function updateStepEditorUI() {
  stepEditorInput.value = state.stepEditor.step;
  stepEffectSelect.value = state.stepEditor.effect;
  stepDurationRange.value = state.stepEditor.duration;
  stepStaggerRange.value = state.stepEditor.stagger;
  syncAnimationLabels();

  const zones = getZonesForStep(state.stepEditor.step);
  if (!zones.length) {
    stepEditorSummary.textContent = `Aucune zone active sur l'etape ${state.stepEditor.step}.`;
    return;
  }

  stepEditorSummary.textContent = `${zones.length} zone(s) sur l'etape ${state.stepEditor.step} • ${labelForEffect(
    state.stepEditor.effect
  )} • ${state.stepEditor.duration} ms • decalage ${state.stepEditor.stagger} ms.`;
}

function applyStepSettings() {
  const zones = getZonesForStep(state.stepEditor.step);
  if (!zones.length) {
    return;
  }
  checkpointUndo("reglage d'etape");

  zones.forEach((zone, index) => {
    zone.animation.effect = state.stepEditor.effect;
    zone.animation.duration = state.stepEditor.duration;
    zone.animation.delay = state.stepEditor.stagger * index;

    const defaults = getEffectDefaults(state.stepEditor.effect);
    if (defaults.offsetX !== null) zone.animation.offsetX = defaults.offsetX;
    if (defaults.offsetY !== null) zone.animation.offsetY = defaults.offsetY;
    if (defaults.scaleFrom !== null) zone.animation.scaleFrom = defaults.scaleFrom;
    if (defaults.rotateFrom !== null) zone.animation.rotateFrom = defaults.rotateFrom;
  });

  drawAnnotatedPreview();
  renderZones(state.zones);
  renderAnimationStage();
  updateInspector();
  updateStepEditorUI();
  renderGroupsPanel();
  updateAnimationControlsState();
  setAnimationStatus(`Etape ${state.stepEditor.step} mise a jour avec ${labelForEffect(state.stepEditor.effect)}.`);
}

function subdivideSelectedZone(mode) {
  const zone = getSelectedZone();
  if (!zone || !state.sourceImage) {
    return;
  }
  checkpointUndo("redecoupage de zone");

  const subBoxes = analyzeZoneSubdivision(zone, mode);
  if (subBoxes.length < 2) {
    splitZoneSummary.textContent =
      mode === "auto"
        ? "La sous-analyse n'a pas trouve de decoupe pertinente sur cette zone."
        : `La redecoupe ${mode === "vertical" ? "verticale" : "horizontale"} n'a pas trouve plusieurs sous-zones.`;
    return;
  }

  const zoneIndex = state.zones.findIndex((item) => item.id === zone.id);
  if (zoneIndex < 0) {
    return;
  }

  const enrichedBoxes = subBoxes.map((box) => enrichLocalZoneGeometry(box, zone));
  const replacementZones = enrichedBoxes.map((box, index) => createZoneAsset(box, zoneIndex + index, zone.animation));
  const parentSnapshot = createSubdivisionParentSnapshot(zone, replacementZones.map((item) => item.id));
  replacementZones.forEach((item) => {
    item.subdivisionParent = { ...parentSnapshot };
  });

  const timingGroupId = getZoneTimingGroupId(zone.animation);
  if (timingGroupId) {
    const group = state.groups.find((item) => item.id === timingGroupId && item.kind === "timing");
    if (group) {
      const memberIndex = group.zoneIds.indexOf(zone.id);
      if (memberIndex >= 0) {
        group.zoneIds.splice(memberIndex, 1, ...replacementZones.map((item) => item.id));
      }
    }
  }
  const recapGroupId = getZoneRecapGroupId(zone.animation);
  if (recapGroupId) {
    const group = state.groups.find((item) => item.id === recapGroupId && item.kind === "recap");
    if (group) {
      const memberIndex = group.zoneIds.indexOf(zone.id);
      if (memberIndex >= 0) {
        group.zoneIds.splice(memberIndex, 1, ...replacementZones.map((item) => item.id));
      }
    }
  }
  state.zones.splice(zoneIndex, 1, ...replacementZones);
  state.selectedZoneId = replacementZones[0].id;
  state.selectedZoneIds = replacementZones.map((item) => item.id);

  drawAnnotatedPreview();
  renderZones(state.zones);
  renderAnimationStage();
  updateInspector();
  loadStepEditorFromZones(true);
  updateAnimationControlsState();

  splitZoneSummary.textContent = `${replacementZones.length} sous-zone(s) ont remplace la zone selectionnee.`;
  setAnimationStatus(`Zone redecoupee en ${replacementZones.length} sous-zone(s).`);
}

function resetSubdivisionForSelection() {
  const zone = getSelectedZone();
  const parent = zone?.subdivisionParent;
  if (!zone || !parent) {
    splitZoneSummary.textContent = "Aucun second decoupage a reinitialiser sur la selection courante.";
    return;
  }
  checkpointUndo("reset du redecoupage");

  const childIds = [...parent.childIds];
  const firstChildIndex = state.zones.findIndex((item) => childIds.includes(item.id));
  if (firstChildIndex < 0) {
    splitZoneSummary.textContent = "Impossible de retrouver les sous-zones a reinitialiser.";
    return;
  }

  const restoredZone = createZoneAsset(
    {
      x: parent.x,
      y: parent.y,
      width: parent.width,
      height: parent.height,
      area: parent.area,
    },
    firstChildIndex,
    parent.animation
  );

  restoredZone.id = parent.id;
  restoredZone.fileName = parent.fileName;
  restoredZone.locked = Boolean(parent.locked);
  restoredZone.subdivisionParent = parent.subdivisionParent ? { ...parent.subdivisionParent } : null;

  const parentTimingGroupId = getZoneTimingGroupId(parent.animation);
  if (parentTimingGroupId) {
    const group = state.groups.find((item) => item.id === parentTimingGroupId && item.kind === "timing");
    if (group) {
      const memberIndexes = group.zoneIds
        .map((id, index) => (childIds.includes(id) ? index : -1))
        .filter((index) => index >= 0);
      if (memberIndexes.length) {
        const start = memberIndexes[0];
        group.zoneIds = group.zoneIds.filter((id) => !childIds.includes(id));
        group.zoneIds.splice(start, 0, restoredZone.id);
      }
    }
  }
  const parentRecapGroupId = getZoneRecapGroupId(parent.animation);
  if (parentRecapGroupId) {
    const group = state.groups.find((item) => item.id === parentRecapGroupId && item.kind === "recap");
    if (group) {
      const memberIndexes = group.zoneIds
        .map((id, index) => (childIds.includes(id) ? index : -1))
        .filter((index) => index >= 0);
      if (memberIndexes.length) {
        const start = memberIndexes[0];
        group.zoneIds = group.zoneIds.filter((id) => !childIds.includes(id));
        group.zoneIds.splice(start, 0, restoredZone.id);
      }
    }
  }

  state.zones = state.zones.filter((item) => !childIds.includes(item.id));
  state.zones.splice(firstChildIndex, 0, restoredZone);
  state.selectedZoneId = restoredZone.id;
  state.selectedZoneIds = [restoredZone.id];

  drawAnnotatedPreview();
  renderZones(state.zones);
  renderAnimationStage();
  updateInspector();
  renderGroupsPanel();
  updateAnimationControlsState();

  splitZoneSummary.textContent = "Le second decoupage a ete reinitialise pour cette zone.";
  setAnimationStatus("Retour au bloc parent effectue.");
}

function createSubdivisionParentSnapshot(zone, childIds) {
  return {
    id: zone.id,
    x: zone.x,
    y: zone.y,
    width: zone.width,
    height: zone.height,
    area: zone.area ?? zone.width * zone.height,
    fileName: zone.fileName,
    locked: Boolean(zone.locked),
    animation: { ...zone.animation },
    childIds,
    subdivisionParent: zone.subdivisionParent ? { ...zone.subdivisionParent } : null,
  };
}

function analyzeZoneSubdivision(zone, mode) {
  const canvas = document.createElement("canvas");
  canvas.width = zone.width;
  canvas.height = zone.height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(
    state.sourceImage,
    zone.x,
    zone.y,
    zone.width,
    zone.height,
    0,
    0,
    zone.width,
    zone.height
  );

  const { data, width, height } = context.getImageData(0, 0, zone.width, zone.height);
  const background = estimateBackgroundColor(data, width, height);
  const threshold = Math.max(10, Number(thresholdRange.value) - 4);
  const mask = bridgeMask(
    buildForegroundMask(data, width, height, background, threshold),
    width,
    height,
    12,
    10
  );

  let localBoxes = [];
  if (mode === "vertical") {
    localBoxes = splitRegionByProjection(mask, width, height, "vertical", { data, background });
  } else if (mode === "horizontal") {
    localBoxes = splitRegionByProjection(mask, width, height, "horizontal");
  } else if (mode === "columns-2") {
    localBoxes = splitRegionIntoFixedColumns(mask, width, height, data, background, 2);
  } else if (mode === "columns-3") {
    localBoxes = splitRegionIntoFixedColumns(mask, width, height, data, background, 3);
  } else if (mode === "columns-4") {
    localBoxes = splitRegionIntoFixedColumns(mask, width, height, data, background, 4);
  } else {
    const verticalBoxes = splitRegionByProjection(mask, width, height, "vertical", { data, background });
    const horizontalBoxes = splitRegionByProjection(mask, width, height, "horizontal");
    localBoxes = chooseBestSubdivision(verticalBoxes, horizontalBoxes, width, height);
  }

  if (localBoxes.length < 2) {
    const minArea = Math.max(300, Math.floor(zone.width * zone.height * 0.04));
    const components = detectComponentZones(mask, width, height, {
      minArea,
      padding: Math.min(12, Math.floor(Math.min(width, height) * 0.04)),
      mergeDistance: 8,
    });
    localBoxes = suppressContainedBoxes(components);
  }

  return localBoxes
    .filter((box) => box.width >= 24 && box.height >= 24)
    .map((box) => ({
      x: zone.x + box.x,
      y: zone.y + box.y,
      width: box.width,
      height: box.height,
      area: box.area ?? box.width * box.height,
    }));
}

function splitRegionByProjection(mask, width, height, axis, options = {}) {
  if (axis === "vertical") {
    const separatorBoxes = detectVerticalSeparatorBoxes(
      options.data,
      width,
      height,
      options.background
    );
    if (separatorBoxes.length >= 1) {
      return separatorBoxes;
    }

    const projection = projectMaskColumns(mask, width, 0, height - 1);
    const minPixels = Math.max(4, Math.floor(height * 0.04));
    const minRun = Math.max(18, Math.floor(width * 0.08));
    const bands = expandBandsToMidpoints(findBands(projection, minPixels, minRun, 18), width);
    return bands
      .map((band) => ({
        x: band.start,
        y: 0,
        width: band.end - band.start + 1,
        height,
        area: countMaskPixelsInBox(mask, width, band.start, 0, band.end - band.start + 1, height),
      }))
      .filter((box) => box.area >= Math.max(180, Math.floor(width * height * 0.03)));
  }

  const projection = projectMaskRows(mask, width, height);
  const minPixels = Math.max(4, Math.floor(width * 0.04));
  const minRun = Math.max(18, Math.floor(height * 0.08));
  const bands = expandBandsToMidpoints(findBands(projection, minPixels, minRun, 14), height);
  return bands
    .map((band) => ({
      x: 0,
      y: band.start,
      width,
      height: band.end - band.start + 1,
      area: countMaskPixelsInBox(mask, width, 0, band.start, width, band.end - band.start + 1),
    }))
    .filter((box) => box.area >= Math.max(180, Math.floor(width * height * 0.03)));
}

function detectVerticalSeparatorBoxes(data, width, height, background) {
  const thinSeparators = detectVerticalSeparators(data, width, height, background);
  if (!thinSeparators.length) {
    return [];
  }

  const boxes = [];
  let regionStart = 0;

  thinSeparators.forEach((band) => {
    const regionWidth = band.start - regionStart;
    if (regionWidth >= Math.max(24, Math.floor(width * 0.12))) {
      boxes.push({
        x: regionStart,
        y: 0,
        width: regionWidth,
        height,
        area: regionWidth * height,
      });
    }
    regionStart = band.end + 1;
  });

  const trailingWidth = width - regionStart;
  if (trailingWidth >= Math.max(24, Math.floor(width * 0.12))) {
    boxes.push({
      x: regionStart,
      y: 0,
      width: trailingWidth,
      height,
      area: trailingWidth * height,
    });
  }

  return boxes.length >= 2 ? boxes : [];
}

function detectVerticalSeparators(data, width, height, background) {
  if (!data || !background || width < 80) {
    return [];
  }

  const strength = new Array(width).fill(0);
  const nearBackgroundMin = 4;
  const nearBackgroundMax = 54;
  const contrastThreshold = 4;
  const hardEdgeThreshold = 12;

  for (let x = 1; x < width - 1; x += 1) {
    let score = 0;
    for (let y = 0; y < height; y += 1) {
      const center = readPixel(data, width, x, y);
      const left = readPixel(data, width, x - 1, y);
      const right = readPixel(data, width, x + 1, y);

      const bgDistance = colorDistance(center, background);
      const centerLum = luminance(center);
      const neighborLum = (luminance(left) + luminance(right)) / 2;
      const localContrast = Math.abs(centerLum - neighborLum);
      const edgeStrength = colorDistance(center, left) + colorDistance(center, right);

      const isSoftSeparator =
        bgDistance >= nearBackgroundMin &&
        bgDistance <= nearBackgroundMax &&
        localContrast >= contrastThreshold;
      const isHardSeparator = edgeStrength >= hardEdgeThreshold;

      if (isSoftSeparator || isHardSeparator) {
        score += 1;
      }
    }
    strength[x] = score;
  }

  const smoothed = smoothNumericSeries(strength, 2);
  const minColumnCoverage = Math.max(10, Math.floor(height * 0.16));
  const separators = [];
  let start = -1;
  let gap = 0;
  const maxGap = 2;

  for (let x = 0; x < width; x += 1) {
    const isCandidate = smoothed[x] >= minColumnCoverage;
    if (isCandidate && start < 0) {
      start = x;
      gap = 0;
      continue;
    }

    if (start >= 0) {
      if (isCandidate) {
        gap = 0;
        continue;
      }

      gap += 1;
      if (gap <= maxGap) {
        continue;
      }

      separators.push({ start, end: x - gap });
      start = -1;
      gap = 0;
    }
  }

  if (start >= 0) {
    separators.push({ start, end: width - 1 });
  }

  return separators.filter((band) => {
    const bandWidth = band.end - band.start + 1;
    return (
      bandWidth <= Math.max(10, Math.floor(width * 0.06)) &&
      band.start > Math.floor(width * 0.08) &&
      band.end < Math.ceil(width * 0.92)
    );
  });
}

function splitRegionIntoFixedColumns(mask, width, height, data, background, columnCount) {
  const separators = detectVerticalSeparators(data, width, height, background);
  const targetCount = columnCount - 1;
  let centers = separators.map((band) => Math.round((band.start + band.end) / 2));

  if (centers.length > targetCount) {
    centers = chooseEvenlyDistributedSeparators(centers, targetCount, width);
  }

  while (centers.length < targetCount) {
    centers.push(Math.round((width * (centers.length + 1)) / columnCount));
  }

  centers = [...new Set(centers)].sort((a, b) => a - b);
  const boundaries = [0, ...centers, width];
  const boxes = [];

  for (let index = 0; index < boundaries.length - 1; index += 1) {
    const start = boundaries[index];
    const end = boundaries[index + 1];
    const regionWidth = end - start;
    if (regionWidth < Math.max(20, Math.floor(width * 0.1))) {
      continue;
    }
    boxes.push({
      x: start,
      y: 0,
      width: regionWidth,
      height,
      area: countMaskPixelsInBox(mask, width, start, 0, regionWidth, height),
    });
  }

  return boxes;
}

function enrichZoneGeometry(box, mask, imageWidth) {
  const shape = inferZoneShape(box, mask, imageWidth);
  return {
    ...box,
    shape: shape.kind,
    shapeConfidence: shape.confidence,
  };
}

function enrichLocalZoneGeometry(box, parentZone) {
  const canvas = document.createElement("canvas");
  canvas.width = box.width;
  canvas.height = box.height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(
    state.sourceImage,
    box.x,
    box.y,
    box.width,
    box.height,
    0,
    0,
    box.width,
    box.height
  );
  const { data, width, height } = context.getImageData(0, 0, canvas.width, canvas.height);
  const background = estimateBackgroundColor(data, width, height);
  const threshold = Math.max(10, Number(thresholdRange.value) || 28);
  const mask = buildForegroundMask(data, width, height, background, threshold);
  return enrichZoneGeometry(box, mask, width);
}

function inferZoneShape(box, mask, imageWidth) {
  const aspect = Math.min(box.width, box.height) / Math.max(box.width, box.height, 1);
  if (aspect < 0.76 || box.width < 24 || box.height < 24) {
    return { kind: "rect", confidence: 0 };
  }

  const fillRatio = countMaskPixelsInBox(mask, imageWidth, box.x, box.y, box.width, box.height) / Math.max(1, box.width * box.height);
  if (fillRatio < 0.42 || fillRatio > 0.9) {
    return { kind: "rect", confidence: 0 };
  }

  const cornerDensity = sampleMaskDensity(mask, imageWidth, box, "corners");
  const centerDensity = sampleMaskDensity(mask, imageWidth, box, "center");
  const roundScore =
    (aspect - 0.76) / 0.24 +
    clamp((0.9 - Math.abs(fillRatio - 0.72)) / 0.9, 0, 1) +
    clamp(centerDensity, 0, 1) +
    clamp(1 - cornerDensity, 0, 1);

  if (centerDensity > 0.55 && cornerDensity < 0.38 && roundScore > 2.15) {
    return { kind: "round", confidence: roundScore / 4 };
  }

  return { kind: "rect", confidence: 0 };
}

function sampleMaskDensity(mask, imageWidth, box, mode) {
  const insetX = Math.max(2, Math.floor(box.width * 0.18));
  const insetY = Math.max(2, Math.floor(box.height * 0.18));

  if (mode === "center") {
    const sampleWidth = Math.max(4, box.width - insetX * 2);
    const sampleHeight = Math.max(4, box.height - insetY * 2);
    return countMaskPixelsInBox(mask, imageWidth, box.x + insetX, box.y + insetY, sampleWidth, sampleHeight) / Math.max(1, sampleWidth * sampleHeight);
  }

  const cornerWidth = Math.max(4, Math.floor(box.width * 0.22));
  const cornerHeight = Math.max(4, Math.floor(box.height * 0.22));
  const corners = [
    [box.x, box.y],
    [box.x + box.width - cornerWidth, box.y],
    [box.x, box.y + box.height - cornerHeight],
    [box.x + box.width - cornerWidth, box.y + box.height - cornerHeight],
  ];
  const total = corners.reduce((sum, [x, y]) => {
    return sum + countMaskPixelsInBox(mask, imageWidth, x, y, cornerWidth, cornerHeight) / Math.max(1, cornerWidth * cornerHeight);
  }, 0);
  return total / corners.length;
}

function applyRoundZoneTransparency(cropContext, cropWidth, cropHeight, box, sourceContext) {
  const imageData = cropContext.getImageData(0, 0, cropWidth, cropHeight);
  let localMask = null;

  if (sourceContext?.mask && Number.isFinite(sourceContext?.imageWidth)) {
    localMask = extractLocalMask(sourceContext.mask, sourceContext.imageWidth, box);
  }

  if (!localMask) {
    const background = sourceContext?.background ?? estimateBackgroundColor(imageData.data, cropWidth, cropHeight);
    const threshold = sourceContext?.threshold ?? Math.max(10, Number(thresholdRange.value) || 28);
    localMask = buildForegroundMask(imageData.data, cropWidth, cropHeight, background, threshold);
  }

  const centerX = (cropWidth - 1) / 2;
  const centerY = (cropHeight - 1) / 2;
  const radiusX = Math.max(1, cropWidth / 2 - 1);
  const radiusY = Math.max(1, cropHeight / 2 - 1);

  for (let y = 0; y < cropHeight; y += 1) {
    for (let x = 0; x < cropWidth; x += 1) {
      const index = y * cropWidth + x;
      if (!localMask[index]) {
        const dx = (x - centerX) / radiusX;
        const dy = (y - centerY) / radiusY;
        if (dx * dx + dy * dy >= 0.92) {
          imageData.data[index * 4 + 3] = 0;
        }
      }
    }
  }

  cropContext.putImageData(imageData, 0, 0);
}

function extractLocalMask(globalMask, imageWidth, box) {
  const localMask = new Uint8Array(box.width * box.height);
  for (let y = 0; y < box.height; y += 1) {
    for (let x = 0; x < box.width; x += 1) {
      localMask[y * box.width + x] = globalMask[(box.y + y) * imageWidth + (box.x + x)];
    }
  }
  return localMask;
}

function chooseEvenlyDistributedSeparators(centers, wantedCount, width) {
  if (centers.length <= wantedCount) {
    return centers;
  }

  const result = [];
  for (let step = 1; step <= wantedCount; step += 1) {
    const target = (width * step) / (wantedCount + 1);
    let best = centers[0];
    let bestDistance = Math.abs(centers[0] - target);
    centers.forEach((center) => {
      const distance = Math.abs(center - target);
      if (distance < bestDistance) {
        best = center;
        bestDistance = distance;
      }
    });
    result.push(best);
  }
  return result;
}

function chooseBestSubdivision(verticalBoxes, horizontalBoxes, width, height) {
  const verticalScore = scoreSubdivision(verticalBoxes, width, height, "vertical");
  const horizontalScore = scoreSubdivision(horizontalBoxes, width, height, "horizontal");
  return verticalScore >= horizontalScore ? verticalBoxes : horizontalBoxes;
}

function scoreSubdivision(boxes, width, height, axis) {
  if (boxes.length < 2) {
    return 0;
  }

  const totalArea = boxes.reduce((sum, box) => sum + box.area, 0);
  const coverage = totalArea / (width * height);
  const sizes = boxes.map((box) => (axis === "vertical" ? box.width : box.height));
  const average = sizes.reduce((sum, value) => sum + value, 0) / sizes.length;
  const variance =
    sizes.reduce((sum, value) => sum + Math.abs(value - average), 0) / Math.max(1, sizes.length);
  const uniformity = 1 / (1 + variance / Math.max(average, 1));
  return boxes.length * coverage * uniformity;
}

function startPreviewPlayback() {
  if (!countEnabledZones()) {
    return;
  }

  resetPreviewPlayback(false);
  const runtime = createRuntimeController(animationStage, getExportPayload(), {
    preview: true,
    onStatus: setAnimationStatus,
  });
  state.previewRuntime = runtime;
  runtime.arm();
}

function resetPreviewPlayback(resetMessage) {
  if (state.previewRuntime) {
    state.previewRuntime.dispose();
    state.previewRuntime = null;
  }

  animationStage.querySelectorAll(".animation-zone").forEach((element) => {
    const zone = state.zones.find((item) => item.id === element.dataset.zoneId);
    if (!zone) {
      return;
    }
    applyZoneEditorAppearance(element, zone);
  });

  if (resetMessage && countEnabledZones()) {
    setAnimationStatus("Apercu reinitialise. Relance-le pour tester le comportement exporte.");
  }
}

function applyZoneEditorAppearance(element, zone) {
  element.style.opacity = "1";
  element.style.transform = "translate(0px, 0px) scale(1) rotate(0deg)";
  element.style.filter = "blur(0px)";
  element.style.boxShadow = "";
  element.style.zIndex = "";
  element.style.transitionDuration = `${zone.animation.duration}ms`;
  element.style.transitionDelay = "0ms";
  element.style.transitionTimingFunction = "cubic-bezier(0.22, 1, 0.36, 1)";
  element.style.transitionProperty = "opacity, transform, filter, box-shadow";
  element.classList.toggle("inactive", !zone.animation.enabled);
  element.classList.remove("preview-hidden");
  element.classList.remove("focus-settled", "focus-active");
}

function applyZonePreviewAppearance(element, zone, revealed) {
  const styles = getZoneVisualState(zone.animation, revealed);
  element.style.opacity = String(styles.opacity);
  element.style.transform = styles.transform;
  element.style.filter = styles.filter;
  element.style.boxShadow = "";
  element.style.zIndex = "";
  element.style.transitionDuration = `${zone.animation.duration}ms`;
  element.style.transitionDelay = `${revealed ? zone.animation.delay : 0}ms`;
  element.style.transitionTimingFunction = "cubic-bezier(0.22, 1, 0.36, 1)";
  element.style.transitionProperty = "opacity, transform, filter, box-shadow";
  element.classList.toggle("inactive", !zone.animation.enabled);
  element.classList.toggle("preview-hidden", !revealed);
  element.classList.remove("focus-settled", "focus-active");
}

function getZoneVisualState(animation, revealed) {
  return AnimationCore.getZoneVisualState(animation, revealed);
}

function hiddenOffsetX(effect, offsetX) {
  return AnimationCore.hiddenOffsetX(effect, offsetX);
}

function hiddenOffsetY(effect, offsetY) {
  return AnimationCore.hiddenOffsetY(effect, offsetY);
}

function hiddenScale(effect, scaleFrom) {
  return AnimationCore.hiddenScale(effect, scaleFrom);
}

function hiddenRotation(effect, rotateFrom) {
  return AnimationCore.hiddenRotation(effect, rotateFrom);
}

function hiddenBlur(effect) {
  return AnimationCore.hiddenBlur(effect);
}

function buildTransform(x, y, scale, rotate) {
  return AnimationCore.buildTransform(x, y, scale, rotate);
}

function getExportPayload() {
  const format = FORMATS[state.animationSettings.format];
  const fit = state.sourceImage
    ? getContainRect(state.sourceImage.width, state.sourceImage.height, format.width, format.height)
    : { x: 0, y: 0, width: format.width, height: format.height };
  const zones = getEnabledZonesSorted().map((zone) => ({
    id: zone.id,
    fileName: zone.fileName,
    dataUrl: zone.dataUrl,
    box: {
      x: zone.x,
      y: zone.y,
      width: zone.width,
      height: zone.height,
    },
    placement: getZonePlacement(zone, fit, format),
    animation: resolveZoneAnimationForExport(zone),
  }));

  return {
    name: state.imageName,
    formatKey: state.animationSettings.format,
    format,
    fit,
    source: state.sourceImage
      ? {
          width: state.sourceImage.width,
          height: state.sourceImage.height,
        }
      : null,
    settings: { ...state.animationSettings },
    zones,
    groups: state.groups.map(serializeGroupForProject),
    recapGroups: buildExportRecapGroups(zones),
  };
}

async function saveProjectAsJson() {
  const payload = await buildProjectPayload();
  const fileName = `${state.imageName || "infographie"}-projet-animation.json`;
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  triggerDownload(fileName, url, true);
  setStatus("Projet JSON sauvegarde.", `${payload.zones.length} zone(s) et ${payload.groups.length} groupe(s) memorises.`);
}

async function buildProjectPayload() {
  return {
    version: 1,
    kind: "decoupezoneimage-project",
    savedAt: new Date().toISOString(),
    imageName: state.imageName,
    sourceImageDataUrl: getSourceImageDataUrl(),
    detection: {
      presetKey: presetSelect.value,
      profileMode: state.detectionProfile?.mode ?? "components",
      bridgeX: state.detectionProfile?.bridgeX ?? null,
      bridgeY: state.detectionProfile?.bridgeY ?? null,
      rowFillGap: state.detectionProfile?.rowFillGap ?? null,
      columnFillGap: state.detectionProfile?.columnFillGap ?? null,
      threshold: Number(thresholdRange.value),
      minArea: Number(minAreaRange.value),
      padding: Number(paddingRange.value),
      mergeDistance: Number(mergeDistanceRange.value),
    },
    animationSettings: { ...state.animationSettings },
    stepEditor: { ...state.stepEditor },
    selectedZoneId: state.selectedZoneId,
    selectedZoneIds: [...state.selectedZoneIds],
    selectedGroupId: state.selectedGroupId,
    selectedFocusGroupId: state.selectedFocusGroupId,
    selectedRecapGroupId: state.selectedRecapGroupId,
    zones: state.zones.map(serializeZoneForProject),
    groups: state.groups.map(serializeGroupForProject),
  };
}

function serializeGroupForProject(group) {
  const kind = group.kind ?? "timing";
  const serialized = {
    id: group.id,
    kind,
    name: group.name,
    zoneIds: [...group.zoneIds],
  };
  if (kind === "timing") {
    serialized.step = group.step;
    serialized.stagger = group.stagger;
  }
  if (kind === "focus") {
    serialized.presentation = sanitizeGroupPresentation(group.presentation);
  }
  return serialized;
}

function buildExportRecapGroups(zones) {
  const zoneById = new Map(zones.map((zone) => [zone.id, zone]));
  return getGroupsByKind("recap")
    .map((group, index) => {
      const zoneIds = group.zoneIds.filter((zoneId) => zoneById.has(zoneId));
      if (zoneIds.length < 2) {
        return null;
      }
      const afterStep = zoneIds.reduce((maxStep, zoneId) => {
        const zone = zoneById.get(zoneId);
        return Math.max(maxStep, Math.max(1, Number(zone.animation.step) || 1));
      }, 1);
      const duration = zoneIds.reduce((maxDuration, zoneId) => {
        const zone = zoneById.get(zoneId);
        return Math.max(maxDuration, Math.max(700, Number(zone.animation.duration) || 700));
      }, 900);
      return {
        id: group.id,
        name: group.name || `Recap ${index + 1}`,
        zoneIds,
        afterStep,
        duration: Math.max(900, duration),
        order: index,
      };
    })
    .filter(Boolean);
}

function serializeZoneForProject(zone) {
  return {
    x: zone.x,
    y: zone.y,
    width: zone.width,
    height: zone.height,
    area: zone.area ?? zone.width * zone.height,
    id: zone.id,
    fileName: zone.fileName,
    dataUrl: zone.dataUrl,
    sourceWidth: zone.sourceWidth ?? zone.width,
    sourceHeight: zone.sourceHeight ?? zone.height,
    shape: zone.shape ?? "rect",
    shapeConfidence: zone.shapeConfidence ?? 0,
    locked: Boolean(zone.locked),
    subdivisionParent: zone.subdivisionParent ? structuredCloneProjectData(zone.subdivisionParent) : null,
    subdivisionChildren: zone.subdivisionChildren ? structuredCloneProjectData(zone.subdivisionChildren) : null,
    animation: structuredCloneProjectData(zone.animation),
  };
}

async function loadProjectFromPayload(project) {
  if (!project || project.kind !== "decoupezoneimage-project" || !project.sourceImageDataUrl) {
    throw new Error("Invalid project file");
  }

  const image = await loadImageFromDataUrl(project.sourceImageDataUrl);
  restoreProjectState(project, image);
}

function restoreProjectState(project, image) {
  resetPreviewPlayback(false);

  state.sourceImage = image;
  state.imageName = project.imageName || "infographie";

  applyDetectionSettings(project.detection);

  state.animationSettings = {
    ...state.animationSettings,
    ...sanitizeAnimationSettings(project.animationSettings),
  };
  state.stepEditor = {
    ...state.stepEditor,
    ...sanitizeStepEditor(project.stepEditor),
  };

  state.zones = Array.isArray(project.zones) ? project.zones.map((zone, index) => normalizeProjectZone(zone, index)) : [];
  normalizeZoneOrder();

  const validZoneIds = new Set(state.zones.map((zone) => zone.id));
  state.groups = Array.isArray(project.groups)
    ? project.groups.flatMap((group, index) => normalizeProjectGroups(group, index, validZoneIds))
    : [];

  state.selectedGroupId =
    state.groups.find((group) => group.id === project.selectedGroupId && group.kind === "timing")?.id ??
    getGroupsByKind("timing")[0]?.id ??
    null;
  state.selectedFocusGroupId =
    state.groups.find((group) => group.id === project.selectedFocusGroupId)?.id ??
    (typeof project.selectedGroupId === "string"
      ? state.groups.find((group) => group.id === `${project.selectedGroupId}-focus`)?.id
      : null) ??
    getGroupsByKind("focus")[0]?.id ??
    null;
  state.selectedRecapGroupId =
    state.groups.find((group) => group.id === project.selectedRecapGroupId)?.id ??
    getGroupsByKind("recap")[0]?.id ??
    null;
  state.selectedZoneId = validZoneIds.has(project.selectedZoneId) ? project.selectedZoneId : state.zones[0]?.id ?? null;
  state.selectedZoneIds = Array.isArray(project.selectedZoneIds)
    ? project.selectedZoneIds.filter((id) => validZoneIds.has(id))
    : [];
  if (state.selectedZoneId && !state.selectedZoneIds.includes(state.selectedZoneId)) {
    state.selectedZoneIds.unshift(state.selectedZoneId);
  }
  if (!state.selectedZoneIds.length && state.selectedZoneId) {
    state.selectedZoneIds = [state.selectedZoneId];
  }
  if (!state.selectedZoneId && state.selectedZoneIds.length) {
    state.selectedZoneId = state.selectedZoneIds[0];
  }

  detectButton.disabled = false;
  downloadAllButton.disabled = state.zones.length === 0;

  syncDetectionLabels();
  syncAnimationFormControls();
  syncAnimationLabels();
  updateFormatLabel();
  drawAnnotatedPreview();
  renderZones(state.zones);
  renderAnimationStage();
  updateInspector();
  loadStepEditorFromZones(false);
  renderGroupsPanel();
  renderZonesOrderPanel();
  updateAnimationControlsState();

  setStatus(
    "Projet JSON charge.",
    `${image.width} x ${image.height} px • ${state.zones.length} zone(s) restauree(s) • ${state.groups.length} groupe(s)`
  );
  setAnimationStatus("Projet recharge. Tu peux reprendre le decoupage, l'edition et l'export.");
}

function applyDetectionSettings(settings = {}) {
  const presetKey = typeof settings.presetKey === "string" ? settings.presetKey : "custom";
  if (presetKey !== "custom" && presets[presetKey]) {
    applyPreset(presetKey);
  } else {
    state.detectionProfile = {
      label: "Personnalise",
      mode: settings.profileMode === "layout" ? "layout" : "components",
      threshold: Number(settings.threshold) || Number(thresholdRange.value),
      minArea: Number(settings.minArea) || Number(minAreaRange.value),
      padding: Number(settings.padding) || Number(paddingRange.value),
      mergeDistance: Number(settings.mergeDistance) || Number(mergeDistanceRange.value),
      bridgeX: Number(settings.bridgeX) || 12,
      bridgeY: Number(settings.bridgeY) || 10,
      rowFillGap: Number(settings.rowFillGap) || 10,
      columnFillGap: Number(settings.columnFillGap) || 16,
    };
    presetSelect.value = "custom";
    presetHint.textContent = "Personnalise";
  }

  thresholdRange.value = String(clamp(Number(settings.threshold) || Number(thresholdRange.value), 5, 120));
  minAreaRange.value = String(clamp(Number(settings.minArea) || Number(minAreaRange.value), 200, 12000));
  paddingRange.value = String(clamp(Number(settings.padding) || Number(paddingRange.value), 0, 60));
  mergeDistanceRange.value = String(clamp(Number(settings.mergeDistance) || Number(mergeDistanceRange.value), 0, 80));
  syncDetectionLabels();
}

function syncAnimationFormControls() {
  formatSelect.value = state.animationSettings.format;
  startTriggerSelect.value = state.animationSettings.startTrigger;
  stepModeSelect.value = state.animationSettings.stepMode;
  autoStepGapRange.value = String(state.animationSettings.autoStepGap);
  guideToggle.checked = state.animationSettings.showGuide;
}

function sanitizeAnimationSettings(settings = {}) {
  return {
    format: FORMATS[settings.format] ? settings.format : state.animationSettings.format,
    startTrigger: ["slide", "click", "key"].includes(settings.startTrigger)
      ? settings.startTrigger
      : state.animationSettings.startTrigger,
    stepMode: ["all", "auto", "click", "key"].includes(settings.stepMode)
      ? settings.stepMode
      : state.animationSettings.stepMode,
    autoStepGap: clamp(Number(settings.autoStepGap) || state.animationSettings.autoStepGap, 0, 2000),
    showGuide: typeof settings.showGuide === "boolean" ? settings.showGuide : state.animationSettings.showGuide,
  };
}

function sanitizeStepEditor(stepEditor = {}) {
  return {
    step: Math.max(1, Number(stepEditor.step) || state.stepEditor.step),
    effect: isKnownEffect(stepEditor.effect) ? stepEditor.effect : state.stepEditor.effect,
    duration: clamp(Number(stepEditor.duration) || state.stepEditor.duration, 100, 4000),
    stagger: clamp(Number(stepEditor.stagger) || state.stepEditor.stagger, 0, 1200),
  };
}

function normalizeProjectZone(zone, index) {
  const defaultEffect = "fade-up";
  const animation = zone?.animation ?? {};
  const effect = isKnownEffect(animation.effect) ? animation.effect : defaultEffect;
  const defaults = getEffectDefaults(effect);
  return {
    x: Math.max(0, Number(zone?.x) || 0),
    y: Math.max(0, Number(zone?.y) || 0),
    width: Math.max(1, Number(zone?.width) || 1),
    height: Math.max(1, Number(zone?.height) || 1),
    area: Math.max(1, Number(zone?.area) || (Number(zone?.width) || 1) * (Number(zone?.height) || 1)),
    id: typeof zone?.id === "string" && zone.id ? zone.id : makeId(index),
    fileName: zone?.fileName || `${state.imageName}-zone-${String(index + 1).padStart(2, "0")}.png`,
    dataUrl: zone?.dataUrl || "",
    sourceWidth: Math.max(1, Number(zone?.sourceWidth) || Number(zone?.width) || 1),
    sourceHeight: Math.max(1, Number(zone?.sourceHeight) || Number(zone?.height) || 1),
    shape: zone?.shape === "round" ? "round" : "rect",
    shapeConfidence: clamp(Number(zone?.shapeConfidence) || 0, 0, 1.5),
    locked: Boolean(zone?.locked),
    subdivisionParent: zone?.subdivisionParent ? structuredCloneProjectData(zone.subdivisionParent) : null,
    subdivisionChildren: zone?.subdivisionChildren ? structuredCloneProjectData(zone.subdivisionChildren) : null,
    animation: {
      enabled: typeof animation.enabled === "boolean" ? animation.enabled : true,
      step: Math.max(1, Number(animation.step) || index + 1),
      order: Math.max(0, Number(animation.order) || index),
      effect,
      duration: clamp(Number(animation.duration) || 700, 100, 4000),
      delay: Math.max(0, Number(animation.delay) || 0),
      timingGroupId: getZoneTimingGroupId(animation),
      focusGroupId: getZoneFocusGroupId(animation),
      recapGroupId: getZoneRecapGroupId(animation),
      groupId: getZoneTimingGroupId(animation),
      revealAtEnd: Boolean(animation.revealAtEnd),
      offsetX: Number(animation.offsetX) || 0,
      offsetY: Number.isFinite(Number(animation.offsetY)) ? Number(animation.offsetY) : defaults.offsetY ?? 0,
      scaleFrom: clamp(Number(animation.scaleFrom) || 0.96, 0.2, 2),
      rotateFrom: Number(animation.rotateFrom) || 0,
    },
  };
}

function normalizeProjectGroups(group, index, validZoneIds) {
  const zoneIds = Array.isArray(group?.zoneIds) ? group.zoneIds.filter((id) => validZoneIds.has(id)) : [];
  if (!zoneIds.length) {
    return [];
  }

  const hasLegacyPresentation =
    typeof group?.kind !== "string" && group?.presentation && Object.keys(group.presentation).length > 0;
  const kind = ["focus", "recap"].includes(group?.kind) ? group.kind : "timing";
  const baseId = typeof group?.id === "string" && group.id ? group.id : makeId(index + 1);
  const normalized = [];

  if (kind === "timing" || hasLegacyPresentation) {
    normalized.push({
      id: baseId,
      kind: "timing",
      name: group?.name || `Apparition ${index + 1}`,
      step: Math.max(1, Number(group?.step) || index + 1),
      stagger: Math.max(0, Number(group?.stagger) || 0),
      zoneIds: [...zoneIds],
    });
  }

  if (kind === "focus" || hasLegacyPresentation) {
    normalized.push({
      id: kind === "focus" ? baseId : `${baseId}-focus`,
      kind: "focus",
      name: group?.name || `Focus ${index + 1}`,
      presentation: sanitizeGroupPresentation(group?.presentation),
      zoneIds: [...zoneIds],
    });
  }

  if (kind === "recap") {
    normalized.push({
      id: baseId,
      kind: "recap",
      name: group?.name || `Recap ${index + 1}`,
      zoneIds: [...zoneIds],
    });
  }

  return normalized;
}

function structuredCloneProjectData(value) {
  return JSON.parse(JSON.stringify(value));
}

function buildStepSchedule(items, recapGroups = []) {
  return AnimationCore.buildStepSchedule(items, recapGroups);
}

function getResolvedEnabledStepCount() {
  const payload = getExportPayload();
  return buildStepSchedule(payload.zones, payload.recapGroups).length;
}

function resolveZoneAnimationForExport(zone) {
  const animation = { ...zone.animation };
  const focusPresentation = resolveZoneFocusPresentation(zone);
  if (focusPresentation) {
    animation.focusPresentation = focusPresentation;
  } else {
    delete animation.focusPresentation;
  }

  const timingGroupId = getZoneTimingGroupId(animation);
  if (!timingGroupId) {
    return animation;
  }

  const group = state.groups.find((item) => item.id === timingGroupId && item.kind === "timing");
  if (!group) {
    return animation;
  }

  const orderedZoneIds = [...group.zoneIds].sort((a, b) => {
    const zoneA = state.zones.find((item) => item.id === a);
    const zoneB = state.zones.find((item) => item.id === b);
    const orderA = zoneA?.animation.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = zoneB?.animation.order ?? Number.MAX_SAFE_INTEGER;
    return orderA - orderB;
  });
  const index = Math.max(0, orderedZoneIds.indexOf(zone.id));
  const synchronizeFocusedGroup = Boolean(focusPresentation?.enabled);
  const memberDelays = group.zoneIds
    .map((zoneId) => state.zones.find((item) => item.id === zoneId))
    .filter((item) => item?.animation.enabled)
    .map((item) => item.animation.delay);
  animation.step = group.step;
  animation.delay = AnimationCore.resolveTimingGroupDelay(
    animation.delay,
    group.stagger,
    index,
    synchronizeFocusedGroup,
    memberDelays
  );
  animation.timingGroupId = group.id;
  animation.groupId = group.id;
  return animation;
}

function resolveZoneFocusPresentation(zone) {
  const focusGroupId = getEffectiveFocusGroupId(zone);
  if (!focusGroupId) {
    return null;
  }
  const group = state.groups.find((item) => item.id === focusGroupId && item.kind === "focus");
  return group ? sanitizeGroupPresentation(group.presentation) : createDefaultGroupPresentation();
}

function exportOverlayHtml() {
  const payload = getExportPayload();
  const html = buildExportHtml(payload);
  const fileName = `${state.imageName}-overlay-${payload.format.label.replace(":", "x")}.html`;
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  triggerDownload(fileName, url, true);
  setAnimationStatus(
    `Slide HTML exportee. Elle est au format ${payload.format.label} avec declenchement ${labelForStartTrigger(
      payload.settings.startTrigger
    )}.`
  );
}

async function exportProjectZip() {
  const payload = getExportPayload();
  if (!payload.zones.length) {
    setAnimationStatus("Aucune zone active a exporter.");
    return;
  }

  const projectPayload = await buildProjectPayload();
  const html = buildExportHtml(payload);
  const animationManifest = {
    version: 1,
    kind: "decoupezoneimage-animation-manifest",
    exportedAt: new Date().toISOString(),
    name: payload.name,
    format: payload.format,
    settings: payload.settings,
    source: payload.source,
    zones: payload.zones.map((zone) => ({
      id: zone.id,
      fileName: zone.fileName,
      box: zone.box,
      placement: zone.placement,
      animation: zone.animation,
    })),
    groups: payload.groups,
    recapGroups: payload.recapGroups,
  };
  const files = [
    {
      name: `${state.imageName}-overlay-${payload.format.label.replace(":", "x")}.html`,
      bytes: encodeText(html),
    },
    {
      name: `${state.imageName}-projet-animation.json`,
      bytes: encodeText(JSON.stringify(projectPayload, null, 2)),
    },
    {
      name: `${state.imageName}-animation-manifest.json`,
      bytes: encodeText(JSON.stringify(animationManifest, null, 2)),
    },
  ];

  payload.zones.forEach((zone) => {
    files.push({
      name: `zones/${zone.fileName}`,
      bytes: bytesFromDataUrl(zone.dataUrl),
    });
  });

  const zipBlob = buildZipBlob(files);
  const url = URL.createObjectURL(zipBlob);
  triggerDownload(`${state.imageName || "infographie"}-export-animation.zip`, url, true);
  setAnimationStatus(`Archive ZIP exportee: ${payload.zones.length} PNG, une slide HTML et les manifestes JSON.`);
}

function buildExportHtml(payload) {
  const data = JSON.stringify(payload).replace(/</g, "\\u003c");
  return `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(payload.name)} overlay</title>
    <style>
      html, body {
        margin: 0;
        width: 100%;
        height: 100%;
        background: transparent;
        overflow: hidden;
      }
      body {
        display: grid;
        place-items: center;
        font-family: system-ui, sans-serif;
      }
      .overlay-root {
        width: 100vw;
        height: 100vh;
        display: grid;
        place-items: center;
        background: transparent;
      }
      .overlay-stage {
        position: relative;
        width: min(100vw, calc(100vh * ${payload.format.width} / ${payload.format.height}));
        aspect-ratio: ${payload.format.width} / ${payload.format.height};
        overflow: hidden;
        background: transparent;
      }
      .overlay-stage:focus {
        outline: none;
      }
      .anim-zone {
        position: absolute;
        display: block;
        transform-origin: center center;
        will-change: transform, opacity;
      }
      .anim-zone.focus-settled {
        opacity: 0.42 !important;
        filter: brightness(0.96) contrast(0.99) saturate(0.94) blur(1px) !important;
      }
    </style>
  </head>
  <body>
    <div class="overlay-root">
      <div id="stage" class="overlay-stage" tabindex="0"></div>
    </div>
    <script>
      const payload = ${data};
      const stage = document.querySelector("#stage");
      const zones = payload.zones.map((zone) => {
        const img = document.createElement("img");
        img.className = "anim-zone";
        img.src = zone.dataUrl;
        img.alt = zone.fileName;
        img.style.left = zone.placement.left;
        img.style.top = zone.placement.top;
        img.style.width = zone.placement.widthPct;
        img.style.height = zone.placement.heightPct;
        img.style.transition = "opacity " + zone.animation.duration + "ms cubic-bezier(0.22, 1, 0.36, 1) " + zone.animation.delay + "ms, transform " + zone.animation.duration + "ms cubic-bezier(0.22, 1, 0.36, 1) " + zone.animation.delay + "ms, filter " + zone.animation.duration + "ms cubic-bezier(0.22, 1, 0.36, 1) " + zone.animation.delay + "ms";
        stage.append(img);
        return { data: zone, element: img };
      });

      function buildTransform(x, y, scale, rotate) {
        return "translate(" + x + "px, " + y + "px) scale(" + scale + ") rotate(" + rotate + "deg)";
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

      function applyHidden(zoneEntry) {
        const animation = zoneEntry.data.animation;
        zoneEntry.element.style.opacity = "0";
        zoneEntry.element.style.transform = buildTransform(
          hiddenOffsetX(animation.effect, animation.offsetX),
          hiddenOffsetY(animation.effect, animation.offsetY),
          hiddenScale(animation.effect, animation.scaleFrom),
          hiddenRotation(animation.effect, animation.rotateFrom)
        );
        zoneEntry.element.style.filter = "blur(" + hiddenBlur(animation.effect) + "px)";
      }

      zones.forEach(applyHidden);
      let started = false;
      const stepSchedule = buildStepSchedule(zones, payload.recapGroups || []);
      const revealBatches = buildRevealBatches(zones);
      const revealBatchIndex = new Map(revealBatches.map((batch) => [batch.key, batch.index]));
      let currentStepIndex = 0;
      let autoTimer = null;
      let focusTimers = [];
      let finalRevealTimer = null;
      let finalRevealComplete = false;

      function buildStepSchedule(items, recapGroups) {
        const steps = new Map();

        items.forEach((item) => {
          const animation = item.data.animation;
          const step = Math.max(1, Number(animation.step) || 1);
          const duration = Math.max(0, Number(animation.duration) || 0);
          const delay = Math.max(0, Number(animation.delay) || 0);
          const endTime = duration + delay;
          steps.set(step, Math.max(steps.get(step) || 0, endTime));
        });

        const stepEvents = Array.from(steps.entries())
          .sort((a, b) => a[0] - b[0])
          .map(([step, duration]) => ({ type: "step", step: step, duration: duration }));
        const recapEvents = recapGroups.map((group) => ({
          type: "recap",
          step: group.afterStep,
          duration: group.duration,
          group: group,
        }));
        return stepEvents.concat(recapEvents).sort((a, b) => {
          if (a.step !== b.step) return a.step - b.step;
          if (a.type !== b.type) return a.type === "step" ? -1 : 1;
          return ((a.group && a.group.order) || 0) - ((b.group && b.group.order) || 0);
        });
      }

      function buildRevealBatches(items) {
        const batches = new Map();
        items.forEach((item) => {
          const animation = item.data.animation;
          const step = Math.max(1, Number(animation.step) || 1);
          const delay = Math.max(0, Number(animation.delay) || 0);
          const key = step + ":" + delay;
          if (!batches.has(key)) {
            batches.set(key, { key: key, step: step, delay: delay });
          }
        });
        return Array.from(batches.values())
          .sort((a, b) => a.step - b.step || a.delay - b.delay)
          .map((batch, index) => ({ ...batch, index: index }));
      }

      function getRevealBatchIndex(step, delay) {
        return revealBatchIndex.get(step + ":" + delay) ?? 0;
      }

      function getEntryRevealBatchIndex(zoneEntry) {
        const animation = zoneEntry.data.animation;
        const step = Math.max(1, Number(animation.step) || 1);
        const delay = Math.max(0, Number(animation.delay) || 0);
        return getRevealBatchIndex(step, delay);
      }

      function getFirstRevealBatchIndexForStep(step) {
        const batch = revealBatches.find((item) => item.step === step);
        return batch ? batch.index : 0;
      }

      function getDelayedRevealBatchesForStep(step) {
        return revealBatches.filter((batch) => batch.step === step && batch.delay > 0);
      }

      function getFocusAppearance(presentation, depth) {
        if (!presentation || !presentation.enabled) {
          return null;
        }
        if (depth <= 0) {
          return {
            opacity: 1,
            scale: presentation.activeScale,
            blur: presentation.activeBlur,
            brightness: 1,
            contrast: 1,
            veil: 0,
          };
        }
        const extraDepth = Math.max(0, depth - 1);
        return {
          opacity: Math.max(0.02, Math.min(1, presentation.settledOpacity - extraDepth * presentation.settledOpacityStep)),
          scale: Math.max(0.55, Math.min(1, presentation.settledScale - extraDepth * presentation.settledScaleStep)),
          blur: Math.max(0, Math.min(12, presentation.settledBlur + extraDepth * presentation.settledBlurStep)),
          brightness: Math.max(0.9, 0.96 - extraDepth * 0.02),
          contrast: Math.max(0.96, 0.99 - extraDepth * 0.01),
          veil: Math.min(0.08, 0.03 + extraDepth * 0.01),
        };
      }

      function getFocusUnitEntries(zoneEntry) {
        const timingGroupId = zoneEntry.data.animation.timingGroupId || zoneEntry.data.animation.groupId;
        if (!timingGroupId) {
          return [zoneEntry];
        }
        const groupedEntries = zones.filter((candidate) => {
          const candidateGroupId = candidate.data.animation.timingGroupId || candidate.data.animation.groupId;
          return candidateGroupId === timingGroupId && candidate.data.animation.focusPresentation?.enabled;
        });
        return groupedEntries.length ? groupedEntries : [zoneEntry];
      }

      function getFocusUnitRevealBatchIndex(zoneEntry) {
        return Math.max(...getFocusUnitEntries(zoneEntry).map(getEntryRevealBatchIndex));
      }

      function getFocusActiveLayout(zoneEntry, focusAppearance) {
        const stageWidth = stage.clientWidth;
        const stageHeight = stage.clientHeight;
        const focusEntries = getFocusUnitEntries(zoneEntry);
        const boxes = focusEntries.map((entry) => ({
          left: entry.element.offsetLeft,
          top: entry.element.offsetTop,
          width: entry.element.offsetWidth,
          height: entry.element.offsetHeight,
        }));
        if (!stageWidth || !stageHeight || boxes.some((box) => !box.width || !box.height)) {
          return { transform: buildTransform(0, 0, focusAppearance.scale, 0), origin: "center center" };
        }

        const bounds = boxes.reduce((acc, box) => ({
          left: Math.min(acc.left, box.left),
          top: Math.min(acc.top, box.top),
          right: Math.max(acc.right, box.left + box.width),
          bottom: Math.max(acc.bottom, box.top + box.height),
        }), { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity });
        const groupWidth = Math.max(1, bounds.right - bounds.left);
        const groupHeight = Math.max(1, bounds.bottom - bounds.top);
        const groupCenterX = bounds.left + groupWidth / 2;
        const groupCenterY = bounds.top + groupHeight / 2;
        const targetScale = Math.min((stageWidth * 0.82) / groupWidth, (stageHeight * 0.82) / groupHeight);
        const scale = Math.max(0.62, Math.min(2.4, targetScale));
        return {
          transform: buildTransform(stageWidth / 2 - groupCenterX, stageHeight / 2 - groupCenterY, scale, 0),
          origin: (groupCenterX - zoneEntry.element.offsetLeft) + "px " + (groupCenterY - zoneEntry.element.offsetTop) + "px",
        };
      }

      function getRecapEntries(group) {
        const ids = new Set(group.zoneIds);
        return zones.filter((zoneEntry) => ids.has(zoneEntry.data.id));
      }

      function getRecapLayout(zoneEntry, recapEntries) {
        const stageWidth = stage.clientWidth;
        const stageHeight = stage.clientHeight;
        if (!stageWidth || !stageHeight || !recapEntries.length) {
          return { transform: buildTransform(0, 0, 1, 0), origin: "center center" };
        }
        const bounds = recapEntries.reduce((acc, recapEntry) => {
          const width = recapEntry.element.offsetWidth;
          const height = recapEntry.element.offsetHeight;
          const left = recapEntry.element.offsetLeft;
          const top = recapEntry.element.offsetTop;
          return {
            left: Math.min(acc.left, left),
            top: Math.min(acc.top, top),
            right: Math.max(acc.right, left + width),
            bottom: Math.max(acc.bottom, top + height),
          };
        }, { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity });
        const groupWidth = Math.max(1, bounds.right - bounds.left);
        const groupHeight = Math.max(1, bounds.bottom - bounds.top);
        const targetScale = Math.min((stageWidth * 0.9) / groupWidth, (stageHeight * 0.9) / groupHeight);
        const scale = Math.max(0.62, targetScale);
        const groupCenterX = bounds.left + groupWidth / 2;
        const groupCenterY = bounds.top + groupHeight / 2;
        return {
          transform: buildTransform(stageWidth / 2 - groupCenterX, stageHeight / 2 - groupCenterY, scale, 0),
          origin: (groupCenterX - zoneEntry.element.offsetLeft) + "px " + (groupCenterY - zoneEntry.element.offsetTop) + "px",
        };
      }

      function applyPlaybackAppearance(zoneEntry, mode, useRevealDelay, currentStep, currentRevealIndex, recapEntries) {
        const animation = zoneEntry.data.animation;
        const focusPresentation = animation.focusPresentation || null;
        const hasFocus = Boolean(focusPresentation && focusPresentation.enabled);
        const revealAtEnd = Boolean(animation.revealAtEnd);
        const revealIndex =
          typeof currentRevealIndex === "number" ? currentRevealIndex : getFirstRevealBatchIndexForStep(currentStep);
        const focusRevealIndex = hasFocus ? getFocusUnitRevealBatchIndex(zoneEntry) : 0;
        const focusDepth = hasFocus && mode === "settled" ? Math.max(1, revealIndex - focusRevealIndex) : 0;
        const focusAppearance = hasFocus ? getFocusAppearance(focusPresentation, focusDepth) : null;
        const transitionDelay = mode === "active" && useRevealDelay ? animation.delay + "ms" : "0ms";
        const transitionDuration = mode === "recap"
          ? Math.max(900, Number(animation.duration) || 700)
          : focusAppearance
          ? Math.max(1100, Math.round(animation.duration * 1.45))
          : animation.duration;
        let opacity = 1;
        let transform = "translate(0px, 0px) scale(1) rotate(0deg)";
        let filter = "blur(0px)";
        let boxShadow = "none";
        let zIndex = "1";
        let transformOrigin = "center center";

        if (mode === "hidden") {
          opacity = 0;
          zIndex = "0";
          transform = buildTransform(
            hiddenOffsetX(animation.effect, animation.offsetX),
            hiddenOffsetY(animation.effect, animation.offsetY),
            hiddenScale(animation.effect, animation.scaleFrom),
            hiddenRotation(animation.effect, animation.rotateFrom)
          );
          filter = "blur(" + hiddenBlur(animation.effect) + "px)";
        } else if (focusAppearance && mode === "settled") {
          opacity = focusAppearance.opacity;
          transform = buildTransform(0, 0, 1, 0);
          filter = "blur(" + focusAppearance.blur + "px) brightness(" + focusAppearance.brightness + ") contrast(" + focusAppearance.contrast + ") saturate(0.94)";
          boxShadow = "inset 0 0 0 9999px rgba(0, 0, 0, " + focusAppearance.veil + ")";
        } else if (revealAtEnd && mode === "settled") {
          opacity = 0.38;
          transform = buildTransform(0, 0, 1, 0);
          filter = "blur(1.5px) brightness(0.97) contrast(0.99) saturate(0.94)";
          boxShadow = "inset 0 0 0 9999px rgba(0, 0, 0, 0.02)";
        } else if (focusAppearance && mode === "active") {
          const focusLayout = getFocusActiveLayout(zoneEntry, focusAppearance);
          const isGroupedFocus = Boolean(animation.timingGroupId || animation.groupId);
          opacity = 1;
          zIndex = "50";
          transform = focusLayout.transform;
          transformOrigin = focusLayout.origin;
          filter = "blur(" + focusAppearance.blur + "px) brightness(1.03) contrast(1.04) saturate(1)";
          boxShadow = isGroupedFocus ? "none" : "0 20px 70px rgba(0, 0, 0, 0.28)";
        } else if (mode === "recap") {
          const recapLayout = getRecapLayout(zoneEntry, recapEntries || []);
          opacity = 1;
          zIndex = "70";
          transform = recapLayout.transform;
          transformOrigin = recapLayout.origin;
          filter = "blur(0px) brightness(1.03) contrast(1.04) saturate(1)";
          boxShadow = "none";
        }

        zoneEntry.element.style.opacity = String(opacity);
        zoneEntry.element.style.transformOrigin = transformOrigin;
        zoneEntry.element.style.transform = transform;
        zoneEntry.element.style.filter = filter;
        zoneEntry.element.style.boxShadow = boxShadow;
        zoneEntry.element.style.zIndex = zIndex;
        zoneEntry.element.style.transitionDuration = transitionDuration + "ms";
        zoneEntry.element.style.transitionDelay = transitionDelay;
        zoneEntry.element.style.transitionTimingFunction = "cubic-bezier(0.22, 1, 0.36, 1)";
        zoneEntry.element.style.transitionProperty = "opacity, transform, filter, box-shadow";
        zoneEntry.element.classList.toggle("focus-settled", Boolean(focusAppearance && mode === "settled"));
        zoneEntry.element.classList.toggle("focus-active", Boolean(focusAppearance && mode === "active"));
      }

      function applyStepState(step, useRevealDelay) {
        const currentRevealIndex = getFirstRevealBatchIndexForStep(step);
        zones.forEach((zoneEntry) => {
          const zoneStep = Math.max(1, Number(zoneEntry.data.animation.step) || 1);
          if (zoneStep > step) {
            applyPlaybackAppearance(zoneEntry, "hidden", false, step, currentRevealIndex);
            return;
          }
          if (zoneStep < step) {
            const shouldAttenuateLater = Boolean(zoneEntry.data.animation.revealAtEnd) && !zoneEntry.data.animation.focusPresentation?.enabled;
            applyPlaybackAppearance(zoneEntry, shouldAttenuateLater ? "settled" : "settled", false, step, currentRevealIndex);
            return;
          }
          applyPlaybackAppearance(zoneEntry, "active", useRevealDelay, step, currentRevealIndex);
        });
        scheduleFocusSettlingForStep(step);
      }

      function applyRecapState(group) {
        clearFocusTimers();
        const recapEntries = getRecapEntries(group);
        const recapIds = new Set(group.zoneIds);
        const currentRevealIndex = getFirstRevealBatchIndexForStep(group.afterStep);
        zones.forEach((zoneEntry) => {
          const zoneStep = Math.max(1, Number(zoneEntry.data.animation.step) || 1);
          if (recapIds.has(zoneEntry.data.id)) {
            applyPlaybackAppearance(zoneEntry, "recap", false, group.afterStep, currentRevealIndex, recapEntries);
            return;
          }
          if (zoneStep > group.afterStep) {
            applyPlaybackAppearance(zoneEntry, "hidden", false, group.afterStep, currentRevealIndex);
            return;
          }
          applyPlaybackAppearance(zoneEntry, "settled", false, group.afterStep, currentRevealIndex);
        });
      }

      function revealAll() {
        clearFocusTimers();
        clearFinalRevealTimer();
        finalRevealComplete = true;
        zones.forEach((zoneEntry) => {
          applyPlaybackAppearance(zoneEntry, "final", false, Number.MAX_SAFE_INTEGER);
        });
      }

      function clearFocusTimers() {
        focusTimers.forEach((timer) => window.clearTimeout(timer));
        focusTimers = [];
      }

      function clearFinalRevealTimer() {
        if (finalRevealTimer) {
          window.clearTimeout(finalRevealTimer);
          finalRevealTimer = null;
        }
      }

      function scheduleFocusSettlingForStep(step) {
        clearFocusTimers();
        getDelayedRevealBatchesForStep(step).forEach((batch) => {
          focusTimers.push(window.setTimeout(() => applyFocusSettlingForRevealBatch(batch.index, batch.step), batch.delay));
        });
      }

      function applyFocusSettlingForRevealBatch(currentRevealIndex, currentStep) {
        zones.forEach((zoneEntry) => {
          const focusPresentation = zoneEntry.data.animation.focusPresentation || null;
          if (!focusPresentation || !focusPresentation.enabled) {
            return;
          }
          const focusRevealIndex = getFocusUnitRevealBatchIndex(zoneEntry);
          if (focusRevealIndex < currentRevealIndex) {
            applyPlaybackAppearance(zoneEntry, "settled", false, currentStep, currentRevealIndex);
          }
        });
      }

      function scheduleFinalReveal(currentStep) {
        clearFinalRevealTimer();
        const delay = Math.max(0, currentStep.duration) + Math.max(0, payload.settings.autoStepGap || 0);
        finalRevealTimer = window.setTimeout(() => {
          revealAll();
        }, delay);
      }

      function completeFinalReveal() {
        revealAll();
      }

      function advance() {
        if (currentStepIndex >= stepSchedule.length) {
          completeFinalReveal();
          return;
        }

        const currentStep = stepSchedule[currentStepIndex];
        if (currentStep.type === "recap") {
          applyRecapState(currentStep.group);
        } else {
          applyStepState(currentStep.step, true);
        }

        if (payload.settings.stepMode === "auto") {
          currentStepIndex += 1;
          if (currentStepIndex < stepSchedule.length) {
            const delay = currentStep.duration + Math.max(0, payload.settings.autoStepGap || 0);
            autoTimer = window.setTimeout(advance, delay);
          } else {
            scheduleFinalReveal(currentStep);
          }
          return;
        }

        currentStepIndex += 1;
      }

      function beginSequence() {
        if (started) {
          return;
        }
        started = true;
        finalRevealComplete = false;
        if (payload.settings.stepMode === "all") {
          revealAll();
          return;
        }
        advance();
      }

      function consumeInteractionEvent(event) {
        event.preventDefault();
        event.stopPropagation();
        if (typeof event.stopImmediatePropagation === "function") {
          event.stopImmediatePropagation();
        }
      }

      function handleInteraction(kind) {
        if (finalRevealComplete) {
          return false;
        }

        if (!started) {
          const canStart =
            (payload.settings.startTrigger === "click" && kind === "click") ||
            (payload.settings.startTrigger === "key" && kind === "key");
          if (canStart) {
            beginSequence();
            return true;
          }
          return false;
        }

        if (payload.settings.stepMode === "click" && kind === "click") {
          advance();
          return true;
        }
        if (payload.settings.stepMode === "key" && kind === "key") {
          advance();
          return true;
        }
        return false;
      }

      stage.addEventListener(
        "click",
        (event) => {
          stage.focus({ preventScroll: true });
          if (handleInteraction("click")) {
            consumeInteractionEvent(event);
          }
        },
        true
      );
      window.addEventListener("keydown", (event) => {
        const target = event.target;
        if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT")) {
          return;
        }
        if (handleInteraction("key")) {
          consumeInteractionEvent(event);
        }
      }, true);

      if (payload.settings.startTrigger === "slide") {
        beginSequence();
      }

      window.requestAnimationFrame(() => {
        stage.focus({ preventScroll: true });
      });

      window.addEventListener("beforeunload", () => {
        if (autoTimer) {
          clearTimeout(autoTimer);
        }
        clearFocusTimers();
        clearFinalRevealTimer();
      });
    </script>
  </body>
</html>`;
}

function createRuntimeController(stageElement, payload, options = {}) {
  const entries = payload.zones
    .map((zone) => {
      const element = stageElement.querySelector(`.animation-zone[data-zone-id="${zone.id}"]`);
      if (!element) {
        return null;
      }
      return { data: zone, element };
    })
    .filter(Boolean);
  const focusZoneCount = entries.filter((entry) => entry.data.animation.focusPresentation?.enabled).length;

  let active = true;
  let started = false;
  const stepSchedule = buildStepSchedule(entries, payload.recapGroups ?? []);
  const revealBatches = buildRevealBatches(entries);
  const revealBatchIndex = new Map(revealBatches.map((batch) => [batch.key, batch.index]));
  let currentStepIndex = 0;
  let timer = null;
  let focusTimers = [];
  let finalRevealTimer = null;

  entries.forEach((entry) => applyPlaybackAppearance(entry, "hidden"));

  function buildRevealBatches(items) {
    const batches = new Map();
    items.forEach((item) => {
      const animation = item.data.animation;
      const step = Math.max(1, Number(animation.step) || 1);
      const delay = Math.max(0, Number(animation.delay) || 0);
      const key = `${step}:${delay}`;
      if (!batches.has(key)) {
        batches.set(key, { key, step, delay });
      }
    });
    return [...batches.values()]
      .sort((a, b) => a.step - b.step || a.delay - b.delay)
      .map((batch, index) => ({ ...batch, index }));
  }

  function getRevealBatchIndex(step, delay) {
    return revealBatchIndex.get(`${step}:${delay}`) ?? 0;
  }

  function getEntryRevealBatchIndex(entry) {
    const animation = entry.data.animation;
    const step = Math.max(1, Number(animation.step) || 1);
    const delay = Math.max(0, Number(animation.delay) || 0);
    return getRevealBatchIndex(step, delay);
  }

  function getFirstRevealBatchIndexForStep(step) {
    return revealBatches.find((batch) => batch.step === step)?.index ?? 0;
  }

  function getDelayedRevealBatchesForStep(step) {
    return revealBatches.filter((batch) => batch.step === step && batch.delay > 0);
  }

  function getFocusAppearance(presentation, depth) {
    const sanitized = sanitizeGroupPresentation(presentation);
    if (!sanitized.enabled) {
      return null;
    }
    if (depth <= 0) {
      return {
        opacity: 1,
        scale: sanitized.activeScale,
        blur: sanitized.activeBlur,
        brightness: 1,
        contrast: 1,
        veil: 0,
      };
    }
    const extraDepth = Math.max(0, depth - 1);
    return {
      opacity: clamp(sanitized.settledOpacity - extraDepth * sanitized.settledOpacityStep, 0.02, 1),
      scale: clamp(sanitized.settledScale - extraDepth * sanitized.settledScaleStep, 0.55, 1),
      blur: clamp(sanitized.settledBlur + extraDepth * sanitized.settledBlurStep, 0, 12),
      brightness: Math.max(0.9, 0.96 - extraDepth * 0.02),
      contrast: Math.max(0.96, 0.99 - extraDepth * 0.01),
      veil: Math.min(0.08, 0.03 + extraDepth * 0.01),
    };
  }

  function getFocusUnitEntries(entry) {
    const timingGroupId = entry.data.animation.timingGroupId || entry.data.animation.groupId;
    if (!timingGroupId) {
      return [entry];
    }
    const groupedEntries = entries.filter((candidate) => {
      const candidateGroupId = candidate.data.animation.timingGroupId || candidate.data.animation.groupId;
      return candidateGroupId === timingGroupId && candidate.data.animation.focusPresentation?.enabled;
    });
    return groupedEntries.length ? groupedEntries : [entry];
  }

  function getFocusUnitRevealBatchIndex(entry) {
    return Math.max(...getFocusUnitEntries(entry).map(getEntryRevealBatchIndex));
  }

  function getFocusActiveLayout(entry, focusAppearance) {
    const stageWidth = stageElement.clientWidth;
    const stageHeight = stageElement.clientHeight;
    const focusEntries = getFocusUnitEntries(entry);
    const boxes = focusEntries.map((focusEntry) => ({
      left: focusEntry.element.offsetLeft,
      top: focusEntry.element.offsetTop,
      width: focusEntry.element.offsetWidth,
      height: focusEntry.element.offsetHeight,
    }));
    if (!stageWidth || !stageHeight || boxes.some((box) => !box.width || !box.height)) {
      return { transform: buildTransform(0, 0, focusAppearance.scale, 0), origin: "center center" };
    }

    const layout = AnimationCore.getGroupFocusLayout(stageWidth, stageHeight, boxes, focusAppearance.scale);
    return {
      transform: buildTransform(layout.translateX, layout.translateY, layout.scale, 0),
      origin: `${layout.centerX - entry.element.offsetLeft}px ${layout.centerY - entry.element.offsetTop}px`,
    };
  }

  function getRecapLayout(entry, recapEntries) {
    const stageWidth = stageElement.clientWidth;
    const stageHeight = stageElement.clientHeight;
    if (!stageWidth || !stageHeight || !recapEntries.length) {
      return { transform: buildTransform(0, 0, 1, 0), origin: "center center" };
    }

    const bounds = recapEntries.reduce(
      (acc, recapEntry) => {
        const width = recapEntry.element.offsetWidth;
        const height = recapEntry.element.offsetHeight;
        const left = recapEntry.element.offsetLeft;
        const top = recapEntry.element.offsetTop;
        return {
          left: Math.min(acc.left, left),
          top: Math.min(acc.top, top),
          right: Math.max(acc.right, left + width),
          bottom: Math.max(acc.bottom, top + height),
        };
      },
      { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity }
    );
    const groupWidth = Math.max(1, bounds.right - bounds.left);
    const groupHeight = Math.max(1, bounds.bottom - bounds.top);
    const targetScale = Math.min((stageWidth * 0.9) / groupWidth, (stageHeight * 0.9) / groupHeight);
    const scale = Math.max(0.62, targetScale);
    const groupCenterX = bounds.left + groupWidth / 2;
    const groupCenterY = bounds.top + groupHeight / 2;
    return {
      transform: buildTransform(stageWidth / 2 - groupCenterX, stageHeight / 2 - groupCenterY, scale, 0),
      origin: `${groupCenterX - entry.element.offsetLeft}px ${groupCenterY - entry.element.offsetTop}px`,
    };
  }

  function getRecapEntries(group) {
    const wantedIds = new Set(group.zoneIds);
    return entries.filter((entry) => wantedIds.has(entry.data.id));
  }

  function applyPlaybackAppearance(entry, mode, useRevealDelay = false, currentStep = 1, currentRevealIndex, recapEntries = []) {
    const animation = entry.data.animation;
    const focusPresentation = animation.focusPresentation || null;
    const hasFocus = Boolean(focusPresentation?.enabled);
    const revealAtEnd = Boolean(animation.revealAtEnd);
    const revealIndex =
      typeof currentRevealIndex === "number" ? currentRevealIndex : getFirstRevealBatchIndexForStep(currentStep);
    const focusRevealIndex = hasFocus ? getFocusUnitRevealBatchIndex(entry) : 0;
    const focusDepth = hasFocus && mode === "settled" ? Math.max(1, revealIndex - focusRevealIndex) : 0;
    const focusAppearance = hasFocus ? getFocusAppearance(focusPresentation, focusDepth) : null;
    const transitionDelay = mode === "active" && useRevealDelay ? `${Math.max(0, animation.delay)}ms` : "0ms";
    const transitionDuration = mode === "recap"
      ? Math.max(900, Number(animation.duration) || 700)
      : focusAppearance
      ? Math.max(1100, Math.round(animation.duration * 1.45))
      : animation.duration;
    let opacity = 1;
    let transform = "translate(0px, 0px) scale(1) rotate(0deg)";
    let filter = "blur(0px)";
    let boxShadow = "none";
    let zIndex = "1";
    let transformOrigin = "center center";

    if (mode === "hidden") {
      const hiddenState = getZoneVisualState(animation, false);
      opacity = hiddenState.opacity;
      transform = hiddenState.transform;
      filter = hiddenState.filter;
      zIndex = "0";
    } else if (focusAppearance && mode === "settled") {
      opacity = focusAppearance.opacity;
      transform = buildTransform(0, 0, 1, 0);
      filter = `blur(${focusAppearance.blur}px) brightness(${focusAppearance.brightness}) contrast(${focusAppearance.contrast}) saturate(0.94)`;
      boxShadow = `inset 0 0 0 9999px rgba(0, 0, 0, ${focusAppearance.veil})`;
    } else if (revealAtEnd && mode === "settled") {
      opacity = 0.38;
      transform = buildTransform(0, 0, 1, 0);
      filter = "blur(1.5px) brightness(0.97) contrast(0.99) saturate(0.94)";
      boxShadow = "inset 0 0 0 9999px rgba(0, 0, 0, 0.02)";
    } else if (focusAppearance && mode === "active") {
      const focusLayout = getFocusActiveLayout(entry, focusAppearance);
      const isGroupedFocus = Boolean(animation.timingGroupId || animation.groupId);
      opacity = 1;
      zIndex = "50";
      transform = focusLayout.transform;
      transformOrigin = focusLayout.origin;
      filter = `blur(${focusAppearance.blur}px) brightness(1.03) contrast(1.04) saturate(1)`;
      boxShadow = isGroupedFocus ? "none" : "0 20px 70px rgba(0, 0, 0, 0.28)";
    } else if (mode === "recap") {
      const recapLayout = getRecapLayout(entry, recapEntries);
      opacity = 1;
      zIndex = "70";
      transform = recapLayout.transform;
      transformOrigin = recapLayout.origin;
      filter = "blur(0px) brightness(1.03) contrast(1.04) saturate(1)";
      boxShadow = "none";
    }

    entry.element.style.opacity = String(opacity);
    entry.element.style.transformOrigin = transformOrigin;
    entry.element.style.transform = transform;
    entry.element.style.filter = filter;
    entry.element.style.boxShadow = boxShadow;
    entry.element.style.zIndex = zIndex;
    entry.element.style.transitionDuration = `${transitionDuration}ms`;
    entry.element.style.transitionDelay = transitionDelay;
    entry.element.style.transitionTimingFunction = "cubic-bezier(0.22, 1, 0.36, 1)";
    entry.element.style.transitionProperty = "opacity, transform, filter, box-shadow";
    entry.element.classList.toggle("focus-settled", Boolean(focusAppearance && mode === "settled"));
    entry.element.classList.toggle("focus-active", Boolean(focusAppearance && mode === "active"));
  }

  function applyStepState(currentStep, useRevealDelay = true) {
    const currentRevealIndex = getFirstRevealBatchIndexForStep(currentStep);
    entries.forEach((entry) => {
      const step = Math.max(1, Number(entry.data.animation.step) || 1);
      if (step > currentStep) {
        applyPlaybackAppearance(entry, "hidden", false, currentStep, currentRevealIndex);
        return;
      }
      if (step < currentStep) {
        applyPlaybackAppearance(entry, "settled", false, currentStep, currentRevealIndex);
        return;
      }
      applyPlaybackAppearance(entry, "active", useRevealDelay, currentStep, currentRevealIndex);
    });
    scheduleFocusSettlingForStep(currentStep);
  }

  function applyRecapState(group) {
    clearFocusTimers();
    const recapEntries = getRecapEntries(group);
    const recapIds = new Set(group.zoneIds);
    const currentRevealIndex = getFirstRevealBatchIndexForStep(group.afterStep);
    entries.forEach((entry) => {
      const step = Math.max(1, Number(entry.data.animation.step) || 1);
      if (recapIds.has(entry.data.id)) {
        applyPlaybackAppearance(entry, "recap", false, group.afterStep, currentRevealIndex, recapEntries);
        return;
      }
      if (step > group.afterStep) {
        applyPlaybackAppearance(entry, "hidden", false, group.afterStep, currentRevealIndex);
        return;
      }
      applyPlaybackAppearance(entry, "settled", false, group.afterStep, currentRevealIndex);
    });
  }

  function revealAll() {
    clearFocusTimers();
    clearFinalRevealTimer();
    entries.forEach((entry) => {
      applyPlaybackAppearance(entry, "final", false, Number.MAX_SAFE_INTEGER);
    });
  }

  function clearFocusTimers() {
    focusTimers.forEach((focusTimer) => window.clearTimeout(focusTimer));
    focusTimers = [];
  }

  function clearFinalRevealTimer() {
    if (finalRevealTimer) {
      window.clearTimeout(finalRevealTimer);
      finalRevealTimer = null;
    }
  }

  function scheduleFocusSettlingForStep(currentStep) {
    clearFocusTimers();
    getDelayedRevealBatchesForStep(currentStep).forEach((batch) => {
      focusTimers.push(window.setTimeout(() => applyFocusSettlingForRevealBatch(batch.index, batch.step), batch.delay));
    });
  }

  function applyFocusSettlingForRevealBatch(currentRevealIndex, currentStep) {
    entries.forEach((entry) => {
      const focusPresentation = entry.data.animation.focusPresentation || null;
      if (!focusPresentation?.enabled) {
        return;
      }
      const focusRevealIndex = getFocusUnitRevealBatchIndex(entry);
      if (focusRevealIndex < currentRevealIndex) {
        applyPlaybackAppearance(entry, "settled", false, currentStep, currentRevealIndex);
      }
    });
  }

  function scheduleFinalReveal(currentStep) {
    clearFinalRevealTimer();
    const delay = Math.max(0, currentStep.duration) + Math.max(0, payload.settings.autoStepGap || 0);
    finalRevealTimer = window.setTimeout(() => {
      completeFinalReveal();
    }, delay);
  }

  function completeFinalReveal() {
    revealAll();
    if (options.onStatus) {
      options.onStatus("Infographie complete revelee.");
    }
  }

  function advance() {
    if (!active || currentStepIndex >= stepSchedule.length) {
      if (active && currentStepIndex >= stepSchedule.length) {
        completeFinalReveal();
      }
      return;
    }

    const currentStep = stepSchedule[currentStepIndex];
    if (currentStep.type === "recap") {
      applyRecapState(currentStep.group);
    } else {
      applyStepState(currentStep.step, true);
    }

    if (payload.settings.stepMode === "auto") {
      currentStepIndex += 1;
      if (currentStepIndex < stepSchedule.length) {
        const delay = currentStep.duration + Math.max(0, payload.settings.autoStepGap || 0);
        timer = window.setTimeout(advance, delay);
      } else {
        scheduleFinalReveal(currentStep);
      }
      return;
    }

    currentStepIndex += 1;
    if (currentStepIndex >= stepSchedule.length) {
      if (options.onStatus) {
        options.onStatus("Derniere zone revelee. Presse encore une touche pour afficher toute l'infographie.");
      }
    }
  }

  function beginSequence() {
    if (!active || started) {
      return;
    }
    started = true;
    if (options.onStatus) {
      options.onStatus(`Animation lancee.${getRuntimeFocusStatusSuffix()}`);
    }
    if (payload.settings.stepMode === "all") {
      revealAll();
      if (options.onStatus) {
        options.onStatus("Toutes les zones sont revelees.");
      }
      return;
    }
    advance();
  }

  function arm() {
    if (payload.settings.startTrigger === "slide") {
      beginSequence();
      return;
    }
    if (options.onStatus) {
      options.onStatus(
        payload.settings.startTrigger === "click"
          ? `Apercu arme. Clique dans la scene pour demarrer.${getRuntimeFocusStatusSuffix()}`
          : `Apercu arme. Presse une touche pour demarrer.${getRuntimeFocusStatusSuffix()}`
      );
    }
  }

  function getRuntimeFocusStatusSuffix() {
    return focusZoneCount ? ` Focus detecte: ${focusZoneCount} zone(s).` : " Aucun focus detecte.";
  }

  function handleInteraction(kind) {
    if (!active) {
      return;
    }

    if (!started) {
      const canStart =
        (payload.settings.startTrigger === "click" && kind === "click") ||
        (payload.settings.startTrigger === "key" && kind === "key");
      if (canStart) {
        beginSequence();
      }
      return;
    }

    if (payload.settings.stepMode === "click" && kind === "click") {
      advance();
    }
    if (payload.settings.stepMode === "key" && kind === "key") {
      advance();
    }
  }

  function dispose() {
    active = false;
    if (timer) {
      window.clearTimeout(timer);
    }
    clearFocusTimers();
    clearFinalRevealTimer();
  }

  return {
    get active() {
      return active;
    },
    arm,
    dispose,
    handleInteraction,
  };
}

function getSelectedZone() {
  return state.zones.find((zone) => zone.id === state.selectedZoneId) ?? null;
}

function getSelectedZones() {
  return state.zones.filter((zone) => state.selectedZoneIds.includes(zone.id));
}

function getEnabledZonesSorted() {
  return state.zones
    .filter((zone) => zone.animation.enabled)
    .sort((a, b) => {
      if (a.animation.step !== b.animation.step) {
        return a.animation.step - b.animation.step;
      }
      return (a.animation.order ?? 0) - (b.animation.order ?? 0);
    });
}

function countEnabledZones() {
  return state.zones.filter((zone) => zone.animation.enabled).length;
}

function getContainRect(sourceWidth, sourceHeight, targetWidth, targetHeight) {
  const sourceRatio = sourceWidth / sourceHeight;
  const targetRatio = targetWidth / targetHeight;

  if (sourceRatio > targetRatio) {
    const width = targetWidth;
    const height = width / sourceRatio;
    return {
      x: 0,
      y: (targetHeight - height) / 2,
      width,
      height,
    };
  }

  const height = targetHeight;
  const width = height * sourceRatio;
  return {
    x: (targetWidth - width) / 2,
    y: 0,
    width,
    height,
  };
}

function getZonePlacement(zone, fitRect, format) {
  const scale = fitRect.width / state.sourceImage.width;
  return {
    x: fitRect.x + zone.x * scale,
    y: fitRect.y + zone.y * scale,
    width: zone.width * scale,
    height: zone.height * scale,
    left: `${(((fitRect.x + zone.x * scale) / format.width) * 100).toFixed(4)}%`,
    top: `${(((fitRect.y + zone.y * scale) / format.height) * 100).toFixed(4)}%`,
    widthPct: `${(((zone.width * scale) / format.width) * 100).toFixed(4)}%`,
    heightPct: `${(((zone.height * scale) / format.height) * 100).toFixed(4)}%`,
  };
}

function applyRectStyles(element, rect, format) {
  if ("left" in rect) {
    element.style.left = rect.left;
    element.style.top = rect.top;
    element.style.width = rect.widthPct;
    element.style.height = rect.heightPct;
    return;
  }

  element.style.left = `${((rect.x / format.width) * 100).toFixed(4)}%`;
  element.style.top = `${((rect.y / format.height) * 100).toFixed(4)}%`;
  element.style.width = `${((rect.width / format.width) * 100).toFixed(4)}%`;
  element.style.height = `${((rect.height / format.height) * 100).toFixed(4)}%`;
}

function detectComponentZones(mask, width, height, options) {
  const components = findConnectedComponents(mask, width, height, options.minArea);
  const merged = mergeNearbyBoxes(components, options.mergeDistance);
  return merged.map((box) => padBox(box, options.padding, width, height));
}

function detectLayoutZones(mask, width, height, options) {
  const bridgedMask = bridgeMask(mask, width, height, options.bridgeX, options.bridgeY);
  const rowProjection = projectMaskRows(bridgedMask, width, height);
  const rowBands = expandBandsToMidpoints(
    findBands(
      rowProjection,
      Math.max(8, Math.floor(width * 0.008)),
      Math.max(12, Math.floor(height * 0.012)),
      options.rowFillGap
    ),
    height
  );

  if (rowBands.length === 0) {
    return detectComponentZones(mask, width, height, options);
  }

  const boxes = [];

  rowBands.forEach((rowBand) => {
    const columnProjection = projectMaskColumns(bridgedMask, width, rowBand.start, rowBand.end);
    const columnBands = findBands(
      columnProjection,
      Math.max(6, Math.floor((rowBand.end - rowBand.start + 1) * 0.06)),
      Math.max(18, Math.floor(width * 0.03)),
      options.columnFillGap
    );

    if (shouldSplitRowIntoColumns(columnBands, width)) {
      const expandedColumns = expandBandsToMidpoints(columnBands, width);
      expandedColumns.forEach((columnBand) => {
        const area = countMaskPixelsInBox(
          bridgedMask,
          width,
          columnBand.start,
          rowBand.start,
          columnBand.end - columnBand.start + 1,
          rowBand.end - rowBand.start + 1
        );

        if (area < options.minArea * 0.15) {
          return;
        }

        boxes.push(
          padBox(
            {
              x: columnBand.start,
              y: rowBand.start,
              width: columnBand.end - columnBand.start + 1,
              height: rowBand.end - rowBand.start + 1,
              area,
            },
            options.padding,
            width,
            height
          )
        );
      });
      return;
    }

    const bandArea = countMaskPixelsInBox(
      bridgedMask,
      width,
      0,
      rowBand.start,
      width,
      rowBand.end - rowBand.start + 1
    );

    if (bandArea >= options.minArea * 0.25) {
      boxes.push(
        padBox(
          {
            x: 0,
            y: rowBand.start,
            width,
            height: rowBand.end - rowBand.start + 1,
            area: bandArea,
          },
          options.padding,
          width,
          height
        )
      );
    }
  });

  const merged = mergeNearbyBoxes(boxes, options.mergeDistance);
  return merged.length ? merged : detectComponentZones(mask, width, height, options);
}

function estimateBackgroundColor(data, width, height) {
  const samples = [];
  const stepX = Math.max(1, Math.floor(width / 32));
  const stepY = Math.max(1, Math.floor(height / 32));

  for (let x = 0; x < width; x += stepX) {
    samples.push(readPixel(data, width, x, 0));
    samples.push(readPixel(data, width, x, height - 1));
  }

  for (let y = 0; y < height; y += stepY) {
    samples.push(readPixel(data, width, 0, y));
    samples.push(readPixel(data, width, width - 1, y));
  }

  const sortedR = samples.map((sample) => sample.r).sort((a, b) => a - b);
  const sortedG = samples.map((sample) => sample.g).sort((a, b) => a - b);
  const sortedB = samples.map((sample) => sample.b).sort((a, b) => a - b);

  return {
    r: median(sortedR),
    g: median(sortedG),
    b: median(sortedB),
  };
}

function buildForegroundMask(data, width, height, background, threshold) {
  const mask = new Uint8Array(width * height);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const alpha = data[index + 3];
      if (alpha <= 16) {
        continue;
      }

      const distance =
        Math.abs(data[index] - background.r) +
        Math.abs(data[index + 1] - background.g) +
        Math.abs(data[index + 2] - background.b);

      if (distance >= threshold) {
        mask[y * width + x] = 1;
      }
    }
  }

  return closeSmallGaps(mask, width, height);
}

function closeSmallGaps(mask, width, height) {
  const result = mask.slice();

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const index = y * width + x;
      if (mask[index]) {
        continue;
      }

      let neighbors = 0;
      for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
        for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
          if (offsetX === 0 && offsetY === 0) {
            continue;
          }
          neighbors += mask[(y + offsetY) * width + (x + offsetX)];
        }
      }

      if (neighbors >= 5) {
        result[index] = 1;
      }
    }
  }

  return result;
}

function bridgeMask(mask, width, height, bridgeX, bridgeY) {
  let result = mask.slice();
  if (bridgeX > 0) {
    result = fillLineGaps(result, width, height, bridgeX, "horizontal");
  }
  if (bridgeY > 0) {
    result = fillLineGaps(result, width, height, bridgeY, "vertical");
  }
  if (bridgeX > 0) {
    result = fillLineGaps(result, width, height, Math.max(1, Math.floor(bridgeX / 2)), "horizontal");
  }
  return result;
}

function fillLineGaps(mask, width, height, maxGap, direction) {
  const result = mask.slice();

  if (direction === "horizontal") {
    for (let y = 0; y < height; y += 1) {
      let lastFilledX = -1;
      for (let x = 0; x < width; x += 1) {
        if (!mask[y * width + x]) {
          continue;
        }
        if (lastFilledX >= 0 && x - lastFilledX - 1 <= maxGap) {
          for (let fillX = lastFilledX + 1; fillX < x; fillX += 1) {
            result[y * width + fillX] = 1;
          }
        }
        lastFilledX = x;
      }
    }
    return result;
  }

  for (let x = 0; x < width; x += 1) {
    let lastFilledY = -1;
    for (let y = 0; y < height; y += 1) {
      if (!mask[y * width + x]) {
        continue;
      }
      if (lastFilledY >= 0 && y - lastFilledY - 1 <= maxGap) {
        for (let fillY = lastFilledY + 1; fillY < y; fillY += 1) {
          result[fillY * width + x] = 1;
        }
      }
      lastFilledY = y;
    }
  }

  return result;
}

function projectMaskRows(mask, width, height) {
  const projection = new Uint32Array(height);
  for (let y = 0; y < height; y += 1) {
    let count = 0;
    for (let x = 0; x < width; x += 1) {
      count += mask[y * width + x];
    }
    projection[y] = count;
  }
  return projection;
}

function projectMaskColumns(mask, width, startY, endY) {
  const projection = new Uint32Array(width);
  for (let x = 0; x < width; x += 1) {
    let count = 0;
    for (let y = startY; y <= endY; y += 1) {
      count += mask[y * width + x];
    }
    projection[x] = count;
  }
  return projection;
}

function findBands(projection, minPixels, minRunLength, maxGap) {
  const active = Array.from(projection, (value) => (value >= minPixels ? 1 : 0));
  const bridged = bridgeBinaryGaps(active, maxGap);
  const bands = [];
  let start = -1;

  for (let index = 0; index < bridged.length; index += 1) {
    if (bridged[index] && start < 0) {
      start = index;
      continue;
    }
    if (!bridged[index] && start >= 0) {
      if (index - start >= minRunLength) {
        bands.push({ start, end: index - 1 });
      }
      start = -1;
    }
  }

  if (start >= 0 && bridged.length - start >= minRunLength) {
    bands.push({ start, end: bridged.length - 1 });
  }

  return bands;
}

function bridgeBinaryGaps(values, maxGap) {
  const result = values.slice();
  let previousActive = -1;

  for (let index = 0; index < values.length; index += 1) {
    if (!values[index]) {
      continue;
    }
    if (previousActive >= 0 && index - previousActive - 1 <= maxGap) {
      for (let fillIndex = previousActive + 1; fillIndex < index; fillIndex += 1) {
        result[fillIndex] = 1;
      }
    }
    previousActive = index;
  }

  return result;
}

function expandBandsToMidpoints(bands, limit) {
  if (!bands.length) {
    return [];
  }

  return bands.map((band, index) => {
    const previous = bands[index - 1];
    const next = bands[index + 1];
    const start = previous ? Math.max(0, Math.floor((previous.end + band.start) / 2) + 1) : 0;
    const end = next ? Math.min(limit - 1, Math.floor((band.end + next.start) / 2)) : limit - 1;
    return { start, end };
  });
}

function shouldSplitRowIntoColumns(columnBands, width) {
  if (columnBands.length < 2 || columnBands.length > 8) {
    return false;
  }

  const widths = columnBands.map((band) => band.end - band.start + 1);
  const medianWidth = median([...widths].sort((a, b) => a - b));
  const similarCount = widths.filter((value) => Math.abs(value - medianWidth) <= medianWidth * 0.45).length;
  const coverage = widths.reduce((sum, value) => sum + value, 0) / width;

  return similarCount >= Math.ceil(columnBands.length * 0.6) && coverage >= 0.25;
}

function countMaskPixelsInBox(mask, width, x, y, boxWidth, boxHeight) {
  let total = 0;
  for (let row = y; row < y + boxHeight; row += 1) {
    for (let col = x; col < x + boxWidth; col += 1) {
      total += mask[row * width + col];
    }
  }
  return total;
}

function findConnectedComponents(mask, width, height, minArea) {
  const visited = new Uint8Array(width * height);
  const queueX = new Int32Array(width * height);
  const queueY = new Int32Array(width * height);
  const boxes = [];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const startIndex = y * width + x;
      if (!mask[startIndex] || visited[startIndex]) {
        continue;
      }

      let head = 0;
      let tail = 0;
      let area = 0;
      let minX = x;
      let minY = y;
      let maxX = x;
      let maxY = y;

      visited[startIndex] = 1;
      queueX[tail] = x;
      queueY[tail] = y;
      tail += 1;

      while (head < tail) {
        const currentX = queueX[head];
        const currentY = queueY[head];
        head += 1;
        area += 1;

        if (currentX < minX) minX = currentX;
        if (currentY < minY) minY = currentY;
        if (currentX > maxX) maxX = currentX;
        if (currentY > maxY) maxY = currentY;

        for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
          for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
            if (offsetX === 0 && offsetY === 0) {
              continue;
            }

            const nextX = currentX + offsetX;
            const nextY = currentY + offsetY;
            if (nextX < 0 || nextY < 0 || nextX >= width || nextY >= height) {
              continue;
            }

            const nextIndex = nextY * width + nextX;
            if (!mask[nextIndex] || visited[nextIndex]) {
              continue;
            }

            visited[nextIndex] = 1;
            queueX[tail] = nextX;
            queueY[tail] = nextY;
            tail += 1;
          }
        }
      }

      if (area >= minArea) {
        boxes.push({
          x: minX,
          y: minY,
          width: maxX - minX + 1,
          height: maxY - minY + 1,
          area,
        });
      }
    }
  }

  return boxes;
}

function mergeNearbyBoxes(boxes, mergeDistance) {
  if (boxes.length <= 1) {
    return boxes.slice();
  }

  const pending = boxes.slice();
  const merged = [];

  while (pending.length) {
    let current = pending.pop();
    let changed = true;

    while (changed) {
      changed = false;
      for (let index = pending.length - 1; index >= 0; index -= 1) {
        if (!boxesAreNear(current, pending[index], mergeDistance)) {
          continue;
        }
        current = combineBoxes(current, pending[index]);
        pending.splice(index, 1);
        changed = true;
      }
    }

    merged.push(current);
  }

  return merged;
}

function boxesAreNear(a, b, mergeDistance) {
  const horizontalGap = Math.max(0, Math.max(a.x - (b.x + b.width), b.x - (a.x + a.width)));
  const verticalGap = Math.max(0, Math.max(a.y - (b.y + b.height), b.y - (a.y + a.height)));
  return horizontalGap <= mergeDistance && verticalGap <= mergeDistance;
}

function combineBoxes(a, b) {
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);
  const maxX = Math.max(a.x + a.width, b.x + b.width);
  const maxY = Math.max(a.y + a.height, b.y + b.height);

  return {
    x,
    y,
    width: maxX - x,
    height: maxY - y,
    area: a.area + b.area,
  };
}

function padBox(box, padding, maxWidth, maxHeight) {
  const x = Math.max(0, box.x - padding);
  const y = Math.max(0, box.y - padding);
  const right = Math.min(maxWidth, box.x + box.width + padding);
  const bottom = Math.min(maxHeight, box.y + box.height + padding);

  return {
    x,
    y,
    width: right - x,
    height: bottom - y,
    area: box.area,
  };
}

function suppressContainedBoxes(boxes) {
  return boxes.filter((box, index) => {
    return !boxes.some((other, otherIndex) => {
      if (index === otherIndex) {
        return false;
      }

      const sameSize =
        box.x === other.x &&
        box.y === other.y &&
        box.width === other.width &&
        box.height === other.height;

      const inside =
        box.x >= other.x &&
        box.y >= other.y &&
        box.x + box.width <= other.x + other.width &&
        box.y + box.height <= other.y + other.height;

      return inside && !sameSize;
    });
  });
}

function readPixel(data, width, x, y) {
  const index = (y * width + x) * 4;
  return {
    r: data[index],
    g: data[index + 1],
    b: data[index + 2],
  };
}

function colorDistance(a, b) {
  return Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b);
}

function luminance(color) {
  return color.r * 0.2126 + color.g * 0.7152 + color.b * 0.0722;
}

function smoothNumericSeries(values, radius) {
  const result = new Array(values.length).fill(0);
  for (let index = 0; index < values.length; index += 1) {
    let total = 0;
    let count = 0;
    for (
      let cursor = Math.max(0, index - radius);
      cursor <= Math.min(values.length - 1, index + radius);
      cursor += 1
    ) {
      total += values[cursor];
      count += 1;
    }
    result[index] = total / Math.max(1, count);
  }
  return result;
}

function median(values) {
  const middle = Math.floor(values.length / 2);
  if (values.length % 2 === 0) {
    return Math.round((values[middle - 1] + values[middle]) / 2);
  }
  return values[middle];
}

async function loadImageFromFile(file) {
  const src = URL.createObjectURL(file);
  const image = new Image();
  image.decoding = "async";

  try {
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      image.src = src;
    });
  } finally {
    URL.revokeObjectURL(src);
  }

  return image;
}

async function loadImageFromDataUrl(dataUrl) {
  const image = new Image();
  image.decoding = "async";
  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
    image.src = dataUrl;
  });
  return image;
}

function getSourceImageDataUrl() {
  if (!state.sourceImage) {
    return "";
  }

  const canvas = document.createElement("canvas");
  canvas.width = state.sourceImage.width;
  canvas.height = state.sourceImage.height;
  const context = canvas.getContext("2d");
  context.drawImage(state.sourceImage, 0, 0);
  return canvas.toDataURL("image/png");
}

function triggerDownload(fileName, href, isObjectUrl = false) {
  const link = document.createElement("a");
  link.href = href;
  link.download = fileName;
  link.click();

  if (isObjectUrl) {
    window.setTimeout(() => URL.revokeObjectURL(href), 1500);
  }
}

function buildZipBlob(files) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  files.forEach((file) => {
    const nameBytes = encodeText(sanitizeZipPath(file.name));
    const bytes = file.bytes instanceof Uint8Array ? file.bytes : new Uint8Array(file.bytes);
    const crc = crc32(bytes);
    const localHeader = createZipLocalHeader(nameBytes, bytes, crc);
    localParts.push(localHeader, bytes);
    centralParts.push(createZipCentralHeader(nameBytes, bytes, crc, offset));
    offset += localHeader.length + bytes.length;
  });

  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const endRecord = createZipEndRecord(files.length, centralSize, offset);
  return new Blob([...localParts, ...centralParts, endRecord], { type: "application/zip" });
}

function createZipLocalHeader(nameBytes, bytes, crc) {
  const header = new Uint8Array(30 + nameBytes.length);
  const view = new DataView(header.buffer);
  view.setUint32(0, 0x04034b50, true);
  view.setUint16(4, 20, true);
  view.setUint16(6, 0x0800, true);
  view.setUint16(8, 0, true);
  view.setUint16(10, 0, true);
  view.setUint16(12, 0, true);
  view.setUint32(14, crc, true);
  view.setUint32(18, bytes.length, true);
  view.setUint32(22, bytes.length, true);
  view.setUint16(26, nameBytes.length, true);
  view.setUint16(28, 0, true);
  header.set(nameBytes, 30);
  return header;
}

function createZipCentralHeader(nameBytes, bytes, crc, localHeaderOffset) {
  const header = new Uint8Array(46 + nameBytes.length);
  const view = new DataView(header.buffer);
  view.setUint32(0, 0x02014b50, true);
  view.setUint16(4, 20, true);
  view.setUint16(6, 20, true);
  view.setUint16(8, 0x0800, true);
  view.setUint16(10, 0, true);
  view.setUint16(12, 0, true);
  view.setUint16(14, 0, true);
  view.setUint32(16, crc, true);
  view.setUint32(20, bytes.length, true);
  view.setUint32(24, bytes.length, true);
  view.setUint16(28, nameBytes.length, true);
  view.setUint16(30, 0, true);
  view.setUint16(32, 0, true);
  view.setUint16(34, 0, true);
  view.setUint16(36, 0, true);
  view.setUint32(38, 0, true);
  view.setUint32(42, localHeaderOffset, true);
  header.set(nameBytes, 46);
  return header;
}

function createZipEndRecord(fileCount, centralSize, centralOffset) {
  const record = new Uint8Array(22);
  const view = new DataView(record.buffer);
  view.setUint32(0, 0x06054b50, true);
  view.setUint16(4, 0, true);
  view.setUint16(6, 0, true);
  view.setUint16(8, fileCount, true);
  view.setUint16(10, fileCount, true);
  view.setUint32(12, centralSize, true);
  view.setUint32(16, centralOffset, true);
  view.setUint16(20, 0, true);
  return record;
}

function bytesFromDataUrl(dataUrl) {
  const [, payload = ""] = dataUrl.split(",", 2);
  const binary = atob(payload);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function encodeText(value) {
  return new TextEncoder().encode(value);
}

function sanitizeZipPath(path) {
  return String(path)
    .replaceAll("\\", "/")
    .replace(/^\/+/, "")
    .replaceAll("../", "")
    .replaceAll("..", "")
    .replace(/[<>:"|?*]/g, "_");
}

function crc32(bytes) {
  let crc = 0xffffffff;
  for (let index = 0; index < bytes.length; index += 1) {
    crc ^= bytes[index];
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function formatNumber(value) {
  return new Intl.NumberFormat("fr-FR").format(value);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function delay(duration) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });
}

function isKnownEffect(effect) {
  return getEffectOptions().some((option) => option.value === effect);
}

function labelForEffect(effect) {
  const labels = {
    fade: "Fondu net",
    "fade-up": "Fondu depuis le bas",
    "fade-down": "Fondu depuis le haut",
    "fade-left": "Fondu depuis la gauche",
    "fade-right": "Fondu depuis la droite",
    zoom: "Zoom doux",
    pop: "Pop subtil",
    "mist-left": "Brume laterale gauche",
    "mist-right": "Brume laterale droite",
    "mist-up": "Brume montante",
    "drift-left": "Glissement feutre gauche",
    "drift-right": "Glissement feutre droite",
  };
  return labels[effect] ?? effect;
}

function getEffectOptions() {
  return [
    { value: "fade", label: "Fondu net" },
    { value: "fade-up", label: "Fondu depuis le bas" },
    { value: "fade-down", label: "Fondu depuis le haut" },
    { value: "fade-left", label: "Fondu depuis la gauche" },
    { value: "fade-right", label: "Fondu depuis la droite" },
    { value: "zoom", label: "Zoom doux" },
    { value: "pop", label: "Pop subtil" },
    { value: "mist-left", label: "Brume laterale gauche" },
    { value: "mist-right", label: "Brume laterale droite" },
    { value: "mist-up", label: "Brume montante" },
    { value: "drift-left", label: "Glissement feutre gauche" },
    { value: "drift-right", label: "Glissement feutre droite" },
  ];
}

function getZonesForStep(step) {
  return getEnabledZonesSorted().filter((zone) => zone.animation.step === step);
}

function inferStepStagger(zones) {
  if (zones.length < 2) {
    return 0;
  }
  return Math.max(0, zones[1].animation.delay - zones[0].animation.delay);
}

function getEffectDefaults(effect) {
  const defaults = {
    fade: { offsetX: 0, offsetY: 0, scaleFrom: 1, rotateFrom: 0 },
    "fade-up": { offsetX: 0, offsetY: 24, scaleFrom: 0.98, rotateFrom: 0 },
    "fade-down": { offsetX: 0, offsetY: -24, scaleFrom: 0.98, rotateFrom: 0 },
    "fade-left": { offsetX: -48, offsetY: 0, scaleFrom: 1, rotateFrom: 0 },
    "fade-right": { offsetX: 48, offsetY: 0, scaleFrom: 1, rotateFrom: 0 },
    zoom: { offsetX: 0, offsetY: 0, scaleFrom: 0.9, rotateFrom: 0 },
    pop: { offsetX: 0, offsetY: 0, scaleFrom: 0.86, rotateFrom: -6 },
    "mist-left": { offsetX: -80, offsetY: 10, scaleFrom: 1.03, rotateFrom: 0 },
    "mist-right": { offsetX: 80, offsetY: 10, scaleFrom: 1.03, rotateFrom: 0 },
    "mist-up": { offsetX: 0, offsetY: 54, scaleFrom: 1.03, rotateFrom: 0 },
    "drift-left": { offsetX: -56, offsetY: 8, scaleFrom: 1, rotateFrom: -2 },
    "drift-right": { offsetX: 56, offsetY: 8, scaleFrom: 1, rotateFrom: 2 },
  };
  return defaults[effect] ?? { offsetX: null, offsetY: null, scaleFrom: null, rotateFrom: null };
}

function labelForStartTrigger(trigger) {
  const labels = {
    slide: "au changement de slide",
    click: "au clic",
    key: "a la touche",
  };
  return labels[trigger] ?? trigger;
}

function labelForStepMode(mode) {
  const labels = {
    all: "tout d'un coup",
    auto: "automatique",
    click: "clic par etape",
    key: "touche par etape",
  };
  return labels[mode] ?? mode;
}

function labelForPresentationPreset(mode) {
  const labels = {
    cascade: "Cascade",
    organic: "Organique",
    floral: "Floral",
    constellation: "Constellation",
  };
  return labels[mode] ?? mode;
}

function makeId(index) {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `zone-${Date.now()}-${index}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
