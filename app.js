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
  detectionProfile: presets.balanced,
  selectedZoneId: null,
  selectedZoneIds: [],
  animationSettings: {
    format: "16-9",
    startTrigger: "slide",
    stepMode: "all",
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
};

const imageInput = document.querySelector("#imageInput");
const projectInput = document.querySelector("#projectInput");
const detectButton = document.querySelector("#detectButton");
const downloadAllButton = document.querySelector("#downloadAllButton");
const openProjectButton = document.querySelector("#openProjectButton");
const saveProjectButton = document.querySelector("#saveProjectButton");
const selectAllZonesButton = document.querySelector("#selectAllZonesButton");
const deselectAllZonesButton = document.querySelector("#deselectAllZonesButton");
const exportHtmlButton = document.querySelector("#exportHtmlButton");
const playPreviewButton = document.querySelector("#playPreviewButton");
const resetPreviewButton = document.querySelector("#resetPreviewButton");
const fullscreenPreviewButton = document.querySelector("#fullscreenPreviewButton");
const createGroupButton = document.querySelector("#createGroupButton");
const ungroupSelectedZoneButton = document.querySelector("#ungroupSelectedZoneButton");
const presetCascadeButton = document.querySelector("#presetCascadeButton");
const presetOrganicButton = document.querySelector("#presetOrganicButton");
const presetFloralButton = document.querySelector("#presetFloralButton");
const presetConstellationButton = document.querySelector("#presetConstellationButton");

const previewCanvas = document.querySelector("#previewCanvas");
const previewContext = previewCanvas.getContext("2d");
const zonesGrid = document.querySelector("#zonesGrid");
const groupsList = document.querySelector("#groupsList");
const zonesOrderList = document.querySelector("#zonesOrderList");
const controlsPanel = document.querySelector(".controls");
const animationStage = document.querySelector("#animationStage");
const animationStageViewport = document.querySelector("#animationStageViewport");

const statusText = document.querySelector("#statusText");
const summaryText = document.querySelector("#summaryText");
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
  state.animationSettings.format = formatSelect.value;
  updateFormatLabel();
  renderAnimationStage();
});

startTriggerSelect.addEventListener("change", () => {
  state.animationSettings.startTrigger = startTriggerSelect.value;
  updateAnimationControlsState();
});

stepModeSelect.addEventListener("change", () => {
  state.animationSettings.stepMode = stepModeSelect.value;
  updateAnimationControlsState();
});

guideToggle.addEventListener("change", () => {
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
    state.selectedZoneId = null;
    state.selectedZoneIds = [];

    drawSourceImage();
    renderZones([]);
    renderAnimationStage();
    updateInspector();
    updateStepEditorUI();
    renderGroupsPanel();
    renderZonesOrderPanel();

    detectButton.disabled = false;
    downloadAllButton.disabled = true;
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

selectAllZonesButton.addEventListener("click", () => {
  updateAllZonesEnabled(true);
});

deselectAllZonesButton.addEventListener("click", () => {
  updateAllZonesEnabled(false);
});

playPreviewButton.addEventListener("click", () => {
  startPreviewPlayback();
});

resetPreviewButton.addEventListener("click", () => {
  resetPreviewPlayback(true);
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

createGroupButton.addEventListener("click", () => {
  createNewGroup();
});

ungroupSelectedZoneButton.addEventListener("click", () => {
  removeSelectedZoneFromGroup();
});

animationStage.addEventListener("click", (event) => {
  const zoneElement = event.target.closest(".animation-zone");
  if (zoneElement) {
    selectZone(zoneElement.dataset.zoneId, event.ctrlKey || event.metaKey);
  }

  if (state.previewRuntime && state.previewRuntime.active) {
    state.previewRuntime.handleInteraction("click");
  }
});

window.addEventListener("keydown", (event) => {
  if (!state.previewRuntime || !state.previewRuntime.active) {
    return;
  }

  const target = event.target;
  if (
    target instanceof HTMLElement &&
    (target.tagName === "INPUT" || target.tagName === "SELECT" || target.tagName === "TEXTAREA")
  ) {
    return;
  }

  state.previewRuntime.handleInteraction("key");
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
  previewContext.save();
  previewContext.lineWidth = 3;
  previewContext.font = "600 18px 'Space Grotesk', sans-serif";
  previewContext.textBaseline = "top";

  state.zones.forEach((zone, index) => {
    previewContext.fillStyle = zone.animation.enabled
      ? "rgba(217, 93, 57, 0.18)"
      : "rgba(31, 27, 22, 0.1)";
    previewContext.strokeStyle = zone.animation.enabled
      ? "rgba(217, 93, 57, 0.95)"
      : "rgba(31, 27, 22, 0.35)";
    previewContext.fillRect(zone.x, zone.y, zone.width, zone.height);
    previewContext.strokeRect(zone.x, zone.y, zone.width, zone.height);

    const label = `${index + 1}`;
    previewContext.fillStyle = "rgba(31, 27, 22, 0.88)";
    previewContext.fillRect(zone.x + 8, zone.y + 8, 36, 30);
    previewContext.fillStyle = "#fff";
    previewContext.fillText(label, zone.x + 17, zone.y + 13);
  });

  previewContext.restore();
}

function runDetection() {
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
  const background = estimateBackgroundColor(data, width, height);
  const mask = buildForegroundMask(data, width, height, background, threshold);
  const boxes =
    profile.mode === "layout"
      ? detectLayoutZones(mask, width, height, {
          minArea,
          padding,
          mergeDistance,
          bridgeX: profile.bridgeX ?? 10,
          bridgeY: profile.bridgeY ?? 8,
          rowFillGap: profile.rowFillGap ?? 10,
          columnFillGap: profile.columnFillGap ?? 16,
        })
      : detectComponentZones(mask, width, height, { minArea, padding, mergeDistance });

  const filtered = suppressContainedBoxes(boxes);
  state.zones = filtered
    .sort((a, b) => {
      if (Math.abs(a.y - b.y) > 20) {
        return a.y - b.y;
      }
      return a.x - b.x;
    })
    .map((box, index) => createZoneAsset(box, index));

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

function createZoneAsset(box, index, animationOverride = null) {
  const cropCanvas = document.createElement("canvas");
  cropCanvas.width = box.width;
  cropCanvas.height = box.height;
  const cropContext = cropCanvas.getContext("2d");
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

  return {
    ...box,
    id: makeId(index),
    fileName: `${state.imageName}-zone-${String(index + 1).padStart(2, "0")}.png`,
    dataUrl: cropCanvas.toDataURL("image/png"),
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
        groupId: null,
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
  zones.forEach((zone, index) => {
    const card = zoneCardTemplate.content.firstElementChild.cloneNode(true);
    const preview = card.querySelector(".zone-preview");
    const toggle = card.querySelector(".zone-enabled-toggle");
    const title = card.querySelector(".zone-title");
    const dimensions = card.querySelector(".zone-dimensions");
    const position = card.querySelector(".zone-position");
    const step = card.querySelector(".zone-step");
    const editButton = card.querySelector(".zone-edit");
    const downloadButton = card.querySelector(".zone-download");

    if (state.selectedZoneIds.includes(zone.id)) {
      card.classList.add("selected");
    }

    preview.src = zone.dataUrl;
    preview.alt = `Zone ${index + 1}`;
    toggle.checked = zone.animation.enabled;
    title.textContent = `Zone ${index + 1}`;
    dimensions.textContent = `${zone.width} x ${zone.height} px`;
    position.textContent = `Origine: (${zone.x}, ${zone.y})`;
    step.textContent = zone.animation.enabled
      ? `Etape ${zone.animation.step} • ${labelForEffect(zone.animation.effect)}`
      : "Retiree de la slide";

    toggle.addEventListener("change", (event) => {
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

    fragment.append(card);
  });

  zonesGrid.append(fragment);
}

function renderAnimationStage() {
  resetPreviewPlayback(false);
  animationStage.innerHTML = "";

  const format = FORMATS[state.animationSettings.format];
  animationStage.style.aspectRatio = `${format.width} / ${format.height}`;

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

  if (state.animationSettings.showGuide) {
    const guide = document.createElement("img");
    guide.className = "animation-guide";
    guide.src = state.sourceImage.src;
    guide.alt = "";
    applyRectStyles(guide, fit, format);
    animationStage.append(guide);
  }

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
  selectedZoneMeta.textContent = `${zone.width} x ${zone.height} px • origine (${zone.x}, ${zone.y})`;
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
  saveProjectButton.disabled = !state.sourceImage;
  playPreviewButton.disabled = !hasEnabledZones;
  resetPreviewButton.disabled = !hasZones;
  exportHtmlButton.disabled = !hasEnabledZones;
  createGroupButton.disabled = !hasMultiSelection;
  ungroupSelectedZoneButton.disabled = !hasSelectedZone || getSelectedZones().every((zone) => !zone.animation.groupId);
  autoStepGapRange.disabled = state.animationSettings.stepMode !== "auto";
  applyStepSettingsButton.disabled = !hasEnabledZones || getZonesForStep(state.stepEditor.step).length === 0;
  splitZoneAutoButton.disabled = !hasSelectedZone;
  splitZoneVerticalButton.disabled = !hasSelectedZone;
  splitZoneHorizontalButton.disabled = !hasSelectedZone;
  splitZone2ColsButton.disabled = !hasSelectedZone;
  splitZone3ColsButton.disabled = !hasSelectedZone;
  splitZone4ColsButton.disabled = !hasSelectedZone;
  resetSubdivideButton.disabled = !selectedZone?.subdivisionParent;

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

function renderGroupsPanel() {
  groupsList.innerHTML = "";

  if (!state.groups.length) {
    const emptyState = document.createElement("article");
    emptyState.className = "empty-state";
    emptyState.textContent = "Selectionne plusieurs zones avec Ctrl puis clique sur Grouper la selection.";
    groupsList.append(emptyState);
    return;
  }

  const fragment = document.createDocumentFragment();

  state.groups.forEach((group, index) => {
    const card = document.createElement("article");
    card.className = "group-card";

    const topline = document.createElement("div");
    topline.className = "group-topline";

    const titleWrap = document.createElement("div");
    const title = document.createElement("h3");
    title.className = "group-name";
    title.textContent = group.name;
    const meta = document.createElement("p");
    meta.className = "group-meta";
    meta.textContent = `${group.zoneIds.length} zone(s) • etape ${group.step} • stagger ${group.stagger} ms`;
    titleWrap.append(title, meta);

    const removeButton = document.createElement("button");
    removeButton.className = "mini-btn";
    removeButton.textContent = "Supprimer";
    removeButton.addEventListener("click", () => {
      deleteGroup(group.id);
    });

    topline.append(titleWrap, removeButton);

    const controls = document.createElement("div");
    controls.className = "group-controls";

    const nameField = createMiniField("Nom", group.name, (value) => {
      group.name = value || group.name;
      renderGroupsPanel();
    });
    const stepField = createMiniField("Etape", String(group.step), (value) => {
      const step = Math.max(1, Number(value) || 1);
      group.step = step;
      syncGroupStepToMembers(group);
      renderZones(state.zones);
      renderAnimationStage();
      updateInspector();
      renderGroupsPanel();
      updateAnimationControlsState();
    }, "number");
    const staggerField = createMiniField("Stagger ms", String(group.stagger), (value) => {
      group.stagger = Math.max(0, Number(value) || 0);
      renderGroupsPanel();
    }, "number");
    controls.append(nameField, stepField, staggerField);

    const actions = document.createElement("div");
    actions.className = "group-actions";

    const addSelectedButton = document.createElement("button");
    addSelectedButton.className = "mini-btn";
    addSelectedButton.textContent = "Ajouter la selection";
    addSelectedButton.disabled = state.selectedZoneIds.length === 0;
    addSelectedButton.addEventListener("click", () => {
      assignSelectionToGroup(group.id);
    });

    const selectGroupButton = document.createElement("button");
    selectGroupButton.className = "mini-btn";
    selectGroupButton.textContent = state.selectedGroupId === group.id ? "Groupe actif" : "Activer";
    selectGroupButton.addEventListener("click", () => {
      state.selectedGroupId = group.id;
      renderGroupsPanel();
    });

    actions.append(addSelectedButton, selectGroupButton);

    const members = document.createElement("div");
    members.className = "group-members";

    group.zoneIds.forEach((zoneId, memberIndex) => {
      const zone = state.zones.find((item) => item.id === zoneId);
      if (!zone) {
        return;
      }

      const row = document.createElement("div");
      row.className = "group-member";

      const left = document.createElement("div");
      left.className = "member-left";

      const handle = document.createElement("span");
      handle.className = "member-handle";
      handle.textContent = ":::";

      const label = document.createElement("button");
      label.className = "mini-btn member-label";
      label.textContent = `${memberIndex + 1}. ${zone.fileName}`;
      label.addEventListener("click", () => {
        selectZone(zone.id);
      });

      left.append(handle, label);

      const effectSelect = document.createElement("select");
      effectSelect.className = "select-control member-effect-select";
      getEffectOptions().forEach((option) => {
        const element = document.createElement("option");
        element.value = option.value;
        element.textContent = option.label;
        if (zone.animation.effect === option.value) {
          element.selected = true;
        }
        effectSelect.append(element);
      });
      effectSelect.addEventListener("change", () => {
        zone.animation.effect = effectSelect.value;
        renderZones(state.zones);
        renderAnimationStage();
        updateInspector();
        renderGroupsPanel();
      });

      const buttons = document.createElement("div");
      buttons.className = "member-buttons";

      const upButton = document.createElement("button");
      upButton.className = "mini-btn";
      upButton.textContent = "↑";
      upButton.disabled = memberIndex === 0;
      upButton.addEventListener("click", () => {
        reorderGroupMember(group.id, memberIndex, -1);
      });

      const downButton = document.createElement("button");
      downButton.className = "mini-btn";
      downButton.textContent = "↓";
      downButton.disabled = memberIndex === group.zoneIds.length - 1;
      downButton.addEventListener("click", () => {
        reorderGroupMember(group.id, memberIndex, 1);
      });

      buttons.append(upButton, downButton);
      row.append(left, effectSelect, buttons);
      members.append(row);
    });

    card.append(topline, controls, actions, members);
    fragment.append(card);
  });

  groupsList.append(fragment);
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

    const main = document.createElement("div");
    main.className = "zone-order-main";

    const handle = document.createElement("span");
    handle.className = "member-handle";
    handle.textContent = ":::";

    const labelWrap = document.createElement("div");
    const button = document.createElement("button");
    button.className = "mini-btn member-label";
    button.textContent = `${index + 1}. ${zone.fileName}`;
    button.addEventListener("click", () => {
      selectZone(zone.id);
    });

    const meta = document.createElement("p");
    meta.className = "zone-order-meta";
    meta.textContent = `Etape ${zone.animation.step} • ${labelForEffect(zone.animation.effect)}`;

    labelWrap.append(button, meta);
    main.append(handle, labelWrap);

    const controls = document.createElement("div");
    controls.className = "member-buttons";

    const upButton = document.createElement("button");
    upButton.className = "mini-btn";
    upButton.textContent = "↑";
    upButton.disabled = index === 0;
    upButton.addEventListener("click", () => moveZoneOrder(zone.id, -1));

    const downButton = document.createElement("button");
    downButton.className = "mini-btn";
    downButton.textContent = "↓";
    downButton.disabled = index === state.zones.length - 1;
    downButton.addEventListener("click", () => moveZoneOrder(zone.id, 1));

    controls.append(upButton, downButton);
    row.append(main, controls);
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

  const [zone] = ordered.splice(index, 1);
  ordered.splice(nextIndex, 0, zone);
  ordered.forEach((item, position) => {
    item.animation.order = position;
  });

  renderZones(state.zones);
  renderAnimationStage();
  renderZonesOrderPanel();
  renderGroupsPanel();
  updateInspector();
}

function applyPresentationPreset(mode) {
  const orderedZones = getZonesInOrder().filter((zone) => zone.animation.enabled);
  if (!orderedZones.length) {
    return;
  }

  const format = FORMATS[state.animationSettings.format];
  const fit = state.sourceImage
    ? getContainRect(state.sourceImage.width, state.sourceImage.height, format.width, format.height)
    : { x: 0, y: 0, width: format.width, height: format.height };

  if (!state.groups.length) {
    orderedZones.forEach((zone, index) => {
      zone.animation.step = index + 1;
      zone.animation.groupId = null;
    });
  }

  const groups = state.groups.length
    ? [...state.groups]
    : orderedZones.map((zone, index) => ({
        id: `virtual-${zone.id}`,
        name: `Evenement ${index + 1}`,
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
      if (state.groups.length) {
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

function createMiniField(labelText, value, onChange, type = "text") {
  const wrapper = document.createElement("div");
  wrapper.className = "mini-field";
  const label = document.createElement("label");
  label.textContent = labelText;
  const input = document.createElement("input");
  input.type = type;
  input.value = value;
  input.addEventListener("change", () => onChange(input.value));
  wrapper.append(label, input);
  return wrapper;
}

function createNewGroup() {
  const selectedZones = getSelectedZones();
  if (selectedZones.length < 2) {
    setAnimationStatus("Selectionne au moins 2 zones avec Ctrl pour creer un evenement.");
    return;
  }
  const group = {
    id: makeId(state.groups.length + 1),
    name: `Evenement ${state.groups.length + 1}`,
    step: selectedZones[0]?.animation.step ?? 1,
    stagger: 80,
    zoneIds: [],
  };
  state.groups.push(group);
  state.selectedGroupId = group.id;
  assignSelectionToGroup(group.id);
  renderGroupsPanel();
  updateAnimationControlsState();
}

function assignSelectionToGroup(groupId) {
  const zones = getSelectedZones();
  const group = state.groups.find((item) => item.id === groupId);
  if (!zones.length || !group) {
    return;
  }

  zones.forEach((zone) => {
    removeZoneFromAnyGroup(zone.id, false);
    zone.animation.groupId = group.id;
    zone.animation.step = group.step;
    group.zoneIds.push(zone.id);
  });

  renderZones(state.zones);
  renderAnimationStage();
  updateInspector();
  renderGroupsPanel();
  updateAnimationControlsState();
}

function removeSelectedZoneFromGroup() {
  const zones = getSelectedZones();
  if (!zones.length) {
    return;
  }
  zones.forEach((zone, index) => {
    removeZoneFromAnyGroup(zone.id, index === zones.length - 1);
  });
}

function removeZoneFromAnyGroup(zoneId, rerender) {
  state.groups.forEach((group) => {
    group.zoneIds = group.zoneIds.filter((id) => id !== zoneId);
  });
  state.groups = state.groups.filter((group) => group.zoneIds.length > 0);
  const zone = state.zones.find((item) => item.id === zoneId);
  if (zone) {
    zone.animation.groupId = null;
  }

  if (rerender) {
    renderZones(state.zones);
    renderAnimationStage();
    updateInspector();
    renderGroupsPanel();
    updateAnimationControlsState();
  }
}

function deleteGroup(groupId) {
  const group = state.groups.find((item) => item.id === groupId);
  if (!group) {
    return;
  }
  group.zoneIds.forEach((zoneId) => {
    const zone = state.zones.find((item) => item.id === zoneId);
    if (zone) {
      zone.animation.groupId = null;
    }
  });
  state.groups = state.groups.filter((item) => item.id !== groupId);
  if (state.selectedGroupId === groupId) {
    state.selectedGroupId = state.groups[0]?.id ?? null;
  }
  renderZones(state.zones);
  renderAnimationStage();
  updateInspector();
  renderGroupsPanel();
  updateAnimationControlsState();
}

function reorderGroupMember(groupId, memberIndex, direction) {
  const group = state.groups.find((item) => item.id === groupId);
  if (!group) {
    return;
  }
  const nextIndex = memberIndex + direction;
  if (nextIndex < 0 || nextIndex >= group.zoneIds.length) {
    return;
  }
  const [zoneId] = group.zoneIds.splice(memberIndex, 1);
  group.zoneIds.splice(nextIndex, 0, zoneId);
  renderGroupsPanel();
}

function syncGroupStepToMembers(group) {
  group.zoneIds.forEach((zoneId) => {
    const zone = state.zones.find((item) => item.id === zoneId);
    if (zone) {
      zone.animation.step = group.step;
    }
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

  const replacementZones = subBoxes.map((box, index) => createZoneAsset(box, zoneIndex + index, zone.animation));
  const parentSnapshot = createSubdivisionParentSnapshot(zone, replacementZones.map((item) => item.id));
  replacementZones.forEach((item) => {
    item.subdivisionParent = { ...parentSnapshot };
  });

  if (zone.animation.groupId) {
    const group = state.groups.find((item) => item.id === zone.animation.groupId);
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
  restoredZone.subdivisionParent = parent.subdivisionParent ? { ...parent.subdivisionParent } : null;

  if (parent.animation.groupId) {
    const group = state.groups.find((item) => item.id === parent.animation.groupId);
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
  element.style.transitionDuration = `${zone.animation.duration}ms`;
  element.style.transitionDelay = "0ms";
  element.style.transitionTimingFunction = "cubic-bezier(0.22, 1, 0.36, 1)";
  element.style.transitionProperty = "opacity, transform, filter";
  element.classList.toggle("inactive", !zone.animation.enabled);
  element.classList.remove("preview-hidden");
}

function applyZonePreviewAppearance(element, zone, revealed) {
  const styles = getZoneVisualState(zone.animation, revealed);
  element.style.opacity = String(styles.opacity);
  element.style.transform = styles.transform;
  element.style.filter = styles.filter;
  element.style.transitionDuration = `${zone.animation.duration}ms`;
  element.style.transitionDelay = `${revealed ? zone.animation.delay : 0}ms`;
  element.style.transitionTimingFunction = "cubic-bezier(0.22, 1, 0.36, 1)";
  element.style.transitionProperty = "opacity, transform, filter";
  element.classList.toggle("inactive", !zone.animation.enabled);
  element.classList.toggle("preview-hidden", !revealed);
}

function getZoneVisualState(animation, revealed) {
  if (revealed) {
    return {
      opacity: 1,
      transform: "translate(0px, 0px) scale(1) rotate(0deg)",
      filter: "blur(0px)",
    };
  }

  const hiddenOpacity = 0;
  const hiddenTransform = buildTransform(
    hiddenOffsetX(animation.effect, animation.offsetX),
    hiddenOffsetY(animation.effect, animation.offsetY),
    hiddenScale(animation.effect, animation.scaleFrom),
    hiddenRotation(animation.effect, animation.rotateFrom)
  );
  const hiddenFilter = hiddenBlur(animation.effect);

  return {
    opacity: hiddenOpacity,
    transform: hiddenTransform,
    filter: `blur(${hiddenFilter}px)`,
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
  if (effect === "mist-left" || effect === "mist-right" || effect === "mist-up") {
    return Math.min(scaleFrom || 1.03, 1.05);
  }
  if (effect === "drift-left" || effect === "drift-right") {
    return Math.min(scaleFrom || 1, 1);
  }
  return scaleFrom;
}

function hiddenRotation(effect, rotateFrom) {
  if (effect === "pop") {
    return rotateFrom || -6;
  }
  if (effect === "drift-left") {
    return rotateFrom || -2;
  }
  if (effect === "drift-right") {
    return rotateFrom || 2;
  }
  return rotateFrom;
}

function hiddenBlur(effect) {
  if (effect === "mist-left" || effect === "mist-right" || effect === "mist-up") {
    return 14;
  }
  if (effect === "zoom") {
    return 4;
  }
  if (effect === "drift-left" || effect === "drift-right") {
    return 2;
  }
  return 0;
}

function buildTransform(x, y, scale, rotate) {
  return `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotate}deg)`;
}

function getExportPayload() {
  const format = FORMATS[state.animationSettings.format];
  const fit = state.sourceImage
    ? getContainRect(state.sourceImage.width, state.sourceImage.height, format.width, format.height)
    : { x: 0, y: 0, width: format.width, height: format.height };

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
    zones: getEnabledZonesSorted().map((zone) => ({
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
    })),
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
    zones: state.zones.map(serializeZoneForProject),
    groups: state.groups.map((group) => ({
      id: group.id,
      name: group.name,
      step: group.step,
      stagger: group.stagger,
      zoneIds: [...group.zoneIds],
    })),
  };
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
    ? project.groups
        .map((group, index) => normalizeProjectGroup(group, index, validZoneIds))
        .filter((group) => group.zoneIds.length > 0)
    : [];

  state.selectedGroupId =
    state.groups.find((group) => group.id === project.selectedGroupId)?.id ?? state.groups[0]?.id ?? null;
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
    subdivisionParent: zone?.subdivisionParent ? structuredCloneProjectData(zone.subdivisionParent) : null,
    subdivisionChildren: zone?.subdivisionChildren ? structuredCloneProjectData(zone.subdivisionChildren) : null,
    animation: {
      enabled: typeof animation.enabled === "boolean" ? animation.enabled : true,
      step: Math.max(1, Number(animation.step) || index + 1),
      order: Math.max(0, Number(animation.order) || index),
      effect,
      duration: clamp(Number(animation.duration) || 700, 100, 4000),
      delay: Math.max(0, Number(animation.delay) || 0),
      groupId: typeof animation.groupId === "string" && animation.groupId ? animation.groupId : null,
      offsetX: Number(animation.offsetX) || 0,
      offsetY: Number.isFinite(Number(animation.offsetY)) ? Number(animation.offsetY) : defaults.offsetY ?? 0,
      scaleFrom: clamp(Number(animation.scaleFrom) || 0.96, 0.2, 2),
      rotateFrom: Number(animation.rotateFrom) || 0,
    },
  };
}

function normalizeProjectGroup(group, index, validZoneIds) {
  return {
    id: typeof group?.id === "string" && group.id ? group.id : makeId(index + 1),
    name: group?.name || `Evenement ${index + 1}`,
    step: Math.max(1, Number(group?.step) || index + 1),
    stagger: Math.max(0, Number(group?.stagger) || 0),
    zoneIds: Array.isArray(group?.zoneIds) ? group.zoneIds.filter((id) => validZoneIds.has(id)) : [],
  };
}

function structuredCloneProjectData(value) {
  return JSON.parse(JSON.stringify(value));
}

function buildStepSchedule(items) {
  const steps = new Map();

  items.forEach((item) => {
    const animation = item.animation ?? item.data?.animation;
    if (!animation) {
      return;
    }

    const step = Math.max(1, Number(animation.step) || 1);
    const duration = Math.max(0, Number(animation.duration) || 0);
    const delay = Math.max(0, Number(animation.delay) || 0);
    const endTime = duration + delay;
    steps.set(step, Math.max(steps.get(step) ?? 0, endTime));
  });

  return [...steps.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([step, duration]) => ({ step, duration }));
}

function getResolvedEnabledStepCount() {
  return buildStepSchedule(getExportPayload().zones).length;
}

function resolveZoneAnimationForExport(zone) {
  const animation = { ...zone.animation };
  if (!animation.groupId) {
    return animation;
  }

  const group = state.groups.find((item) => item.id === animation.groupId);
  if (!group) {
    return animation;
  }

  const index = Math.max(0, group.zoneIds.indexOf(zone.id));
  animation.step = group.step;
  animation.delay = Math.max(0, animation.delay) + Math.max(0, group.stagger) * index;
  return animation;
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
      .anim-zone {
        position: absolute;
        display: block;
        transform-origin: center center;
        will-change: transform, opacity;
      }
    </style>
  </head>
  <body>
    <div class="overlay-root">
      <div id="stage" class="overlay-stage"></div>
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

      function reveal(zoneEntry) {
        zoneEntry.element.style.opacity = "1";
        zoneEntry.element.style.transform = "translate(0px, 0px) scale(1) rotate(0deg)";
        zoneEntry.element.style.filter = "blur(0px)";
      }

      zones.forEach(applyHidden);

      let started = false;
      const stepSchedule = buildStepSchedule(zones);
      let currentStepIndex = 0;
      let autoTimer = null;

      function buildStepSchedule(items) {
        const steps = new Map();

        items.forEach((item) => {
          const animation = item.data.animation;
          const step = Math.max(1, Number(animation.step) || 1);
          const duration = Math.max(0, Number(animation.duration) || 0);
          const delay = Math.max(0, Number(animation.delay) || 0);
          const endTime = duration + delay;
          steps.set(step, Math.max(steps.get(step) || 0, endTime));
        });

        return Array.from(steps.entries())
          .sort((a, b) => a[0] - b[0])
          .map(([step, duration]) => ({ step, duration }));
      }

      function revealStep(step) {
        zones
          .filter((zone) => zone.data.animation.step === step)
          .forEach(reveal);
      }

      function revealAll() {
        zones.forEach(reveal);
      }

      function advance() {
        if (currentStepIndex >= stepSchedule.length) {
          return;
        }

        const currentStep = stepSchedule[currentStepIndex];
        revealStep(currentStep.step);

        if (payload.settings.stepMode === "auto") {
          currentStepIndex += 1;
          if (currentStepIndex < stepSchedule.length) {
            const delay = currentStep.duration + Math.max(0, payload.settings.autoStepGap || 0);
            autoTimer = window.setTimeout(advance, delay);
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
        if (payload.settings.stepMode === "all") {
          revealAll();
          return;
        }
        advance();
      }

      function handleInteraction(kind) {
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

      stage.addEventListener("click", () => handleInteraction("click"));
      window.addEventListener("keydown", (event) => {
        const target = event.target;
        if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT")) {
          return;
        }
        handleInteraction("key");
      });

      if (payload.settings.startTrigger === "slide") {
        beginSequence();
      }

      window.addEventListener("beforeunload", () => {
        if (autoTimer) {
          clearTimeout(autoTimer);
        }
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

  let active = true;
  let started = false;
  const stepSchedule = buildStepSchedule(entries);
  let currentStepIndex = 0;
  let timer = null;

  entries.forEach((entry) => applyZonePreviewAppearance(entry.element, { animation: entry.data.animation }, false));

  function revealStep(step) {
    entries
      .filter((entry) => entry.data.animation.step === step)
      .forEach((entry) => {
        applyZonePreviewAppearance(entry.element, { animation: entry.data.animation }, true);
      });
  }

  function revealAll() {
    entries.forEach((entry) => {
      applyZonePreviewAppearance(entry.element, { animation: entry.data.animation }, true);
    });
  }

  function advance() {
    if (!active || currentStepIndex >= stepSchedule.length) {
      return;
    }

    const currentStep = stepSchedule[currentStepIndex];
    revealStep(currentStep.step);

    if (payload.settings.stepMode === "auto") {
      currentStepIndex += 1;
      if (currentStepIndex < stepSchedule.length) {
        const delay = currentStep.duration + Math.max(0, payload.settings.autoStepGap || 0);
        timer = window.setTimeout(advance, delay);
      } else if (options.onStatus) {
        options.onStatus("Apercu termine.");
      }
      return;
    }

    currentStepIndex += 1;
    if (currentStepIndex >= stepSchedule.length && options.onStatus) {
      options.onStatus("Apercu termine.");
    }
  }

  function beginSequence() {
    if (!active || started) {
      return;
    }
    started = true;
    if (options.onStatus) {
      options.onStatus("Animation lancee.");
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
          ? "Apercu arme. Clique dans la scene pour demarrer."
          : "Apercu arme. Presse une touche pour demarrer."
      );
    }
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
