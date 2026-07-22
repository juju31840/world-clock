import { getCountryInfo } from './countries.js';

function buildSearchText(parts) {
  return parts
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .replace(/[_/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseTimezoneId(id) {
  const displayName = (segment) => segment.replace(/_/g, ' ');
  const country = getCountryInfo(id);

  if (id.startsWith('Etc/')) {
    const city = id.slice(4);
    return {
      id,
      region: 'Etc',
      subregion: null,
      city,
      label: city,
      countryCode: country.code,
      countryName: country.name,
      flagPath: country.flagPath,
      searchText: buildSearchText([id, 'Etc', city, country.name]),
    };
  }

  const parts = id.split('/');
  const region = parts[0];
  const subregion = parts.length === 3 ? displayName(parts[1]) : null;
  const city = displayName(parts[parts.length - 1]);

  return {
    id,
    region,
    subregion,
    city,
    label: subregion ? `${city}, ${subregion}` : city,
    countryCode: country.code,
    countryName: country.name,
    flagPath: country.flagPath,
    searchText: buildSearchText([id, region, subregion, city, country.name]),
  };
}

export function buildTimezoneEntries() {
  return Intl.supportedValuesOf('timeZone')
    .map(parseTimezoneId)
    .sort((a, b) => {
      if (a.region !== b.region) return a.region.localeCompare(b.region);
      return a.city.localeCompare(b.city);
    });
}
