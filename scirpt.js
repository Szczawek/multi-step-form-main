const price = document.getElementById("price");
const form = document.querySelector("form");
const stage = document.querySelectorAll(".content > section");
const btnBack = document.getElementById("backward");
const btnForw = document.getElementById("forward");
const link = document.getElementById("link-to-pick");
const btnSwitch = document.getElementById("btn-switch");
const ofert = document.querySelectorAll("#ofert");
const ofertInPick = document.querySelectorAll("#choice-ofert");
const btnOfert = document.querySelectorAll("#pick-plan-btn");
const checkbox = document.querySelectorAll("input[type='checkbox'");
const quickSwap = document.querySelectorAll("li");
const circle = document.getElementById("circle");

let amount = 0;
//sets the current position to "selected plan"
link.addEventListener("click", () => move("="));

function validity() {
  if (form.checkValidity() && position == 3) {
    btnForw.textContent = "confirme";
    btnForw.addEventListener("click", () => {
      move("+");
      document.querySelector(".control_panel").style.display = "none";
      form.style.gridTemplateRows = "1fr";
    });
  } else {
    btnForw.textContent = "Next Step";
    btnForw.setAttribute("type", "button");
  }
}
let position = 0;
let prevPosition;
// when you click the button put you in the desired location
quickSwap.forEach((e) =>
  e.addEventListener("click", () => {
    move("=", Number(e.ariaValueText));
    validity();
  })
);

// function, which creates a movement to put you where you want to be
function move(e, s = 1) {
  if (position < 4 && position >= 0) {
    prevPosition = position;
    switch (e) {
      case "-":
        position -= s;
        break;
      case "+":
        position += s;
        break;
      case "=":
        position = s;
    }
    stage[prevPosition].classList.add("ghost");
    stage[position].classList.remove("ghost");
    if (position > 0) {
      btnBack.classList.remove("vanish");
    } else {
      btnBack.classList.add("vanish");
    }
    background();
    finalPrice();
  }
}
// sets the background color of the li when the element is active
function background() {
  if (position <= 3 && position != prevPosition) {
    document
      .getElementById(`${stage[position].ariaValueText}`)
      .classList.add("active");
    if (prevPosition >= 0) {
      document
        .getElementById(`${stage[prevPosition].ariaValueText}`)
        .classList.remove("active");
    }
  }
}
// move by section up
btnForw.addEventListener("click", () => {
  if (position < 3) {
    move("+");
    validity();
  }
});
// move by section down
btnBack.addEventListener("click", () => {
  move("-");
  validity();
});
// Switch monthly offer with yearly
function switchOfert(type, typeTwo) {
  ofert.forEach((e, index) => (e.textContent = type[index]));
  ofertInPick.forEach((e, index) => (e.textContent = typeTwo[index]));
  checkbox.forEach((e, index) => (e.value = typeTwo[index]));
  btnOfert.forEach((e, index) => e.setAttribute("value", `${type[index]}`));
}
let checkOfert = true;
let monthOrYear = "Monthly";
const historyMonthly = [];
const historyYearly = ["$90/yr", "$120/yr", "$150/yr"];
ofert.forEach((e) => historyMonthly.push(e.textContent));

// toggle button
let startAfterOne = 0;
btnSwitch.addEventListener("click", () => {
  circle.classList.toggle("plusk_right");
  startAfterOne == 1
    ? circle.classList.toggle("plusk_left")
    : (startAfterOne = 1);

  document
    .querySelectorAll("#yearly")
    .forEach((e) => e.classList.toggle("ghost"));
  if (checkOfert) {
    switchOfert(historyYearly, historyYearlyPick);
    checkOfert = false;
    monthOrYear = "Yearly";
  } else {
    switchOfert(historyMonthly, historyMonthlyPick);
    checkOfert = true;
    monthOrYear = "Monthly";
  }
  refresh(monthOrYear);
});

const historyMonthlyPick = [];
ofertInPick.forEach((e) => historyMonthlyPick.push(e.textContent));
const historyYearlyPick = ["+$10/yr", "+$20/yr", "+$20/yr"];

// Chooses one of three possible plans
let prevPlan = 0;
let currentElement;

btnOfert.forEach((e, index) =>
  e.addEventListener("click", () => pickBgc(e, index))
);

function pickBgc(e, index) {
  btnOfert[prevPlan].classList.remove("pick_plan_active");
  btnOfert[prevPlan].ariaChecked = false;
  e.classList.add("pick_plan_active");
  e.ariaChecked = true;
  prevPlan = index;
  currentElement = e;
  refresh(monthOrYear);
}

// Maybe looks like shit meybe works like shit but works
function refresh(type) {
  document.getElementById(
    "plan-name"
  ).textContent = `${currentElement.name} (${type})`;
  document.getElementById("price").textContent = currentElement.value;
  document.querySelectorAll("#plan-bonus > p").forEach((e) => {
    const subName = document.querySelector(
      `input[name="${e.ariaValueText}"]`
    ).value;
    e.textContent = e.ariaValueText;
    const span = document.createElement("span");
    span.setAttribute("class", "all-price");
    span.textContent = subName;
    e.appendChild(span);
  });
}
// add the prices of all the things we chose
let sum = 0;
function finalPrice() {
  sum = 0;
  const total = document.getElementById("fina-price");
  const container = document.getElementById("fina-price-container");
  const add = document
    .querySelectorAll(".all-price")
    .forEach((e) => (sum += Number(e.textContent.split(/\D/).join(""))));
  if (monthOrYear == "Monthly") {
    container.textContent = "Total (per month)";
    total.textContent = `$${sum}/mo`;
  } else {
    container.textContent = "Total (per year)";
    total.textContent = `$${sum}/yr`;
  }
}
const bonus = document.getElementById("plan-bonus");
checkbox.forEach((e, index) =>
  e.addEventListener("click", () => addBonus(e, index))
);
const checkId = [];
const bonusName = [];
function addBonus(e, index) {
  bgcTwo(e, index);
  const bonusId = checkId.indexOf(e.id);
  const p = document.createElement("p");
  p.setAttribute("id", `${e.id}-bonus`);
  p.setAttribute("aria-valuetext", `${e.name}`);
  p.textContent = `${e.name}`;
  const span = document.createElement("span");
  span.setAttribute("class", "all-price");
  span.setAttribute("id", `${e.id}-span`);
  span.textContent = `${e.value}`;
  p.appendChild(span);
  if (bonusId == -1) {
    checkId.push(e.id);
    bonus.appendChild(p);
  } else {
    checkId.splice(bonusId, 1);
    bonus.removeChild(document.getElementById(`${e.id}-bonus`));
  }
}
const label = document.querySelectorAll("#pick-label > label");
let tellMeStory = [];
function bgcTwo(e, index) {
  let check = tellMeStory.indexOf(index);
  if (check != -1) {
    tellMeStory.splice(check, 1);
    label[index].classList.remove("pick_plan_active");
  } else {
    tellMeStory.push(index);
    label[index].classList.add("pick_plan_active");
  }
}

function start() {
  finalPrice();
  currentElement = btnOfert[0];
  refresh(monthOrYear);
  background();
}
start();
