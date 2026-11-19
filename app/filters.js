// Filtering and counting for the trophy list: grade, kind, text search,
// earned/unearned and the missable-only switch. Pure functions, no DOM.
export const KIND_LABELS = {
  story: 'Story',
  chapter: 'Chapter',
  mission: 'Mission',
  side: 'Side quests',
  activity: 'Activities',
  collectible: 'Collectibles',
  robbery: 'Robberies',
  exploration: 'Exploration',
  money: 'Money',
  combat: 'Combat',
  misc: 'Misc',
};

export const GRADE_LABELS = {
  platinum: 'Platinum',
  gold: 'Gold',
  silver: 'Silver',
  bronze: 'Bronze',
};

export function applyFilters(trophies, filters, earned) {
  const query = (filters.query ?? '').trim().toLowerCase();
  return trophies.filter((trophy) => {
    if (filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
    if (filters.kind !== 'all' && trophy.kind !== filters.kind) return false;
    if (filters.earnedFilter === 'earned' && !earned.has(trophy.id)) return false;
    if (filters.earnedFilter === 'unearned' && earned.has(trophy.id)) return false;
    if (filters.missableOnly && !trophy.missable) return false;
    if (query) {
      const haystack = `${trophy.name} ${trophy.description} ${trophy.guide} ${trophy.kind}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

export function countByGrade(trophies, earned) {
  const counts = {};
  for (const trophy of trophies) {
    counts[trophy.grade] ??= { total: 0, earned: 0 };
    counts[trophy.grade].total += 1;
    if (earned.has(trophy.id)) counts[trophy.grade].earned += 1;
  }
  return counts;
}

export function countByKind(trophies, earned) {
  const counts = {};
  for (const trophy of trophies) {
    counts[trophy.kind] ??= { total: 0, earned: 0 };
    counts[trophy.kind].total += 1;
    if (earned.has(trophy.id)) counts[trophy.kind].earned += 1;
  }
  return counts;
}
