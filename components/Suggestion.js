const Suggestion = ({ $target, initialSate, onSelect }) => {
  const $element = document.createElement('div');
  $element.className = 'Suggestion';
  $target.appendChild($element);

  let state = initialSate;

  (() => {
    state = {
      ...state,
      index: parseInt(window.localStorage.getItem('index')) ?? 0,
    };
  })();

  const setState = (newState) => {
    if (newState.keyword && newState.keyword !== state.keyword) {
      newState.index = 0;
    }
    state = { ...state, ...newState };
    render();
  };

  const render = () => {
    const { fetchedLanguages, index, keyword } = state;

    const re = new RegExp(keyword, 'ig');
    if (fetchedLanguages.length > 0) {
      $element.style.display = 'block';
      $element.innerHTML = `
          <ul>
              ${fetchedLanguages
                .map((language) =>
                  language.replaceAll(
                    re,
                    `<span class="Suggestion__item--matched">${language.match(re)[0]}</span>`
                  )
                )
                .map(
                  (language, i) =>
                    `<li ${
                      i === index ? 'class="Suggestion__item--selected"' : ''
                    } data-index="${i}">${language}</li>`
                )
                .join('\n')}
          </ul>
          `;
    } else {
      $element.style.display = 'none';
      $element.innerHTML = ``;
    }
  };

  const bindEvents = () => {
    $element.addEventListener('click', (e) => {
      const {
        target: {
          dataset: { index },
        },
      } = e;
      const { fetchedLanguages } = state;
      onSelect(fetchedLanguages[index]);
    });

    window.addEventListener('keyup', (e) => {
      const { key } = e;
      const { fetchedLanguages, index } = state;
      if (key === 'ArrowUp') {
        setState({
          ...state,
          index: index - 1 < 0 ? fetchedLanguages.length - 1 : index - 1,
        });
      } else if (key === 'ArrowDown') {
        setState({
          ...state,
          index: (index + 1) % fetchedLanguages.length,
        });
      } else if (key === 'Enter') {
        const { fetchedLanguages, index } = state;
        onSelect(fetchedLanguages[index]);
      }

      window.localStorage.setItem('index', state.index);
    });
  };

  bindEvents();

  return {
    setState,
    render,
  };
};

export default Suggestion;
