import type { API, FileInfo } from "jscodeshift";

const IMPORT_MAP: Record<string, { source: string; name: string }> = {
  LegacyChart: { source: "@pulse/analytics", name: "Chart" },
  LegacyStatsBar: { source: "@pulse/analytics", name: "StatsBar" },
  LegacyDataTable: { source: "@pulse/ui", name: "DataTable" },
  LegacyButton: { source: "@pulse/ui", name: "Button" },
};

export default function transform(file: FileInfo, api: API): string {
  const j = api.jscodeshift;
  const root = j(file.source);

  // Find all import declarations from legacy local files
  root
    .find(j.ImportDeclaration)
    .filter((path) => {
      const source = path.node.source.value;
      return typeof source === "string" && source.startsWith("./legacy-");
    })
    .forEach((path) => {
      const specifiers = path.node.specifiers;
      if (!specifiers) return;

      // Group new imports by their target package
      const newImports = new Map<string, string[]>();

      specifiers.forEach((specifier) => {
        if (specifier.type !== "ImportSpecifier") return;

        const oldName =
          specifier.imported.type === "Identifier"
            ? specifier.imported.name
            : specifier.imported.value;
        const mapping = IMPORT_MAP[oldName];

        if (mapping) {
          const existing = newImports.get(mapping.source) || [];
          existing.push(mapping.name);
          newImports.set(mapping.source, existing);
        }
      });

      // Replace the old import with new package imports
      const replacements = Array.from(newImports.entries()).map(
        ([source, names]) =>
          j.importDeclaration(
            names.map((name) =>
              j.importSpecifier(j.identifier(name), j.identifier(name)),
            ),
            j.literal(source),
          ),
      );

      if (replacements.length > 0) {
        j(path).replaceWith(replacements);
      }
    });

  // Replace usage of old component names with new names
  Object.entries(IMPORT_MAP).forEach(([oldName, { name: newName }]) => {
    root.find(j.JSXIdentifier, { name: oldName }).forEach((path) => {
      path.node.name = newName;
    });

    root
      .find(j.Identifier, { name: oldName })
      .filter(
        (path) =>
          path.parent.node.type !== "ImportSpecifier" &&
          path.parent.node.type !== "ImportDefaultSpecifier",
      )
      .forEach((path) => {
        path.node.name = newName;
      });
  });

  return root.toSource();
}
