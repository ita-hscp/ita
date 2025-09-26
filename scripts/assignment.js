let exercises= [];
let detailedAssignments = [];
async function createAssignment() {
    const formData = new FormData(document.getElementById('assignmentForm'));
    const assignment = {
        title: formData.get('title'),
        description: formData.get('description'),
        type: formData.get('assignmentType'),
        week: formData.get('week'),
        dueDate: formData.get('dueDate'),
        status: 'assigned',
        exerciseId: formData.get('exercise')
    };
    const response = await fetch('https://infinite-sands-52519-06605f47cb30.herokuapp.com/create_assignment_test', {
        method: 'POST',
        headers: {
            'Authorization': sessionStorage.getItem('sessionToken'),
            'Content-Type': 'application/json'
        }
    });
    if (response.status === 401) {
        // Redirect to login page if not authenticated
        window.location.href = "https://ita-hscp.github.io/ita/Login"; // Replace with your actual login URL
        return;
    }
    if (!response.ok) {
        return {};
    }
    const responseData = await response.json();
    return responseData;
}
window.onload = function () {
    let selectAssignmentType = document.getElementById('assignmentType');
    //     <select id="assignmentType" name="assignmentType"> if assignment_type is selected, call getExercisesForAssignmentType in the backend
    selectAssignmentType.addEventListener('change', async function () {
        const selectedType = this.value;
        exercises = await getExercisesForAssignmentType(selectedType);
        const exerciseSelect = document.getElementById('exercise');
        exerciseSelect.innerHTML = ''; // Clear previous options
        exercises.forEach(exercise => {
            const option = document.createElement('option');
            option.value = exercise.id;
            option.textContent = exercise.title;
            exerciseSelect.appendChild(option);
        });
    });
};
/**
 *  sample exercise response
 *  {{"content":{"intro":["தமிழ் உரையாடல் பயிற்சி . முழு வாக்கியங்களாக பேசவும்","இன்றைய தலைப்பு \"ஓலைச்சுவடிகள்‌\""],"conversations":["உன் பெயர் என்ன ?","ஓலைச்சுவடிகள்‌ என்றால்‌ என்ன?","ஓலைச்சுவடிகள்‌ எந்த காலத்தில்‌ வந்தது?","ஓலைச்சுவடிகள்‌ எவற்றையெல்லாம்‌ உள்ளடக்கியுள்ளன?","ஓலைச்சுவடிகளில்‌ உள்ள எழுத்துக்களின்‌ பெயர்‌ என்ன? ","பனையோலைச்‌ சுவடிகளில்‌ எப்படி எழுத்துகளை எழுதுவார்கள்‌ என்று உனக்குத்‌ தெரியுமா?","ஓலைச்சுவடிகளை எப்படிப்‌ பாதுகாத்தார்கள்‌?","அந்தக்‌ காலத்தில்‌ மக்கள்‌ குறிப்புகளை எதில்‌ எழுதினார்கள்‌? "," எந்த மரத்தின்‌ இலையை எழுதப்‌ பயன்படுத்தினார்கள்‌?","அந்தகாலத்தில்‌ ஏன்‌ பனை ஓலைகளில்‌ மையால்‌ எழுதவில்லை ?"],"words":["ஓலைச்சுவடிகள்‌"],"test":[]},"title":"ஓலைச்சுவடிகள்‌","type":"உரையாடல் பயிற்சி","class":"HSCP2","description":"உரையாடல்","status":"created","updatedAt":{"$date":{"$numberLong":"1755737465762"}},"createdAt":{"$date":{"$numberLong":"1755737465762"}}}} assignmentType 
 * @param {*} assignmentType
 * @returns array of exercises for that assignment type
 */
async function getExercisesForAssignmentType(assignmentType) {
    const response = await fetch(`https://infinite-sands-52519-06605f47cb30.herokuapp.com/exercises_by_type?type=${assignmentType}`, {
        method: 'GET',
        headers: {
            'Authorization': sessionStorage.getItem('sessionToken'),
            'Content-Type': 'application/json'
        }
    });
    if (response.status === 401) {
        // Redirect to login page if not authenticated
        window.location.href = "https://ita-hscp.github.io/ita/Login"; // Replace with your actual login URL
        return;
    }
    //Mock response for testing
    return [
        { id: 1, title: 'வாஸ்கோடகாமா', description: 'வாஸ்கோடகாமா ', exerciseId: 101, content: {"intro":["தமிழ் உரையாடல் பயிற்சி . முழு வாக்கியங்களாக பேசவும்","இன்றைய தலைப்பு \"ஓலைச்சுவடிகள்‌\""],"conversations":["உன் பெயர் என்ன ?","ஓலைச்சுவடிகள்‌ என்றால்‌ என்ன?","ஓலைச்சுவடிகள்‌ எந்த காலத்தில்‌ வந்தது?","ஓலைச்சுவடிகள்‌ எவற்றையெல்லாம்‌ உள்ளடக்கியுள்ளன?","ஓலைச்சுவடிகளில்‌ உள்ள எழுத்துக்களின்‌ பெயர்‌ என்ன? ","பனையோலைச்‌ சுவடிகளில்‌ எப்படி எழுத்துகளை எழுதுவார்கள்‌ என்று உனக்குத்‌ தெரியுமா?","ஓலைச்சுவடிகளை எப்படிப்‌ பாதுகாத்தார்கள்‌?","அந்தக்‌ காலத்தில்‌ மக்கள்‌ குறிப்புகளை எதில்‌ எழுதினார்கள்‌? "," எந்த மரத்தின்‌ இலையை எழுதப்‌ பயன்படுத்தினார்கள்‌?","அந்தகாலத்தில்‌ ஏன்‌ பனை ஓலைகளில்‌ மையால்‌ எழுதவில்லை ?"],"words":["ஓலைச்சுவடிகள்‌"],"test":[]} },
        { id: 2, title: 'கொல்லாமை', description: 'கொல்லாமை” என்ற திருக்குறள்‌ கதையைக்‌ கேட்டு, அதைப்‌ பற்றி‌ உங்கள்‌ கருத்துக்களைப்‌ பகிரவும்.', exerciseId: 102, content: {"intro":["தமிழ் உரையாடல் பயிற்சி . முழு வாக்கியங்களாக பேசவும்","இன்றைய தலைப்பு \"ஓலைச்சுவடிகள்‌\""],"conversations":["உன் பெயர் என்ன ?","ஓலைச்சுவடிகள்‌ என்றால்‌ என்ன?","ஓலைச்சுவடிகள்‌ எந்த காலத்தில்‌ வந்தது?","ஓலைச்சுவடிகள்‌ எவற்றையெல்லாம்‌ உள்ளடக்கியுள்ளன?","ஓலைச்சுவடிகளில்‌ உள்ள எழுத்துக்களின்‌ பெயர்‌ என்ன? ","பனையோலைச்‌ சுவடிகளில்‌ எப்படி எழுத்துகளை எழுதுவார்கள்‌ என்று உனக்குத்‌ தெரியுமா?","ஓலைச்சுவடிகளை எப்படிப்‌ பாதுகாத்தார்கள்‌?","அந்தக்‌ காலத்தில்‌ மக்கள்‌ குறிப்புகளை எதில்‌ எழுதினார்கள்‌? "," எந்த மரத்தின்‌ இலையை எழுதப்‌ பயன்படுத்தினார்கள்‌?","அந்தகாலத்தில்‌ ஏன்‌ பனை ஓலைகளில்‌ மையால்‌ எழுதவில்லை ?"],"words":["ஓலைச்சுவடிகள்‌"],"test":[]} },
        { id: 3, title: 'பொங்கல்', description: 'பொங்கல்', exerciseId: 103, content: {"intro":["தமிழ் உரையாடல் பயிற்சி . முழு வாக்கியங்களாக பேசவும்","இன்றைய தலைப்பு \"ஓலைச்சுவடிகள்‌\""],"conversations":["உன் பெயர் என்ன ?","ஓலைச்சுவடிகள்‌ என்றால்‌ என்ன?","ஓலைச்சுவடிகள்‌ எந்த காலத்தில்‌ வந்தது?","ஓலைச்சுவடிகள்‌ எவற்றையெல்லாம்‌ உள்ளடக்கியுள்ளன?","ஓலைச்சுவடிகளில்‌ உள்ள எழுத்துக்களின்‌ பெயர்‌ என்ன? ","பனையோலைச்‌ சுவடிகளில்‌ எப்படி எழுத்துகளை எழுதுவார்கள்‌ என்று உனக்குத்‌ தெரியுமா?","ஓலைச்சுவடிகளை எப்படிப்‌ பாதுகாத்தார்கள்‌?","அந்தக்‌ காலத்தில்‌ மக்கள்‌ குறிப்புகளை எதில்‌ எழுதினார்கள்‌? "," எந்த மரத்தின்‌ இலையை எழுதப்‌ பயன்படுத்தினார்கள்‌?","அந்தகாலத்தில்‌ ஏன்‌ பனை ஓலைகளில்‌ மையால்‌ எழுதவில்லை ?"],"words":["ஓலைச்சுவடிகள்‌"],"test":[]} },
        { id: 4, title: 'தமிழ் மொழி', description: 'தமிழ் மொழி', exerciseId: 104, content: {"intro":["தமிழ் உரையாடல் பயிற்சி . முழு வாக்கியங்களாக பேசவும்","இன்றைய தலைப்பு \"ஓலைச்சுவடிகள்‌\""],"conversations":["உன் பெயர் என்ன ?","ஓலைச்சுவடிகள்‌ என்றால்‌ என்ன?","ஓலைச்சுவடிகள்‌ எந்த காலத்தில்‌ வந்தது?","ஓலைச்சுவடிகள்‌ எவற்றையெல்லாம்‌ உள்ளடக்கியுள்ளன?","ஓலைச்சுவடிகளில்‌ உள்ள எழுத்துக்களின்‌ பெயர்‌ என்ன? ","பனையோலைச்‌ சுவடிகளில்‌ எப்படி எழுத்துகளை எழுதுவார்கள்‌ என்று உனக்குத்‌ தெரியுமா?","ஓலைச்சுவடிகளை எப்படிப்‌ பாதுகாத்தார்கள்‌?","அந்தக்‌ காலத்தில்‌ மக்கள்‌ குறிப்புகளை எதில்‌ எழுதினார்கள்‌? "," எந்த மரத்தின்‌ இலையை எழுதப்‌ பயன்படுத்தினார்கள்‌?","அந்தகாலத்தில்‌ ஏன்‌ பனை ஓலைகளில்‌ மையால்‌ எழுதவில்லை ?"],"words":["ஓலைச்சுவடிகள்‌"],"test":[]} }
    ];
    if (!response.ok) {
        return [];
    }
    const responseData = await response.json();
    return responseData.exercises || [];
}
async function addQuestionField() {
    const container = document.getElementById('dialogueFields');//<div id="dialogueFields" style="display:none;"><input type="text" id="intro" name="intro" placeholder="Introduction (optional)"><br><br>
    const input = document.createElement('input');//<input type=text id="questions" name="questions" placeholder="Enter a question"><button type="button" onclick="addDialogueField()">+</button><br><br> next to questions
    input.type = 'text';
    input.name = 'questions';
    const lastInput = container.querySelector('input[name="questions"]:last-of-type');
    if (lastInput && lastInput.value.trim() === '') {
        lastInput.focus();
        return;
    }
    // add input box next to last input box
    container.appendChild(input);
    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.textContent = '+';
    addButton.onclick = addQuestionField;
    container.appendChild(addButton);
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.textContent = '-';
    removeButton.onclick = removeQuestionField;
    container.appendChild(removeButton);
}

function removeQuestionField(event) {
    event.target.previousSibling.remove();// remove the add button
    event.target.previousSibling.remove();// remove the input box
    event.target.remove(); // remove the remove button
}
async function addListeningQuestionField() {
    const container = document.getElementById('listeningFields');
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'listeningQuestions';
    container.appendChild(input);
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = '+';
    button.onclick = addListeningQuestionField;
    container.appendChild(button);
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.textContent = '-';
    removeButton.onclick = removeQuestionField;
    container.appendChild(removeButton);
}
async function addTopicKeywordField() {
    const container = document.getElementById('topicFields');
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'topicKeywords';
    container.appendChild(input);
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = '+';
    button.onclick = addTopicKeywordField;
    container.appendChild(button);
    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.textContent = '-';
    removeButton.onclick = removeQuestionField;
    container.appendChild(removeButton);
}
async function loadExercises() {
    const assignmentType = document.getElementById('assignmentType').value;
    const exerciseSelect = document.getElementById('exercise');
    exerciseSelect.innerHTML = ''; // Clear existing options
    const exercises = await fetchExercises(assignmentType);
    exercises.forEach(exercise => {
        const option = document.createElement('option');
        option.value = exercise.id;
        option.textContent = exercise.title || exercise.prompt || exercise.url || exercise.keywords.join(', ');
        exerciseSelect.appendChild(option);
    });
}

async function fetchExercises() {
    const assignmentType = document.getElementById('assignmentType').value;
    const response = await fetch(`https://infinite-sands-52519-06605f47cb30.herokuapp.com/exercises_by_type?type=${assignmentType}`, {
        method: 'GET',
        headers: {
            'Authorization': sessionStorage.getItem('sessionToken'),
            'Content-Type': 'application/json'
        }
    });
    if (response.status === 401) {
        // Redirect to login page if not authenticated
        window.location.href = '/login';
        return;
        }
    if (!response.ok) {
        //mock response for testing
         return [
        { id: 1, title: 'வாஸ்கோடகாமா', description: 'வாஸ்கோடகாமா ', exerciseId: 101, content: {"intro":["தமிழ் உரையாடல் பயிற்சி . முழு வாக்கியங்களாக பேசவும்","இன்றைய தலைப்பு \"ஓலைச்சுவடிகள்‌\""],"conversations":["உன் பெயர் என்ன ?","ஓலைச்சுவடிகள்‌ என்றால்‌ என்ன?","ஓலைச்சுவடிகள்‌ எந்த காலத்தில்‌ வந்தது?","ஓலைச்சுவடிகள்‌ எவற்றையெல்லாம்‌ உள்ளடக்கியுள்ளன?","ஓலைச்சுவடிகளில்‌ உள்ள எழுத்துக்களின்‌ பெயர்‌ என்ன? ","பனையோலைச்‌ சுவடிகளில்‌ எப்படி எழுத்துகளை எழுதுவார்கள்‌ என்று உனக்குத்‌ தெரியுமா?","ஓலைச்சுவடிகளை எப்படிப்‌ பாதுகாத்தார்கள்‌?","அந்தக்‌ காலத்தில்‌ மக்கள்‌ குறிப்புகளை எதில்‌ எழுதினார்கள்‌? "," எந்த மரத்தின்‌ இலையை எழுதப்‌ பயன்படுத்தினார்கள்‌?","அந்தகாலத்தில்‌ ஏன்‌ பனை ஓலைகளில்‌ மையால்‌ எழுதவில்லை ?"],"words":["ஓலைச்சுவடிகள்‌"],"test":[]} },
        { id: 2, title: 'கொல்லாமை', description: 'கொல்லாமை” என்ற திருக்குறள்‌ கதையைக்‌ கேட்டு, அதைப்‌ பற்றி‌ உங்கள்‌ கருத்துக்களைப்‌ பகிரவும்.', exerciseId: 102, content: {"intro":["தமிழ் உரையாடல் பயிற்சி . முழு வாக்கியங்களாக பேசவும்","இன்றைய தலைப்பு \"ஓலைச்சுவடிகள்‌\""],"conversations":["உன் பெயர் என்ன ?","ஓலைச்சுவடிகள்‌ என்றால்‌ என்ன?","ஓலைச்சுவடிகள்‌ எந்த காலத்தில்‌ வந்தது?","ஓலைச்சுவடிகள்‌ எவற்றையெல்லாம்‌ உள்ளடக்கியுள்ளன?","ஓலைச்சுவடிகளில்‌ உள்ள எழுத்துக்களின்‌ பெயர்‌ என்ன? ","பனையோலைச்‌ சுவடிகளில்‌ எப்படி எழுத்துகளை எழுதுவார்கள்‌ என்று உனக்குத்‌ தெரியுமா?","ஓலைச்சுவடிகளை எப்படிப்‌ பாதுகாத்தார்கள்‌?","அந்தக்‌ காலத்தில்‌ மக்கள்‌ குறிப்புகளை எதில்‌ எழுதினார்கள்‌? "," எந்த மரத்தின்‌ இலையை எழுதப்‌ பயன்படுத்தினார்கள்‌?","அந்தகாலத்தில்‌ ஏன்‌ பனை ஓலைகளில்‌ மையால்‌ எழுதவில்லை ?"],"words":["ஓலைச்சுவடிகள்‌"],"test":[]} },
        { id: 3, title: 'பொங்கல்', description: 'பொங்கல்', exerciseId: 103, content: {"intro":["தமிழ் உரையாடல் பயிற்சி . முழு வாக்கியங்களாக பேசவும்","இன்றைய தலைப்பு \"ஓலைச்சுவடிகள்‌\""],"conversations":["உன் பெயர் என்ன ?","ஓலைச்சுவடிகள்‌ என்றால்‌ என்ன?","ஓலைச்சுவடிகள்‌ எந்த காலத்தில்‌ வந்தது?","ஓலைச்சுவடிகள்‌ எவற்றையெல்லாம்‌ உள்ளடக்கியுள்ளன?","ஓலைச்சுவடிகளில்‌ உள்ள எழுத்துக்களின்‌ பெயர்‌ என்ன? ","பனையோலைச்‌ சுவடிகளில்‌ எப்படி எழுத்துகளை எழுதுவார்கள்‌ என்று உனக்குத்‌ தெரியுமா?","ஓலைச்சுவடிகளை எப்படிப்‌ பாதுகாத்தார்கள்‌?","அந்தக்‌ காலத்தில்‌ மக்கள்‌ குறிப்புகளை எதில்‌ எழுதினார்கள்‌? "," எந்த மரத்தின்‌ இலையை எழுதப்‌ பயன்படுத்தினார்கள்‌?","அந்தகாலத்தில்‌ ஏன்‌ பனை ஓலைகளில்‌ மையால்‌ எழுதவில்லை ?"],"words":["ஓலைச்சுவடிகள்‌"],"test":[]} },
        { id: 4, title: 'தமிழ் மொழி', description: 'தமிழ் மொழி', exerciseId: 104, content: {"intro":["தமிழ் உரையாடல் பயிற்சி . முழு வாக்கியங்களாக பேசவும்","இன்றைய தலைப்பு \"ஓலைச்சுவடிகள்‌\""],"conversations":["உன் பெயர் என்ன ?","ஓலைச்சுவடிகள்‌ என்றால்‌ என்ன?","ஓலைச்சுவடிகள்‌ எந்த காலத்தில்‌ வந்தது?","ஓலைச்சுவடிகள்‌ எவற்றையெல்லாம்‌ உள்ளடக்கியுள்ளன?","ஓலைச்சுவடிகளில்‌ உள்ள எழுத்துக்களின்‌ பெயர்‌ என்ன? ","பனையோலைச்‌ சுவடிகளில்‌ எப்படி எழுத்துகளை எழுதுவார்கள்‌ என்று உனக்குத்‌ தெரியுமா?","ஓலைச்சுவடிகளை எப்படிப்‌ பாதுகாத்தார்கள்‌?","அந்தக்‌ காலத்தில்‌ மக்கள்‌ குறிப்புகளை எதில்‌ எழுதினார்கள்‌? "," எந்த மரத்தின்‌ இலையை எழுதப்‌ பயன்படுத்தினார்கள்‌?","அந்தகாலத்தில்‌ ஏன்‌ பனை ஓலைகளில்‌ மையால்‌ எழுதவில்லை ?"],"words":["ஓலைச்சுவடிகள்‌"],"test":[]} }
    ];
       //{"content":{"intro":["கேட்டல்‌ கருத்தறிதல் பயிற்சி . முழு வாக்கியங்களாக பேசவும்","வெகுளாமை' என்ற திருக்குறள்‌ கதையைக்‌ கீழே உள்ள லிங்க்கில்‌ பார்க்கவும்‌."],"conversations":["நடுவர் என்ன தீர்ப்பு வழங்கினார் ?","வெகுளாமை என்றால் என்ன ?","இந்த கதையில் இருந்து நீ என்ன தெரிந்து கொண்டாய் ?"],"words":["வெகுளாமை"],"test":[],"week":{"$numberInt":"2"},"class":"HSCP2","link":"https://www.youtube.com/embed/4j1kypXSaew?si=0utNCHP4zPlAW-uB"},"title":"வெகுளாமை","type":"கேட்டல்‌ கருத்தறிதல் பயிற்சி","class":"HSCP2","description":"கேட்டல்‌ கருத்தறிதல்","status":"created","updatedAt":{"$date":{"$numberLong":"1756185966887"}},"createdAt":{"$date":{"$numberLong":"1756185966887"}},"number":"2"}  
    }
    const data = await response.json();
    return data.exercises;
}

async function previewExercise() {
    const assignmentType = document.getElementById('assignmentType').value;
    const exerciseId = document.getElementById('exercise').value;
    const previewDiv = document.getElementById('exercisePreview');
    previewDiv.innerHTML = ''; // Clear previous preview
    let exercise = null;
    if (exercises.length > 0) {
        exercise = exercises.find(ex => ex.id == exerciseId);
    } else {
        const allExercises = await fetchExercises(assignmentType);
        exercise = allExercises.find(ex => ex.id == exerciseId);
    }
    if (!exercise) {
        previewDiv.textContent = 'No exercise selected or exercise not found.';
        return;
    }
    let contentHtml = `<h3>${exercise.title || 'Exercise Preview'}</h3>`;
    if (assignmentType === 'உரையாடல் பயிற்சி') {
        contentHtml += '<h4>Intro:</h4><ul>';
        (exercise.content.intro || []).forEach(line => {
            contentHtml += `<li>${line}</li>`;
        });
        contentHtml += '</ul><h4>Conversations:</h4><ul>';
        (exercise.content.conversations || []).forEach(line => {
            contentHtml += `<li>${line}</li>`;
        });
        contentHtml += '</ul>';
    } else if (assignmentType === 'கதை சொல்லுதல் பயிற்சி') {
        contentHtml += `<p><strong>Prompt:</strong> ${exercise.prompt || ''}</p>`;
    } else if (assignmentType === 'கேட்டல்‌ கருத்தறிதல் பயிற்சி') {
        contentHtml += `<p><strong>Audio URL:</strong> <a href="${exercise.url}" target="_blank">${exercise.url}</a></p>`;
        contentHtml += '<h4>Questions:</h4><ul>';
        (exercise.keywords || []).forEach(keyword => {
            contentHtml += `<li>${keyword}</li>`;
        });
        contentHtml += '</ul>';
    } else if (assignmentType === 'தலைப்பு பயிற்சி') {
        contentHtml += `<p><strong>Keywords:</strong> ${ (exercise.keywords || []).join(', ') }</p>`;
    }
    previewDiv.innerHTML = contentHtml; 
}

async function showCustomExercise() {
    const section = document.getElementById('customExerciseSection');
    section.style.display = 'block';
    const exerciseType = document.getElementById('assignmentType').value;
    // Hide all fields initially
    document.getElementById('dialogueFields').style.display = 'none';
    document.getElementById('storyFields').style.display = 'none';
    document.getElementById('listeningFields').style.display = 'none';
    document.getElementById('topicFields').style.display = 'none';
    // Show the relevant fields based on the selected exercise type
    if (exerciseType === 'உரையாடல் பயிற்சி') {
        document.getElementById('dialogueFields').style.display = 'block';
    } else if (exerciseType === 'கதை சொல்லுதல் பயிற்சி') {
        document.getElementById('storyFields').style.display = 'block';
    } else if (exerciseType === 'கேட்டல்‌ கருத்தறிதல் பயிற்சி') {
        document.getElementById('listeningFields').style.display = 'block';
    } else if (exerciseType === 'தலைப்பு பயிற்சி') {
        document.getElementById('topicFields').style.display = 'block';
    }
}


async function saveCustomExercise() {
    const exerciseType = document.getElementById('assignmentType').value;
    const classId = document.getElementById('class').value;
    console.log('Creating custom exercise for classId:', classId);
    const exerciseData = {};
    const intro=[];
    if(exerciseType === 'உரையாடல் பயிற்சி'){
        intro.push("தமிழ் உரையாடல் பயிற்சி . முழு வாக்கியங்களாக பேசவும்");
        intro.push(`இன்றைய தலைப்பு "${document.getElementById('title').value}"`);
    } else if(exerciseType === 'கதை சொல்லுதல் பயிற்சி'){
        intro.push("கதை சொல்லுதல் பயிற்சி . முழு வாக்கியங்களாக பேசவும்");
        intro.push(`இன்றைய தலைப்பு "${document.getElementById('title').value}"`);
    } else if(exerciseType === 'கேட்டல்‌ கருத்தறிதல் பயிற்சி'){
        intro.push("கேட்டல்‌ கருத்தறிதல் பயிற்சி . முழு வாக்கியங்களாக பேசவும்");
        intro.push(`"${document.getElementById('title').value}"  கீழே உள்ள லிங்க்கில்‌ பார்க்கவும்‌.`);
    } else if(exerciseType === 'தலைப்பு பயிற்சி'){
        intro.push("தலைப்பு பயிற்சி . முக்கிய சொற்களை பயன்படுத்தி உரையாடவும்");
        intro.push(`இன்றைய தலைப்பு "${document.getElementById('title').value}"`);
    }
    exerciseData.title = document.getElementById('title').value;
    exerciseData.description = document.getElementById('description').value;
    exerciseData.intro = intro;
    if (exerciseType === 'உரையாடல் பயிற்சி') {
        const questionInputs = document.querySelectorAll('#dialogueFields input[name="questions"]');
        exerciseData.questions = Array.from(questionInputs).map(input => input.value);
    } else if (exerciseType === 'கதை சொல்லுதல் பயிற்சி') {
        exerciseData.storyPrompt = document.getElementById('storyPrompt').value;
    } else if (exerciseType === 'கேட்டல்‌ கருத்தறிதல் பயிற்சி') {
        exerciseData.listeningAudioURL = document.getElementById('listeningAudioURL').value;
        const listeningQuestionInputs = document.querySelectorAll('#listeningFields input[name="listeningQuestions"]');
        exerciseData.listeningQuestions = Array.from(listeningQuestionInputs).map(input => input.value);
    } else if (exerciseType === 'தலைப்பு பயிற்சி') {
        const topicKeywordInputs = document.querySelectorAll('#topicFields input[name="keywords"]');
        exerciseData.topicKeywords = Array.from(topicKeywordInputs).map(input => input.value);
    }
    console.log('Exercise Data:', exerciseData);
    // Send the data to the backend
    const response = await fetch('https://infinite-sands-52519-06605f47cb30.herokuapp.com/create_exercise', {
        method: 'POST',
        headers: {
            'Authorization': sessionStorage.getItem('sessionToken'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "class": classId,
            "type": exerciseType,
            'title': exerciseData.title ,
            'description': exerciseData.description || '',
            'content': {
                "intro": exerciseData.intro || [],  
                "conversations": exerciseData.questions || [],
                "url": exerciseData.listeningAudioURL || '',
                "keywords": exerciseData.topicKeywords || [],
                "questions": exerciseData.listeningQuestions || []
            }
            // Include other necessary fields from the form
        })
    });
    if (response.status === 401) {
        // Redirect to login page if not authenticated
        window.location.href = "https://ita-hscp.github.io/ita/Login"; // Replace with your actual login URL
        return;
    }
    if (!response.ok) {
        return {};
    }
    const responseData = await response.json();
    return responseData;//{"message":"Form saved successfully","exerciseId":"ec88eba4-8dbf-49e3-80a9-0fe846df6b10"}
    // add the exerciseId to the exercise dropdown and value should be the exerciseId, text should be the title or prompt
    const exerciseDropdown = document.getElementById('exercise');
    const newOption = document.createElement('option');
    newOption.value = responseData.exerciseId;
    newOption.textContent = exerciseData.title || exerciseData.storyTitle || exerciseData.listeningTitle || exerciseData.topicTitle;
    exerciseDropdown.appendChild(newOption);
}