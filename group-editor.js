function createMiniField(labelText, value, onChange, type = "text", attributes = {}) {
  const wrapper = document.createElement("div");
  wrapper.className = "mini-field";

  const label = document.createElement("label");
  label.textContent = labelText;

  const input = document.createElement("input");
  input.type = type;
  input.value = value;
  Object.entries(attributes).forEach(([name, attributeValue]) => {
    input.setAttribute(name, String(attributeValue));
  });
  input.addEventListener("change", () => {
    checkpointUndo("reglage de groupe");
    onChange(input.value);
  });

  wrapper.append(label, input);
  return wrapper;
}

function getGroupsByKind(kind) {
  return state.groups.filter((group) => group.kind === kind);
}

function getGroupKindLabel(kind) {
  if (kind === "focus") {
    return "focus";
  }
  if (kind === "recap") {
    return "recap";
  }
  return "apparition";
}

function getGroupZoneCountText(group) {
  return `${group.zoneIds.length} zone(s)`;
}

function getZoneShortLabel(zone) {
  return `Zone ${(zone.animation.order ?? state.zones.indexOf(zone)) + 1}`;
}

function renderGroupsPanel() {
  renderTimingGroupsPanel();
  renderFocusGroupsPanel();
  renderRecapGroupsPanel();
}

function renderTimingGroupsPanel() {
  timingGroupsList.innerHTML = "";

  const timingGroups = getGroupsByKind("timing");
  if (!timingGroups.length) {
    const emptyState = document.createElement("article");
    emptyState.className = "empty-state";
    emptyState.textContent = "Selectionne plusieurs zones puis cree un groupe d'apparition.";
    timingGroupsList.append(emptyState);
    return;
  }

  const fragment = document.createDocumentFragment();
  timingGroups.forEach((group) => {
    const isFocused = group.zoneIds.some((zoneId) => {
      const zone = state.zones.find((item) => item.id === zoneId);
      return zone ? Boolean(getEffectiveFocusGroupId(zone)) : false;
    });
    const card = document.createElement("article");
    card.className = "group-card";
    if (state.selectedGroupId === group.id) {
      card.classList.add("selected");
    }

    const topline = document.createElement("div");
    topline.className = "group-topline";

    const titleWrap = document.createElement("div");
    const title = document.createElement("h3");
    title.className = "group-name";
    title.textContent = group.name;
    const meta = document.createElement("p");
    meta.className = "group-meta";
    meta.textContent = isFocused
      ? `${getGroupZoneCountText(group)} • etape ${group.step} • focus simultane`
      : `${getGroupZoneCountText(group)} • etape ${group.step} • stagger ${group.stagger} ms`;
    titleWrap.append(title, meta);

    const removeButton = document.createElement("button");
    removeButton.className = "mini-btn";
    removeButton.textContent = "Supprimer";
    removeButton.addEventListener("click", () => deleteGroup(group.id));

    topline.append(titleWrap, removeButton);

    const controls = document.createElement("div");
    controls.className = "group-controls";

    const nameField = createMiniField("Nom", group.name, (value) => {
      group.name = value || group.name;
      renderGroupsPanel();
    });
    const stepField = createMiniField(
      "Etape",
      String(group.step),
      (value) => {
        group.step = Math.max(1, Number(value) || 1);
        syncTimingGroupStepToMembers(group);
        renderZones(state.zones);
        renderAnimationStage();
        updateInspector();
        renderGroupsPanel();
        updateAnimationControlsState();
      },
      "number"
    );
    const staggerField = createMiniField(
      "Stagger ms",
      String(group.stagger),
      (value) => {
        group.stagger = Math.max(0, Number(value) || 0);
        renderGroupsPanel();
      },
      "number"
    );
    const staggerInput = staggerField.querySelector("input");
    staggerInput.disabled = isFocused;
    staggerInput.title = isFocused ? "Le stagger est suspendu pendant le focus collectif." : "";

    controls.append(nameField, stepField, staggerField);

    const actions = document.createElement("div");
    actions.className = "group-actions";

    const addSelectedButton = document.createElement("button");
    addSelectedButton.className = "mini-btn";
    addSelectedButton.textContent = "Ajouter la selection";
    addSelectedButton.disabled = state.selectedZoneIds.length === 0;
    addSelectedButton.addEventListener("click", () => {
      assignSelectionToTimingGroup(group.id);
    });

    const selectGroupButton = document.createElement("button");
    selectGroupButton.className = "mini-btn";
    selectGroupButton.textContent = state.selectedGroupId === group.id ? "Groupe actif" : "Activer";
    selectGroupButton.addEventListener("click", () => {
      state.selectedGroupId = group.id;
      renderGroupsPanel();
    });

    const removeSelectedFromGroupButton = document.createElement("button");
    removeSelectedFromGroupButton.className = "mini-btn";
    removeSelectedFromGroupButton.textContent = "Retirer la selection";
    removeSelectedFromGroupButton.disabled = state.selectedZoneIds.length === 0;
    removeSelectedFromGroupButton.addEventListener("click", () => {
      removeSelectedZoneFromTimingGroup();
    });

    actions.append(addSelectedButton, removeSelectedFromGroupButton, selectGroupButton);

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
      label.addEventListener("click", () => selectZone(zone.id));

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
        checkpointUndo("effet de zone groupee");
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

  timingGroupsList.append(fragment);
}

function renderFocusGroupsPanel() {
  focusGroupsList.innerHTML = "";

  const focusGroups = getGroupsByKind("focus");
  if (!focusGroups.length) {
    const emptyState = document.createElement("article");
    emptyState.className = "empty-state";
    emptyState.textContent = "Selectionne une ou plusieurs zones.";
    focusGroupsList.append(emptyState);
    return;
  }

  const fragment = document.createDocumentFragment();
  focusGroups.forEach((group) => {
    group.presentation = sanitizeGroupPresentation(group.presentation);
    const card = document.createElement("article");
    card.className = "group-card";
    if (state.selectedFocusGroupId === group.id) {
      card.classList.add("selected");
    }

    const topline = document.createElement("div");
    topline.className = "group-topline";

    const titleWrap = document.createElement("div");
    const title = document.createElement("h3");
    title.className = "group-name";
    title.textContent = group.name;
    const meta = document.createElement("p");
    meta.className = "group-meta";
    meta.textContent = getGroupZoneCountText(group);
    titleWrap.append(title, meta);

    const removeButton = document.createElement("button");
    removeButton.className = "mini-btn";
    removeButton.textContent = "Supprimer";
    removeButton.addEventListener("click", () => deleteGroup(group.id));

    const topActions = document.createElement("div");
    topActions.className = "group-top-actions";
    const isExpanded = state.expandedFocusGroupIds.includes(group.id);

    const toggleDetailsButton = document.createElement("button");
    toggleDetailsButton.className = "mini-btn";
    toggleDetailsButton.textContent = isExpanded ? "Masquer" : "Reglages";
    toggleDetailsButton.setAttribute("aria-expanded", String(isExpanded));
    toggleDetailsButton.addEventListener("click", () => {
      if (state.expandedFocusGroupIds.includes(group.id)) {
        state.expandedFocusGroupIds = state.expandedFocusGroupIds.filter((id) => id !== group.id);
      } else {
        state.expandedFocusGroupIds = [...state.expandedFocusGroupIds, group.id];
      }
      renderGroupsPanel();
    });

    topActions.append(toggleDetailsButton, removeButton);
    topline.append(titleWrap, topActions);

    const focusCard = document.createElement("div");
    focusCard.className = "group-focus-card";
    focusCard.classList.toggle("collapsed", !isExpanded);

    const focusToggle = document.createElement("label");
    focusToggle.className = "toggle-line group-focus-toggle";
    const focusToggleLabel = document.createElement("span");
    focusToggleLabel.textContent = "Attenuation apres apparition";
    const focusToggleInput = document.createElement("input");
    focusToggleInput.type = "checkbox";
    focusToggleInput.checked = group.presentation.enabled;
    focusToggleInput.addEventListener("change", () => {
      checkpointUndo("reglage du focus");
      group.presentation.enabled = focusToggleInput.checked;
      renderGroupsPanel();
      renderAnimationStage();
    });
    focusToggle.append(focusToggleLabel, focusToggleInput);

    const focusControls = document.createElement("div");
    focusControls.className = "group-focus-controls";

    const settledOpacityField = createMiniField(
      "Opacite repos %",
      String(Math.round(group.presentation.settledOpacity * 100)),
      (value) => {
        const numeric = Number(value);
        group.presentation.presetKey = "custom";
        group.presentation.settledOpacity = clamp(
          Number.isFinite(numeric) ? numeric / 100 : group.presentation.settledOpacity,
          0.1,
          1
        );
        renderGroupsPanel();
        renderAnimationStage();
      },
      "number",
      { min: 10, max: 100, step: 1 }
    );
    const settledScaleField = createMiniField(
      "Echelle repos %",
      String(Math.round(group.presentation.settledScale * 100)),
      (value) => {
        const numeric = Number(value);
        group.presentation.presetKey = "custom";
        group.presentation.settledScale = clamp(
          Number.isFinite(numeric) ? numeric / 100 : group.presentation.settledScale,
          0.5,
          1
        );
        renderGroupsPanel();
        renderAnimationStage();
      },
      "number",
      { min: 50, max: 100, step: 1 }
    );
    const activeScaleField = createMiniField(
      "Echelle active %",
      String(Math.round(group.presentation.activeScale * 100)),
      (value) => {
        const numeric = Number(value);
        group.presentation.presetKey = "custom";
        group.presentation.activeScale = clamp(
          Number.isFinite(numeric) ? numeric / 100 : group.presentation.activeScale,
          1,
          1.4
        );
        renderGroupsPanel();
        renderAnimationStage();
      },
      "number",
      { min: 100, max: 140, step: 1 }
    );
    const settledOpacityStepField = createMiniField(
      "Attenuation step %",
      String(Math.round((group.presentation.settledOpacityStep ?? 0.06) * 100)),
      (value) => {
        const numeric = Number(value);
        group.presentation.presetKey = "custom";
        group.presentation.settledOpacityStep = clamp(
          Number.isFinite(numeric) ? numeric / 100 : group.presentation.settledOpacityStep,
          0,
          0.3
        );
        renderGroupsPanel();
        renderAnimationStage();
      },
      "number",
      { min: 0, max: 30, step: 1 }
    );
    const settledScaleStepField = createMiniField(
      "Echelle step %",
      String(Math.round((group.presentation.settledScaleStep ?? 0.02) * 100)),
      (value) => {
        const numeric = Number(value);
        group.presentation.presetKey = "custom";
        group.presentation.settledScaleStep = clamp(
          Number.isFinite(numeric) ? numeric / 100 : group.presentation.settledScaleStep,
          0,
          0.1
        );
        renderGroupsPanel();
        renderAnimationStage();
      },
      "number",
      { min: 0, max: 10, step: 1 }
    );
    const settledBlurStepField = createMiniField(
      "Flou step px",
      String(group.presentation.settledBlurStep ?? 1),
      (value) => {
        const numeric = Number(value);
        group.presentation.presetKey = "custom";
        group.presentation.settledBlurStep = clamp(
          Number.isFinite(numeric) ? numeric : group.presentation.settledBlurStep,
          0,
          5
        );
        renderGroupsPanel();
        renderAnimationStage();
      },
      "number",
      { min: 0, max: 5, step: 0.1 }
    );
    focusControls.append(
      settledOpacityField,
      settledScaleField,
      activeScaleField,
      settledOpacityStepField,
      settledScaleStepField,
      settledBlurStepField
    );
    focusCard.append(focusToggle, focusControls);

    const presetRow = document.createElement("div");
    presetRow.className = "group-focus-presets";
    ["discrete", "standard", "strong", "dense"].forEach((presetKey) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "group-focus-preset";
      button.textContent = getGroupFocusPresetLabel(presetKey);
      if (group.presentation.presetKey === presetKey) {
        button.classList.add("active");
      }
      button.addEventListener("click", () => {
        checkpointUndo("preset de focus");
        group.presentation = applyGroupFocusPreset(presetKey);
        renderGroupsPanel();
        renderAnimationStage();
      });
      presetRow.append(button);
    });
    focusCard.append(presetRow);

    const actions = document.createElement("div");
    actions.className = "group-actions";

    const addSelectedButton = document.createElement("button");
    addSelectedButton.className = "mini-btn";
    addSelectedButton.textContent = "Ajouter";
    addSelectedButton.disabled = state.selectedZoneIds.length === 0;
    addSelectedButton.addEventListener("click", () => {
      assignSelectionToFocusGroup(group.id);
    });

    const selectGroupButton = document.createElement("button");
    selectGroupButton.className = "mini-btn";
    selectGroupButton.textContent = state.selectedFocusGroupId === group.id ? "Focus actif" : "Activer";
    selectGroupButton.addEventListener("click", () => {
      state.selectedFocusGroupId = group.id;
      renderGroupsPanel();
    });

    const removeSelectedFromGroupButton = document.createElement("button");
    removeSelectedFromGroupButton.className = "mini-btn";
    removeSelectedFromGroupButton.textContent = "Retirer";
    removeSelectedFromGroupButton.disabled = state.selectedZoneIds.length === 0;
    removeSelectedFromGroupButton.addEventListener("click", () => {
      removeSelectedZoneFromFocusGroup();
    });

    actions.append(addSelectedButton, removeSelectedFromGroupButton, selectGroupButton);

    const members = document.createElement("div");
    members.className = "group-members";
    group.zoneIds.forEach((zoneId) => {
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
      label.textContent = getZoneShortLabel(zone);
      label.addEventListener("click", () => selectZone(zone.id));

      left.append(handle, label);

      const button = document.createElement("button");
      button.className = "mini-btn";
      button.textContent = "Retirer";
      button.addEventListener("click", () => {
        removeZoneFromGroup(zone.id, "focus");
      });

      row.append(left, button);
      members.append(row);
    });

    card.append(topline, focusCard, actions, members);
    fragment.append(card);
  });

  focusGroupsList.append(fragment);
}

function renderRecapGroupsPanel() {
  recapGroupsList.innerHTML = "";

  const recapGroups = getGroupsByKind("recap");
  if (!recapGroups.length) {
    const emptyState = document.createElement("article");
    emptyState.className = "empty-state";
    emptyState.textContent = "Selectionne 2 zones ou plus.";
    recapGroupsList.append(emptyState);
    return;
  }

  const fragment = document.createDocumentFragment();
  recapGroups.forEach((group) => {
    const card = document.createElement("article");
    card.className = "group-card";
    if (state.selectedRecapGroupId === group.id) {
      card.classList.add("selected");
    }

    const topline = document.createElement("div");
    topline.className = "group-topline";

    const titleWrap = document.createElement("div");
    const title = document.createElement("h3");
    title.className = "group-name";
    title.textContent = group.name;
    const meta = document.createElement("p");
    meta.className = "group-meta";
    meta.textContent = getGroupZoneCountText(group);
    titleWrap.append(title, meta);

    const removeButton = document.createElement("button");
    removeButton.className = "mini-btn";
    removeButton.textContent = "Supprimer";
    removeButton.addEventListener("click", () => deleteGroup(group.id));

    topline.append(titleWrap, removeButton);

    const controls = document.createElement("div");
    controls.className = "group-controls group-controls-single";
    const nameField = createMiniField("Nom", group.name, (value) => {
      group.name = value || group.name;
      renderGroupsPanel();
    });
    controls.append(nameField);

    const actions = document.createElement("div");
    actions.className = "group-actions";

    const addSelectedButton = document.createElement("button");
    addSelectedButton.className = "mini-btn";
    addSelectedButton.textContent = "Ajouter";
    addSelectedButton.disabled = state.selectedZoneIds.length === 0;
    addSelectedButton.addEventListener("click", () => {
      assignSelectionToRecapGroup(group.id);
    });

    const removeSelectedFromGroupButton = document.createElement("button");
    removeSelectedFromGroupButton.className = "mini-btn";
    removeSelectedFromGroupButton.textContent = "Retirer";
    removeSelectedFromGroupButton.disabled = state.selectedZoneIds.length === 0;
    removeSelectedFromGroupButton.addEventListener("click", () => {
      removeSelectedZoneFromRecapGroup();
    });

    const selectGroupButton = document.createElement("button");
    selectGroupButton.className = "mini-btn";
    selectGroupButton.textContent = state.selectedRecapGroupId === group.id ? "Recap actif" : "Activer";
    selectGroupButton.addEventListener("click", () => {
      state.selectedRecapGroupId = group.id;
      renderGroupsPanel();
    });

    actions.append(addSelectedButton, removeSelectedFromGroupButton, selectGroupButton);

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
      label.textContent = `${memberIndex + 1}. ${getZoneShortLabel(zone)}`;
      label.addEventListener("click", () => selectZone(zone.id));

      left.append(handle, label);

      const buttons = document.createElement("div");
      buttons.className = "member-buttons";

      const upButton = document.createElement("button");
      upButton.className = "mini-btn";
      upButton.textContent = "↑";
      upButton.disabled = memberIndex === 0;
      upButton.addEventListener("click", () => {
        reorderRecapGroupMember(group.id, memberIndex, -1);
      });

      const downButton = document.createElement("button");
      downButton.className = "mini-btn";
      downButton.textContent = "↓";
      downButton.disabled = memberIndex === group.zoneIds.length - 1;
      downButton.addEventListener("click", () => {
        reorderRecapGroupMember(group.id, memberIndex, 1);
      });

      buttons.append(upButton, downButton);
      row.append(left, buttons);
      members.append(row);
    });

    card.append(topline, controls, actions, members);
    fragment.append(card);
  });

  recapGroupsList.append(fragment);
}

function createNewTimingGroup() {
  const selectedZones = getSelectedZones();
  if (selectedZones.length < 2) {
    setAnimationStatus("Selectionne au moins 2 zones avec Ctrl pour creer un groupe d'apparition.");
    return;
  }
  checkpointUndo("creation d'un groupe d'apparition");

  const group = {
    id: makeId(state.groups.length + 1),
    kind: "timing",
    name: `Apparition ${getGroupsByKind("timing").length + 1}`,
    step: selectedZones[0]?.animation.step ?? 1,
    stagger: 80,
    zoneIds: [],
  };
  state.groups.push(group);
  state.selectedGroupId = group.id;
  assignSelectionToTimingGroup(group.id, false);
  renderGroupsPanel();
  updateAnimationControlsState();
}

function createNewFocusGroup() {
  const selectedZones = getSelectedZones();
  if (!selectedZones.length) {
    setAnimationStatus("Selectionne au moins une zone pour la mettre en focus.");
    return;
  }
  checkpointUndo("creation d'un groupe focus");

  const group = {
    id: makeId(state.groups.length + 1),
    kind: "focus",
    name: selectedZones.length === 1 ? `Focus zone ${selectedZones[0].animation.order + 1}` : `Focus ${getGroupsByKind("focus").length + 1}`,
    presentation: createDefaultGroupPresentation(),
    zoneIds: [],
  };
  state.groups.push(group);
  state.selectedFocusGroupId = group.id;
  assignSelectionToFocusGroup(group.id, false);
  renderGroupsPanel();
  updateAnimationControlsState();
}

function createNewRecapGroup() {
  const selectedZones = getSelectedZones();
  if (selectedZones.length < 2) {
    setAnimationStatus("Selectionne au moins 2 zones avec Ctrl pour creer un recap.");
    return;
  }
  checkpointUndo("creation d'un groupe recap");

  const group = {
    id: makeId(state.groups.length + 1),
    kind: "recap",
    name: `Recap ${getGroupsByKind("recap").length + 1}`,
    zoneIds: [],
  };
  state.groups.push(group);
  state.selectedRecapGroupId = group.id;
  assignSelectionToRecapGroup(group.id, false);
  renderGroupsPanel();
  updateAnimationControlsState();
}

function assignSelectionToTimingGroup(groupId, recordUndo = true) {
  const zones = getSelectedZones();
  const group = state.groups.find((item) => item.id === groupId && item.kind === "timing");
  if (!zones.length || !group) {
    return;
  }
  if (recordUndo) {
    checkpointUndo("ajout au groupe d'apparition");
  }

  zones.forEach((zone) => {
    removeZoneFromGroupsOfKind(zone.id, "timing", false, group.id);
    zone.animation.timingGroupId = group.id;
    zone.animation.groupId = group.id;
    zone.animation.step = group.step;
    if (!group.zoneIds.includes(zone.id)) {
      group.zoneIds.push(zone.id);
    }
  });

  renderZones(state.zones);
  renderAnimationStage();
  updateInspector();
  renderGroupsPanel();
  updateAnimationControlsState();
}

function assignSelectionToFocusGroup(groupId, recordUndo = true) {
  const zones = expandZonesToTimingGroups(getSelectedZones());
  const group = state.groups.find((item) => item.id === groupId && item.kind === "focus");
  if (!zones.length || !group) {
    return;
  }
  if (recordUndo) {
    checkpointUndo("ajout au groupe focus");
  }

  zones.forEach((zone) => {
    removeZoneFromGroupsOfKind(zone.id, "focus", false, group.id);
    zone.animation.revealAtEnd = false;
    zone.animation.focusGroupId = group.id;
    if (!group.zoneIds.includes(zone.id)) {
      group.zoneIds.push(zone.id);
    }
  });

  renderZones(state.zones);
  renderAnimationStage();
  updateInspector();
  renderGroupsPanel();
  updateAnimationControlsState();
}

function assignSelectionToRecapGroup(groupId, recordUndo = true) {
  const zones = getSelectedZones();
  const group = state.groups.find((item) => item.id === groupId && item.kind === "recap");
  if (!zones.length || !group) {
    return;
  }
  if (recordUndo) {
    checkpointUndo("ajout au groupe recap");
  }

  zones.forEach((zone) => {
    removeZoneFromGroupsOfKind(zone.id, "recap", false, group.id);
    zone.animation.recapGroupId = group.id;
    if (!group.zoneIds.includes(zone.id)) {
      group.zoneIds.push(zone.id);
    }
  });

  renderZones(state.zones);
  renderAnimationStage();
  updateInspector();
  renderGroupsPanel();
  updateAnimationControlsState();
}

function removeSelectedZoneFromTimingGroup() {
  const zones = getSelectedZones();
  if (!zones.length) {
    return;
  }
  checkpointUndo("retrait du groupe d'apparition");
  zones.forEach((zone, index) => {
    removeZoneFromGroupsOfKind(zone.id, "timing", index === zones.length - 1);
  });
}

function removeSelectedZoneFromFocusGroup() {
  const zones = expandZonesToTimingGroups(getSelectedZones());
  if (!zones.length) {
    return;
  }
  checkpointUndo("retrait du groupe focus");
  zones.forEach((zone, index) => {
    removeZoneFromGroupsOfKind(zone.id, "focus", index === zones.length - 1);
  });
}

function removeSelectedZoneFromRecapGroup() {
  const zones = getSelectedZones();
  if (!zones.length) {
    return;
  }
  checkpointUndo("retrait du groupe recap");
  zones.forEach((zone, index) => {
    removeZoneFromGroupsOfKind(zone.id, "recap", index === zones.length - 1);
  });
}

function removeZoneFromGroup(zoneId, kind) {
  checkpointUndo(`retrait du groupe ${getGroupKindLabel(kind)}`);
  if (kind === "focus") {
    const zone = state.zones.find((item) => item.id === zoneId);
    const zones = zone ? expandZonesToTimingGroups([zone]) : [];
    zones.forEach((item, index) => {
      removeZoneFromGroupsOfKind(item.id, kind, index === zones.length - 1);
    });
    return;
  }
  removeZoneFromGroupsOfKind(zoneId, kind, true);
}

function removeZoneFromGroupsOfKind(zoneId, kind, rerender, preservedGroupId = null) {
  state.groups.forEach((group) => {
    if (group.kind !== kind) {
      return;
    }
    group.zoneIds = group.zoneIds.filter((id) => id !== zoneId);
  });
  state.groups = state.groups.filter((group) => group.zoneIds.length > 0 || group.id === preservedGroupId);

  if (kind === "timing" && state.selectedGroupId && !state.groups.some((group) => group.id === state.selectedGroupId)) {
    state.selectedGroupId = getGroupsByKind("timing")[0]?.id ?? null;
  }
  if (kind === "focus" && state.selectedFocusGroupId && !state.groups.some((group) => group.id === state.selectedFocusGroupId)) {
    state.selectedFocusGroupId = getGroupsByKind("focus")[0]?.id ?? null;
  }
  if (kind === "recap" && state.selectedRecapGroupId && !state.groups.some((group) => group.id === state.selectedRecapGroupId)) {
    state.selectedRecapGroupId = getGroupsByKind("recap")[0]?.id ?? null;
  }

  const zone = state.zones.find((item) => item.id === zoneId);
  if (zone) {
    if (kind === "timing") {
      zone.animation.timingGroupId = null;
      zone.animation.groupId = null;
    } else if (kind === "focus") {
      zone.animation.focusGroupId = null;
    } else if (kind === "recap") {
      zone.animation.recapGroupId = null;
    }
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
  checkpointUndo(`suppression du groupe ${getGroupKindLabel(group.kind)}`);

  group.zoneIds.forEach((zoneId) => {
    const zone = state.zones.find((item) => item.id === zoneId);
    if (!zone) {
      return;
    }
    if (group.kind === "timing") {
      zone.animation.timingGroupId = null;
      zone.animation.groupId = null;
    } else if (group.kind === "focus") {
      zone.animation.focusGroupId = null;
    } else if (group.kind === "recap") {
      zone.animation.recapGroupId = null;
    }
  });

  state.groups = state.groups.filter((item) => item.id !== groupId);
  if (state.selectedGroupId === groupId) {
    state.selectedGroupId = getGroupsByKind("timing")[0]?.id ?? null;
  }
  if (state.selectedFocusGroupId === groupId) {
    state.selectedFocusGroupId = getGroupsByKind("focus")[0]?.id ?? null;
  }
  if (state.selectedRecapGroupId === groupId) {
    state.selectedRecapGroupId = getGroupsByKind("recap")[0]?.id ?? null;
  }
  state.expandedFocusGroupIds = (state.expandedFocusGroupIds ?? []).filter((id) => id !== groupId);

  renderZones(state.zones);
  renderAnimationStage();
  updateInspector();
  renderGroupsPanel();
  updateAnimationControlsState();
}

function reorderGroupMember(groupId, memberIndex, direction) {
  const group = state.groups.find((item) => item.id === groupId && item.kind === "timing");
  if (!group) {
    return;
  }
  checkpointUndo("ordre du groupe d'apparition");
  const nextIndex = memberIndex + direction;
  if (nextIndex < 0 || nextIndex >= group.zoneIds.length) {
    return;
  }
  const [zoneId] = group.zoneIds.splice(memberIndex, 1);
  group.zoneIds.splice(nextIndex, 0, zoneId);
  syncZoneOrderToTimingGroupMemberOrder(group);
  drawAnnotatedPreview();
  renderZones(state.zones);
  renderAnimationStage();
  renderZonesOrderPanel();
  renderGroupsPanel();
}

function reorderRecapGroupMember(groupId, memberIndex, direction) {
  const group = state.groups.find((item) => item.id === groupId && item.kind === "recap");
  if (!group) {
    return;
  }
  checkpointUndo("ordre du groupe recap");
  const nextIndex = memberIndex + direction;
  if (nextIndex < 0 || nextIndex >= group.zoneIds.length) {
    return;
  }
  const [zoneId] = group.zoneIds.splice(memberIndex, 1);
  group.zoneIds.splice(nextIndex, 0, zoneId);
  renderGroupsPanel();
}

function syncTimingGroupStepToMembers(group) {
  if (group.kind !== "timing") {
    return;
  }
  group.zoneIds.forEach((zoneId) => {
    const zone = state.zones.find((item) => item.id === zoneId);
    if (zone) {
      zone.animation.step = group.step;
    }
  });
}
