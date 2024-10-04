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
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
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

const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = ''; // Clear old data

  const movs = sort
    ? currentAccount.movements.slice().sort((a, b) => a - b) // Sorts a copy
    : currentAccount.movements;

  movs.forEach((mov, i) => {
    const transactionType = mov > 0 ? 'deposit' : 'withdrawal';

    const movDate = new Date(account.movementsDates[i]);
    const day = `${movDate.getDate()}`.padStart(2, 0);
    const month = `${movDate.getMonth() + 1}`.padStart(2, 0);
    const year = movDate.getFullYear();

    const displayDate = `${day}/${month}/${year}`;

    const html = `<div class="movements__row">
      <div class="movements__type movements__type--${transactionType}">${
      i + 1
    } ${transactionType}</div>
    <div class="movements__date">${displayDate}</div>
      <div class="movements__value">€${mov.toFixed(2)}</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html); // afterbegin means all new ones will be on top
  });
};

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.textContent = `€${account.balance.toFixed(2)}`;
};

const calcDisplaySummary = function (account) {
  const movs = account.movements;
  const withdrawals = movs
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `€${Math.abs(withdrawals).toFixed(2)}`;
  const deposits = movs
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `€${Math.abs(deposits).toFixed(2)}`;

  const interest = movs
    .filter(mov => mov > 0)
    .map(mov => (mov * account.interestRate) / 100)
    .filter(int => int > 1) // makes it so that interest is only added if it's greater than €1
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `€${interest.toFixed(2)}`;
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

let currentAccount;

// Event Handlers

// // Fake Always Logged in
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

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
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const minutes = `${now.getMinutes()}`.padStart(2, 0);
    const seconds = `${now.getSeconds()}`.padStart(2, 0);

    labelDate.textContent = `${day}/${month}/${year} ${hour}:${minutes}:${seconds}`;

    //Clear input fields and move focus
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
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
    currentAccount.movements.push(loanAmount);

    // Add loan date
    currentAccount.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);
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
// Create a date
/*
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
console.log(new Date().toISOString());
