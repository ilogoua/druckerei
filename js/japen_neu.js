"use strict";

const Склад = [
  { nazva: "Бумага A1", nayavnist: 101, minLevel: 100 },
  { nazva: "Краска CYAN", nayavnist: 11, minLevel: 10 },
  { nazva: "Плівка", nayavnist: 20, minLevel: 15 },
];

function проверкаСклад(items) {
  for (let i = 0; i < items.length; i++) {
    if (items[i].nayavnist < items[i].minLevel) {
      console.log(`${items[i].nazva} треба заказати!`);
    }
  }
}

function видатиЦеху(items, nazva, potreba) {
  for (let i = 0; i < items.length; i++) {
    if (items[i].nazva === nazva) {
      if (items[i].nayavnist >= potreba) {
        items[i].nayavnist -= potreba;
        return `${nazva} видано: ${potreba}. Залишок: ${items[i].nayavnist}`;
      }
      return `Недостатньо "${nazva}" на складі. Залишок: ${items[i].nayavnist}`;
    }
  }
  return `Товар "${nazva}" не знайдено`;
}

function прийнятиНаСклад(items, nazva, amount) {
  for (let i = 0; i < items.length; i++) {
    if (items[i].nazva === nazva) {
      items[i].nayavnist += amount;
      return `${nazva} прийнято: ${amount}. Залишок: ${items[i].nayavnist}`;
    }
  }
  return `Товар "${nazva}" не знайдено`;
}

function renderSklad(items) {
  const app = document.getElementById("app");
  if (!app) return;

  let html = "<h2>Остатки на складе</h2><ul>";

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const status = item.nayavnist < item.minLevel ? "Нужно заказать" : "OK";
    html += `<li>${item.nazva}: ${item.nayavnist} (min ${item.minLevel}) — ${status}</li>`;
  }

  html += "</ul>";
  app.innerHTML = html;
}

function fillNameSelect(items) {
  const select = document.getElementById("nameInput");
  if (!select) return;

  let options = `<option value="" disabled selected>— Выберите товар —</option>`;

  for (let i = 0; i < items.length; i++) {
    options += `<option value="${items[i].nazva}">${items[i].nazva}</option>`;
  }

  select.innerHTML = options;
}

// ====== старт ======
проверкаСклад(Склад);
fillNameSelect(Склад);
renderSklad(Склад);

// ====== UI (DOM) ======
const issueBtn = document.getElementById("issueBtn");
const receiveBtn = document.getElementById("receiveBtn");
const msg = document.getElementById("msg");
const nameInput = document.getElementById("nameInput");
const amountInput = document.getElementById("amountInput");

if (amountInput) {
  amountInput.style.display = "none";
  amountInput.value = "";
  amountInput.placeholder = "";
}

if (nameInput) {
  nameInput.addEventListener("change", function () {
    clearMsg();

    if (!amountInput) return;

    if (nameInput.value) {
      amountInput.style.display = "inline-block";
      amountInput.placeholder = "Введить кількість";
      amountInput.focus();
    } else {
      amountInput.style.display = "none";
      amountInput.value = "";
      amountInput.placeholder = "";
    }
  });
}

// маленький помощник: читаем ввод
function readForm() {
  const name = nameInput ? nameInput.value : "";
  const amount = amountInput ? Number(amountInput.value) : 0;
  return { name, amount };
}

// маленький помощник: проверка
function validate(name, amount) {
  if (!msg) return false;

  if (!name) {
    msg.textContent = "Выберите товар.";
    return false;
  }

  if (amount <= 0) {
    msg.textContent = "Введите количество больше нуля.";
    return false;
  }

  return true;
}

function clearMsg() {
  if (!msg) return;
  msg.textContent = "";
}

// кнопка "Выдать в цех"
if (issueBtn) {
  issueBtn.addEventListener("click", function () {
    const { name, amount } = readForm();
    if (!validate(name, amount)) return;

    const result = видатиЦеху(Склад, name, amount);
    msg.textContent = result;
    renderSklad(Склад);
  });
}

// кнопка "Приняти на склад"
if (receiveBtn) {
  receiveBtn.addEventListener("click", function () {
    const { name, amount } = readForm();
    if (!validate(name, amount)) return;

    const result = прийнятиНаСклад(Склад, name, amount);
    msg.textContent = result;
    renderSklad(Склад);
  });
}
