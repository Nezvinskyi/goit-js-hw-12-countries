import { error } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';

const BASE_URL = 'https://restcountries.eu/rest/v2';

function fetchCountriesList(query) {
  return fetch(`${BASE_URL}/name/${query}`)
    .then(response => {
      if (response.status === 404) throw new Error();
      return response.json();
    })
    .catch(onError);
}

function onError() {
  error({
    text: 'There is no such country. Please try another search!',
    delay: 4000,
  });
}

export default { fetchCountriesList };
