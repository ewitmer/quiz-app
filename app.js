$(document).ready(function(){
	renderCurrentState();
});

//-----single state variable-----

var state = {
	questionIndex: 0,
	correctResponses: 0,
	totalResponses: 0,
	correct: false,
	incorrect: false,
	noResponse: false,
	alreadySubmit: false,
	endQuiz: false,
}

var quizQuestions = [
{ 	
	question: 'Is this working?',
	ans1: 'yes',
	ans2: 'no',
	ans3: 'maybe',
	ans4: 'i have no idea',
	correct: 'answer-1'
},
{ 	
	question: '2Is this working?',
	ans1: '2yes',
	ans2: '2no',
	ans3: '2maybe',
	ans4: '2i have no idea',
	correct: 'answer-1'
},
{ 	
	question: 'Is this working?',
	ans1: 'yes',
	ans2: 'no',
	ans3: 'maybe',
	ans4: 'i have no idea',
	correct: 'answer-1'
},
{ 	
	question: 'Is this working?',
	ans1: 'yes',
	ans2: 'no',
	ans3: 'maybe',
	ans4: 'i have no idea',
	correct: 'answer-1'
},
{ 	
	question: 'Is this working?',
	ans1: 'yes',
	ans2: 'no',
	ans3: 'maybe',
	ans4: 'i have no idea',
	correct: 'answer-1'
},
]

//-----state modification functions-----


function quizReset() {
	state.questionIndex = 0;
	state.correctResponses = 0;
	state.totalResponses = 0;
};

function alertReset() {;
	state.noResponse = false;
	state.alreadySubmit = false;
	state.endQuiz = false;
};

function responseReset() {
	state.correct = false;
	state.incorrect = false;
};

function onAnswer(userAns, correctAns) {

	if (userAns === correctAns) {
		state.correct = true;
		state.correctResponses = state.correctResponses + 1;
		state.totalResponses = state.totalResponses + 1;
	}	
	else {	 
		state.incorrect = true;
		state.totalResponses = state.totalResponses + 1; 
	}
};

function noResponse() {
	state.noResponse = true;
};

function alreadySubmit() {
    state.alreadySubmit = true;	
};

function endQuiz() {
	state.endQuiz = true;
};

function nextQuestion() {

	state.questionIndex = state.questionIndex+1;
	
};

function uncheckBoxes(element) {
	element.prop("checked", false);
}
//-----render functions-----

function renderAlert() {
	
	if (state.noResponse) {
		$('.js-alert').text("Please select an answer.")		
	}

	else if (state.alreadySubmit) {
		$('.js-alert').text("You've already logged a response to this question. Please click 'Next' to continue.")
	}

	else if (state.endQuiz) { 
		$('.js-alert').text("You've completed the quiz! Please select Start Over to play again.")
	}
}


function renderResult() {
	if (state.correct === true) {
		$('.js-alert').text('You are correct!')
	}
	else if (state.incorrect === true){
		$('.js-alert').text('Sorry! That is incorrect.')
	}
	else {
		$('.js-alert').text('')
	}
}

function renderCurrentState() {
	var index = state.questionIndex;
	var questionObject = quizQuestions[index]
	var totalQuestions = quizQuestions.length;

	//render question
	$('#js-current-question').text(questionObject.question)

	//render answers
	$('#js-answer1').text(questionObject.ans1)
	$('#js-answer2').text(questionObject.ans2)
	$('#js-answer3').text(questionObject.ans3)
	$('#js-answer4').text(questionObject.ans4)

	//render progress
	$('#js-index-question').text(index+1)
	$('#js-total-questions').text(totalQuestions)

	//render score
	$('#js-total-correct').text(state.correctResponses);
	$('#js-total-answered').text(state.totalResponses);
}

//-----event listeners-----


// submit answer for current question

$('#js-question-form').submit(function(event) {

    event.preventDefault();
	
	var index = state.questionIndex;
	var questionObject = quizQuestions[index] 
    var $checked = $("input:checked").val();
	var correct = questionObject.correct;
	
	if ($checked === undefined) {
		noResponse();
		renderAlert();
		alertReset();
	}
	
	else if (state.totalResponses > state.questionIndex) {
		alreadySubmit();
		renderAlert();
		alertReset();
	}

	else {
		onAnswer($checked, correct);
		renderCurrentState();
		renderResult();
		alertReset();
		responseReset();
	}
 
});

$('#js-next-question').on('click', function(){

    event.preventDefault();

	
	if (state.questionIndex + 1 != state.totalResponses) {
		noResponse();
		renderAlert();
		alertReset();
	}
	else if (state.questionIndex + 1 === quizQuestions.length) {
		endQuiz();
		renderAlert();
		alertReset();
	}

	else {
		renderResult();
		nextQuestion();
		renderCurrentState();
		uncheckBoxes($("input:radio"));

	}
	
});


