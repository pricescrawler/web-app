export const WHATS_NEW_LAST_SEEN_KEY = 'whats-new-last-seen';

export const hasUnseenChangelogEntries = (latestDate) => {
  if (!latestDate) return false;

  return localStorage.getItem(WHATS_NEW_LAST_SEEN_KEY) !== latestDate;
};

export const markChangelogAsSeen = (latestDate) => {
  if (!latestDate) return;

  localStorage.setItem(WHATS_NEW_LAST_SEEN_KEY, latestDate);
};
