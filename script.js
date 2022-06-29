// import { createElement } from '/createLI.js';
// import { debounce } from '/debounce.js'; -//как делать импорты

// Обьявление переменных
const input = document.querySelector('input');
const repo = document.querySelector('.repo');
const popup = document.querySelector('.popup');
const span = document.querySelectorAll('span');
const closeIcon = document.querySelector('.close-icon');
const searchIcon = document.querySelector('.search-icon');

// Функция debounce
function debounce(callee, timeoutMs) {
  return function perform(...args) {
    let previousCall = this.lastCall;
    this.lastCall = Date.now();
    if (previousCall && this.lastCall - previousCall <= timeoutMs) {
      clearTimeout(this.lastCallTimer);
    }
    this.lastCallTimer = setTimeout(() => callee(...args), timeoutMs);
  };
}

// Функция для создания элементов
const createElement = (tagName, className) => {
  const element = document.createElement(tagName);
  if (className) {
    element.classList.add(className);
  }
  return element;
};

// Функция запроса fetch
const getResponce = async () => {
  const url = ` https://api.github.com/search/repositories?q=${input.value}&sort=star&per_page=5`;
  try {
    const responseUrl = await fetch(url);
    if (responseUrl.ok) {
      const data = await responseUrl.json();
      return data;
    } else {
      throw new Error('ОШИБКА');
    }
  } catch (Error) {
    console.log(Error);
  }
};

// функция создания Li и отрисовка
const renderLi = () => {
  const arr = [];
  if (ul.hasChildNodes()) {
    while (ul.firstChild) {
      ul.removeChild(ul.lastChild);
    }
  }
  if (popup.style.opacity === '1') {
    popup.style.opacity = '0';
    ul.hidden = false;
  }

  if (input.value.length > 3) {
    getResponce().then((resp) => {
      for (let i = 0; i < resp.items.length; i++) {
        const item = resp.items[i].name;
        const saveLi = createElement('li');
        saveLi.textContent = item;
        repo.append(ul);
        arr.push(saveLi);
      }
      arr.map((el) => {
        ul.appendChild(el);
      });
      propertyRep(resp);
    });
  }
};

//Функция отрисовки модального окна свойсв репозиториев
const propertyRep = (data) => {
  ul.addEventListener('click', (e) => {
    for (let i = 0; i < data.items.length; i++) {
      if (e.target.textContent == data.items[i].name) {
        span[0].textContent = data.items[i].name;
        span[1].textContent = data.items[i]['owner']['login'];
        span[2].textContent = data.items[i].stargazers_count;
      }
      ul.hidden = true;
      popup.style.opacity = '1';
    }
    document.addEventListener('keyup', (e) => {
      if (e.keyCode == 27) {
        popup.style.opacity = '0';
        ul.hidden = false;
      }
    });
  });
};
const ul = createElement('ul');
const spans =createElement('span')
const debounced = debounce(renderLi, 800);
document.addEventListener('input', debounced);

