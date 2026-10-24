// Вставьте URL опубликованного Google Apps Script в эту переменную.
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxrz3UidHFQmvhgV2qpjcK-tdu60U6lJBMKW0WO7_bXX0uX9fQ3YAL1bBRJ2kTeDbrS/exec";

const form = document.getElementById("applicationForm");
const randomBtn = document.getElementById("fillRandomBtn");
const formMessage = document.getElementById("formMessage");
const submitBtn = document.getElementById("submitBtn");

const fieldNames = [
  "firstName", "lastName", "email", "phone", "company", "position",
  "service", "budget", "deadline", "launchDate", "pagesCount",
  "description", "website", "source", "contactMethod"
];

function getField(name) {
  return form.elements.namedItem(name);
}

function showError(name, message = "") {
  const field = getField(name);
  const error = document.getElementById(`${name}Error`);
  if (error) error.textContent = message;
  if (field) {
    field.classList.toggle("invalid", Boolean(message));
    field.setAttribute("aria-invalid", message ? "true" : "false");
  }
}

function validateForm() {
  let valid = true;
  const value = (name) => String(getField(name).value || "").trim();

  const check = (name, message) => {
    showError(name, message);
    if (message) valid = false;
  };

  const namePattern = /^[\p{L}\s'-]+$/u;

  for (const name of ["firstName", "lastName"]) {
    const v = value(name);
    let error = "";
    if (v.length < 2) error = "Введите минимум 2 символа.";
    else if (!namePattern.test(v)) error = "Используйте только буквы и пробелы.";
    check(name, error);
  }

  const email = value("email");
  check("email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? "" : "Введите корректный email.");

  const phone = value("phone");
  check("phone", /^\+998\d{9}$/.test(phone.replace(/[\s()-]/g, ""))
    ? "" : "Телефон должен начинаться с +998 и содержать 12 цифр.");

  for (const name of ["service", "budget", "deadline", "source", "contactMethod"]) {
    check(name, value(name) ? "" : "Выберите вариант из списка.");
  }

  const description = value("description");
  check("description", description.length >= 30
    ? "" : "Описание должно содержать минимум 30 символов.");

  const pages = value("pagesCount");
  let pagesError = "";
  if (pages !== "") {
    const count = Number(pages);
    if (!Number.isInteger(count) || count < 1 || count > 100) {
      pagesError = "Введите целое число от 1 до 100.";
    }
  }
  check("pagesCount", pagesError);

  const website = value("website");
  let websiteError = "";
  if (website) {
    try {
      const url = new URL(website);
      if (!["http:", "https:"].includes(url.protocol)) {
        websiteError = "Ссылка должна начинаться с http:// или https://.";
      }
    } catch {
      websiteError = "Введите корректный URL, например https://example.com.";
    }
  }
  check("website", websiteError);

  // Необязательные поля без дополнительных правил.
  for (const name of ["company", "position", "launchDate"]) {
    showError(name, "");
  }

  return valid;
}

function clearMessage() {
  formMessage.textContent = "";
  formMessage.className = "form-message";
}

form.addEventListener("input", (event) => {
  if (event.target.name && document.getElementById(`${event.target.name}Error`)) {
    showError(event.target.name, "");
  }
  clearMessage();
});

form.addEventListener("change", (event) => {
  if (event.target.name && document.getElementById(`${event.target.name}Error`)) {
    showError(event.target.name, "");
  }
  clearMessage();
});

const pick = (items) => items[Math.floor(Math.random() * items.length)];
const randomDigits = (length) => Array.from(
  { length }, () => Math.floor(Math.random() * 10)
).join("");

randomBtn.addEventListener("click", () => {
  const firstNames = ["Алишер", "Дилшод", "Малика", "Самира", "Азиз", "София"];
  const lastNames = ["Каримов", "Юсупов", "Абдуллаева", "Рахимова", "Ибрагимов"];
  const companies = ["Pixel Lab", "Nova Studio", "Bright Tech", "WebCraft", ""];
  const positions = ["Основатель", "Менеджер проекта", "CEO", "Маркетолог", ""];
  const descriptions = [
    "Нужен современный адаптивный сайт для нашей компании. Важно добавить удобную навигацию, форму обратной связи и красивый дизайн.",
    "Хотим разработать удобный интернет-магазин с каталогом товаров, поиском, корзиной и простой административной панелью.",
    "Нужен сайт для нового проекта с адаптивной версткой, современным оформлением и возможностью легко обновлять содержимое."
  ];

  getField("firstName").value = pick(firstNames);
  getField("lastName").value = pick(lastNames);
  getField("email").value = `test${randomDigits(5)}@example.com`;
  getField("phone").value = `+998${randomDigits(9)}`;
  getField("company").value = pick(companies);
  getField("position").value = pick(positions);
  getField("service").value = pick([
    "Лендинг", "Корпоративный сайт", "Интернет-магазин",
    "Веб-приложение", "Мобильное приложение", "Дизайн (лого/брендинг)"
  ]);
  getField("budget").value = pick([
    "до 1000$", "1000-5000$", "5000-10000$", "10000-25000$", "свыше 25000$"
  ]);
  getField("deadline").value = pick([
    "до 2 недель", "1 месяц", "1-2 месяца", "3+ месяцев", "не срочно"
  ]);

  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * 90) + 1);
  getField("launchDate").value =
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  getField("pagesCount").value = String(Math.floor(Math.random() * 20) + 1);
  getField("description").value = pick(descriptions);
  getField("website").value = pick(["https://example.com", "https://demo.example.org", ""]);
  getField("source").value = pick([
    "Instagram", "Telegram", "Google", "Рекомендация друзей", "Другое"
  ]);
  getField("contactMethod").value = pick(["Telegram", "WhatsApp", "Email", "Телефон"]);

  fieldNames.forEach((name) => showError(name, ""));
  clearMessage();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearMessage();

  if (!validateForm()) {
    formMessage.textContent = "Проверьте поля, отмеченные красным.";
    formMessage.className = "form-message failure";
    const firstInvalid = form.querySelector(".invalid");
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  if (!APPS_SCRIPT_URL.startsWith("https://script.google.com/")) {
    formMessage.textContent = "Форма проверена, но отправка ещё не настроена. Добавьте URL веб-приложения Apps Script в js/script.js.";
    formMessage.className = "form-message failure";
    return;
  }

  const data = Object.fromEntries(new FormData(form).entries());
  submitBtn.disabled = true;
  submitBtn.textContent = "Отправка...";

  try {
    // Apps Script обычно удобнее принимать в режиме no-cors.
    // В этом режиме браузер не позволяет прочитать ответ, поэтому нельзя
    // достоверно проверить, дошла ли заявка до Telegram.
    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(data)
    });

    form.reset();
    fieldNames.forEach((name) => showError(name, ""));
    formMessage.textContent = "Запрос отправлен. Если Apps Script настроен правильно, заявка поступит в Telegram.";
    formMessage.className = "form-message success";
  } catch (error) {
    formMessage.textContent = "Не удалось отправить заявку. Проверьте подключение и настройки Apps Script.";
    formMessage.className = "form-message failure";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Отправить заявку";
  }
});
