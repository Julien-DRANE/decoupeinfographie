# Graph Report - decoupeinfographie-main  (2026-07-16)

## Corpus Check
- 10 files · ~28,869 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 417 nodes · 1030 edges · 20 communities (18 shown, 2 thin omitted)
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
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 23|Community 23]]
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
- `createNewFocusGroup()` --calls--> `setAnimationStatus()`  [INFERRED]
  group-editor.js → app.js
- `createNewRecapGroup()` --calls--> `setAnimationStatus()`  [INFERRED]
  group-editor.js → app.js
- `createNewTimingGroup()` --calls--> `setAnimationStatus()`  [INFERRED]
  group-editor.js → app.js

## Import Cycles
- None detected.

## Communities (20 total, 2 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.02
Nodes (107): addZoneModeButton, animationStage, animationStageViewport, animationStatusText, applyRectStyles(), applyStepSettingsButton, autoStepGapRange, autoStepGapValue (+99 more)

### Community 1 - "Community 1"
Cohesion: 0.21
Nodes (44): applyPresentationPreset(), applyStepSettings(), createManualZone(), createZoneAsset(), deleteSelectedZones(), drawAnnotatedPreview(), duplicateSelectedZone(), getGroupsByKind() (+36 more)

### Community 2 - "Community 2"
Cohesion: 0.16
Nodes (15): applyDetectionSettings(), applyPreset(), clearUndoHistory(), cloneZonesForUndo(), createUndoSnapshot(), formatNumber(), getUndoSnapshotSignature(), serializeZoneForProject() (+7 more)

### Community 3 - "Community 3"
Cohesion: 0.40
Nodes (5): applyEffectPreset(), applyEffectPresetValues(), applyPresentationMotionPreset(), getEffectDefaults(), getZonePlacement()

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (29): boxesAreNear(), bridgeBinaryGaps(), bridgeMask(), buildForegroundMask(), clamp(), closeSmallGaps(), combineBoxes(), countMaskPixels() (+21 more)

### Community 5 - "Community 5"
Cohesion: 0.14
Nodes (18): analyzeZoneSubdivision(), boxesAreNear(), bridgeBinaryGaps(), bridgeMask(), chooseBestSubdivision(), combineBoxes(), detectComponentZones(), detectLayoutZones() (+10 more)

### Community 6 - "Community 6"
Cohesion: 0.11
Nodes (18): Detection, Double analyse locale, Editeur d'animation, Effets actuellement disponibles, Export HTML, Groupes d'apparition, Limites actuelles, Liste des zones (+10 more)

### Community 7 - "Community 7"
Cohesion: 0.11
Nodes (25): clamp(), computeResizedBox(), cursorForPreviewHandle(), drawPreviewDeleteAction(), drawRoundedRect(), findZoneAtCanvasPoint(), getCanvasPoint(), getFocusAppearanceForDepth() (+17 more)

### Community 8 - "Community 8"
Cohesion: 0.11
Nodes (22): buildExportHtml(), buildExportRecapGroups(), buildProjectPayload(), buildStepSchedule(), buildZipBlob(), countEnabledZones(), createRuntimeController(), createZipEndRecord() (+14 more)

### Community 9 - "Community 9"
Cohesion: 0.25
Nodes (8): applyZonePreviewAppearance(), buildTransform(), getZoneVisualState(), hiddenBlur(), hiddenOffsetX(), hiddenOffsetY(), hiddenRotation(), hiddenScale()

### Community 10 - "Community 10"
Cohesion: 0.20
Nodes (11): applyRoundZoneTransparency(), buildForegroundMask(), closeSmallGaps(), enrichLocalZoneGeometry(), enrichZoneGeometry(), estimateBackgroundColor(), extractLocalMask(), median() (+3 more)

### Community 11 - "Community 11"
Cohesion: 0.22
Nodes (10): chooseEvenlyDistributedSeparators(), colorDistance(), countMaskPixelsInBox(), detectVerticalSeparatorBoxes(), detectVerticalSeparators(), inferZoneShape(), luminance(), sampleMaskDensity() (+2 more)

### Community 12 - "Community 12"
Cohesion: 0.50
Nodes (4): clearZoneOrderDropIndicator(), handleZoneOrderListDrop(), resetZoneOrderDragState(), updateZoneOrderDropIndicator()

### Community 13 - "Community 13"
Cohesion: 0.21
Nodes (13): getEffectiveFocusGroupId(), getEffectOptions(), getTimingGroupForZone(), getZoneFocusGroupId(), getZoneRecapGroupId(), getZoneRevealAtEnd(), getZoneTimingGroupId(), isKnownEffect() (+5 more)

### Community 14 - "Community 14"
Cohesion: 0.22
Nodes (8): description, devDependencies, name, private, scripts, check, test, version

### Community 15 - "Community 15"
Cohesion: 0.67
Nodes (3): drawPreviewResizeHandles(), getPreviewHandleRects(), getPreviewInteractionSize()

### Community 23 - "Community 23"
Cohesion: 0.17
Nodes (12): buildTransform(), getGroupFocusLayout(), getQualityLimitedScale(), getZoneVisualState(), hiddenBlur(), hiddenOffsetX(), hiddenOffsetY(), hiddenRotation() (+4 more)

### Community 25 - "Community 25"
Cohesion: 0.19
Nodes (26): checkpointUndo(), expandZonesToTimingGroups(), getSelectedZones(), makeId(), removeZoneFromAnyGroup(), toggleZoneFocusMode(), assignSelectionToFocusGroup(), assignSelectionToRecapGroup() (+18 more)

## Knowledge Gaps
- **131 isolated node(s):** `FORMATS`, `presets`, `state`, `imageInput`, `projectInput` (+126 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `checkpointUndo()` connect `Community 25` to `Community 0`, `Community 1`, `Community 2`, `Community 13`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `renderGroupsPanel()` connect `Community 25` to `Community 1`, `Community 2`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `sanitizeGroupPresentation()` connect `Community 7` to `Community 13`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `updateAnimationControlsState()` (e.g. with `assignSelectionToFocusGroup()` and `assignSelectionToRecapGroup()`) actually correct?**
  _`updateAnimationControlsState()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Are the 13 inferred relationships involving `checkpointUndo()` (e.g. with `assignSelectionToFocusGroup()` and `assignSelectionToRecapGroup()`) actually correct?**
  _`checkpointUndo()` has 13 INFERRED edges - model-reasoned connections that need verification._
- **Are the 20 inferred relationships involving `renderGroupsPanel()` (e.g. with `applyPresentationPreset()` and `applyStepSettings()`) actually correct?**
  _`renderGroupsPanel()` has 20 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `renderAnimationStage()` (e.g. with `assignSelectionToFocusGroup()` and `assignSelectionToRecapGroup()`) actually correct?**
  _`renderAnimationStage()` has 6 INFERRED edges - model-reasoned connections that need verification._