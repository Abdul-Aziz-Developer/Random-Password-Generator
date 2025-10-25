const lengthInput = document.getElementById('length');
const lengthValue = document.getElementById('lengthValue');
const uppercase = document.getElementById('uppercase');
const lowercase = document.getElementById('lowercase');
const numbers = document.getElementById('numbers');
const symbols = document.getElementById('symbols');
const passwordField = document.getElementById('password');
const copyBtn = document.getElementById('copy');
const generateBtn = document.getElementById('generate');
const strengthMeter = document.getElementById('strengthMeter');
const historyList = document.getElementById('historyList');
const toggleLang = document.getElementById('toggleLang');

let history = [];
let isBangla = false;

lengthInput.addEventListener('input', () => {
  lengthValue.textContent = lengthInput.value;
});

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(passwordField.value);
  copyBtn.textContent = '✅ Copied!';
  setTimeout(() => {
    copyBtn.textContent =  '📋 Copy';
  }, 1500);
});

generateBtn.addEventListener('click', () => {
  const length = +lengthInput.value;
  const hasUpper = uppercase.checked;
  const hasLower = lowercase.checked;
  const hasNumber = numbers.checked;
  const hasSymbol = symbols.checked;

  const password = generatePassword(length, hasUpper, hasLower, hasNumber, hasSymbol);
  passwordField.value = password;
  updateStrength(password);
  updateHistory(password);
  saveSettings();
});

function generatePassword(length, upper, lower, number, symbol) {
  const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()_+~';

  let allChars = '';
  if (upper) allChars += upperChars;
  if (lower) allChars += lowerChars;
  if (number) allChars += numberChars;
  if (symbol) allChars += symbolChars;

  let password = '';
  for (let i = 0; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  return password;
}

function updateStrength(password) {
  let strength = 0;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  const colors = ['#ff4d4d', '#ffa500', '#ffff66', '#66ff66'];
  strengthMeter.style.background = colors[strength - 1] || '#ddd';
}

function updateHistory(password) {
  history.unshift(password);
  if (history.length > 5) history.pop();

  historyList.innerHTML = '';
  history.forEach(pwd => {
    const li = document.createElement('li');
    li.innerHTML = `${pwd} <button onclick="copyFromHistory('${pwd}')">📋</button>`;
    historyList.appendChild(li);
  });
}

function copyFromHistory(pwd) {
  navigator.clipboard.writeText(pwd);
  copyBtn.textContent =  '✅ Copied!';
  setTimeout(() => {
    copyBtn.textContent =  '📋 Copy';
  }, 1500);
}

function saveSettings() {
  const settings = {
    length: lengthInput.value,
    uppercase: uppercase.checked,
    lowercase: lowercase.checked,
    numbers: numbers.checked,
    symbols: symbols.checked
  };
  localStorage.setItem('passwordSettings', JSON.stringify(settings));
}

function loadSettings() {
  const saved = JSON.parse(localStorage.getItem('passwordSettings'));
  if (saved) {
    lengthInput.value = saved.length;
    lengthValue.textContent = saved.length;
    uppercase.checked = saved.uppercase;
    lowercase.checked = saved.lowercase;
    numbers.checked = saved.numbers;
    symbols.checked = saved.symbols;
  }
}

toggleLang.addEventListener('click', () => {
  isBangla = !isBangla;
  document.querySelector('h1').textContent =  '🔐 Password Generator';
  generateBtn.textContent =  '🎲 Generate Password';
  copyBtn.textContent = '📋 Copy';
});

window.onload = loadSettings;