const Склад = [
    { name: "Бумага A1", quantity: 99, minLevel: 100 },
    { name: "Краска CYAN", quantity: 20, minLevel: 10 },
    { name: "Плівка", quantity: 20, minLevel: 15 }
];
function проверкаСклад(items) {
    for (let i = 0; i < items.length; i++) {
        if (items[i].quantity < items[i].minLevel) {
            console.log(`${items[i].name} треба заказати!`);
        }
    }
}
function видатиЦеху(items, name, amount) {
    for (let i = 0; i < items.length; i++) {

        if (items[i].name === name) {

            if (items[i].quantity >= amount) {
                items[i].quantity -= amount;

                return `${name} видано: ${amount}. Залишок: ${items[i].quantity}`;
            } else {
                return `Недостатньо "${name}" на складі. Залишок: ${items[i].quantity}`;
            }

        }
    }

    return `Товар "${name}" не знайдено`;
}

// видатиЦеху(Склад, "Краска CYAN", 10);
function прийнятиНаСклад(items, name, amount) {
    for (let i = 0; i < items.length; i++) {

        if (items[i].name === name) {
            items[i].quantity += amount;
            return `${name} прийнято: ${amount}. Залишок: ${items[i].quantity}`;
        }

    }

    return `Товар "${name}" не знайдено`;
}

проверкаСклад(Склад);

function renderSklad(items) {
    const app = document.getElementById("app");

    if (!app) return; // если открыли не ту страницу
    let html = "<h2>Остатки на складе</h2><ul>";

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const status = item.quantity < item.minLevel ? "Нужно заказать" : "OK";

        html += `<li>${item.name}: ${item.quantity} (min ${item.minLevel}) — ${status}</li>`;
    }

    html += "</ul>";

    app.innerHTML = html;
}

renderSklad(Склад);

const issueBtn = document.getElementById("issueBtn");
const msg = document.getElementById("msg");

if (issueBtn) {
    issueBtn.addEventListener("click", function () {
        const name = document.getElementById("nameInput").value;
        const amount = Number(document.getElementById("amountInput").value);

        // простая проверка
        if (!name || !amount) {
            msg.textContent = "Введите название и количество.";
            return;
        }

        // попробуем выдать
        const result = видатиЦеху(Склад, name, amount);

        // покажем сообщение
        msg.textContent = result;

        // перерисуем склад
        renderSklad(Склад);
    });
    
    const receiveBtn = document.getElementById("receiveBtn");

    if (receiveBtn) {
        receiveBtn.addEventListener("click", function () {

            const name = document.getElementById("nameInput").value;
            const amount = Number(document.getElementById("amountInput").value);

            if (!name || !amount) {
                msg.textContent = "Введіть назву і кількість.";
                return;
            }

            const result = прийнятиНаСклад(Склад, name, amount);

            msg.textContent = result;

            renderSklad(Склад);
        });
    }

}