

let madeQuizzes = null;
const MAIN = document.querySelector("main");
let CREATEDQUIZOBJECT = {};
const CONSTAPI = "https://mock-api.driven.com.br/api/v4/buzzquizz";
let QUESTION_QTD = 0;
let LEVEL_QTD = 0;

/* Comportamento de respostas do quiz*/
let QUIZ_FROM_SERVER;
let currentQuiz;
const quizPage = document.querySelector('.quiz-page');
let questionList = [];
let correctAnswers = 0;


// Checa ao abrir o site se já existem quizzes criados pelo usuário
function checkIfMadeQuizzes() {
  const containerMyQuizzes = document.querySelector(".my-quizzes");

  if (madeQuizzes === null) {
    containerMyQuizzes.innerHTML = `
        <article class="create-first-quiz">
            <p>Você não criou nenhum quizz ainda :(</p>
            <p><span onclick="createQuizScreen1()">Criar Quizz</span></p>
        </article>
        `;
  } else {
    containerMyQuizzes.innerHTML = `
        <div class="created-quizzes-header">
            <p>Seus Quizzes</p>
            <ion-icon name="add-circle"></ion-icon>
        </div>
        <div class="created-quizzes">
            <article class="created-quiz" onclick="openQuiz()">
                <img src="./img/homer-simpson.jpeg" alt="imagem-quiz"/>
                <p><span>Quizz do Homer sdadasdsa dsad sa sad asd sad ad asd sa das</span></p>
            </article>
        </div>
        `;
  }
}

checkIfMadeQuizzes();

// Exibição do quiz:

function openQuiz() {
  const quizHeader = document.querySelector(".quiz-page-header");
  MAIN.classList.toggle("hide");
  quizPage.classList.toggle("hide");
  quizHeader.classList.toggle("hide");
}

// Disponibilização dos quizzes do servidor ao entrar na tela inicial:
const promiseGetQuizzes = axios.get(`${CONSTAPI}/quizzes`);
promiseGetQuizzes.then(renderQuizzes);
promiseGetQuizzes.catch(error => {
  console.error(error.response);
  alert("Não deu pra obter os quizzes, verifique o erro ou avise o devinho");
})

function renderQuizzes(response) {
  const containerAllQuizzes = document.querySelector(".all-quizzes-container");
  const data = response.data;

  data.forEach(quiz => {
    containerAllQuizzes.innerHTML += `
        <article onclick="loadQuizFromServer(${quiz.id})">
          <div class="bg-gradient">
          </div>
          <img src="${quiz.image}" alt="imagem-quiz"/>
          <p><span>${quiz.title}</span></p>
        </article>
      `;
  })
}


//  Criação do quiz
function createQuizScreen1() {
  const containerCreateFirst = document.querySelector(".create-first-quiz");
  const pageCreate = document.querySelector(".create-quiz-page");

  MAIN.classList.toggle("hide");
  containerCreateFirst.classList.toggle("hide");

  pageCreate.innerHTML = `
    <h1>Comece pelo começo</h1>
    <div class="container-questions">
        <input type="text" placeholder="Título do seu quizz" class="title">
        <input type="url" placeholder="URL da imagem do seu quizz" class="url">
        <input type="text" placeholder="Quantidade de perguntas do quizz" class="question-qtd">
        <input type="text" placeholder="Quantidade de níveis do quizz" class="level-qtd">
    </div>
    <button type="submit" class="btn-create-screen-1" onclick="createQuizNextScreens(this)">Prosseguir pra criar perguntas</button>
    `;
}

function createQuizNextScreens(btn) {
    const btnClass = btn.classList;
    const btnText = btn.innerHTML;

    // inputs de perguntas básicas:
    if (btnClass.contains("btn-create-screen-1")) {
    const inputTitle = document.querySelector(".create-quiz-page .title").value;
    const inputURL = document.querySelector(".create-quiz-page .url").value;
    const inputQuestionQtd = document.querySelector(".create-quiz-page .question-qtd").value;
    const inputLevelQtd = document.querySelector(".create-quiz-page .level-qtd").value;

    // Validations basic questions
    const titleOK = inputTitle.length >= 20 && inputTitle.length <= 65;
    const urlOK = validURL(inputURL);
    const questionQtdOK = inputQuestionQtd >= 3;
    const levelQtdOK = inputLevelQtd >= 2;

    if (titleOK && urlOK && questionQtdOK && levelQtdOK) {
      QUESTION_QTD = inputQuestionQtd;
      LEVEL_QTD = inputLevelQtd;
      createQuizScreen2(QUESTION_QTD);
    } else {
      alert("Preencha os dados corretamente!");
    }
    }

    // inputs de perguntas:
    const questions = [];

    if (btn.classList.contains("btn-create-screen-2")) {
    for (let i = 0; i < QUESTION_QTD; i++) {
      let questionObject = {
        title: document.querySelector(`.q${i+1}-text`).value,
        color: document.querySelector(`.q${i+1}-color`).value,
        answers: [{
          text: document.querySelector(`.q${i+1}-answer`).value,
          image: document.querySelector(`.q${i+1}-answer-img`).value,
          isCorrectAnswer: true
        }, {
          text: document.querySelector(`.q${i+1}-wrong-answer1`).value,
          image: document.querySelector(`.q${i+1}-wrong-answer-img1`).value,
          isCorrectAnswer: false
        }, {
          text: document.querySelector(`.q${i+1}-wrong-answer2`).value,
          image: document.querySelector(`.q${i+1}-wrong-answer-img2`).value,
          isCorrectAnswer: false
        }, {
          text: document.querySelector(`.q${i+1}-wrong-answer3`).value,
          image: document.querySelector(`.q${i+1}-wrong-answer-img3`).value,
          isCorrectAnswer: false
        }]
      }
      questions.push(questionObject);
    }

     // Validations questions
     let titleQuestionOK;
     let colorOK;
     let answerQtdOK;
     let countAnswerNotNull = 0;
     let countAnswerURLOK = 0;
     let answerURLOK;
     let questionsValidated;
 
     for (let i = 0; i < questions.length; i++) {
       titleQuestionOK = questions[i].title.length >= 20;
       colorOK = validColorHEX(questions[i].color);
       let answersNotNull = questions[i].answers.forEach(() => {
         if (questions[i].answers.text !== null) {
           countAnswerNotNull += 1;
         }
 
         if (validURL(questions[i].answers.image) === true) {
           countAnswerURLOK += 1;
         }
       });
       answerQtdOK = countAnswerNotNull >= 2;
       answerURLOK = (countAnswerURLOK === countAnswerNotNull);
 
       if (titleQuestionOK && colorOK && answerQtdOK && answerURLOK) {
         questionsValidated += 1;
       }
     }

     if (questionsValidated === QUESTION_QTD) {
      createQuizScreen3(LEVEL_QTD);
    } else {
      alert("Preencha os dados corretamente!");
    }
  }

    // CREATEDQUIZOBJECT = {
    //     title: inputTitle,
    //     image: inputURL,
    //     questions: questions
    // }
}

function createQuizScreen2(questionQtd) {
  const pageCreate = document.querySelector(".create-quiz-page");
  pageCreate.innerHTML = `
  <h1>Crie suas perguntas</h1>
  `;
  
  for (let i = 0; i < questionQtd; i++) {
    pageCreate.innerHTML += `
    <div class="container-questions hide container-q${i+1}">
        <h1 onclick="alreadyEditedQuestion(this, ${i+1})">Pergunta ${i+1} <span>(Clique novamente para resumir)</span></h1>
        <input type="text" placeholder="Texto da pergunta" class="q${i+1}-text"/>
        <input type="text" placeholder="Cor de fundo da pergunta" class="q${i+1}-color"/>
        <h1>Resposta correta</h1>
        <input type="text" placeholder="Resposta correta" class="q${i+1}-answer"/>
        <input type="url" placeholder="URL da imagem" class="q${i+1}-answer-img"/>
        <h1>Respostas incorretas</h1>
        <input type="text" placeholder="Resposta incorreta 1" class="q${i+1}-wrong-answer1"/>
        <input type="url" placeholder="URL da imagem 1" class="q${i+1}-wrong-answer-img1"/>
        <input type="text" placeholder="Resposta incorreta 2" class="q${i+1}-wrong-answer2"/>
        <input type="url" placeholder="URL da imagem 2" class="q${i+1}-wrong-answer-img2"/>
        <input type="text" placeholder="Resposta incorreta 3" class="q${i+1}-wrong-answer3"/>
        <input type="url" placeholder="URL da imagem 3" class="q${i+1}-wrong-answer-img3"/>
    </div>
    <div class="edit-question id${i+1}" onclick="editQuestion(this, ${i+1})">
        <h1>Pergunta ${i+1}</h1>
        <img src="./img/Vector.svg" alt="edit-question-icon"/>
    </div>
    `;
  }

  pageCreate.innerHTML += `<button type="submit" class="btn-create-screen-2" onclick="createQuizNextScreens(this)">Prosseguir pra criar níveis</button>`;
}

function createQuizScreen3(levelQtd) {
  alert("Opa, acho que foi");
}

function editQuestion(question, id) {
  const expandedQuestion = question.parentNode.querySelector(`.container-q${id}`);

  question.classList.toggle("hide");
  expandedQuestion.classList.toggle("hide");
}

function alreadyEditedQuestion(question, id) {
  const minimizedQuestion = document.querySelector(`.id${id}`);
  
  question.parentNode.classList.toggle("hide");
  minimizedQuestion.classList.toggle("hide");
}

// Função para validar uma URL
function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

function validColorHEX(str) {
  let pattern = new RegExp('^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$');
  return !!pattern.test(str);
}

/* Montagem da página de perguntas de um quiz */

let qtdQuestions = 0;

function loadQuizFromServer(id) {
  console.log(`${CONSTAPI}/quizzes/${id}`);
  const promise = axios.get(`${CONSTAPI}/quizzes/${id}`);
  promise.then(assembleQuizzes);
  promise.catch(console.error());
  openQuiz();
}


function assembleQuizzes(quizFromServer) {
  QUIZ_FROM_SERVER = quizFromServer;
  quizPage.innerHTML = '';

  currentQuiz = quizFromServer.data;

  const documentImgHeader = document.querySelector('.quiz-page-header');
  documentImgHeader.style.backgroundImage = `linear-gradient(
      0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), 
      url("${currentQuiz.image}")
  `;

  const documentTitle = document.querySelector('header h2');
  documentTitle.innerHTML = currentQuiz.title;

  let questions = currentQuiz.questions;
  qtdQuestions = questions.length;

  questions = shuffleArray(questions);

  questions.forEach((question) => {
    quizPage.innerHTML += assembleQuestions(question);
    const header = quizPage.querySelector('article:last-child header');
    header.style.backgroundColor = `${question.color}`;
  })
}


function assembleQuestions(question) {
  return `
    <article>
        <header>${question.title}?</header>
        <section>
        ${assembleAnswer(question.answers)}
        </section>
    </article>
  `;
}


function assembleAnswer(answers) {
  let rightDiv = '';
  let leftDiv = '';

  for (let i = 0; (i + 1) < answers.length; i += 2) {

    const img1 = answers[i].image;
    const describe1 = answers[i].text;
    const isCorrect1 = answers[i].isCorrectAnswer;

    const img2 = answers[i + 1].image;
    const describe2 = answers[i + 1].text;
    const isCorrect2 = answers[i + 1].isCorrectAnswer;

    leftDiv += `                 
      <div id="${isCorrect1}" class="answer-quiz" onclick="answerSelection(this, this.id)">
        <img src="${img1}" alt="">
        <p>${describe1}</p>
        <div class="white-cover"></div>
      </div>`;

    rightDiv += `
      <div id="${isCorrect2}" class="answer-quiz" onclick="answerSelection(this, this.id)">
        <img src="${img2}" alt="">
        <p>${describe2}</p>
        <div class="white-cover"></div>
      </div>`;
  }

  rightDiv = `<div class="right">${rightDiv}</div>`;
  leftDiv = `<div class="left">${leftDiv}</div>`;

  return leftDiv + rightDiv;
}


function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    // gera índices aleatórios dentro do permitido para o 'array'
    const j = (Math.floor((Math.random() * 10) % array.length));

    const aux = array[i];
    array[i] = array[j];
    array[j] = aux;
  }
  return array;
}

/* Comportamento de respostas do quiz*/

function answerSelection(answerSelected, isCorrectAnswer) {
  let documentSection = answerSelected.parentNode;
  documentSection = documentSection.parentNode;

  // se não foi escolhida nenhuma resposta do cartão
  console.log(' func é igual? ' + isSelected(documentSection));
  if (!isSelected(documentSection)) {
    // não finalizou ainda
    if (questionList.length <= qtdQuestions) {
      const article = documentSection.parentNode;

      setTimeout(()=>{
        window.scrollBy(0, article.clientHeight + 26)
      }, 2000);

      questionList.push({ question: documentSection, isCorrectAnswer: isCorrectAnswer });

      const coverSelection = answerSelected.querySelector('.white-cover');

      const documentArticle = documentSection.parentNode;
      const coverList = documentArticle.querySelectorAll('.white-cover');
      const answerList = documentSection.querySelectorAll('.answer-quiz'); // mudar para documenteArticle

      // altera cor do text da resposta erradas e certas
      for (let i = 0; i < answerList.length; i++) {
        if (answerList[i].id === 'true') {
          answerList[i].querySelector('p').classList.add('success-quiz-answer-selection');

          if (answerList[i] === answerSelected) correctAnswers++;// Se a resposta correta é igual a selecionada
        }
        else {
          answerList[i].querySelector('p').classList.add('error-quiz-answer-selection');
        }
      }

      // adiciona fundo branco nas resposta não selecionadas
      for (let i = 0; i < coverList.length; i++) {
        if (coverList[i] !== coverSelection) {
          coverList[i].classList.add('unselected');
        }
      }

      if (qtdQuestions === questionList.length) {
        setTimeout(showScore, 2000);
      }
    }
  }
}


function isSelected(questionSelected) {
  for(let i = 0; i < questionList.length; i++){
    if(questionList[i].question === questionSelected){
      return true;
    }
  }

  return false;
}


function showScore() {
  const levels = currentQuiz.levels;
  let currentLevel;

  const hitPercent = Math.floor((100 / qtdQuestions) * correctAnswers);


  levels.forEach(level => {
    if (level.minValue <= hitPercent) {
      currentLevel = level;
    }
  })

  const levelTitle = `${hitPercent} de acerto: ${currentLevel.title}`;
  const levelColor = currentLevel.color;
  const levelImage = currentLevel.image;
  const levelText = currentLevel.text;
  quizPage.innerHTML += `
  <article class="show-score">
    <header>${levelTitle}</header>
    <img src="${levelImage}"></img>
    <p>${levelText}</p>
  </article>`;

  const header = quizPage.querySelector('article:last-child header');
  header.style.backgroundColor = `"${levelColor}"`;

  quizPage.innerHTML += `
  <div class="quiz-result">
    <button onclick="resetQuiz()">Reiniciar Quizz</button>
    <button onclick="comeBackHome()">Voltar para home</button>
  </div>`;
  quizPage.querySelector('.show-score').scrollIntoView();
}

function comeBackHome() {
  window.location.reload();
  openQuiz();
}

function resetQuiz() {
  currentQuiz = undefined;
  questionList = [];
  correctAnswers = 0;
  assembleQuizzes(QUIZ_FROM_SERVER);
  window.scrollTo(0,0);
}

function returnHome() {
  window.location.reload();
}