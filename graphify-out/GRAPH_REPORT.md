# Graph Report - decoupezoneimage  (2026-06-22)

## Corpus Check
- 15 files · ~29,307 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 372 nodes · 800 edges · 23 communities (17 shown, 6 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 57 edges (avg confidence: 0.8)
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

## God Nodes (most connected - your core abstractions)
1. `updateAnimationControlsState()` - 37 edges
2. `updateInspector()` - 28 edges
3. `renderGroupsPanel()` - 28 edges
4. `renderAnimationStage()` - 27 edges
5. `renderZones()` - 25 edges
6. `restoreProjectState()` - 22 edges
7. `drawAnnotatedPreview()` - 20 edges
8. `runDetection()` - 19 edges
9. `renderZonesOrderPanel()` - 16 edges
10. `clamp()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `toggleZoneFocusMode()` --calls--> `createDefaultGroupPresentation()`  [INFERRED]
  app.js → group-focus.js
- `removeSelectedZoneFromFocusGroup()` --calls--> `getSelectedZones()`  [INFERRED]
  group-editor.js → app.js
- `removeSelectedZoneFromTimingGroup()` --calls--> `getSelectedZones()`  [INFERRED]
  group-editor.js → app.js
- `sanitizeGroupPresentation()` --calls--> `clamp()`  [INFERRED]
  group-focus.js → app.js
- `createNewFocusGroup()` --calls--> `makeId()`  [INFERRED]
  group-editor.js → app.js

## Import Cycles
- None detected.

## Communities (23 total, 6 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.02
Nodes (101): addZoneModeButton, animationStage, animationStageViewport, animationStatusText, applyRectStyles(), applyStepSettingsButton, autoStepGapRange, autoStepGapValue (+93 more)

### Community 1 - "Community 1"
Cohesion: 0.14
Nodes (55): applyPresentationPreset(), applyStepSettings(), createManualZone(), deleteSelectedZones(), drawAnnotatedPreview(), duplicateSelectedZone(), getGroupsByKind(), getSelectedZone() (+47 more)

### Community 2 - "Community 2"
Cohesion: 0.12
Nodes (18): getEffectOptions(), getFocusAppearanceForDepth(), getZoneFocusGroupId(), getZoneTimingGroupId(), isKnownEffect(), makeId(), normalizeProjectGroups(), normalizeProjectZone() (+10 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (23): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+15 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (40): analyzeZoneSubdivision(), applyRoundZoneTransparency(), boxesAreNear(), bridgeBinaryGaps(), bridgeMask(), buildForegroundMask(), chooseBestSubdivision(), chooseEvenlyDistributedSeparators() (+32 more)

### Community 5 - "Community 5"
Cohesion: 0.25
Nodes (8): buildExportHtml(), buildProjectPayload(), escapeHtml(), exportOverlayHtml(), getSourceImageDataUrl(), labelForStartTrigger(), saveProjectAsJson(), triggerDownload()

### Community 6 - "Community 6"
Cohesion: 0.11
Nodes (18): Detection, Double analyse locale, Editeur d'animation, Effets actuellement disponibles, Export HTML, Groupes d'apparition, Limites actuelles, Liste des zones (+10 more)

### Community 7 - "Community 7"
Cohesion: 0.12
Nodes (24): applyDetectionSettings(), applyPreset(), clamp(), computeResizedBox(), cursorForPreviewHandle(), drawPreviewDeleteAction(), drawPreviewResizeHandles(), drawRoundedRect() (+16 more)

### Community 8 - "Community 8"
Cohesion: 0.28
Nodes (9): buildStepSchedule(), countEnabledZones(), createRuntimeController(), getContainRect(), getEnabledZonesSorted(), getExportPayload(), getResolvedEnabledStepCount(), resetPreviewPlayback() (+1 more)

### Community 9 - "Community 9"
Cohesion: 0.25
Nodes (8): applyZonePreviewAppearance(), buildTransform(), getZoneVisualState(), hiddenBlur(), hiddenOffsetX(), hiddenOffsetY(), hiddenRotation(), hiddenScale()

### Community 10 - "Community 10"
Cohesion: 0.25
Nodes (7): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 11 - "Community 11"
Cohesion: 0.40
Nodes (5): applyEffectPreset(), applyEffectPresetValues(), applyPresentationMotionPreset(), getEffectDefaults(), getZonePlacement()

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

## Knowledge Gaps
- **147 isolated node(s):** `PreToolUse`, `FORMATS`, `presets`, `state`, `imageInput` (+142 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `sanitizeGroupPresentation()` connect `Community 2` to `Community 7`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `toggleZoneFocusMode()` connect `Community 1` to `Community 0`, `Community 2`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `updateAnimationControlsState()` (e.g. with `assignSelectionToFocusGroup()` and `assignSelectionToTimingGroup()`) actually correct?**
  _`updateAnimationControlsState()` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `updateInspector()` (e.g. with `assignSelectionToFocusGroup()` and `assignSelectionToTimingGroup()`) actually correct?**
  _`updateInspector()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 18 inferred relationships involving `renderGroupsPanel()` (e.g. with `applyPresentationPreset()` and `applyStepSettings()`) actually correct?**
  _`renderGroupsPanel()` has 18 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `renderAnimationStage()` (e.g. with `assignSelectionToFocusGroup()` and `assignSelectionToTimingGroup()`) actually correct?**
  _`renderAnimationStage()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `renderZones()` (e.g. with `assignSelectionToFocusGroup()` and `assignSelectionToTimingGroup()`) actually correct?**
  _`renderZones()` has 4 INFERRED edges - model-reasoned connections that need verification._