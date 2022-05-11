const debounce = (callback, delay) => {
  let timer;

  return (...arg) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...arg), delay);
  };
};

export default debounce;
