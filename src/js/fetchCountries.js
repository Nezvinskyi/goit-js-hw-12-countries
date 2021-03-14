import notice from './notifications';
import getRefs from './get-refs';

const refs = getRefs();

const BASE_URL = 'https://restcountries.eu/rest/v2';

async function fetchCountryData(query) {
  const response = await fetch(`${BASE_URL}/name/${query}`);
  const countryData = await response.json();
  refs.spinner.classList.add('is-hidden');
  if (response.status === 404) {
    throw new Error();
  }
  return countryData;
}

export default { fetchCountryData };
