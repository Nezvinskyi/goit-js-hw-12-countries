import notice from './notifications';

const BASE_URL = 'https://restcountries.eu/rest/v2';

function fetchCountriesList(query) {
  return fetch(`${BASE_URL}/name/${query}`)
    .then(response => {
      if (response.status === 404) throw new Error();
      return response.json();
    })
    .catch(notice.onNotFoundError);
}

export default { fetchCountriesList };
