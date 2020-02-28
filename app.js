const questionsAmount = document.getElementById('amount-of-questions');
const startQuizBtn = document.getElementById('btn-start');
const nextQuestionBtn = document.getElementById('next-questionBtn');
const li = document.querySelectorAll('li');
const ul = document.getElementById('list');
const questionDiv = document.querySelector('.question');
const answerOne = document.querySelector('.answer-one');
const answerTwo = document.querySelector('.answer-two');
const answerThree = document.querySelector('.answer-three');
const answerFour = document.querySelector('.answer-four');

let indexCount = 0;
let score = 0;

const getQuiz = async () => {
  const response = await fetch(
    `https://opentdb.com/api.php?amount=${questionsAmount.value}&category=21&type=multiple`
  );

  const data = await response.json();

  let quizData = data.results;

  //console.log(data.results);
  /* displayQuestion(quizData);
  displayAnswers(quizData);
  checkCorrectAnswer(quizData);
  nextQuestion(quizData); */
  playGame(quizData);
};

startQuizBtn.addEventListener('click', () => {
  checkInput();
});
checkInput = () => {
  if (questionsAmount.value === '') {
    document.querySelector('.alert-message').style.display = 'inline-block';
  } else {
    UIinputs();
    getQuiz();
  }
};

UIinputs = () => {
  questionsAmount.style.display = 'none';
  startQuizBtn.style.display = 'none';
  document.getElementById('label-amount').style.display = 'none';
  nextQuestionBtn.style.display = 'block';
  document.querySelector('.answer-container').style.display = 'flex';
  document.querySelector('.question').style.display = 'flex';
};
displayQuestion = quizData => {
  questionDiv.textContent = quizData[indexCount].question;
};

displayAnswers = quizData => {
  answerOne.textContent = quizData[indexCount].correct_answer;
  answerTwo.textContent = quizData[indexCount].incorrect_answers[0];
  answerThree.textContent = quizData[indexCount].incorrect_answers[1];
  answerFour.textContent = quizData[indexCount].incorrect_answers[2];
};
nextQuestion = quizData => {
  nextQuestionBtn.addEventListener('click', () => {
    nextIndex();
    displayQuestion(quizData);
    displayAnswers(quizData);
    removeAnswerClasses();
  });
};
checkCorrectAnswer = quizData => {
  ul.addEventListener('click', function(e) {
    if (e.target.matches('li')) {
      e.target.parentElement.classList.add('disabled');
      if (e.target.textContent === quizData[indexCount].correct_answer) {
        e.target.classList.add('correct-answer');
        score++;
      } else {
        e.target.classList.add('incorrect-answer');
      }
    }

    console.log(indexCount + 'index');
  });

  /*  li.forEach(listItem => {
    score++;
    console.log(score);
    listItem.addEventListener('click', () => {
      listItem.parentElement.classList.add('disabled');
      if (listItem.textContent === quizData[indexCount].correct_answer) {
        listItem.classList.add('correct-answer');
      } else {
        listItem.classList.add('incorrect-answer');
      }
    });
  }); */
};

playGame = quizData => {
  displayQuestion(quizData);
  displayAnswers(quizData);
  checkCorrectAnswer(quizData);
  nextQuestion(quizData);
};

nextIndex = () => {
  indexCount += 1;
};

removeAnswerClasses = () => {
  li.forEach(function(listItem) {
    listItem.classList.remove('incorrect-answer');
    listItem.classList.remove('correct-answer');
    listItem.parentElement.classList.remove('disabled');
  });
};
