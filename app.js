
//-----single state variable-----

// state variable tracks the current question, score of game, and any error alerts that need to be rendered
var state = {
	questionIndex: 0,
	correctResponses: 0,
	totalResponses: 0,
	correct: false,
	incorrect: false,
	noResponse: false,
	alreadySubmit: false,
}

// quiz questions with responses and correct answer
var quizTitle = 'Brain Teasers'

var quizQuestions = [
{ 	
	question: '6 + 4 = 210 | 9 + 2 = 711 | 8 + 5 = 313 | 5 + 2 = 37 | 7 + 6 = 113 | 9 + 8 = 117 | 10 + 6 = 416 | 15 + 3 = 1218 | (a) + (b) = 123 | What is (a) equal to?',
	
	ans1: '15',
	ans2: '3',
	ans3: '12',
	ans4: '11',
	correct: '12'
},
{ 	
	question: 'What 5-digit number has the following property? If we put numeral 1 in front of the number, we get a number three times smaller, than if we put the numeral 1 behind this number.',
	ans1: '42857',
	ans2: '37037',
	ans3: '83945',
	ans4: '93403',
	correct: '42857'
},
{ 	
	question: 'What number comes next in the sequence: 2, 4, 5, 10, 12, 24, 27, (x)?',
	ans1: '48',
	ans2: '51',
	ans3: '54',
	ans4: '58',
	correct: '54'
},
{ 	
	question: 'If it were two hours later, it would be half as long until midnight as it would be if it were an hour later. What time is it now?',
	ans1: '6AM',
	ans2: '9:30PM',
	ans3: '4PM',
	ans4: '9PM',
	correct: '9PM'
},
{ 	
	question: 'Is it correct that seven and five is thirteen or seven and five are thirteen?',
	ans1: 'seven and five is thirteen',
	ans2: 'seven and five are thirteen',
	ans3: 'both are acceptable',
	ans4: 'neither is correct',
	correct: 'neither is correct'
	//seven and five is twelve :) 
},
]

//-----state modification functions-----

//resets the state variable related to the quiz questions
function quizReset() {
	state.questionIndex = 0;
	state.correctResponses = 0;
	state.totalResponses = 0;
};

//resets any alerts to be rendered
function alertReset() {;
	state.noResponse = false;
	state.alreadySubmit = false;
};

//resets the correct/incorrect indicator
function responseReset() {
	state.correct = false;
	state.incorrect = false;
};

//combines all three reset functions to one
function totalReset() {
	quizReset();
	alertReset();
	responseReset();
}

//changes state of correct/incorrect and score
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

//changes state of no response alert
function noResponse() {
	state.noResponse = true;
};

//changes state of already submitted alert
function alreadySubmit() {
    state.alreadySubmit = true;	
};

//advances question index to next question
function nextQuestion() {
	state.questionIndex = state.questionIndex+1;	
};

//unchecks the radio buttons
function uncheckBoxes(element) {
	element.prop("checked", false);
}


//-----render functions-----

//renders start page 
function renderStart() {
	$('.js-hide').hide();
	$('.js-title').text('Welcome to the quiz! Click start to begin.');
	$('#js-start-over').text('Start')
}

//renders finished page
function renderFinish() {
    var totalCorrect = state.correctResponses;
    var totalQuestions = quizQuestions.length;
    var percent = Math.round((totalCorrect / totalQuestions) * 100)

	$('.js-hide').hide();
	$('.js-title').html('<h1>Thanks for playing!</h1><h2>Your total score is: '+totalCorrect+' out of '+totalQuestions+' ('+percent+'%).</h2>');
	$('#js-start-over').text('Play Again')
}

//renders any alerts that are true
function renderAlert() {
	
	if (state.noResponse) {
		$('.js-alert').text("Please select an answer.")		
	}

	else if (state.alreadySubmit) {
		$('.js-alert').text("You've already logged a response to this question. Please click 'Next' to continue.")
	}
}

//renders correct or incorrect answer or nothing before the answer is submitted
function renderResult(correct) {
	if (state.correct === true) {
		$('.js-alert').text('You are correct!')
	}
	else if (state.incorrect === true){
		$('.js-alert').text('Sorry! That is incorrect. The correct answer is: '+correct)
	}
	else {
		$('.js-alert').text('')
	}
}

//renders the quiz page
function renderInitial() {
	
	$('#js-start-over').text('Reset')
	$('.js-hide').show()
	$('.js-title').text(quizTitle)
} 

//renders the page based on current state
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

// on load
$(document).ready(function(){
	renderStart();
});


// on submit answer for current question
$('#js-question-form').submit(function(event) {

    event.preventDefault();
	
	var index = state.questionIndex;
	var questionObject = quizQuestions[index] 
    var $checked = $("input:checked").next().text()
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
		renderResult(correct);
		alertReset();
		responseReset();
	}
 
});

// on next 
$('#js-next-question').on('click', function(){

    event.preventDefault();
	
	if (state.questionIndex + 1 != state.totalResponses) {
		noResponse();
		renderAlert();
		alertReset();
	}
	else if (state.questionIndex + 1 === quizQuestions.length) {
		renderFinish()
	}

	else {
		renderResult();
		nextQuestion();
		renderCurrentState();
		uncheckBoxes($("input:radio"));

	}
	
});

// on start/reset/play again
$('#js-start-over').on('click', function() {

	totalReset();
	renderInitial()
	renderCurrentState();
	renderResult();
	uncheckBoxes($("input:radio"));
})


