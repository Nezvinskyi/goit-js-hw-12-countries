import './css/common.css';
import countriesListTpl from './templates/countriesList.hbs';
import countryCardTpl from './templates/countryCard.hbs';
import API from './js/fetchCountries';
import { debounce } from 'lodash';
import { error, success } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';

const refs = {
  body: document.querySelector('body'),
  input: document.querySelector('#searchQuery'),
  output: document.getElementById('container'),
  notification: document.querySelector('.notification'),
};
let furtherSearchQuery = '';

refs.input.addEventListener('input', debounce(onSearch, 1000));
refs.output.addEventListener('click', onListClick);

function onListClick(event) {
  furtherSearchQuery = event.target.textContent;
  API.fetchCountriesList(furtherSearchQuery).then(renderCountryCard);
}

function onSearch(event) {
  event.preventDefault();
  const searchQuery = event.target.value;
  if (searchQuery === '') return;

  API.fetchCountriesList(searchQuery).then(data => {
    if (!data) return;
    if (data.length > 10) {
      error({
        text: 'Too many items found. Please enter a more specific query!',
        type: 'error',
      });

      console.warn('more than 10 items');
      return;
    }

    if (data.length > 1) {
      API.fetchCountriesList(searchQuery).then(renderCountriesList);
      success({
        text: `Your search found ${data.length} countries. Click on any item in the list to see the country card`,
        delay: 4000,
      });
    }

    if (data.length === 1) {
      API.fetchCountriesList(searchQuery).then(renderCountryCard);
    }
  });
}

function renderCountriesList(listData) {
  refs.output.innerHTML = countriesListTpl(listData);
}

function renderCountryCard(countryData) {
  refs.output.innerHTML = countryCardTpl(countryData);
}
