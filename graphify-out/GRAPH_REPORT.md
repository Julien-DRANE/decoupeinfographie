# Graph Report - decoupeinfographie-main  (2026-06-30)

## Corpus Check
- 10 files · ~28,549 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 416 nodes · 1028 edges · 18 communities (16 shown, 2 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 92 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]

## God Nodes (most connected - your core abstractions)
1. `updateAnimationControlsState()` - 43 edges
2. `checkpointUndo()` - 36 edges
3. `renderGroupsPanel()` - 34 edges
4. `renderAnimationStage()` - 33 edges
5. `updateInspector()` - 33 edges
6. `renderZones()` - 31 edges
7. `drawAnnotatedPreview()` - 24 edges
8. `restoreProjectState()` - 22 edges
9. `undoLastAction()` - 21 edges
10. `runDetection()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `reorderGroupMember()` --calls--> `checkpointUndo()`  [INFERRED]
  group-editor.js → app.js
- `undoLastAction()` --calls--> `renderGroupsPanel()`  [INFERRED]
  app.js → group-editor.js
- `handlePreviewCanvasPointerUp()` --calls--> `renderGroupsPanel()`  [INFERRED]
  app.js → group-editor.js
- `createManualZone()` --calls--> `renderGroupsPanel()`  [INFERRED]
  app.js → group-editor.js
- `duplicateSelectedZone()` --calls--> `renderGroupsPanel()`  [INFERRED]
  app.js → group-editor.js

## Import Cycles
- None detected.

## Communities (18 total, 2 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.02
Nodes (100): addZoneModeButton, animationStage, animationStageViewport, animationStatusText, applyStepSettingsButton, autoStepGapRange, autoStepGapValue, controlsPanel (+92 more)

### Community 1 - "Community 1"
Cohesion: 0.13
Nodes (54): applyPresentationPreset(), applyRectStyles(), applyStepSettings(), createManualZone(), createSubdivisionParentSnapshot(), createZoneAsset(), deleteSelectedZones(), drawAnnotatedPreview() (+46 more)

### Community 2 - "Community 2"
Cohesion: 0.19
Nodes (15): applyDetectionSettings(), applyPreset(), clearUndoHistory(), cloneZonesForUndo(), createUndoSnapshot(), getUndoSnapshotSignature(), restoreProjectState(), sanitizeAnimationSettings() (+7 more)

### Community 3 - "Community 3"
Cohesion: 0.40
Nodes (5): applyEffectPreset(), applyEffectPresetValues(), applyPresentationMotionPreset(), getEffectDefaults(), getZonePlacement()

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (29): boxesAreNear(), bridgeBinaryGaps(), bridgeMask(), buildForegroundMask(), clamp(), closeSmallGaps(), combineBoxes(), countMaskPixels() (+21 more)

### Community 5 - "Community 5"
Cohesion: 0.12
Nodes (24): analyzeZoneSubdivision(), boxesAreNear(), bridgeBinaryGaps(), bridgeMask(), buildForegroundMask(), chooseBestSubdivision(), closeSmallGaps(), combineBoxes() (+16 more)

### Community 6 - "Community 6"
Cohesion: 0.11
Nodes (18): Detection, Double analyse locale, Editeur d'animation, Effets actuellement disponibles, Export HTML, Groupes d'apparition, Limites actuelles, Liste des zones (+10 more)

### Community 7 - "Community 7"
Cohesion: 0.07
Nodes (37): clamp(), computeResizedBox(), cursorForPreviewHandle(), drawPreviewDeleteAction(), drawPreviewResizeHandles(), drawRoundedRect(), findZoneAtCanvasPoint(), getCanvasPoint() (+29 more)

### Community 8 - "Community 8"
Cohesion: 0.12
Nodes (21): buildExportHtml(), buildExportRecapGroups(), buildProjectPayload(), buildStepSchedule(), buildZipBlob(), countEnabledZones(), createRuntimeController(), createZipEndRecord() (+13 more)

### Community 9 - "Community 9"
Cohesion: 0.25
Nodes (8): applyZonePreviewAppearance(), buildTransform(), getZoneVisualState(), hiddenBlur(), hiddenOffsetX(), hiddenOffsetY(), hiddenRotation(), hiddenScale()

### Community 10 - "Community 10"
Cohesion: 0.20
Nodes (10): applyRoundZoneTransparency(), colorDistance(), detectVerticalSeparators(), estimateBackgroundColor(), extractLocalMask(), luminance(), median(), readPixel() (+2 more)

### Community 11 - "Community 11"
Cohesion: 0.40
Nodes (6): chooseEvenlyDistributedSeparators(), countMaskPixelsInBox(), enrichZoneGeometry(), inferZoneShape(), sampleMaskDensity(), splitRegionIntoFixedColumns()

### Community 12 - "Community 12"
Cohesion: 0.50
Nodes (4): clearZoneOrderDropIndicator(), handleZoneOrderListDrop(), resetZoneOrderDragState(), updateZoneOrderDropIndicator()

### Community 23 - "Community 23"
Cohesion: 0.17
Nodes (10): buildTransform(), getZoneVisualState(), hiddenBlur(), hiddenOffsetX(), hiddenOffsetY(), hiddenRotation(), hiddenScale(), AnimationCore (+2 more)

### Community 24 - "Community 24"
Cohesion: 0.22
Nodes (8): description, devDependencies, name, private, scripts, check, test, version

### Community 25 - "Community 25"
Cohesion: 0.18
Nodes (27): checkpointUndo(), expandZonesToTimingGroups(), getSelectedZones(), makeId(), removeZoneFromAnyGroup(), setAnimationStatus(), toggleZoneFocusMode(), assignSelectionToFocusGroup() (+19 more)

## Knowledge Gaps
- **131 isolated node(s):** `FORMATS`, `presets`, `state`, `imageInput`, `projectInput` (+126 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `checkpointUndo()` connect `Community 25` to `Community 0`, `Community 1`, `Community 2`, `Community 5`, `Community 7`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `renderGroupsPanel()` connect `Community 25` to `Community 1`, `Community 2`, `Community 5`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `updateAnimationControlsState()` (e.g. with `assignSelectionToFocusGroup()` and `assignSelectionToRecapGroup()`) actually correct?**
  _`updateAnimationControlsState()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Are the 13 inferred relationships involving `checkpointUndo()` (e.g. with `assignSelectionToFocusGroup()` and `assignSelectionToRecapGroup()`) actually correct?**
  _`checkpointUndo()` has 13 INFERRED edges - model-reasoned connections that need verification._
- **Are the 20 inferred relationships involving `renderGroupsPanel()` (e.g. with `applyPresentationPreset()` and `applyStepSettings()`) actually correct?**
  _`renderGroupsPanel()` has 20 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `renderAnimationStage()` (e.g. with `assignSelectionToFocusGroup()` and `assignSelectionToRecapGroup()`) actually correct?**
  _`renderAnimationStage()` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `updateInspector()` (e.g. with `assignSelectionToFocusGroup()` and `assignSelectionToRecapGroup()`) actually correct?**
  _`updateInspector()` has 5 INFERRED edges - model-reasoned connections that need verification._