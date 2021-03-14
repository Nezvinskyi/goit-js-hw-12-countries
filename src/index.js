import './css/common.css';
import countriesListTpl from './templates/countriesList.hbs';
import countryCardTpl from './templates/countryCard.hbs';
import API from './js/fetchCountries';
import { debounce } from 'lodash';
import notice from './js/notifications';
import getRefs from './js/get-refs';

const refs = getRefs();

let furtherSearchQuery = '';

refs.input.addEventListener('input', debounce(onSearch, 500));

async function onSearch(event) {
  try {
    event.preventDefault();
    refs.spinner.classList.remove('is-hidden');
    refs.output.innerHTML = '';
    const searchQuery = event.target.value.trim();

    if (searchQuery === '') {
      refs.spinner.classList.add('is-hidden');
      return;
    }

    const countryData = await API.fetchCountryData(searchQuery);
    if (countryData.length > 10) {
      await notice.onTooManyError();
      await console.warn('more than 10 items');
    } else if (countryData.length < 10 && countryData.length > 1) {
      await renderCountriesList(countryData);
      await notice.onSuccess(countryData);
      refs.output.addEventListener('click', onListClick);
    } else if (countryData.length === 1) {
      await renderCountryCard(countryData);
    }
  } catch (error) {
    console.log(error);
    notice.onNotFoundError();
  }
}

async function onListClick(event) {
  furtherSearchQuery = event.target.textContent;
  renderCountryCard(await API.fetchCountryData(furtherSearchQuery));
  refs.output.removeEventListener('click', onListClick);
}

function renderCountriesList(listData) {
  refs.output.innerHTML = countriesListTpl(listData);
}

function renderCountryCard(countryData) {
  refs.output.innerHTML = countryCardTpl(countryData);
  refs.output.removeEventListener('click', onListClick);
}
