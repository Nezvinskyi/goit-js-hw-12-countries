export default function getrefs() {
  return {
    body: document.querySelector('body'),
    input: document.querySelector('#searchQuery'),
    spinner: document.querySelector('.icon-container'),
    output: document.getElementById('container'),
    notification: document.querySelector('.notification'),
  };
}
