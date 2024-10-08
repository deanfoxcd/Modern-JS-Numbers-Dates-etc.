'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2024-09-28T17:01:17.194Z',
    '2024-10-01T23:36:17.929Z',
    '2024-10-03T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions
const formatMovementDate = function (movDate, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.floor(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const daysPassed = calcDaysPassed(new Date(), movDate);
  console.log(daysPassed);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed > 1 && daysPassed < 7) return `${daysPassed} days ago`;
  // else {

  // New way
  return Intl.DateTimeFormat(locale).format(movDate);

  // Old way
  // const day = `${movDate.getDate()}`.padStart(2, 0);
  // const month = `${movDate.getMonth() + 1}`.padStart(2, 0);
  // const year = movDate.getFullYear();
  // return `${day}/${month}/${year}`;
  // }
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = ''; // Clear old data

  const movs = sort
    ? currentAccount.movements.slice().sort((a, b) => a - b) // Sorts a copy
    : currentAccount.movements;

  movs.forEach((mov, i) => {
    const transactionType = mov > 0 ? 'deposit' : 'withdrawal';

    const movDate = new Date(account.movementsDates[i]);
    const displayDate = formatMovementDate(movDate, account.locale);

    const html = `<div class="movements__row">
      <div class="movements__type movements__type--${transactionType}">${
      i + 1
    } ${transactionType}</div>
    <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formatCur(
        mov,
        account.locale,
        account.currency
      )}</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html); // afterbegin means all new ones will be on top
  });
};

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.textContent = formatCur(
    account.balance,
    account.locale,
    account.currency
  );
};

const calcDisplaySummary = function (account) {
  const movs = account.movements;
  const withdrawals = movs
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(
    withdrawals,
    account.locale,
    account.currency
  );
  const deposits = movs
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(
    deposits,
    account.locale,
    account.currency
  );

  const interest = movs
    .filter(mov => mov > 0)
    .map(mov => (mov * account.interestRate) / 100)
    .filter(int => int > 1) // makes it so that interest is only added if it's greater than €1
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = formatCur(
    interest,
    account.locale,
    account.currency
  );
};

const createUsernames = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);
// console.log(accounts);

const updateUI = function (account) {
  //Display movements
  displayMovements(account);
  //Display balance
  calcDisplayBalance(account);
  //Display summary
  calcDisplaySummary(account);
};

const startLogoutTimer = function () {
  const tick = () => {
    const minutes = Math.floor(time / 60);
    const seconds = `${time % 60}`.padStart(2, 0);
    labelTimer.textContent = `${minutes}:${seconds}`;
    time--;
    if (time < 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
  };

  let time = 5 * 60;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

// Event Handlers

let currentAccount;
let timer;

// // Fake Always Logged in
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

// Experimenting API
/*
const now = new Date();
const options = {
  hour: 'numeric',
  minute: 'numeric',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  weekday: 'long',
};
const locale = navigator.language;
labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now);
*/

// Login
btnLogin.addEventListener('click', e => {
  e.preventDefault(); // Prevents form from submitting

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and welcome message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Create date and time
    const now = new Date();
    // New way
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    };
    // const locale = navigator.language;
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Old way
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const minutes = `${now.getMinutes()}`.padStart(2, 0);
    // const seconds = `${now.getSeconds()}`.padStart(2, 0);

    // labelDate.textContent = `${day}/${month}/${year} ${hour}:${minutes}:${seconds}`;

    //Clear input fields and move focus
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if (timer) clearInterval(timer); // Avoids 2 timers running if someone else logs in before timer ends

    timer = startLogoutTimer();
    updateUI(currentAccount);
  }
});

// Transfer Money
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const targetAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  const transferAmount = +inputTransferAmount.value;

  if (
    transferAmount > 0 &&
    targetAcc &&
    currentAccount.balance >= transferAmount &&
    targetAcc?.username !== currentAccount.username //first arg can return undefined so targetAcc && si still necessary
  ) {
    currentAccount.movements.push(-transferAmount);
    targetAcc.movements.push(transferAmount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    targetAcc.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);
    clearInterval(timer);
    timer = startLogoutTimer();
  } else alert('Invalid transfer');

  inputTransferTo.value = '';
  inputTransferAmount.value = '';
});

// Request loan (at least one deposit of 10% of the loan amount)
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const loanAmount = Math.floor(inputLoanAmount.value);
  if (
    loanAmount > 0 &&
    currentAccount.movements.some(mov => mov > loanAmount / 10)
  ) {
    setTimeout(function () {
      currentAccount.movements.push(loanAmount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // Rest Timer
      clearInterval(timer);
      timer = startLogoutTimer();
    }, 3000);
  } else {
    alert('You cannot borrow that much money, sorry');
  }
  inputLoanAmount.value = '';
});

// Close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // Delete account
    accounts.splice(index, 1);
    // Hide UI
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin = '';
  }
});

// Sort transactions
let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// Converting and Checking Numbers
/*

// Sortcut to convert to Number
console.log(+'23');

// Parsing
console.log(Number.parseInt('30px', 10)); // 30
console.log(Number.parseInt('e23', 10)); // NaN. Needs to start with a number

console.log(Number.parseFloat('23.5px')); // 23.5. parseInt won't show decimal

// Check if value is NaN
console.log(Number.isNaN(20)); // false
console.log(Number.isNaN('20')); // false
console.log(Number.isNaN(+'20X')); // true
console.log(Number.isNaN(23 / 0)); // false. prints infinity

// Check if value is a number
console.log(Number.isFinite(20)); // true
console.log(Number.isFinite('20')); // false
console.log(Number.isFinite(+'20X')); //false
console.log(Number.isFinite(23 / 0)); // false
*/

// A few more methods
/*
console.log(Math.sqrt(100));

console.log(Math.max(5, 89, 23, 1, 10)); // won't work with a string in there
console.log(Math.min(5, 89, 23, 1, 10)); // won't work with a string in there

console.log(Math.PI * Number.parseFloat('10px') ** 2);

console.log(Math.floor(Math.random() * 6 + 1));

const randomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;
console.log(randomInt(10, 21));
*/

//Rounding integers
/*
console.log('-----Rounding-----');

console.log(Math.trunc(23.3)); // 23
console.log(Math.trunc(23.9)); // 23
console.log(Math.trunc(-23.9)); // -23

console.log(Math.round(23.3)); // 23
console.log(Math.round(23.9)); // 24

console.log(Math.ceil(23.3)); // 24
console.log(Math.ceil(23.9)); // 24
console.log(Math.ceil(-23.9)); // -23

console.log(Math.floor(23.3)); // 23
console.log(Math.floor(23.9)); // 23
console.log(Math.floor(-23.9)); // -24

// Rounding decimals
console.log((2.7).toFixed(0)); // 3 as a string
console.log((2.7).toFixed(3)); // 2.700 as a string
*/

// Remainder function
/*

console.log(5 % 2); // 1
console.log(8 % 3); // 2

// Check even or odd
const isEven = num =>
  num % 2 === 0
    ? console.log(`${num} is an even number`)
    : console.log(`${num} is an odd number`);
isEven(50);
isEven(54783920);
isEven(33);

labelBalance.addEventListener('click', () => {
  [...document.querySelectorAll('.movements__row')].forEach((row, i) => {
    if (i % 2 === 0) row.style.backgroundColor = 'pink';
    if (i % 3 === 0) row.style.backgroundColor = 'orange';
  });
});
*/

// Number separators
/*
const diameter = 287_460_000_000;
console.log(diameter); // Ignores the _

const priceCents = 345_99;
console.log(priceCents); // 34599

const transferFee1 = 15_00;
const transferFee2 = 1_500;

// Can't convert strings with an _ in it
*/

// Dates
/*
// Create a date
const now = new Date();
console.log(now);
console.log(new Date('August 4, 1987'));
console.log(new Date(account1.movementsDates[0]));

// Months are zero based

console.log(new Date(0)); // The date time began for computers
// 3 days after in ms:
console.log(new Date(3 * 24 * 60 * 60 * 1000));


// Working with dates
const future = new Date(2037, 10, 19, 15, 23);
console.log(future.getFullYear()); // 2037
console.log(future.getMonth()); // 10 (zero based)
console.log(future.getDate()); // 19 (getDay is the day of the week)
// etc.
console.log(future.toISOString());
console.log(future.getTime()); // Logs the ms that have passed until this date

console.log(Date.now());
// date.set also exists for all above
*/

// Operations with dates
/*

const future = new Date(2037, 10, 19, 15, 23);
console.log(future);

const calcDaysPassed = (date1, date2) =>
  Math.abs((date2 - date1) / (1000 * 60 * 60 * 24));

const days1 = calcDaysPassed(new Date(2037, 3, 14), new Date(2037, 3, 4));
console.log(days1);
*/

// Internationalizing numbers
/*

const num = 3777281.75;

const options = {
  style: 'unit',
  unit: 'mile-per-hour',
};

console.log('US: ', new Intl.NumberFormat('en-US', options).format(num));
console.log('Germany: ', new Intl.NumberFormat('de-DE', options).format(num));
console.log(
  'US: ',
  new Intl.NumberFormat(navigator.language, options).format(num)
);
*/

// Set timeout
/*

setTimeout(
  (ing1, ing2) => {
    console.log(`Here is your pizza with ${ing1} and ${ing2}`);
  },
  2000,
  'olives',
  'feta'
);
// Any arguments passed after the time can be used in the callback function

// To conditionally clear the timer
const ingredients = ['spinach', 'chicken'];

const pizzaTimer = setTimeout(
  (ing1, ing2) => {
    console.log(`Here is your pizza with ${ing1} and ${ing2}`);
  },
  2000,
  ...ingredients
);
if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);
// Above won't log to console
*/

// Set Interval
/*

// My attempt at clock
setInterval(function () {
  const now = new Date();

  const hours = `${now.getHours()}`.padStart(2, 0);
  const minutes = `${now.getMinutes()}`.padStart(2, 0);
  const seconds = `${now.getSeconds()}`.padStart(2, 0);

  // console.log(`${hours}:${minutes}:${seconds}`);
  // console.log(now);
}, 1000);

// A better solution
// const clock = setInterval(() => {
//   const now = new Date();
//   const options = {
//     hour: 'numeric',
//     minute: 'numeric',
//     second: 'numeric',
//   };
//   console.log(new Intl.DateTimeFormat(navigator.language, options).format(now));
// }, 1000);
*/
