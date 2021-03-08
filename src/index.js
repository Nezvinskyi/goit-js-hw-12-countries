import './css/common.css';
import countriesListTpl from './templates/countriesList.hbs';
import countryCardTpl from './templates/countryCard.hbs';
import API from './js/fetchCountries';
import { debounce } from 'lodash';
import notice from './js/notifications';

const refs = {
  body: document.querySelector('body'),
  input: document.querySelector('#searchQuery'),
  output: document.getElementById('container'),
  notification: document.querySelector('.notification'),
};
let furtherSearchQuery = '';

refs.input.addEventListener('input', debounce(onSearch, 500));

function onSearch(event) {
  event.preventDefault();
  refs.output.innerHTML = '';
  const searchQuery = event.target.value;
  if (searchQuery === '') return;

  API.fetchCountriesList(searchQuery).then(data => {
    if (!data) return;
    if (data.length > 10) {
      notice.onTooManyError();
      console.warn('more than 10 items');
      return;
    }

    if (data.length > 1) {
      API.fetchCountriesList(searchQuery).then(renderCountriesList);
      notice.onSuccess(data);
      refs.output.addEventListener('click', onListClick);
    }

    if (data.length === 1) {
      API.fetchCountriesList(searchQuery).then(renderCountryCard);
    }
  });
}

function onListClick(event) {
  furtherSearchQuery = event.target.textContent;
  API.fetchCountriesList(furtherSearchQuery).then(renderCountryCard);
  refs.output.removeEventListener('click', onListClick);
}

function renderCountriesList(listData) {
  refs.output.innerHTML = countriesListTpl(listData);
}

function renderCountryCard(countryData) {
  refs.output.innerHTML = countryCardTpl(countryData);
  refs.input.value = '';
}
