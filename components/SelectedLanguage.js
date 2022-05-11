const SelectedLanguage = ({ $target, initialState }) => {
  const $element = document.createElement('div');
  $element.className = 'SelectedLanguage';
  $target.appendChild($element);

  let state = initialState;

  const setState = (newState) => {
    state = { ...state, ...newState };
    render();
  };

  const render = () => {
    const { selectedLanguages } = state;
    if (selectedLanguages.length === 0) return;

    $element.innerHTML = `
      <ul>
        ${selectedLanguages.map((language) => `<li>${language}</li>`).join('\n')}
      </ul>
      `;
  };

  return {
    setState,
    render,
  };
};

export default SelectedLanguage;
