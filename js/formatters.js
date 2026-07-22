const timeFormatterCache = new Map();
const dateFormatterCache = new Map();
const offsetFormatterCache = new Map();

export function getFormatter(tzId, timeFormat) {
  const key = `${tzId}|${timeFormat}`;
  let formatter = timeFormatterCache.get(key);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('fr-FR', {
      timeZone: tzId,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: timeFormat === '12h',
    });
    timeFormatterCache.set(key, formatter);
  }
  return formatter;
}

export function getDateFormatter(tzId) {
  let formatter = dateFormatterCache.get(tzId);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('fr-FR', {
      timeZone: tzId,
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    });
    dateFormatterCache.set(tzId, formatter);
  }
  return formatter;
}

function getOffsetFormatter(tzId) {
  let formatter = offsetFormatterCache.get(tzId);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tzId,
      timeZoneName: 'shortOffset',
    });
    offsetFormatterCache.set(tzId, formatter);
  }
  return formatter;
}

export function getOffsetLabel(tzId, date) {
  const parts = getOffsetFormatter(tzId).formatToParts(date);
  const part = parts.find((p) => p.type === 'timeZoneName');
  return part ? part.value.replace('GMT', 'UTC') : '';
}
