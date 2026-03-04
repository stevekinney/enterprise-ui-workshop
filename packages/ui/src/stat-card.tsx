import React from "react";

interface StatCardProps {
  label: string;
  value: string;
}

export function StatCard({ label, value }: StatCardProps): React.ReactElement {
  return (
    <div
      className="rounded-lg border p-5"
      style={{
        borderColor: "var(--color-border)",
        backgroundColor: "var(--color-background)",
      }}
    >
      <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
        {label}
      </p>
      <p
        className="mt-1 text-2xl font-semibold"
        style={{ color: "var(--color-text)" }}
      >
        {value}
      </p>
    </div>
  );
}
