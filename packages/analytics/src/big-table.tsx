import React from "react";
import type { TableRow, PaginatedResponse } from "@pulse/shared";
import { createSuspenseResource } from "@pulse/shared";
import { DataTable } from "@pulse/ui";

const columns = [
  { key: "user" as const, header: "User" },
  { key: "action" as const, header: "Action" },
  {
    key: "timestamp" as const,
    header: "Time",
    render: (value: TableRow[keyof TableRow]) =>
      new Date(String(value)).toLocaleString(),
  },
  {
    key: "duration" as const,
    header: "Duration",
    render: (value: TableRow[keyof TableRow]) => `${value}ms`,
  },
];

const tableResource = createSuspenseResource<TableRow[]>(
  fetch("/api/analytics/table?page=1")
    .then((r) => r.json())
    .then((result: PaginatedResponse<TableRow>) => result.data),
);

export function BigTable(): React.ReactElement {
  const data = tableResource.read();

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 font-medium text-gray-900">Recent Activity</h3>
      <DataTable columns={columns} data={data} keyField="id" />
    </div>
  );
}
