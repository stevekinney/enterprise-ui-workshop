import React, { Suspense, useState } from "react";
import type { TimeRange } from "@pulse/shared";
import { useAuth } from "@pulse/shared";
import { LoadingSkeleton, ErrorBoundary } from "@pulse/ui";
import { StatsBar } from "./stats-bar";
import { Chart } from "./chart";
import { BigTable } from "./big-table";

export function AnalyticsDashboard(): React.ReactElement {
  const { user, isAuthenticated } = useAuth();
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Analytics Overview
        </h2>
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Viewing as: {user.name}
            </span>
          ) : (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
              Not authenticated
            </span>
          )}
        </div>
      </div>

      <ErrorBoundary>
        <Suspense fallback={<LoadingSkeleton variant="card" count={4} />}>
          <StatsBar />
        </Suspense>
      </ErrorBoundary>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-medium text-gray-900">Activity</h3>
          <div className="flex gap-1">
            {(["7d", "30d", "90d"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`rounded-md px-3 py-1 text-sm ${
                  timeRange === range
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        <ErrorBoundary>
          <Suspense fallback={<LoadingSkeleton variant="chart" />}>
            <Chart range={timeRange} />
          </Suspense>
        </ErrorBoundary>
      </div>

      <ErrorBoundary>
        <Suspense fallback={<LoadingSkeleton variant="table" />}>
          <BigTable />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default AnalyticsDashboard;
