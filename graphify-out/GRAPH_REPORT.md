# Graph Report - decoupezoneimage  (2026-06-22)

## Corpus Check
- 15 files · ~30,888 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 384 nodes · 835 edges · 24 communities (18 shown, 6 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 68 edges (avg confidence: 0.8)
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
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]

## God Nodes (most connected - your core abstractions)
1. `updateAnimationControlsState()` - 39 edges
2. `renderGroupsPanel()` - 32 edges
3. `updateInspector()` - 29 edges
4. `renderAnimationStage()` - 28 edges
5. `renderZones()` - 26 edges
6. `restoreProjectState()` - 22 edges
7. `drawAnnotatedPreview()` - 20 edges
8. `runDetection()` - 19 edges
9. `renderZonesOrderPanel()` - 16 edges
10. `clamp()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `handlePreviewCanvasPointerUp()` --calls--> `renderGroupsPanel()`  [INFERRED]
  app.js → group-editor.js
- `createManualZone()` --calls--> `renderGroupsPanel()`  [INFERRED]
  app.js → group-editor.js
- `duplicateSelectedZone()` --calls--> `renderGroupsPanel()`  [INFERRED]
  app.js → group-editor.js
- `deleteSelectedZones()` --calls--> `renderGroupsPanel()`  [INFERRED]
  app.js → group-editor.js
- `runDetection()` --calls--> `renderGroupsPanel()`  [INFERRED]
  app.js → group-editor.js

## Import Cycles
- None detected.

## Communities (24 total, 6 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.02
Nodes (94): addZoneModeButton, animationStage, animationStageViewport, animationStatusText, applyStepSettingsButton, autoStepGapRange, autoStepGapValue, controlsPanel (+86 more)

### Community 1 - "Community 1"
Cohesion: 0.12
Nodes (56): applyPresentationPreset(), applyRectStyles(), applyStepSettings(), createManualZone(), createSubdivisionParentSnapshot(), createZoneAsset(), deleteSelectedZones(), drawAnnotatedPreview() (+48 more)

### Community 2 - "Community 2"
Cohesion: 0.18
Nodes (10): getFocusAppearanceForDepth(), getZoneFocusGroupId(), normalizeProjectGroups(), resolveZoneAnimationForExport(), resolveZoneFocusPresentation(), serializeGroupForProject(), applyGroupFocusPreset(), GROUP_FOCUS_DEFAULTS (+2 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 4 - "Community 4"
Cohesion: 0.15
Nodes (14): analyzeZoneSubdivision(), applyRoundZoneTransparency(), bridgeMask(), buildForegroundMask(), chooseBestSubdivision(), closeSmallGaps(), estimateBackgroundColor(), extractLocalMask() (+6 more)

### Community 5 - "Community 5"
Cohesion: 0.19
Nodes (13): boxesAreNear(), bridgeBinaryGaps(), combineBoxes(), detectComponentZones(), detectLayoutZones(), detectVerticalSeparatorBoxes(), expandBandsToMidpoints(), findBands() (+5 more)

### Community 6 - "Community 6"
Cohesion: 0.11
Nodes (18): Detection, Double analyse locale, Editeur d'animation, Effets actuellement disponibles, Export HTML, Groupes d'apparition, Limites actuelles, Liste des zones (+10 more)

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (33): applyDetectionSettings(), applyEffectPreset(), applyEffectPresetValues(), applyPresentationMotionPreset(), applyPreset(), clamp(), computeResizedBox(), cursorForPreviewHandle() (+25 more)

### Community 8 - "Community 8"
Cohesion: 0.13
Nodes (17): buildExportHtml(), buildExportRecapGroups(), buildProjectPayload(), buildStepSchedule(), countEnabledZones(), createRuntimeController(), escapeHtml(), exportOverlayHtml() (+9 more)

### Community 9 - "Community 9"
Cohesion: 0.25
Nodes (8): applyZonePreviewAppearance(), buildTransform(), getZoneVisualState(), hiddenBlur(), hiddenOffsetX(), hiddenOffsetY(), hiddenRotation(), hiddenScale()

### Community 10 - "Community 10"
Cohesion: 0.25
Nodes (7): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 11 - "Community 11"
Cohesion: 0.22
Nodes (10): chooseEvenlyDistributedSeparators(), colorDistance(), countMaskPixelsInBox(), detectVerticalSeparators(), enrichZoneGeometry(), inferZoneShape(), luminance(), sampleMaskDensity() (+2 more)

### Community 12 - "Community 12"
Cohesion: 0.50
Nodes (4): clearZoneOrderDropIndicator(), handleZoneOrderListDrop(), resetZoneOrderDragState(), updateZoneOrderDropIndicator()

### Community 13 - "Community 13"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 14 - "Community 14"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 15 - "Community 15"
Cohesion: 0.50
Nodes (3): For /graphify explain, For /graphify path, graphify reference: query, path, explain

### Community 16 - "Community 16"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 23 - "Community 23"
Cohesion: 0.16
Nodes (24): getSelectedZones(), makeId(), removeZoneFromAnyGroup(), setAnimationStatus(), toggleZoneFocusMode(), assignSelectionToRecapGroup(), assignSelectionToTimingGroup(), createNewFocusGroup() (+16 more)

## Knowledge Gaps
- **150 isolated node(s):** `PreToolUse`, `FORMATS`, `presets`, `state`, `imageInput` (+145 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `renderGroupsPanel()` connect `Community 23` to `Community 1`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `getSelectedZones()` connect `Community 23` to `Community 0`, `Community 1`, `Community 7`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `sanitizeGroupPresentation()` connect `Community 2` to `Community 7`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `updateAnimationControlsState()` (e.g. with `assignSelectionToFocusGroup()` and `assignSelectionToRecapGroup()`) actually correct?**
  _`updateAnimationControlsState()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Are the 18 inferred relationships involving `renderGroupsPanel()` (e.g. with `applyPresentationPreset()` and `applyStepSettings()`) actually correct?**
  _`renderGroupsPanel()` has 18 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `updateInspector()` (e.g. with `assignSelectionToFocusGroup()` and `assignSelectionToRecapGroup()`) actually correct?**
  _`updateInspector()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `renderAnimationStage()` (e.g. with `assignSelectionToFocusGroup()` and `assignSelectionToRecapGroup()`) actually correct?**
  _`renderAnimationStage()` has 5 INFERRED edges - model-reasoned connections that need verification._