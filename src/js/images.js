import axios from 'axios';

const URL = 'https://pixabay.com/api/';
const API_KEY = '36709978-7836bf9f35f408a7db18834e6';

export default async function fetchImages(value, page) {
  const { data } = await axios.get(
    `${URL}?key=${API_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  );

  return data;
  
  // return axios
  //   .get(
  //     `${URL}?key=${API_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  //   )
  //   .then(({ data }) => {
  //     console.log(data);
  //     return data;
  //   });
}



 