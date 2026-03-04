module.exports = {
  ci: {
    collect: {
      startServerCommand: "pnpm --filter @pulse/dashboard preview",
      url: ["http://localhost:4173"],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "total-byte-weight": ["error", { maxNumericValue: 200000 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
