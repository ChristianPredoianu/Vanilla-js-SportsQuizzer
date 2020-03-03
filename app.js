const questionsAmount = document.getElementById('amount-of-questions');
const startQuizBtn = document.getElementById('btn-start');
const nextQuestionBtn = document.getElementById('next-questionBtn');
const questionDiv = document.querySelector('.question');
const ul = document.getElementById('list');
const li = document.querySelectorAll('li');
const answerOne = document.querySelector('.answer-one');
const answerTwo = document.querySelector('.answer-two');
const answerThree = document.querySelector('.answer-three');
const answerFour = document.querySelector('.answer-four');
const totalScore = document.getElementById('score');
const playAgainBtn = document.getElementById('btn-play-again');

let indexCount = 0;
let score = 0;

const getQuiz = async () => {
  const response = await fetch(
    `https://opentdb.com/api.php?amount=${questionsAmount.value}&category=21&type=multiple`
  );

  const data = await response.json();

  const quizData = data.results;
  console.log(quizData);

  playQuiz(quizData);
};

startQuizBtn.addEventListener('click', () => {
  if (questionsAmount.value === '') {
    document.querySelector('.alert-message').style.visibility = 'visible';
  } else {
    ul.style.display = 'block';
    questionsAmount.style.display = 'none';
    startQuizBtn.style.display = 'none';
    document.getElementById('label-amount').style.display = 'none';
    nextQuestionBtn.style.display = 'block';
    document.querySelector('.answer-container').style.display = 'flex';
    document.querySelector('.question').style.display = 'flex';
    document.querySelector('.alert-message').style.display = 'none';
    getQuiz();
  }
});

playQuiz = quizData => {
  displayQuestion(quizData);
  shuffleAnswers();
  displayAnswers(quizData);
  checkCorrectAnswer(quizData);
  nextQuestion(quizData);
  resetGame();
};

displayQuestion = quizData => {
  checkEndGameQuestions(quizData);
};

displayAnswers = quizData => {
  checkEndGameAnswers(quizData);
};

shuffleAnswers = () => {
  const ul = document.querySelector('ul');
  for (let i = ul.children.length; i >= 0; i--) {
    ul.appendChild(ul.children[(Math.random() * i) | 0]);
  }
};

nextQuestion = quizData => {
  nextQuestionBtn.addEventListener('click', () => {
    indexCount += 1;
    displayQuestion(quizData);
    shuffleAnswers();
    displayAnswers(quizData);
    removeAnswerClasses();
  });
};

checkCorrectAnswer = quizData => {
  ul.addEventListener('click', e => {
    if (e.target.matches('li')) {
      e.target.parentElement.classList.add('disabled');
      showCorrectAnswer(quizData);
      if (e.target.textContent === quizData[indexCount].correct_answer) {
        e.target.classList.add('correct-answer');
        score += 1;
      } else {
        e.target.classList.add('incorrect-answer');
      }
    }
  });

  showCorrectAnswer = quizData => {
    li.forEach(answer => {
      if (answer.textContent === quizData[indexCount].correct_answer) {
        answer.classList.add('correct-answer');
      }
    });
  };

  removeAnswerClasses = () => {
    li.forEach(function(listItem) {
      listItem.classList.remove('incorrect-answer');
      listItem.classList.remove('correct-answer');
      listItem.parentElement.classList.remove('disabled');
    });
  };
};

checkEndGameQuestions = quizData => {
  if (!(indexCount === parseInt(questionsAmount.value))) {
    questionDiv.innerHTML = `<p>${quizData[indexCount].question}</p>`;
  } else {
    nextQuestionBtn.style.display = 'none';
    questionDiv.style.display = 'none';
    totalScore.style.display = 'flex';
    showTotalScore();
    ul.style.display = 'none';
  }
};

checkEndGameAnswers = quizData => {
  if (!(indexCount === parseInt(questionsAmount.value))) {
    answerOne.textContent = quizData[indexCount].correct_answer;
    answerTwo.textContent = quizData[indexCount].incorrect_answers[0];
    answerThree.textContent = quizData[indexCount].incorrect_answers[1];
    answerFour.textContent = quizData[indexCount].incorrect_answers[2];
  }
};

showTotalScore = () => {
  let scoreCount = score;
  totalScore.innerHTML = `<h1>Your total score is <span>${scoreCount}/${questionsAmount.value}</span></h1>
  <h3>Play again?</h3>`;
  playAgainBtn.style.display = 'block';
};

resetGame = () => {
  playAgainBtn.addEventListener('click', function() {
    location.reload();
  });
};
