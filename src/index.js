import './css/common.css';
import countriesListTpl from './templates/countriesList.hbs';
import countryCardTpl from './templates/countryCard.hbs';
import API from './js/fetchCountries';
import { debounce } from 'lodash';
import notice from './js/notifications';

const refs = {
  body: document.querySelector('body'),
  input: document.querySelector('#searchQuery'),
  spinner: document.querySelector('.icon-container'),
  output: document.getElementById('container'),
  notification: document.querySelector('.notification'),
};
let furtherSearchQuery = '';

refs.input.addEventListener('input', debounce(onSearch, 500));

function onSearch(event) {
  event.preventDefault();
  refs.spinner.classList.remove('is-hidden');
  refs.output.innerHTML = '';
  const searchQuery = event.target.value;
  if (searchQuery === '') return;

  API.fetchCountriesList(searchQuery).then(data => {
    if (!data) return;
    if (data.length > 10) {
      notice.onTooManyError();
      console.warn('more than 10 items');
      refs.spinner.classList.add('is-hidden');
      return;
    }

    if (data.length > 1) {
      renderCountriesList(data);
      notice.onSuccess(data);
      refs.output.addEventListener('click', onListClick);
      refs.spinner.classList.add('is-hidden');
    }

    if (data.length === 1) {
      renderCountryCard(data);
      refs.spinner.classList.add('is-hidden');
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
