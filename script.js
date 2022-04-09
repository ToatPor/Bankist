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
    '2022-03-27T17:01:17.194Z',
    '2022-04-01T23:36:17.929Z',
    '2022-04-03T10:51:36.790Z',
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

// account2.shit = 'kuy';
// console.log(account2);
const accounts = [account1, account2];
// const reName = function (arrObj) {
//   arrObj.forEach(
//     cur =>
//       (cur.test = cur.owner
//         .split(' ')
//         .map(cur => cur[0].toLowerCase())
//         .join(''))
//   );
// };
// reName(accounts);
// console.log(account1);
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
// create Username

let currentAccount;
let timer;
let sort = false;

const interfaceLogin = function () {
  containerApp.style.opacity = 100;
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();
  labelWelcome.textContent = `Welcome back ${
    currentAccount.owner.split(' ')[0]
  }`;
};
const createUser = function (arr) {
  arr.forEach(
    cur =>
      (cur.username = cur.owner
        .toLowerCase()
        .split(' ')
        .map(cur => cur[0])
        .join(''))
  );
};
createUser(accounts);
// const formatMovementDate = function (date, locale) {
//   const calDayPass = (day1, day2) =>
//     Math.round(Math.abs(day2 - day1) / (1000 * 60 * 60 * 24));
//   const dayPass = calDayPass(new Date(), date);
//   if (dayPass === 0) return `today`;
//   if (dayPass === 1) return `Yesterday`;
//   if (dayPass <= 7) return `${dayPass} days ago`;
//   else {
//     // const day = `${date.getDate()}`.padStart(2, 0);
//     // const year = date.getFullYear();
//     // const month = `${date.getMonth() + 1}`.padStart(2, 0);
//     // return `${day}/${month}/${year}`;
//     return new Intl.DateTimeFormat(locale, {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//     }).format(date);
//   }
// };
const formatDate = function (curDate, locale) {
  const callDayPass = (day1, day2) =>
    Math.round(Math.abs(day2 - day1) / (1000 * 60 * 60 * 24));
  const dayPass = callDayPass(new Date(), curDate);
  if (dayPass === 0) return 'today';
  if (dayPass === 1) return 'yesterday';
  if (dayPass <= 7) return `${dayPass} days ago`;
  else {
    0;
    return new Intl.DateTimeFormat(locale, {
      month: '2-digit',
      year: 'numeric',
      day: '2-digit',
    }).format(curDate);
  }
};

const curMovement = function (cur, sort = false) {
  containerMovements.innerHTML = '';
  const mov = sort
    ? cur.movements.slice().sort((curNum, nextNum) => curNum - nextNum)
    : cur.movements;
  mov.forEach((curMove, i) => {
    const date = new Date(cur.movementsDates[i]);
    const calDate = formatDate(date, cur.locale);
    const type = curMove > 0 ? 'deposit' : 'withdrawal';
    const movement = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${calDate}
      </div>
      <div class="movements__value">${formatNumber(
        currentAccount.locale,
        curMove,
        currentAccount.currency
      )}
      </div>
    </div>
  `;
    containerMovements.insertAdjacentHTML('afterbegin', movement);
  });
};

const updateUI = function () {
  curMovement(currentAccount);
  calInOutIn(currentAccount);
  allBalance(currentAccount);
};
const login = function (e) {
  e.preventDefault();
  const usernameLogin = inputLoginUsername.value;
  currentAccount = accounts.find(cur => cur.username === usernameLogin);
  if (currentAccount && currentAccount.pin === +inputLoginPin.value) {
    const option = {
      month: '2-digit',
      year: 'numeric',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };
    const date = new Intl.DateTimeFormat(currentAccount.locale, option).format(
      new Date()
    );
    interfaceLogin();
    labelDate.textContent = date;
    if (timer) clearInterval(timer);
    timer = logOut();
    updateUI();
  }
};
const sorted = function (e) {
  e.preventDefault();
  curMovement(currentAccount, !sort);
  sort = !sort;
};
const calInOutIn = function (curMov) {
  const deposit = curMov.movements.reduce(
    (ans, cur) => (cur > 0 ? (ans += cur) : ans),
    0
  );
  const withdraw = curMov.movements.reduce(
    (ans, cur) => (cur < 0 ? (ans += cur) : ans),
    0
  );
  const interest = curMov.movements.reduce(
    (acc, cur) => (cur > 0 ? (acc += (cur * curMov.interestRate) / 100) : acc),
    0
  );
  labelSumInterest.textContent = formatNumber(
    currentAccount.locale,
    interest,
    currentAccount.currency
  );
  labelSumIn.textContent = formatNumber(
    currentAccount.locale,
    deposit,
    currentAccount.currency
  );
  labelSumOut.textContent = formatNumber(
    currentAccount.locale,
    Math.abs(withdraw),
    currentAccount.currency
  );
};
// login
const allBalance = function (curAcc) {
  const balance = curAcc.movements.reduce((acc, sum) => (acc += sum), 0);
  curAcc.balance = balance;

  labelBalance.textContent = formatNumber(
    currentAccount.locale,
    balance,
    currentAccount.currency
  );
};
const formatNumber = function (locale, number, currency) {
  const option = {
    style: 'currency',
    currency: `${currency}`,
  };
  return new Intl.NumberFormat(locale, option).format(number);
};
const formatTime = function (locale, number) {
  const options = {
    minute: '2-digit',
    second: '2-digit',
  };
  return new Intl.DateTimeFormat(locale, options).format(number);
};

const logOut = function () {
  let time = 300;
  const deleteOneSecBefore = function () {
    const minute = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${minute}:${sec}`;
    if (time === 0) {
      clearInterval(realtimeclock);
      containerApp.style.opacity = 0;
      currentAccount = '';
    }
    time--;
  };
  deleteOneSecBefore();
  const realtimeclock = setInterval(deleteOneSecBefore, 1000);
  return realtimeclock;
};
const transfer = function (cur, accs) {
  const toWho = accs.find(cur => cur.username === inputTransferTo.value);
  if (
    toWho &&
    currentAccount.balance >= +inputTransferAmount.value &&
    +inputTransferAmount.value > 0 &&
    inputTransferTo.value !== currentAccount.username
  ) {
    currentAccount.movements.push(-+inputTransferAmount.value);
    toWho.movements.push(+inputTransferAmount.value);
    currentAccount.movementsDates.push(new Date().toISOString());
    toWho.movementsDates.push(new Date().toISOString());
    updateUI();
    clearInterval(timer);
    timer = logOut();
    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferAmount.blur();
  }
};
const deleteAccout = function (accounts) {
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    const deleteAc = accounts.findIndex(
      cur =>
        cur.username === inputCloseUsername.value &&
        cur.pin === +inputClosePin.value
    );
    accounts.splice(deleteAc, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
  }
};
const loan = function (curAcc) {
  const some = curAcc.movements.some(cur => (cur * 10) / 100);
  setTimeout(() => {
    if (some) {
      curAcc.movements.push(+inputLoanAmount.value);
      curAcc.movementsDates.push(new Date().toISOString());
      updateUI();
      inputLoanAmount.value = '';
      inputLoanAmount.blur();
    }
  }, 2500);
};
btnLogin.addEventListener('click', login);
btnSort.addEventListener('click', sorted);
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  transfer(currentAccount, accounts);
});
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  deleteAccout(accounts);
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  loan(currentAccount);
});
// /////////////////////////////////////////////////
// Functions;
// const usernmae = function (arr) {
//   arr.forEach(
//     cur =>
//       (cur.username = cur.owner
//         .toLowerCase()
//         .split(' ')
//         .map(cur => cur[0])
//         .join(''))
//   );
// };

// usernmae(accounts);
// console.log(account1);
// const formatMovementDate = function (date, locale) {
//   const calDayPass = (day1, day2) =>
//     Math.round(Math.abs(day2 - day1) / (1000 * 60 * 60 * 24));
//   const dayPass = calDayPass(new Date(), date);
//   if (dayPass === 0) return `today`;
//   if (dayPass === 1) return `Yesterday`;
//   if (dayPass <= 7) return `${dayPass} days ago`;
//   else {
//     // const day = `${date.getDate()}`.padStart(2, 0);
//     // const year = date.getFullYear();
//     // const month = `${date.getMonth() + 1}`.padStart(2, 0);
//     // return `${day}/${month}/${year}`;
//     return new Intl.DateTimeFormat(locale, {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//     }).format(date);
//   }
// };

// const formatNumbers = function (accObj, value) {
//   return new Intl.NumberFormat(accObj.locale, {
//     style: 'currency',
//     currency: accObj.currency,
//   }).format(value);
// };
// const displayMovements = function (acc, sort = false) {
//   containerMovements.innerHTML = '';

//   const movs = sort
//     ? acc.movements.slice().sort((a, b) => a - b)
//     : acc.movements;

//   movs.forEach(function (mov, i) {
//     const type = mov > 0 ? 'deposit' : 'withdrawal';
//     const date = new Date(acc.movementsDates[i]);
//     const displayDate = formatMovementDate(date, acc.locale);
//     const html = `
//       <div class="movements__row">
//         <div class="movements__type movements__type--${type}">${
//       i + 1
//     } ${type}</div>
//         <div class="movements__date">${displayDate} </div>
//         <div class="movements__value">${formatNumbers(
//           currentAccount,
//           mov
//         )}</div>
//       </div>

//     `;

//     containerMovements.insertAdjacentHTML('afterbegin', html);
//   });
// };

// const calcDisplayBalance = function (acc) {
//   acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
//   labelBalance.textContent = `${acc.balance}€`;
// };
// console.log(Math.round(2.3));

// const calcDisplaySummary = function (acc) {
//   const incomes = acc.movements
//     .filter(mov => mov > 0)
//     .reduce((acc, mov) => acc + mov, 0);
//   labelSumIn.textContent = `${incomes.toFixed(2)}€`;

//   const out = acc.movements
//     .filter(mov => mov < 0)
//     .reduce((acc, mov) => acc + mov, 0);
//   labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

//   const interest = acc.movements
//     .filter(mov => mov > 0)
//     .map(deposit => (deposit * acc.interestRate) / 100)
//     .filter((int, i, arr) => {
//       // console.log(arr);
//       return int >= 1;
//     })
//     .reduce((acc, int) => acc + int, 0);
//   labelSumInterest.textContent = `${interest.toFixed(2)}€`;
// };

// const createUsernames = function (accs) {
//   accs.forEach(function (acc) {
//     acc.username = acc.owner
//       .toLowerCase()
//       .split(' ')
//       .map(name => name[0])
//       .join('');
//   });
// };
// createUsernames(accounts);
// const updateUI = function (acc) {
//   // Display movements
//   displayMovements(acc);

//   // Display balance
//   calcDisplayBalance(acc);

//   // Display summary
//   calcDisplaySummary(acc);
// };

// ///////////////////////////////////////
// // Event handlers
// let currentAccount, timer;
// // const fakelogin = function (current) {
// //   currentAccount = current;
// //   updateUI(current);
// //   containerApp.style.opacity = 100;
// // };

// // fakelogin(account1);

// // const dateLogin = function () {
// //   const date = new Date();
// //   const day = `${date.getDate()}`.padStart(2, 0);
// //   const month = `${date.getMonth() + 1}`.padStart(2, 0);
// //   const year = date.getFullYear();
// //   const hour = `${date.getHours()}`.padStart(2, 0);
// //   const minute = `${date.getMinutes()}`.padStart(2, 0);
// //   labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minute}`;
// // };

// btnLogin.addEventListener('click', function (e) {
//   // Prevent form from submitting
//   e.preventDefault();

//   currentAccount = accounts.find(
//     acc => acc.username === inputLoginUsername.value
//   );
//   console.log(currentAccount);

//   if (currentAccount?.pin === Number(inputLoginPin.value)) {
//     // Display UI and message
//     labelWelcome.textContent = `Welcome back, ${
//       currentAccount.owner.split(' ')[0]
//     }`;
//     containerApp.style.opacity = 100;

//     // Clear input fields
//     inputLoginUsername.value = inputLoginPin.value = '';
//     inputLoginPin.blur();
//     // dateLogin();
//     // Update UI

//     const option = {
//       hour: 'numeric',
//       minute: 'numeric',
//       year: 'numeric',
//       day: '2-digit',
//       month: '2-digit',
//       // weekday: 'long',
//     };
//     const today = new Date();
//     const interNationalFormatter = new Intl.DateTimeFormat(
//       currentAccount.locale,
//       option
//     ).format(today);

//     labelDate.textContent = interNationalFormatter;

//     if (timer) clearInterval(timer);
//     timer = logOut();
//     updateUI(currentAccount);
//   }
// });

// btnTransfer.addEventListener('click', function (e) {
//   e.preventDefault();
//   const amount = Number(inputTransferAmount.value);
//   const receiverAcc = accounts.find(
//     acc => acc.username === inputTransferTo.value
//   );
//   inputTransferAmount.value = inputTransferTo.value = '';

//   if (
//     amount > 0 &&
//     receiverAcc &&
//     currentAccount.balance >= amount &&
//     receiverAcc?.username !== currentAccount.username
//   ) {
//     // Doing the transfer
//     currentAccount.movements.push(-amount);
//     receiverAcc.movements.push(amount);
//     currentAccount.movementsDates.push(new Date().toISOString());
//     receiverAcc.movementsDates.push(new Date().toISOString());
//     clearInterval(timer);
//     timer = logOut();
//     // Update UI
//     updateUI(currentAccount);
//     // Update Login date
//     dateLogin();
//   }
// });

// btnLoan.addEventListener('click', function (e) {
//   e.preventDefault();
//   const amount = Number(inputLoanAmount.value);

//   if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
//     // Add movement
//     setTimeout(() => {
//       currentAccount.movements.push(amount);
//       currentAccount.movementsDates.push(new Date().toISOString());
//       clearInterval(timer);
//       timer = logOut();
//       // Update UI
//       updateUI(currentAccount);
//     }, 2500);
//   }
//   inputLoanAmount.value = '';
// });

// btnClose.addEventListener('click', function (e) {
//   e.preventDefault();

//   if (
//     inputCloseUsername.value === currentAccount.username &&
//     Number(inputClosePin.value) === currentAccount.pin
//   ) {
//     const index = accounts.findIndex(
//       acc => acc.username === currentAccount.username
//     );
//     // console.log(index);
//     // .indexOf(23)

//     // Delete account
//     accounts.splice(index, 1);

//     // Hide UI
//     containerApp.style.opacity = 0;
//   }

//   inputCloseUsername.value = inputClosePin.value = '';
// });

// let sorted = false;
// btnSort.addEventListener('click', function (e) {
//   e.preventDefault();
//   displayMovements(currentAccount, !sorted);
//   sorted = !sorted;
// });

// /////////////////////////////////////////////////
// /////////////////////////////////////////////////
// const logOut = function () {
//   let time = 120;
//   const immediatly = function () {
//     const minute = String(Math.trunc(time / 60)).padStart(2, 0);
//     const sec = String(time % 60).padStart(2, 0);
//     labelTimer.textContent = `${minute}: ${sec}`;
//     if (time === 0) {
//       clearInterval(timer);
//       containerApp.style.opacity = 0;
//       labelWelcome.textContent = `Log in to get started`;
//     }
//     time--;
//   };
//   immediatly();
//   const timer = setInterval(immediatly, 1000);
//   return timer;
// };
// // LECTURES
// //todo date
// // const now = new Date();
// console.log(now);
// console.log(new Date(account1.movementsDates[0]));
// console.log(new Date('Aug 20 2020 17:21:18'));
// console.log(new Date('december 18,2020'));
// //month base on 0
// console.log(new Date(2020, 9, 18, 17, 10, 11));
// // auto correct event november has 30 days will change to 1 dec
// console.log(new Date(2023, 10, 31));
// // standard time
// console.log(new Date(0));
// //convert day to mili sec
// console.log(new Date(3 * 24 * 60 * 60 * 1000));
// // time stamp mean convert year month date hours min to sec

// //working with date
// const workTime = new Date(Date.UTC(2020, 9, 18, 15, 10, 11));
// console.log(workTime.toISOString());
// const workTime1 = new Date(2020, 9, 18, 15, 10, 11);
// console.log(workTime);
// console.log(workTime1);
// console.log(workTime.getFullYear());
// console.log(workTime.getMonth());
// console.log(workTime.getHours());
// console.log(workTime.getMinutes());
// console.log(workTime.getSeconds());
// //get time stamp

// console.log(workTime.getTime());
// console.log(Date.now());
// workTime.setFullYear(2021);
//todo convert date to nicely string
// console.log(workTime.toISOString());
// workTime.setMinutes(420);
// console.log(workTime.toISOString());
// console.log(workTime);

// console.log(new Date(1603015811000));
// const event = new Date('05 October 2011 14:48 UTC');

// console.log(event.toISOString());

// const workTime1 = new Date(2020, 9, 18);
// const workTime2 = new Date(2020, 9, 17);

// console.log(+workTime1);

// const calDays = (day1, day2) => Math.abs(day1 - day2) / (1000 * 60 * 60 * 24);
// const dayLeft = calDays(workTime2, workTime1);

// setTimeout(
//   function (arg1, arg2) {
//     console.log(`${arg1} love ${arg2}`);
//   },
//   2000,
//   'toat',
//   'por'
// );

// setInterval(() => {
//   console.log(new Date());
// }, 1000);
// let sum;
// const shit = function () {
//   const sum = 1 + 2;
//   return sum;
// };
// setInterval(() => {
//   const shit = new Date();
//   const hour = String(shit.getHours()).padStart(2, 0);
//   const min = String(shit.getMinutes()).padStart(2, 0);
//   const sec = String(shit.getSeconds()).padStart(2, 0);
//   console.log(`${hour}:${min}:${sec}`);
// }, 1000);
// // console.log(sum);
