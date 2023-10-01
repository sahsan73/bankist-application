"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
/*
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];
*/

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = function (date1, date2) {
    return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  };

  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCurrency(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
      <div class="movements__type movements__type--${type}">
        ${i + 1} ${type}
      </div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
// displayMovements(account1.movements);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(
    (accumulator, mov) => accumulator + mov,
    0
  );
  // labelBalance.textContent = `${acc.balance.toFixed(2)} EUR`;
  labelBalance.textContent = formatCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  );
};
// calcDisplayBalance(account1.movements);

const calcDisplaySummary = function (acc) {
  const [incomes, outcomes] = acc.movements.reduce(
    (accumulator, mov) => {
      accumulator[mov > 0 ? 0 : 1] += mov;
      return accumulator;
    },
    [0, 0]
  );
  // labelSumIn.textContent = `${incomes.toFixed(2)}€`;
  labelSumIn.textContent = formatCurrency(incomes, acc.locale, acc.currency);
  // labelSumOut.textContent = `${Math.abs(outcomes).toFixed(2)}€`;
  labelSumOut.textContent = formatCurrency(
    Math.abs(outcomes),
    acc.locale,
    acc.currency
  );

  // let's say our bank account pays interest on deposit and that interest
  // will be added to the acocunt if it is atleast 1 buck
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(interestPerDeposit => interestPerDeposit >= 1)
    .reduce(
      (accumulator, interestPerDeposit) => accumulator + interestPerDeposit,
      0
    );
  // labelSumInterest.textContent = `${interest.toFixed(2)}€`;
  labelSumInterest.textContent = formatCurrency(
    interest,
    acc.locale,
    acc.currency
  );
};
// calcDisplaySummary(account1.movements);

const createUsername = function (accounts) {
  accounts.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .reduce((usrId, word) => usrId + word[0], "");
  });
};
createUsername(accounts);

const updateUI = function (acc) {
  // display movements
  displayMovements(acc);

  // display balance
  calcDisplayBalance(acc);

  // display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // in each call, display the remaining time to the UI
    labelTimer.textContent = `${min}:${sec}`;

    // when 0 seconds, stop timer and logout user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
    }

    // decrease 1s
    --time;
  };

  // Set time to 5 minutes
  let time = 180;

  // call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

/////////////////////////////////////////
// Event Listener
let currentAccount, logoutTimer;

// FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 1;

btnLogin.addEventListener("click", function (e) {
  // Prevent default behaviour of the event. For example,
  // this button element is inside a form element so the
  // default behavior is to submit the form(which refreshes/reloads
  // the page) on clicking the button, and we do NOT want that!
  // Pretty common thing to do when working with forms!
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 1;

    // create current date and time
    /*
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const min = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;
    */
    // internationalization of date and time
    const now = new Date();
    // const locale = navigator.language;
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
      // weekday: "long",
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    /*
     * whenever we write something in input field, our cursor
     * will be blinking on this field. But, after logging in
     * if that cursor is still blinking in that field, it would
     * look ugly. To remove that focus, we can use "blur()" method.
     */
    inputLoginUsername.blur();
    inputLoginPin.blur();

    // start the logout timer
    if (logoutTimer) clearInterval(logoutTimer);
    logoutTimer = startLogOutTimer();

    // update user interface
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = "";
  inputTransferAmount.blur();
  inputTransferTo.blur();

  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount?.owner !== currentAccount.owner
  ) {
    // perform transfers
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    // add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());

    // update user interface
    updateUI(currentAccount);

    // reset timer
    clearInterval(logoutTimer);
    logoutTimer = startLogOutTimer();
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  // const amount = Number(inputLoanAmount.value);
  const amount = Math.floor(inputLoanAmount.value);

  /*
   * our mini bank has a rule that, it will only grant the
   * loan if the user had any previous transaction that
   * atleast 10% of the requested loan 😂!
   */
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // console.log("LOAN APPROAVED");
    // add movement
    // bank actually takes some time to approve loan, let's
    // simulate that using setTimeout function
    setTimeout(function () {
      currentAccount.movements.push(amount);

      // add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // update UI
      updateUI(currentAccount);

      // reset timer
      clearInterval(logoutTimer);
      logoutTimer = startLogOutTimer();
    }, 2500);
  }

  inputLoanAmount.value = "";
  inputLoanAmount.blur();
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const idx = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // delete the account
    accounts.splice(idx, 1);

    // hide the UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = "";
  inputCloseUsername.blur();
  inputClosePin.blur();
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const num = 3884764.25;
const options = {
  style: "unit",
  unit: "mile-per-hour",
  currency: "EUR",
};
console.log("US: ", new Intl.NumberFormat("en-US", options).format(num));
console.log("Germany: ", new Intl.NumberFormat("de-DE", options).format(num));

// setTimeout
// const ingredients = ["olives", "spinach"];
// const pizzaTimer = setTimeout(
//   function (ing1, ing2) {
//     console.log(`Here's ur pizza with ${ing1} and ${ing2} 🍕`);
//   },
//   3000,
//   ...ingredients
// );
// console.log("Waiting...");

// console.log(pizzaTimer);

// setInterval
const clockTimer = setInterval(function () {
  const now = new Date();
  const currTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).format(now);
  console.log(currTime);
}, 1000);

setTimeout(function () {
  clearInterval(clockTimer);
}, 7000);
