(function initDetectionCore(globalScope) {
  "use strict";

  function detectZonesFromImageData(data, width, height, profile, controls) {
    const background = estimateBackgroundColor(data, width, height);
    const mask = buildForegroundMask(data, width, height, background, controls.threshold);
    const boxes =
      profile.mode === "layout"
        ? detectLayoutZones(mask, width, height, {
            minArea: controls.minArea,
            padding: controls.padding,
            mergeDistance: controls.mergeDistance,
            bridgeX: profile.bridgeX ?? 10,
            bridgeY: profile.bridgeY ?? 8,
            rowFillGap: profile.rowFillGap ?? 10,
            columnFillGap: profile.columnFillGap ?? 16,
          })
        : detectComponentZones(mask, width, height, controls);
    const filteredBoxes = suppressContainedBoxes(boxes).map((box) => enrichZoneGeometry(box, mask, width));
    const foregroundPixels = countMaskPixels(mask);

    return {
      background,
      mask,
      boxes,
      filteredBoxes,
      diagnostics: {
        mode: profile.mode === "layout" ? "layout" : "components",
        threshold: controls.threshold,
        minArea: controls.minArea,
        padding: controls.padding,
        mergeDistance: controls.mergeDistance,
        foregroundPixels,
        foregroundRatio: foregroundPixels / Math.max(1, width * height),
        candidateCount: boxes.length,
        keptCount: filteredBoxes.length,
      },
    };
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
        expandBandsToMidpoints(columnBands, width).forEach((columnBand) => {
          const area = countMaskPixelsInBox(
            bridgedMask,
            width,
            columnBand.start,
            rowBand.start,
            columnBand.end - columnBand.start + 1,
            rowBand.end - rowBand.start + 1
          );
          if (area >= options.minArea * 0.15) {
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
          }
        });
        return;
      }

      const bandArea = countMaskPixelsInBox(bridgedMask, width, 0, rowBand.start, width, rowBand.end - rowBand.start + 1);
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

    return {
      r: median(samples.map((sample) => sample.r).sort((a, b) => a - b)),
      g: median(samples.map((sample) => sample.g).sort((a, b) => a - b)),
      b: median(samples.map((sample) => sample.b).sort((a, b) => a - b)),
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
            if (offsetX !== 0 || offsetY !== 0) {
              neighbors += mask[(y + offsetY) * width + (x + offsetX)];
            }
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
    if (bridgeX > 0) result = fillLineGaps(result, width, height, bridgeX, "horizontal");
    if (bridgeY > 0) result = fillLineGaps(result, width, height, bridgeY, "vertical");
    if (bridgeX > 0) result = fillLineGaps(result, width, height, Math.max(1, Math.floor(bridgeX / 2)), "horizontal");
    return result;
  }

  function fillLineGaps(mask, width, height, maxGap, direction) {
    const result = mask.slice();
    if (direction === "horizontal") {
      for (let y = 0; y < height; y += 1) {
        let lastFilledX = -1;
        for (let x = 0; x < width; x += 1) {
          if (!mask[y * width + x]) continue;
          if (lastFilledX >= 0 && x - lastFilledX - 1 <= maxGap) {
            for (let fillX = lastFilledX + 1; fillX < x; fillX += 1) result[y * width + fillX] = 1;
          }
          lastFilledX = x;
        }
      }
      return result;
    }
    for (let x = 0; x < width; x += 1) {
      let lastFilledY = -1;
      for (let y = 0; y < height; y += 1) {
        if (!mask[y * width + x]) continue;
        if (lastFilledY >= 0 && y - lastFilledY - 1 <= maxGap) {
          for (let fillY = lastFilledY + 1; fillY < y; fillY += 1) result[fillY * width + x] = 1;
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
      for (let x = 0; x < width; x += 1) count += mask[y * width + x];
      projection[y] = count;
    }
    return projection;
  }

  function projectMaskColumns(mask, width, startY, endY) {
    const projection = new Uint32Array(width);
    for (let x = 0; x < width; x += 1) {
      let count = 0;
      for (let y = startY; y <= endY; y += 1) count += mask[y * width + x];
      projection[x] = count;
    }
    return projection;
  }

  function findBands(projection, minPixels, minRunLength, maxGap) {
    const bridged = bridgeBinaryGaps(Array.from(projection, (value) => (value >= minPixels ? 1 : 0)), maxGap);
    const bands = [];
    let start = -1;
    for (let index = 0; index < bridged.length; index += 1) {
      if (bridged[index] && start < 0) {
        start = index;
      } else if (!bridged[index] && start >= 0) {
        if (index - start >= minRunLength) bands.push({ start, end: index - 1 });
        start = -1;
      }
    }
    if (start >= 0 && bridged.length - start >= minRunLength) bands.push({ start, end: bridged.length - 1 });
    return bands;
  }

  function bridgeBinaryGaps(values, maxGap) {
    const result = values.slice();
    let previousActive = -1;
    for (let index = 0; index < values.length; index += 1) {
      if (!values[index]) continue;
      if (previousActive >= 0 && index - previousActive - 1 <= maxGap) {
        for (let fillIndex = previousActive + 1; fillIndex < index; fillIndex += 1) result[fillIndex] = 1;
      }
      previousActive = index;
    }
    return result;
  }

  function expandBandsToMidpoints(bands, limit) {
    if (!bands.length) return [];
    return bands.map((band, index) => {
      const previous = bands[index - 1];
      const next = bands[index + 1];
      const start = previous ? Math.max(0, Math.floor((previous.end + band.start) / 2) + 1) : 0;
      const end = next ? Math.min(limit - 1, Math.floor((band.end + next.start) / 2)) : limit - 1;
      return { start, end };
    });
  }

  function shouldSplitRowIntoColumns(columnBands, width) {
    if (columnBands.length < 2 || columnBands.length > 8) return false;
    const widths = columnBands.map((band) => band.end - band.start + 1);
    const medianWidth = median([...widths].sort((a, b) => a - b));
    const similarCount = widths.filter((value) => Math.abs(value - medianWidth) <= medianWidth * 0.45).length;
    const coverage = widths.reduce((sum, value) => sum + value, 0) / width;
    return similarCount >= Math.ceil(columnBands.length * 0.6) && coverage >= 0.25;
  }

  function countMaskPixelsInBox(mask, width, x, y, boxWidth, boxHeight) {
    let total = 0;
    for (let row = y; row < y + boxHeight; row += 1) {
      for (let col = x; col < x + boxWidth; col += 1) total += mask[row * width + col];
    }
    return total;
  }

  function countMaskPixels(mask) {
    let total = 0;
    for (let index = 0; index < mask.length; index += 1) total += mask[index];
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
        if (!mask[startIndex] || visited[startIndex]) continue;
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
          minX = Math.min(minX, currentX);
          minY = Math.min(minY, currentY);
          maxX = Math.max(maxX, currentX);
          maxY = Math.max(maxY, currentY);
          for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
            for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
              if (offsetX === 0 && offsetY === 0) continue;
              const nextX = currentX + offsetX;
              const nextY = currentY + offsetY;
              if (nextX < 0 || nextY < 0 || nextX >= width || nextY >= height) continue;
              const nextIndex = nextY * width + nextX;
              if (!mask[nextIndex] || visited[nextIndex]) continue;
              visited[nextIndex] = 1;
              queueX[tail] = nextX;
              queueY[tail] = nextY;
              tail += 1;
            }
          }
        }
        if (area >= minArea) boxes.push({ x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1, area });
      }
    }
    return boxes;
  }

  function mergeNearbyBoxes(boxes, mergeDistance) {
    const pending = boxes.slice();
    const merged = [];
    while (pending.length) {
      let current = pending.pop();
      let changed = true;
      while (changed) {
        changed = false;
        for (let index = pending.length - 1; index >= 0; index -= 1) {
          if (boxesAreNear(current, pending[index], mergeDistance)) {
            current = combineBoxes(current, pending[index]);
            pending.splice(index, 1);
            changed = true;
          }
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
    return { x, y, width: maxX - x, height: maxY - y, area: a.area + b.area };
  }

  function padBox(box, padding, maxWidth, maxHeight) {
    const x = Math.max(0, box.x - padding);
    const y = Math.max(0, box.y - padding);
    const right = Math.min(maxWidth, box.x + box.width + padding);
    const bottom = Math.min(maxHeight, box.y + box.height + padding);
    return { x, y, width: right - x, height: bottom - y, area: box.area };
  }

  function suppressContainedBoxes(boxes) {
    return boxes.filter((box, index) => {
      return !boxes.some((other, otherIndex) => {
        if (index === otherIndex) return false;
        const sameSize = box.x === other.x && box.y === other.y && box.width === other.width && box.height === other.height;
        const inside =
          box.x >= other.x &&
          box.y >= other.y &&
          box.x + box.width <= other.x + other.width &&
          box.y + box.height <= other.y + other.height;
        return inside && !sameSize;
      });
    });
  }

  function enrichZoneGeometry(box, mask, imageWidth) {
    const shape = inferZoneShape(box, mask, imageWidth);
    return { ...box, shape: shape.kind, shapeConfidence: shape.confidence };
  }

  function inferZoneShape(box, mask, imageWidth) {
    const aspect = Math.min(box.width, box.height) / Math.max(box.width, box.height, 1);
    if (aspect < 0.76 || box.width < 24 || box.height < 24) return { kind: "rect", confidence: 0 };
    const fillRatio = countMaskPixelsInBox(mask, imageWidth, box.x, box.y, box.width, box.height) / Math.max(1, box.width * box.height);
    if (fillRatio < 0.42 || fillRatio > 0.9) return { kind: "rect", confidence: 0 };
    const cornerDensity = sampleMaskDensity(mask, imageWidth, box, "corners");
    const centerDensity = sampleMaskDensity(mask, imageWidth, box, "center");
    const roundScore =
      (aspect - 0.76) / 0.24 +
      clamp((0.9 - Math.abs(fillRatio - 0.72)) / 0.9, 0, 1) +
      clamp(centerDensity, 0, 1) +
      clamp(1 - cornerDensity, 0, 1);
    return centerDensity > 0.55 && cornerDensity < 0.38 && roundScore > 2.15
      ? { kind: "round", confidence: roundScore / 4 }
      : { kind: "rect", confidence: 0 };
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
    return (
      corners.reduce((sum, [x, y]) => sum + countMaskPixelsInBox(mask, imageWidth, x, y, cornerWidth, cornerHeight) / Math.max(1, cornerWidth * cornerHeight), 0) /
      corners.length
    );
  }

  function readPixel(data, width, x, y) {
    const index = (y * width + x) * 4;
    return { r: data[index], g: data[index + 1], b: data[index + 2] };
  }

  function median(values) {
    const middle = Math.floor(values.length / 2);
    return values.length % 2 === 0 ? Math.round((values[middle - 1] + values[middle]) / 2) : values[middle];
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  const api = {
    detectZonesFromImageData,
    detectComponentZones,
    estimateBackgroundColor,
    buildForegroundMask,
    findConnectedComponents,
    mergeNearbyBoxes,
    padBox,
    suppressContainedBoxes,
    countMaskPixelsInBox,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
  globalScope.DetectionCore = api;
})(typeof globalThis !== "undefined" ? globalThis : window);
