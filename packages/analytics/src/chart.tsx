import React from "react";
import type { ChartDataPoint, TimeRange } from "@pulse/shared";
import { createSuspenseResource } from "@pulse/shared";

const chartCache = new Map<
  TimeRange,
  ReturnType<typeof createSuspenseResource<ChartDataPoint[]>>
>();

function getChartResource(range: TimeRange) {
  if (!chartCache.has(range)) {
    chartCache.set(
      range,
      createSuspenseResource<ChartDataPoint[]>(
        fetch(`/api/analytics/chart?range=${range}`).then((r) => r.json()),
      ),
    );
  }
  return chartCache.get(range)!;
}

export function Chart({
  range = "30d",
}: {
  range?: TimeRange;
}): React.ReactElement {
  const data = getChartResource(range).read();

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-400">
        No data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map((point) => point.value));
  const chartHeight = 200;
  const chartWidth = 800;
  const barWidth = Math.max(4, (chartWidth - data.length * 2) / data.length);
  const gap = 2;

  return (
    <svg
      viewBox={`0 0 ${chartWidth} ${chartHeight + 30}`}
      className="h-64 w-full"
      role="img"
      aria-label="Analytics activity chart"
    >
      {data.map((point, index) => {
        const barHeight = (point.value / maxValue) * chartHeight;
        const x = index * (barWidth + gap);
        const y = chartHeight - barHeight;

        return (
          <g key={point.date}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              className="fill-gray-800"
              rx={2}
            />
            {index % Math.ceil(data.length / 6) === 0 && (
              <text
                x={x + barWidth / 2}
                y={chartHeight + 16}
                textAnchor="middle"
                className="fill-gray-400 text-[10px]"
              >
                {point.date.slice(5)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
