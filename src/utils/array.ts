export const unique = (...targets: string[][]) => {
  const state: Record<string, number> = {};

  targets.forEach((target) => {
    target.forEach((value) => {
      const base = state[value] ?? 0;

      state[value] = base + 1;
    });
  });

  return Object.entries(state)
    .filter(([, value]) => value === 1)
    .map(([key]) => key);
};
