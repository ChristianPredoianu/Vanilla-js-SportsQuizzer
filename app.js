const questionsAmount = document.getElementById('amount-of-questions');
const startQuizBtn = document.getElementById('btn-start');
const nextQuestionBtn = document.getElementById('next-questionBtn');
const questionDiv = document.querySelector('.question');
const list = document.getElementById('list');
const listItem = document.querySelectorAll('li');
const answerOne = document.querySelector('.answer-one');
const answerTwo = document.querySelector('.answer-two');
const answerThree = document.querySelector('.answer-three');
const answerFour = document.querySelector('.answer-four');
const totalScore = document.getElementById('score');
const playAgainBtn = document.getElementById('btn-play-again');

let currentIndex = 0;
let scoreCount = 0;

//Get quiz from API
async function getQuiz(amountOfQuestions) {
  const response = await fetch(
    `https://opentdb.com/api.php?amount=${amountOfQuestions}&category=21&type=multiple`
  );

  const data = await response.json();
  return data;
}

//Initialize game
function initGame() {
  startQuizBtn.addEventListener('click', () => {
    if (questionsAmount.value === '') {
      alert('you must enter a valid number');
    } else {
      list.style.display = 'block';
      questionsAmount.style.display = 'none';
      startQuizBtn.style.display = 'none';
      document.getElementById('label-amount').style.display = 'none';
      nextQuestionBtn.style.display = 'block';
      document.querySelector('.answer-container').style.display = 'flex';
      document.querySelector('.question').style.display = 'flex';
      document.querySelector('.alert-message').style.display = 'none';

      getQuiz(questionsAmount.value).then((data) => {
        playGame(data);
        nextQuestionBtn.classList.add('disabled');
      });
    }
  });
}

//Play game
function playGame(data) {
  displayQuestion(data);
  displayAnswers(data);
  shuffleAnswers();
  checkCorrectAnswer(data);
  removeAnswerClasses();
  nextQuestion(data);
  resetGame();
}

//Display questions
function displayQuestion(data) {
  questionDiv.textContent = data.results[currentIndex].question;
}

//Display answers
function displayAnswers(data) {
  answerOne.textContent = data.results[currentIndex].correct_answer;
  answerTwo.textContent = data.results[currentIndex].incorrect_answers[0];
  answerThree.textContent = data.results[currentIndex].incorrect_answers[1];
  answerFour.textContent = data.results[currentIndex].incorrect_answers[2];
}

//Shuffle answers
function shuffleAnswers() {
  for (let i = list.children.length; i >= 0; i--) {
    list.appendChild(list.children[(Math.random() * i) | 0]);
  }
}

//Check right answer
function checkCorrectAnswer(data) {
  list.addEventListener('click', (e) => {
    if (e.target.matches('li')) {
      e.target.parentElement.classList.add('disabled');
      nextQuestionBtn.classList.remove('disabled');
    }
    if (e.target.textContent === data.results[currentIndex].correct_answer) {
      e.target.classList.add('correct-answer');
      scoreCount += 1;
    } else {
      e.target.classList.add('incorrect-answer');
      showCorrectAnswer(data);
    }
  });
}

//Show user the correct answer if wrong answer
function showCorrectAnswer(data) {
  listItem.forEach((answer) => {
    if (answer.textContent === data.results[currentIndex].correct_answer) {
      answer.classList.add('correct-answer');
    }
  });
}

//Remove correct/wrong/disabled classes
function removeAnswerClasses() {
  listItem.forEach(function (item) {
    item.classList.remove('incorrect-answer');
    item.classList.remove('correct-answer');
    item.parentElement.classList.remove('disabled');
  });
}

//Next question
function nextQuestion(data) {
  nextQuestionBtn.addEventListener('click', () => {
    nextQuestionBtn.classList.add('disabled');
    if (currentIndex !== parseInt(questionsAmount.value - 1)) {
      currentIndex += 1;
      displayQuestion(data);
      displayAnswers(data);
      shuffleAnswers();
      removeAnswerClasses();
    } else {
      nextQuestionBtn.style.display = 'none';
      questionDiv.style.display = 'none';
      totalScore.style.display = 'flex';
      list.style.display = 'none';
      showTotalScore();
    }
  });
}

//Showing total score
function showTotalScore() {
  totalScore.innerHTML = `<h1>Your total score is <span>${scoreCount}/${questionsAmount.value}</span></h1>
  <h3>Play again?</h3>`;
  playAgainBtn.style.display = 'block';
}

//Reset game/reload page
function resetGame() {
  playAgainBtn.addEventListener('click', function () {
    location.reload();
  });
}

initGame();
