export function fetchCountries(countryName) {
  return fetch(
    `https://restcountries.com/v3.1/name/${countryName}?fields=name,capital,region,languages,population,flags`
  ).then(response => {
    if (!response) {
      throw new Error();
    }
    return response.json();
  });
}
