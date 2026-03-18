import React from "react";
import type { SummaryStats } from "@pulse/shared";
import { createSuspenseResource } from "@pulse/shared";
import { StatCard } from "@pulse/ui";

function formatNumber(value: number): string {
  return value.toLocaleString();
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(value);
}

function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

const statsResource = createSuspenseResource<SummaryStats>(
  fetch("/api/analytics/summary").then((r) => r.json()),
);

export function StatsBar(): React.ReactElement {
  const stats = statsResource.read();

  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard label="Total Users" value={formatNumber(stats.totalUsers)} />
      <StatCard label="Active Today" value={formatNumber(stats.activeToday)} />
      <StatCard label="Revenue" value={formatCurrency(stats.revenue)} />
      <StatCard
        label="Conversion Rate"
        value={formatPercentage(stats.conversionRate)}
      />
    </div>
  );
}
