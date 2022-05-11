import Input from '../components/Input.js';
import Suggestion from '../components/Suggestion.js';
import SelectedLanguage from '../components/SelectedLanguage.js';
import { fetchLanguages } from '../utils/fetcher.js';
import debounce from '../utils/debounce.js';

const App = ({ $target }) => {
  let state = (() => {
    const selectedLanguages = window.localStorage.getItem('selectedLanguages');
    const fetchedLanguages = window.localStorage.getItem('fetchedLanguages');
    const keyword = window.localStorage.getItem('keyword') ?? '';

    return {
      selectedLanguages: selectedLanguages ? selectedLanguages.split(',') : [],
      fetchedLanguages: fetchedLanguages ? fetchedLanguages.split(',') : [],
      keyword,
    };
  })();

  const $seletedLanguages = SelectedLanguage({
    $target,
    initialState: { selectedLanguages: state.selectedLanguages },
  });

  const $input = Input({
    $target,
    initialState: {
      keyword: state.keyword,
    },
    onChange: debounce(async (e) => {
      const {
        target: { value: keyword },
        key,
      } = e;

      const ignoreKey = ['ArrowUp', 'ArrowLeft', 'ArrowRight', 'ArrowDown', 'Enter'];
      if (ignoreKey.includes(key)) return;

      if (keyword.length === 0) {
        setState({ fetchedLanguages: [], keyword: '' });
        window.localStorage.setItem('fetchedLanguages', []);
      } else {
        const fetchedLanguages = await fetchLanguages(keyword);
        setState({ fetchedLanguages, keyword });
        window.localStorage.setItem('fetchedLanguages', fetchedLanguages);
      }
      window.localStorage.setItem('keyword', keyword);
    }, 200),
  });

  const $suggestion = Suggestion({
    $target,
    initialSate: { fetchedLanguages: state.fetchedLanguages, keyword: state.keyword },
    onSelect: (language) => {
      const { selectedLanguages } = state;

      const idx = selectedLanguages.indexOf(language);
      if (idx >= 0) selectedLanguages.splice(idx, 1);
      selectedLanguages.push(language);
      if (selectedLanguages.length > 5) selectedLanguages.shift();
      setState({ languages: selectedLanguages });
      window.localStorage.setItem('selectedLanguages', selectedLanguages);
    },
  });

  const setState = (newState) => {
    state = {
      ...state,
      ...newState,
    };

    const { selectedLanguages, fetchedLanguages, keyword } = state;
    $seletedLanguages.setState({ selectedLanguages });
    $input.setState({ keyword });
    $suggestion.setState({ fetchedLanguages, keyword });
  };

  const render = () => {
    $input.render();
    $suggestion.render();
    $seletedLanguages.render();
  };

  render();
};

export default App;
