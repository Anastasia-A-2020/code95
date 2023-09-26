const BASE_COST = "150"; // базовая цена карты
const surcharge = "100"; // доплата, если клиент хочет заказать код на основе бумажного или пластикового кода, или если живет в Польше больше 6 мес, или если нет работодателя или работодатель не польский с одновременным условием КОРОТКИЙ КОД

const submissionOfDocuments = {
  office: "0", //подача в Варшаве
  remotely: "75", // подача удаленно
};

const deliveryPrices = {
  ownAddres: "0", // свой адрес (с личным получением заказного письма)
  getInOffice: "50", // получение в офисе
  shippmentInPoland: "100", // пересылка по Польше
  shipmentInternational: "130", // международная пересылка, кроме РФ
};

const orderCode = {
  shortCode95: "0", // профиль PKZ для обучения на Короткий Код 95
  longCode95: "0", // профиль PKZ для обучения на Длинный Код 95
  plasticByPaperCode95: surcharge, // пластиковый Код 95 на основе бумажного Кода 95 PL (+100)
  plasticByPlasticCode95: surcharge, // пластиковый Код 95 на основе пластикового Кода 95 PL (+100)
};

const stayInPoland = {
  moreSixMonth: surcharge, // больше 6 мес в Польше
  lessSixMonth: "0", // меньше  6 мес в Польше
};

const employer = {
  plEmployer: "0", // польский работодатель
  anotherEmployer: surcharge, // не польский работодатель
  havenotEmployer: surcharge, // нет работодателя
};

// SLIDER
const formSlider = document.querySelectorAll(
  ".slider .slider__line .slider__item"
);

const sliderLine = document.querySelector(".slider__line");
const sliderBtn = document.querySelector("#slider__next");
const secondPage = document.querySelector(".second-page");
let count = 0;
let width = document.querySelector(".slider").offsetWidth;

init();
window.addEventListener("resize", init);
sliderBtn.addEventListener("click", onBtnNext);
sliderBtn.addEventListener("click", onChangeInputValue);

function init() {
  if (width !== document.querySelector(".slider").offsetWidth) {
    width === document.querySelector(".slider").offsetWidth;
  }
  sliderLine.style.width = width * formSlider.length + "px";
  formSlider.forEach(item => {
    item.style.width = width + "px";
  });
}

function onBtnNext() {
  count++;
  if (count >= formSlider.length) {
    count = 0;
  }

  count === 1
    ? ((sliderBtn.textContent = "Назад"),
      (document.body.scrollTop = 0), // For Safari,
      (document.documentElement.scrollTop = 0),
      sliderBtn.blur(),
      removeClass(refs.contacts, "visually-hidden", "is-hidden"),
      removeClass(secondPage, "visually-hidden", "is-hidden"),
      addClass(refs.deliveryItem, "visually-hidden", "is-hidden"),
      addClass(refs.orderItem, "visually-hidden", "is-hidden"),
      addClass(refs.whopayItem, "visually-hidden", "is-hidden"))
    : ((sliderBtn.textContent = "Дальше"),
      sliderBtn.blur(),
      addClass(refs.contacts, "visually-hidden", "is-hidden"),
      addClass(secondPage, "visually-hidden", "is-hidden"),
      removeClass(refs.deliveryItem, "visually-hidden", "is-hidden"),
      removeClass(refs.orderItem, "visually-hidden", "is-hidden"),
      removeClass(refs.whopayItem, "visually-hidden", "is-hidden"));

  rollSlider();
}

function rollSlider() {
  sliderLine.style.transform = `translate(-${+count * width}px)`;
}

//FORM LOGIC

const refs = {
  form: document.querySelector("#form"),
  whopayItem: document.getElementById("whoPay"),
  orderItem: document.getElementById("order"),
  deliveryItem: document.getElementById("delivery"),
  deliveryAddress: document.querySelector("#deliveryAddress"),
  dateOfVisit: document.querySelector("#dateVisit"),
  totalPrice: document.querySelector("#totalPriceValue"),
  contacts: document.querySelector("#contacts"),
  backdrop: document.querySelector(".backdrop"),
};

const EMAIL_REGEXP =
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

{
  refs.totalPrice.value = BASE_COST + " zl";
  refs.form.addEventListener("change", onChangeInputValue);
  refs.form.addEventListener("submit", onCalculatorFormSubmit);
  document.getElementById("telNumber").addEventListener("input", onInputTel);
  document.getElementById("email").addEventListener("input", onInput);
  document.getElementById("pesel").addEventListener("input", onInputPesel);
}

function onChangeInputValue() {
  const visited = findCheckedItem("readyToComeInOffice");
  const ordered = findCheckedItem("orderCode");
  const delivery = findCheckedItem("deliveryMethod");
  const lengthOfStayInPoland = findCheckedItem("livingInPoland");
  const dataEmployer = findCheckedItem("employer");
  let supplementForLiving = stayInPoland[lengthOfStayInPoland];
  let supplementForEmployer;
  let supplement;

  if (visited === "remotely") {
    addClass(refs.dateOfVisit, "visually-hidden", "is-hidden");
  } else {
    removeClass(refs.dateOfVisit, "visually-hidden", "is-hidden");
  }

  if (delivery === "getInOffice") {
    addClass(refs.deliveryAddress, "visually-hidden", "is-hidden");
  } else {
    removeClass(refs.deliveryAddress, "visually-hidden", "is-hidden");
  }

  if (dataEmployer === "plEmployer") {
    supplementForEmployer = employer[dataEmployer];
  } else if (dataEmployer !== "plEmployer" && ordered === "shortCode95") {
    supplementForEmployer = employer[dataEmployer];
  } else if (ordered === "shortCode95") {
    supplementForEmployer = 0;
  } else {
    supplementForEmployer = 0;
  }

  if (
    +orderCode[ordered] > 0 ||
    +supplementForLiving > 0 ||
    +supplementForEmployer > 0
  ) {
    supplement = surcharge;
  } else {
    supplement = 0;
  }

  refs.totalPrice.value =
    +BASE_COST + +deliveryPrices[delivery] + +supplement + " zl";
}

function onCalculatorFormSubmit(event) {
  event.preventDefault();

  const personalSubmissionOfDocs = findCheckedItem("readyToComeInOffice");
  const clientName = document.getElementById("clientName").value.trim();
  const clientTelephone = document.getElementById("telNumber").value.trim();
  const myPhoneIsIn = [...document.querySelectorAll(".contacts__input")]
    .filter(el => el.checked)
    .map(el => el.value);
  const clientEmail = document.getElementById("email").value.trim();
  const clientPesel = document.getElementById("pesel").value.trim();
  const clientCountry = document.getElementById("country").value.trim();
  const delivery = [
    ...document.querySelectorAll(`[name="deliveryMethod"]`),
  ].find(item => item.checked).parentNode.innerText;
  const clientAddress = document.getElementById("address").value.trim()
    ? document.getElementById("address").value.trim()
    : " ";
  const dateOfVisit = document.getElementById("dateVisitInput").value.trim();
  const whoPay = [...document.querySelectorAll("[data-pay]")]
    .find(item => item.checked)
    .value.trim();
  const wantToOrder = [...document.querySelectorAll("[data-order]")].find(
    item => item.checked
  );
  const livingInPoland = [
    ...document.querySelectorAll("[data-livingInPoland]"),
  ].find(item => item.checked);

  const infoEmployer = [
    ...document.querySelectorAll("[data-infoEmployer]"),
  ].find(item => item.checked);

  try {
    Email.send({
      SecureToken: "ec88ce96-761e-461f-9b06-00ca22ca8bfb",
      To: "infobynet@gmail.com",
      From: "infobynet@gmail.com",

      Subject: "ЗАЯВКА на PKZ",
      Body: `Code95 <hr/>
            Имя:  &#x20; ${clientName}, <br/>
            Почта: &#x20; ${clientEmail}, <br/>
            Телефон: &#x20; ${clientTelephone}, <br/>
            Мой телефон есть в: &#x20; ${myPhoneIsIn}, <br/>
            Номер Pesel:  &#x20; ${clientPesel}, <br/>
            Страна, в которой родился клиент: ${clientCountry}, <br/>
            Хочу заказать: ${wantToOrder.dataset.order}, <br/>
            Я работаю или живу в Польше: ${
              livingInPoland.dataset.livinginpoland
            }, <br/>
            Подача документов: ${personalSubmissionOfDocs}, <br/>
            ${
              dateOfVisit !== "<hr/>"
                ? `Желаемая дата посещения офиса: ${dateOfVisit}`
                : ""
            } <br/>
            Способ доставки: ${delivery}    <br/>  
            ${
              delivery === "офис в Варшаве - лично или представитель"
                ? ""
                : `Адресс доставки: ${clientAddress} `
            }                  
             <br/>
             Данные работодателя: ${infoEmployer.dataset.infoemployer}, <br/>  
            Кто платит: ${whoPay}   <br/>
            Стоимость услуги: &#x20; ${refs.totalPrice.value} <hr/>            
           
    `,
    }).then(data => removeClass(refs.backdrop, "visually-hidden", "is-hidden"));
  } catch (error) {
    alert("Не удалось отправить заявку");
    console.log(error);
  }

  event.currentTarget.reset();
}

function addClass(element, ...className) {
  return element.classList.add(...className);
}

function removeClass(element, ...className) {
  return element.classList.remove(...className);
}

function onInput(e) {
  const email = e.target.value.trim();

  if (isEmailValid(email)) {
    e.target.style.borderColor = "#2E8B57cc";
  } else {
    e.target.style.borderColor = "#CD5C5Ccc";
  }
}

function onInputTel(e) {
  if (String(e.target.value).length > 7 && String(e.target.value).length < 17) {
    e.target.style.borderColor = "#2E8B57cc";
  } else {
    e.target.style.borderColor = "#CD5C5Ccc";
  }
}

function onInputPesel(e) {
  if (String(e.target.value).length > 6) {
    e.target.style.borderColor = "#2E8B57cc";
  } else {
    e.target.style.borderColor = "#CD5C5Ccc";
  }
}

function isEmailValid(value) {
  return EMAIL_REGEXP.test(value);
}

function findCheckedItem(colectionsName) {
  return [...document.querySelectorAll(`[name=${colectionsName}]`)].find(
    item => item.checked
  ).value;
}
