'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Anish Shetty',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2021-04-01T10:17:24.185Z',
    '2021-05-08T14:11:59.604Z',
    '2023-07-07T17:01:17.194Z',
    '2023-07-13T23:36:17.929Z',
    '2023-07-14T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Sowjanya Kulal',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2021-02-05T16:33:06.386Z',
    '2023-06-23T14:43:26.374Z',
    '2023-07-13T18:49:59.371Z',
    '2023-07-14T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};
const account3 = {
  owner: 'Shobha Shetty',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
   movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2021-04-01T10:17:24.185Z',
    '2021-05-08T14:11:59.604Z',
    '2023-07-07T17:01:17.194Z',
    '2023-07-13T23:36:17.929Z',
    '2023-07-14T10:51:36.790Z',
  ],
  currency: 'INR',
  locale: 'pt-PT',
};

const account4 = {
  owner: 'Nagayya Shetty',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
   movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2021-02-05T16:33:06.386Z',
    
  ],
  currency: 'USD',
  locale: 'en-US',
};
const accounts = [account1, account2,account3,account4];

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

// date

const formatedDates = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  // conditions

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  // else {
  //   const day = `${date.getDate()}`.padStart(2, 0);
  //   const month = `${date.getMonth() + 1}`.padStart(2, 0);
  //   const year = date.getFullYear();

  //   return `${day}/${month}/${year}`;
  // }

  return new Intl.DateTimeFormat(locale).format(date);
};

/////////////////////////////////////////////////////////////////////////////////////////////////

// format currency

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};
//////////////////////////////////////////////////////////////////////////////////
// Functions

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    // day/month/year

    const displayDate = formatedDates(date, acc.locale);

    const formatedMovement = formatCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
       <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formatedMovement}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//////////////////////////////////////////////////////////////////////////////////

// total balance

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

////////////////////////////////////////////////////////////////////////////////

// summery=>deposit,intrest,and withdrawal total;

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

//////////////////////////////////////////////////////

// user name

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

///////////////////////////////////////////////////////////

// update UI

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////////////////////////////////////////////////

// exprementing API

// const now = new Date();
// const options = {
//   hour: 'numeric',
//   minute: 'numeric',
//   day: 'numeric',
//   month: 'long', //we can long for month in words and 2-digit to get 0 before a single no eg 08,09
//   year: 'numeric',
//   weekday: 'long',
// };
// const locate = navigator.language;
// console.log(locate);
// labelDate.textContent = new Intl.DateTimeFormat(locate, options).format(now);

/////////////////////////////////////////////////////////////////////////////////////////////////////
// Event handlers
let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // create current date and time

    const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);

    // // day/month/year

    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric', //we can long for month in words and 2-digit to get 0 before a single no eg 08,09
      year: 'numeric',
      // weekday: 'long',
    };
    // const locate = navigator.language;
    // console.log(locate);
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// logout

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // in each call ,print the remaning time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // when 0 second ,stop timer and logout user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }

    // decrese 1sec
    time--;
  };

  // set time to 5min
  let time = 120;

  // call timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};
////////////////////////////////////////////////////////////////////////////////

// transfer

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    // Update UI
    updateUI(currentAccount);

    // reset the timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

/////////////////////////////////////////////////////////////////////////////////////

// loan

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(+amount.toFixed(3));

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // reset the timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 5000);
  }
  inputLoanAmount.value = '';
});
/////////////////////////////////////////////////////////////////////////////////

// close account

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});
//////////////////////////////////////////////////////////////////////////////////////

// sorted

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

////////////////////////////////////////////////////////////////////////////////

// Fake always loged in

// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

/////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////

/*
// Date

const now = new Date();
const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const year = now.getFullYear();
const hour = now.getHours();
const min = now.getMinutes();

// day/month/year

labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/*
// numberss

console.log(23 === 23.0);

// Base 10-0 to 9. 1/10=0.1.  3/10=3.333333333333333333
// binary base 2  - 0 1
console.log(0.1 + 0.2);
console.log(0.1 + 0.2 === 0.3);
console.log(Number(23));
console.log(+'23');

// parsing
console.log(Number.parseInt('30px', 10));
console.log(Number.parseInt('e23', 10));

// parsrefloat

console.log(Number.parseFloat('2.5rem'));
console.log(Number.parseFloat('            2.5rem'));

// isNaN
console.log(Number.isNaN(20));
console.log(Number.isNaN('20'));
console.log(Number.isNaN(+'20x'));
console.log(Number.isNaN(23 / 0));

// isFinite
console.log(Number.isFinite(20));
console.log(Number.isFinite('20'));
console.log(Number.isFinite(+'20px'));
console.log(Number.isFinite(23 / 0));

// isInteger
console.log(Number.isInteger(23));
console.log(Number.isInteger(23.0));
console.log(Number.isInteger(23 / 0));
*/

////////////////////////////////////////////////////////////
/*
// squre root
console.log(Math.sqrt(25));
console.log(25 ** (1 / 2));
console.log(8 ** (1 / 3));

// max

console.log(Math.max(5, 18, 23, 11, 2));

console.log(Math.max(5, 18, '20px', 11, 2));

console.log(Math.max(5, 18, '23', 11, 2));

// min

console.log(Math.min(5, 18, 23, 11, 2));

console.log(Math.min(5, 18, '20px', 11, 2));

console.log(Math.min(5, 18, 23, 11, '2'));

// pi

console.log(Math.PI * Number.parseFloat('10px') ** 2);

// random

console.log(Math.trunc(Math.random() * 6 + 1));

const randomINt = (min, max) =>
  Math.trunc(Math.random() * (max - min) + 1) + min;
console.log(randomINt(10, 20));

// rounding integer

console.log(Math.round(23.3));
console.log(Math.round(23.9));

console.log(Math.ceil(23.3));
console.log(Math.ceil(23.9));

console.log(Math.floor(23.3));
console.log(Math.floor('23.9'));

console.log(Math.trunc(-23.3));
console.log(Math.floor(-23.3));

// rounding decimals

console.log((2.7).toFixed(0));
console.log((2.7).toFixed(3));
console.log(+(2.345).toFixed(2));
*/

//////////////////////////////////////////////////////////////
/*
// reminder operator

console.log(5 % 2);
console.log(5 / 2); //5=2*2+1

console.log(8 % 3);
console.log(8 / 3); // 8=2*3+2

console.log(6 % 2);
console.log(6 / 2);

console.log(7 % 2);
console.log(7 / 2);

const isEven = n => n % 2 === 0;
console.log(isEven(8));
console.log(isEven(23));
console.log(isEven(514));

labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    // 0,2,4,6,8
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';
    // 0,3,6,9
    if (i % 3 === 0) row.style.backgroundColor = 'blue';
  });
});

*/

/////////////////////////////////////////////////////////////////////////////////
/*
// number seperator

const diameter = 287_460_000_000; //js ignore the underscore

console.log(diameter);

const priceCents = 345_99;
console.log(priceCents);

const transferFee1 = 15_00;
const transferFee2 = 1_500;

const PI = 3.14_15; //_ not allowed to place in the begining,at end and start and end of .
console.log(PI);

console.log(Number('233300000'));
console.log(Number('233_300_000')); //_ doesnot work for string converted to number

console.log(parseInt('230_000')); // it gives a number which is before _
*/

/////////////////////////////////////////////////////////////////////////////////////
/*
// BigInt

console.log(2 ** 53 - 1);

console.log(Number.MAX_SAFE_INTEGER);
console.log(2 ** 53 + 4);

console.log(3545456454568748432468756895646548416544365365486n);

console.log(BigInt(11654645184651));

// Operation
console.log(10000n + 10000n);

console.log(45456454564654654564n * 10n);

// console.log(Math.sqrt(16n)); // doesnot work

const huge = 202865554454564545664n;
const num = 23;
console.log(huge * BigInt(num));

// exceptions
console.log(20n > 15);
console.log(20n === 20);
console.log(typeof 20n);
console.log(20n === '20');

console.log(huge + ' is REALY big');

// Division

console.log(16n / 3n);

console.log(16 / 3);
*/

////////////////////////////////////////////////////////////////////////////////////////
/*
// date and time

// create a date
const now = new Date();
console.log(now);

console.log(new Date('Jul 14 2023 18:25:46'));
console.log(new Date('December 24,2015'));

console.log(new Date(account1.movementsDates[0]));

console.log(new Date(2037, 10, 19, 15, 23, 5));
console.log(new Date(2037, 10, 31, 15, 23, 5));

console.log(new Date(0));
console.log(new Date(3 * 24 * 60 * 60 * 1000)); // days*1day has 24 hours*24 hours has 60 min*it has 60 sec*1000 miliseconds

// working with dates
const future = new Date(2037, 10, 19, 15, 23);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDate());
console.log(future.getDay());
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getMilliseconds());
console.log(future.toISOString());
console.log(future.getTime());

console.log(new Date(2142237180000));

console.log(Date.now());

future.setFullYear(2040);
console.log(future);
*/

///////////////////////////////////////////////////////////////////////
/*
// operation with dates

const future = new Date(2037, 10, 19, 15, 23);
console.log(+future);

const calcDaysPassed = (date1, date2) =>
  Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

const day1 = calcDaysPassed(new Date(2037, 3, 4), new Date(2037, 3, 14));
console.log(day1);
*/

////////////////////////////////////////////////////////////////////////////////////////////////
/*
// internationalizion number
const num = 686545321;

const options = {
  style: 'currency',
  unit: 'celsius',
  currency: 'EUR',
  // useGrouping: false,
};

console.log('US: ', new Intl.NumberFormat('en-GB', options).format(num));
console.log('IN: ', new Intl.NumberFormat('hi-IN', options).format(num));
console.log('Germany: ', new Intl.NumberFormat('de-DE', options).format(num));
console.log('Syria: ', new Intl.NumberFormat('ar-SY', options).format(num));
console.log(
  navigator.language,
  new Intl.NumberFormat(navigator.language, options).format(num)
);
*/
/////////////////////////////////////////////////////////////////////////////////////////
/*
// timer

const ingridents = ['olives', 'spinach'];

const pizzaaTimer = setTimeout(
  (ing1, ing2) => console.log(`Herre is ur pizza with ${ing1} and ${ing2} 🍕`),
  4000,
  ...ingridents
);
console.log('waiting...');

if (ingridents.includes('spinach')) clearTimeout(pizzaaTimer);
*/
//////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
// set interval

setInterval(function () {
  const now = new Date();
  console.log(now);
}, 3000);
*/

/////////////////////////////////////////////////////////////////////////////
