import { describe, it, expect } from "vitest";
import jscodeshift from "jscodeshift";
import transform from "../migrate-legacy-import";

function applyTransform(input: string): string {
  const result = transform(
    { source: input, path: "test.tsx" },
    { jscodeshift, j: jscodeshift, stats: () => {}, report: () => {} },
  );
  return result;
}

describe("migrate-legacy-import", () => {
  it("transforms a single legacy import", () => {
    const input = `import { LegacyChart } from "./legacy-chart";`;
    const output = applyTransform(input);
    expect(output).toContain(`import { Chart } from "@pulse/analytics"`);
    expect(output).not.toContain("LegacyChart");
    expect(output).not.toContain("./legacy-chart");
  });

  it("transforms multiple imports from different legacy files", () => {
    const input = [
      `import { LegacyChart } from "./legacy-chart";`,
      `import { LegacyButton } from "./legacy-button";`,
    ].join("\n");
    const output = applyTransform(input);
    expect(output).toContain(`import { Chart } from "@pulse/analytics"`);
    expect(output).toContain(`import { Button } from "@pulse/ui"`);
  });

  it("leaves non-legacy imports unchanged", () => {
    const input = `import { useState } from "react";`;
    const output = applyTransform(input);
    expect(output).toBe(input);
  });

  it("transforms JSX element names", () => {
    const input = [
      `import { LegacyChart } from "./legacy-chart";`,
      `const App = () => <LegacyChart data={data} />;`,
    ].join("\n");
    const output = applyTransform(input);
    expect(output).toContain("<Chart");
    expect(output).not.toContain("<LegacyChart");
  });
});
