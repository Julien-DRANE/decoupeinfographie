# Graph Report - decoupezoneimage  (2026-06-23)

## Corpus Check
- 20 files · ~34,605 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 456 nodes · 963 edges · 29 communities (20 shown, 9 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 68 edges (avg confidence: 0.8)
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
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]

## God Nodes (most connected - your core abstractions)
1. `updateAnimationControlsState()` - 41 edges
2. `renderGroupsPanel()` - 32 edges
3. `updateInspector()` - 31 edges
4. `renderAnimationStage()` - 30 edges
5. `renderZones()` - 28 edges
6. `restoreProjectState()` - 22 edges
7. `drawAnnotatedPreview()` - 21 edges
8. `runDetection()` - 20 edges
9. `renderZonesOrderPanel()` - 17 edges
10. `setAnimationStatus()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `createNewFocusGroup()` --calls--> `setAnimationStatus()`  [INFERRED]
  group-editor.js → app.js
- `createNewRecapGroup()` --calls--> `setAnimationStatus()`  [INFERRED]
  group-editor.js → app.js
- `createNewTimingGroup()` --calls--> `setAnimationStatus()`  [INFERRED]
  group-editor.js → app.js
- `handlePreviewCanvasPointerUp()` --calls--> `renderGroupsPanel()`  [INFERRED]
  app.js → group-editor.js
- `createManualZone()` --calls--> `renderGroupsPanel()`  [INFERRED]
  app.js → group-editor.js

## Import Cycles
- None detected.

## Communities (29 total, 9 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.02
Nodes (109): addZoneModeButton, animationStage, animationStageViewport, animationStatusText, applyRectStyles(), applyStepSettingsButton, autoStepGapRange, autoStepGapValue (+101 more)

### Community 1 - "Community 1"
Cohesion: 0.17
Nodes (48): analyzeZoneSubdivision(), applyPresentationPreset(), applyRoundZoneTransparency(), applyStepSettings(), buildForegroundMask(), createManualZone(), createZoneAsset(), deleteSelectedZones() (+40 more)

### Community 2 - "Community 2"
Cohesion: 0.13
Nodes (16): applyEffectPreset(), applyEffectPresetValues(), applyPresentationMotionPreset(), getEffectDefaults(), getEffectOptions(), getZoneFocusGroupId(), getZonePlacement(), getZoneRecapGroupId() (+8 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (29): boxesAreNear(), bridgeBinaryGaps(), bridgeMask(), buildForegroundMask(), clamp(), closeSmallGaps(), combineBoxes(), countMaskPixels() (+21 more)

### Community 5 - "Community 5"
Cohesion: 0.16
Nodes (15): boxesAreNear(), bridgeBinaryGaps(), bridgeMask(), combineBoxes(), detectComponentZones(), detectLayoutZones(), detectVerticalSeparatorBoxes(), expandBandsToMidpoints() (+7 more)

### Community 6 - "Community 6"
Cohesion: 0.11
Nodes (18): Detection, Double analyse locale, Editeur d'animation, Effets actuellement disponibles, Export HTML, Groupes d'apparition, Limites actuelles, Liste des zones (+10 more)

### Community 7 - "Community 7"
Cohesion: 0.09
Nodes (31): applyDetectionSettings(), applyPreset(), clamp(), computeResizedBox(), cursorForPreviewHandle(), drawPreviewDeleteAction(), drawPreviewResizeHandles(), drawRoundedRect() (+23 more)

### Community 8 - "Community 8"
Cohesion: 0.11
Nodes (22): buildExportHtml(), buildExportRecapGroups(), buildProjectPayload(), buildStepSchedule(), buildZipBlob(), countEnabledZones(), createRuntimeController(), createZipEndRecord() (+14 more)

### Community 9 - "Community 9"
Cohesion: 0.25
Nodes (8): applyZonePreviewAppearance(), buildTransform(), getZoneVisualState(), hiddenBlur(), hiddenOffsetX(), hiddenOffsetY(), hiddenRotation(), hiddenScale()

### Community 10 - "Community 10"
Cohesion: 0.25
Nodes (7): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 11 - "Community 11"
Cohesion: 0.20
Nodes (11): chooseEvenlyDistributedSeparators(), colorDistance(), countMaskPixelsInBox(), detectVerticalSeparators(), enrichZoneGeometry(), inferZoneShape(), luminance(), readPixel() (+3 more)

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
Cohesion: 0.23
Nodes (10): buildTransform(), getZoneVisualState(), hiddenBlur(), hiddenOffsetX(), hiddenOffsetY(), hiddenRotation(), hiddenScale(), AnimationCore (+2 more)

### Community 24 - "Community 24"
Cohesion: 0.22
Nodes (8): description, devDependencies, name, private, scripts, check, test, version

### Community 25 - "Community 25"
Cohesion: 0.16
Nodes (24): getSelectedZones(), makeId(), removeZoneFromAnyGroup(), toggleZoneFocusMode(), assignSelectionToFocusGroup(), assignSelectionToRecapGroup(), assignSelectionToTimingGroup(), createNewFocusGroup() (+16 more)

## Knowledge Gaps
- **166 isolated node(s):** `PreToolUse`, `FORMATS`, `presets`, `state`, `imageInput` (+161 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `renderGroupsPanel()` connect `Community 25` to `Community 1`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `getSelectedZones()` connect `Community 25` to `Community 0`, `Community 1`, `Community 7`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `sanitizeGroupPresentation()` connect `Community 7` to `Community 2`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `updateAnimationControlsState()` (e.g. with `assignSelectionToFocusGroup()` and `assignSelectionToRecapGroup()`) actually correct?**
  _`updateAnimationControlsState()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Are the 18 inferred relationships involving `renderGroupsPanel()` (e.g. with `applyPresentationPreset()` and `applyStepSettings()`) actually correct?**
  _`renderGroupsPanel()` has 18 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `updateInspector()` (e.g. with `assignSelectionToFocusGroup()` and `assignSelectionToRecapGroup()`) actually correct?**
  _`updateInspector()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **Are the 5 inferred relationships involving `renderAnimationStage()` (e.g. with `assignSelectionToFocusGroup()` and `assignSelectionToRecapGroup()`) actually correct?**
  _`renderAnimationStage()` has 5 INFERRED edges - model-reasoned connections that need verification._