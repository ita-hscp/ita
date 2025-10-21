let exercises= [];
let detailedAssignments = [];
window.onload = function() {
    // Get week 1 to 40 
    const weeks = Array.from({ length: 40 }, (_, i) => i + 1);
    // Populate the week dropdown
    const weekSelect = document.getElementById('week');
    weeks.forEach(week => {
        const option = document.createElement('option');
        option.value = week;
        option.textContent = week;
        weekSelect.appendChild(option);
    });
}
async function createAssignment() {
    const formData = new FormData(document.getElementById('assignmentForm'));
    const assignment = {
        title: formData.get('title'),
        description: formData.get('description'),
        type: formData.get('assignmentType'),
        week: formData.get('week'),
        startDate: formData.get('startDate'),
        dueDate: formData.get('dueDate'),
        status: 'assigned',
        exerciseId: formData.get('exercise')
    };
    const response = await fetch('https://infinite-sands-52519-06605f47cb30.herokuapp.com/create_assignment', {
        method: 'POST',
        headers: {
            'Authorization': sessionStorage.getItem('sessionToken'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(assignment)
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

async function addQuestionField() {
    const container = document.getElementById('dialogueFields');
    const input = document.createElement('input');
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
    input.name = 'keywords';
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
    exercises = await fetchExercises(assignmentType);
    exercises.forEach(exercise => {
        const option = document.createElement('option');
        option.value = exercise.id;
        option.textContent = exercise.title || exercise.prompt || exercise.url || exercise.keywords.join(', ');
        exerciseSelect.appendChild(option);
    });
}

async function fetchExercises() {
    const assignmentType = document.getElementById('assignmentType').value;
    const classId = document.getElementById('class').value;
    const response = await fetch(`https://infinite-sands-52519-06605f47cb30.herokuapp.com/exercises?type=${assignmentType}&class=${classId}`, {
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
        //mock response  for testing
         return [
         ];
    }
    const data = await response.json();
    return data;
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
        const allExercises = await fetchExercises();
        exercise = allExercises.find(ex => ex.id == exerciseId);
    }
    if (!exercise) {
        previewDiv.textContent = 'No exercise selected or exercise not found.';
        return;
    }
    let contentHtml = `<h3>${exercise.title}</h3>`;
    if (exercise.description) {
        contentHtml += `<p><strong>Description:</strong> ${exercise.description}</p>`;
    }
    if (exercise.content) {
        if (exercise.content.intro && exercise.content.intro.length > 0) {
            contentHtml += '<h4>Introduction:</h4><ul>';
            exercise.content.intro.forEach(intro => {
                contentHtml += `<li>${intro}</li>`;
            });
            contentHtml += '</ul>';
        }
        if (assignmentType === 'உரையாடல் பயிற்சி' && exercise.content.conversations && exercise.content.conversations.length > 0) {
            contentHtml += '<h4>Questions:</h4><ul>';
            exercise.content.conversations.forEach(question => {
                contentHtml += `<li>${question}</li>`;
            });
            contentHtml += '</ul>';
        } else if (assignmentType === 'கதை சொல்லுதல் பயிற்சி' && exercise.content.storyPrompt) {
            contentHtml += `<h4>Story Prompt:</h4><p>${exercise.content.storyPrompt}</p>`;
        } else if (assignmentType === 'கேட்டல்‌ கருத்தறிதல் பயிற்சி') {
            if (exercise.content.url) {
                contentHtml += `<h4>Listening Material:</h4><iframe width="560" height="315" src="${exercise.content.url}" frameborder="0" allowfullscreen></iframe>`;
            }
            if (exercise.content.conversations && exercise.content.conversations.length > 0) {
                contentHtml += '<h4>Questions:</h4><ul>';
                exercise.content.conversations.forEach(question => {
                    contentHtml += `<li>${question}</li>`;
                });
                contentHtml += '</ul>';
            }
        } else if (assignmentType === 'தலைப்பு பயிற்சி' && exercise.content.keywords && exercise.content.keywords.length > 0) {
            contentHtml += '<h4>Topic Keywords:</h4><ul>';
            exercise.content.keywords.forEach(keyword => {
                contentHtml += `<li>${keyword}</li>`;
            });
            contentHtml += '</ul>';
        }
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
        exerciseData.questions = Array.from(listeningQuestionInputs).map(input => input.value);
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
                "link": exerciseData.listeningAudioURL || '',
                "keywords": exerciseData.topicKeywords || []
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
    // add the exerciseId to the exercise dropdown and value should be the exerciseId, text should be the title or prompt
    const exerciseDropdown = document.getElementById('exercise');
    const newOption = document.createElement('option');
    newOption.value = responseData.exerciseId;
    newOption.textContent = exerciseData.title || exerciseData.storyTitle || exerciseData.listeningTitle || exerciseData.topicTitle;
    exerciseDropdown.appendChild(newOption);
    return responseData;
}

Array.from(document.getElementsByClassName('transliterate')).forEach(element => {
    element.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevent newline insertion
            word = this.value.trim();
            if(word.length === 0){
                return;
            }
            const url = `https://inputtools.google.com/request?text=${encodeURIComponent(word)}&itc=ta-t-i0-und&oe=utf-8`;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data[0] === 'SUCCESS') {
                        const tamilText = data[1][0][1][0];
                        this.value = tamilText; // Replace the textarea content with Tamil text
                    } else {
                        console.error('Error fetching transliteration:', data);
                    }
                })
                .catch(error => console.error('Error:', error));
        }
    });
});