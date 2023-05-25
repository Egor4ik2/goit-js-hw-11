import { refs } from './js/refs.js';
import fetchImages from './js/images.js';
import { markupCreate, markupRender, scrollBy } from './js/markup.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let page = 1;
let searchQuery = '';
let totalImages = 0;
const gallery = new SimpleLightbox('.gallery a');

refs.formEl.addEventListener('submit', onSubmitForm);

async function onSubmitForm(e) {
  e.preventDefault();
  searchQuery = e.target.searchQuery.value.trim();
  clearInput();
  page = 1;
  totalImages = 0;
  refs.listEl.innerHTML = '';

  if (searchQuery === '') {
    Notify.info('Enter some query text');
    hideLoadMoreButton();
    return;
  }

  try {
    const response = await fetchImages(searchQuery, page);

    if (response.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      hideLoadMoreButton();
      return;
    }

    const markup = await markupCreate(response.hits);

    markupRender(markup);
    Notify.success(`Hooray! We found ${response.totalHits} images.`);

    totalImages += response.hits.length;
    scrollBy();

    gallery.refresh();

    if (response.hits.length < 29) {
      hideLoadMoreButton();
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    console.log(error);
  }
}

refs.loadMoreBtn.addEventListener('click', onBtnClick);

async function onBtnClick() {
  page += 1;
  try {
    const response = await fetchImages(searchQuery, page);
    totalImages += response.hits.length;
    if (response.hits.length < 40 || totalImages >= response.totalHits) {
      hideLoadMoreButton();
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
    const markup = await markupCreate(response.hits);

    markupRender(markup);
      
    scrollBy();
    gallery.refresh();
  } catch (error) {
    console.log(error);
  }
}
function showLoadMoreButton() {
  refs.loadMoreBtn.classList.add('visible');
}

function hideLoadMoreButton() {
  refs.loadMoreBtn.classList.remove('visible');
}


function clearInput() {
  refs.formEl.reset();
}
