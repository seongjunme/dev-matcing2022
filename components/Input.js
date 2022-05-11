const Input = ({ $target, initialState, onChange }) => {
  const $element = document.createElement('form');
  $element.className = 'SearchInput';
  $target.appendChild($element);

  let state = initialState;

  const setState = (newState) => {
    state = { ...state, ...newState };
    const $input = $element.querySelector('.SearchInput__input');
    $input.value = state.keyword;
  };

  const render = () => {
    const { keyword } = state;
    $element.innerHTML = `
          <input type="text" class="SearchInput__input" type="text" value="${keyword}" placeholder="프로그램 언어를 입력하세요." autofocus>
      `;
    bindEvents();
  };

  const bindEvents = () => {
    $element.addEventListener('submit', (e) => e.preventDefault());
    const $input = $element.querySelector('.SearchInput__input');
    $input.addEventListener('keyup', onChange);
  };

  return {
    setState,
    render,
  };
};

export default Input;
