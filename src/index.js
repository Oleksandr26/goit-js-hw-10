import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  const value = event.target.value.trim();
  if (!value) {
    return;
  }
  fetchCountries(value)
    .then(data => {
      if (data.length > 10) {
        clearHtml();
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length > 1) {
        const markupPreview = preview(data);
        refs.countryList.insertAdjacentHTML('beforeend', markupPreview);
        clearHtml(markupPreview);
      } else {
        const markupCard = countryCard(data);
        refs.countryInfo.insertAdjacentHTML('beforeend', markupCard);
        clearHtml('', markupCard);
      }
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
      clearHtml();
    });
}

function preview(data) {
  return data
    .map(({ name, flags }) => {
      return `<li class = 'country__descrition'><img src = '${flags.png}' alt = '${name.official}' width = '100px'/>${name.official}</li>`;
    })
    .join('');
}

function countryCard(data) {
  return data
    .map(({ name, capital, region, population, languages, flags }) => {
      return `<ul><li class = 'country__descrition'><img src = '${
        flags.png
      }' alt = '${name.official}' width = '100px'/>${name.official}</li>
        <li><span>Capital:</span> ${capital}</li>
        <li><span>Region:</span> ${region}</li>
        <li><span>Population:</span> ${population}</li>
        <li><span>Languages:</span> ${Object.values(languages)}</li></ul>`;
    })
    .join('');
}

function clearHtml(ul, div) {
  refs.countryList.innerHTML = ul || '';
  refs.countryInfo.innerHTML = div || '';
}
