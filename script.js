'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
const createUserNames = function (accounts) {
  accounts.forEach(
    account =>
      (account.userName = account.owner
        .toLowerCase()
        .split(' ')
        .map(word => word[0])
        .join(''))
  );
};
createUserNames(accounts);

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (movement, i) {
    const html = `<div class="movements__row">
            <div class="movements__type movements__type--${
              movement > 0 ? 'deposit' : 'withdrawal'
            }">
            ${i + 1} ${movement > 0 ? 'deposit' : 'withdrawal'}
            </div>
            <div class="movements__value">${movement}€</div>
          </div>`;
    // const element = document.createElement(html);
    // console.log(element);
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const displayBalance = function (user) {
  const { movements } = user;
  user.balance = movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.textContent = `${user.balance}€`;
};

const displayStatistics = function (account) {
  const { movements, interestRate } = account;
  const deposit = movements
    .filter(movement => movement > 0)
    .reduce((acc, curr) => acc + curr, 0);
  const withdrawal = movements
    .filter(movement => movement < 0)
    .reduce((acc, curr) => acc + curr, 0);

  const interest = movements
    .filter(movement => movement > 0)
    .map(movement => (movement * interestRate) / 100)
    .filter(movement => movement >= 1)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumIn.textContent = `${deposit}€`;
  labelSumOut.textContent = `${withdrawal}€`;
  labelSumInterest.textContent = `${interest}€`;
};

let currentUser, timer;
const updateUi = function (user) {
  //display movements
  displayMovements(user.movements);
  //display balance
  displayBalance(user);
  //display statistics
  displayStatistics(user);
};

const setTime = function () {
  let time = 120;
  const ticket = function () {
    const min = Math.trunc(time / 60);
    const sec = time % 60;

    labelTimer.textContent = `${String(min).padStart(2, 0)}:${String(
      sec
    ).padStart(2, 0)}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Login to get started`;
      containerApp.style.opacity = 0;
    }
    time--;
  };
  ticket();
  const timer = setInterval(ticket, 1000);
  return timer;
};
btnLogin.addEventListener('click', e => {
  e.preventDefault();
  const user = accounts.find(
    //
    account => account.userName === inputLoginUsername.value
  );
  //
  if (user?.pin === Number(inputLoginPin.value)) {
    //display name
    labelWelcome.textContent = `Welcome ${user.owner}`;
    updateUi(user);
    currentUser = user;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    containerApp.style.opacity = 1;
    if (timer) clearInterval(timer);
    timer = setTime();
  }
});

btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const beneficiary = accounts.find(
    account => account.userName === inputTransferTo.value
  );
  if (
    amount > 0 &&
    beneficiary &&
    amount < currentUser.balance &&
    beneficiary.userName !== currentUser.userName
  ) {
    beneficiary.movements.push(+amount);
    currentUser.movements.push(-amount);
    updateUi(currentUser);
  }
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();é
  clearInterval(timer);
  timer = setTime();
});

btnClose.addEventListener('click', e => {
  e.preventDefault();
  const { userName, pin } = currentUser;
  const closeUser = inputCloseUsername.value;
  const closePin = Number(inputClosePin.value);
  console.log(userName, pin);
  console.log(closeUser, closePin);

  if (closeUser === userName && closePin === pin) {
    const index = accounts.findIndex(account => account.userName === closeUser);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();
});

const allMouvements = accounts.flatMap(account => account.movements);
const deposits = allMouvements.filter(mouvement => mouvement > 0);
const withdrawals = allMouvements.filter(mouvement => mouvement < 0);
const allMovementsCount = deposits.reduce((acc, curr) => acc + curr, 0);
const depositsSup1000$ = deposits.filter(movement => movement > 1000).length;
const depositsSup1000$_reduce = deposits.reduce(
  (acc, curr) => (curr > 1000 ? ++acc : acc),
  0
);
const { depositsSum, withdrawalsSum } = allMouvements.reduce(
  (obj, curr) => {
    obj[curr < 0 ? 'depositsSum' : 'withdrawalsSum'] += curr;
    return obj;
  },
  { depositsSum: 0, withdrawalsSum: 0 }
);

const test = 'this is a nice title and How ARE you';
const convert = function (string) {
  const exceptions = [
    'or',
    'an',
    'the',
    'but',
    'or',
    'on',
    'in',
    'with',
    'a',
    'and',
  ];
  const stringArray = string
    .split(' ')
    .map(ele =>
      exceptions.includes(ele)
        ? ele
        : ele[0].toUpperCase() + ele.slice(1).toLowerCase()
    )
    .join(' ');

  console.log(stringArray);
};
convert(test);
///////////////////////////////////////
// Coding Challenge #1

// Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

// Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

// 1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
// 2. Create an array with both Julia's (corrected) and Kate's data
// 3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
// 4. Run the function for both test datasets

// HINT: Use tools from all lectures in this section so far 😉

// TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
// TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

// GOOD LUCK 😀

// const checkDogs = function (dogsJulia, dogsKate) {
//   dogsJulia.splice(0, 1);
//   dogsJulia.splice(-2);
//   const allData = dogsJulia.concat(dogsKate);
//   allData.forEach(function (data, i) {
//     const print =
//       data < 3
//         ? `Dog number ${i + 1} is still a puppy 🐶`
//         : `Dog number ${i + 1} is an adult, and is ${data} years old`;
//     console.log(print);
//   });
// };

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
///////////////////////////////////////
// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. 
If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const calcAverageHumanAge = function (ages) {
//   const humanAge = ages.map(age => (age <= 2 ? 2 * age : 16 + 4 * age));
//   const filteredHumanAge = humanAge.filter(hg => hg >= 18);
//   const avgAge = filteredHumanAge.reduce(
//     (acc, curr) => acc + curr / ages.length,
//     0
//   );
//   console.log(avgAge);
// };
// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
///////////////////////////////////////
// Coding Challenge #3

/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, 
but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const calcAverageHumanAge = function (ages) {
//   const avgAge = ages
//     .map(age => (age <= 2 ? 2 * age : 16 + 4 * age))
//     .filter(hg => hg >= 18)
//     .reduce((acc, curr, i, arr) => acc + curr / arr.length, 0);
//   console.log(avgAge);
// };
// calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

///////////////////////////////////////
// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. 
Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. 
(The result is in grams of food, and the weight needs to be in kg)
//////////////////
2. Find Sarah's dog and log to the console whether it's eating too much or too little.
 HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: 
"Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order 
(keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). 
Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:


GOOD LUCK 😀
*/
// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];

// dogs.forEach(
//   dog => (dog.recommended_food_portion = Math.trunc(dog.weight ** 0.75 * 28))
// );
// const [SarahDogs] = dogs.filter(dog => dog.owners.includes('Sarah'));

// const ownersEatTooMuch = dogs
//   .filter(dog => dog.curFood >= dog.recommended_food_portion)
//   .flatMap(dog => dog.owners);
// const ownersEatTooLittle = dogs
//   .filter(dog => dog.curFood <= dog.recommended_food_portion)
//   .flatMap(dog => dog.owners);

// const string = `"${ownersEatTooMuch.join(
//   ' and '
// )} dogs eat too much!" and "${ownersEatTooLittle.join(
//   ' and '
// )} dogs eat too little!"`;

// const isOkAmount1 = dogs.some(
//   dog => dog.curFood === dog.recommended_food_portion
// );
// const isOkAmount2 = dogs.some(
//   dog =>
//     dog.curFood < dog.recommended_food_portion * 1.1 &&
//     dog.curFood > dog.recommended_food_portion * 0.9
// );

// const isOkArray = dogs.filter(
//   dog =>
//     dog.curFood < dog.recommended_food_portion * 1.1 &&
//     dog.curFood > dog.recommended_food_portion * 0.9
// );

// const orderedDogs = dogs
//   .slice()
//   .sort(
//     (dog1, dog2) =>
//       dog1.recommended_food_portion - dog2.recommended_food_portion
//   );
// console.log(orderedDogs);
