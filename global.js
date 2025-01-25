console.log('IT’S ALIVE!');

function $$ (selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let pages = [
  { url: '', title: 'Home' },
  { url: '/portfolio/projects/', title: 'Projects' },
  { url: '/portfolio/contact/', title: 'Contact' },
  { url: 'https://github.com/kzambani', title: 'GitHub' },
  { url: '/portfolio/resume/', title: 'Resume' }
];

const ARE_WE_HOME = document.documentElement.classList.contains('home');

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;
  let title = p.title;
  
  url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;
  
  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;
  
  a.classList.toggle(
    'current',
    a.host === location.host && a.pathname === location.pathname
  );
  
  if (a.host !== location.host) {
    a.target = "_blank";
  }
  
  nav.append(a);
}

// DARK-LIGHT MODE

document.body.insertAdjacentHTML(
  'afterbegin',
  `
  <label class="prefers-color-scheme">
    Theme:
    <select>
      <option value="auto">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>`
);

const select = document.querySelector('.prefers-color-scheme select');
const root = document.documentElement;

// load saved preference
const savedTheme = localStorage.getItem('theme') || 'auto';
select.value = savedTheme;

// function to apply theme
function applyTheme(theme) {
  root.classList.remove('light', 'dark');
  
  switch(theme) {
    case 'light':
      root.style.colorScheme = 'light';
      document.body.style.backgroundColor = '#f4f4f4';
      document.body.style.color = '#333';
      break;
    case 'dark':
      root.style.colorScheme = 'dark';
      document.body.style.backgroundColor = '#121212';
      document.body.style.color = '#e0e0e0';
      break;
    default:
      root.style.colorScheme = 'light dark';
      // reset to default
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
  }
  
  localStorage.setItem('theme', theme);
}

// initial theme application
applyTheme(savedTheme);

// event listener for theme changes
select.addEventListener('input', (event) => {
  applyTheme(event.target.value);
});

// CONTACT FORM FIX

document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');
  
  form?.addEventListener('submit', function (event) {
    event.preventDefault();  // Stop default form submission

    const formData = new FormData(form);
    let queryString = '';

    for (let [name, value] of formData) {
      if (queryString !== '') {
        queryString += '&';
      }
      queryString += `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    }

    // Construct the mailto link with properly encoded values
    const mailtoLink = `${form.action}?${queryString}`;
    window.location.href = mailtoLink;
  });
});






