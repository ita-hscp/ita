
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
        const exercises = await getExercisesForAssignmentType(selectedType);
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
        { id: 1, title: 'வாஸ்கோடகாமா', description: 'வாஸ்கோடகாமா ', exerciseId: 101 },
        { id: 2, title: 'கொல்லாமை', description: 'கொல்லாமை” என்ற திருக்குறள்‌ கதையைக்‌ கேட்டு, அதைப்‌ பற்றி‌ உங்கள்‌ கருத்துக்களைப்‌ பகிரவும்.', exerciseId: 102 },
        { id: 3, title: 'பொங்கல்', description: 'பொங்கல்', exerciseId: 103 },
        { id: 4, title: 'தமிழ் மொழி', description: 'தமிழ் மொழி', exerciseId: 104 }
    ];
    if (!response.ok) {
        return [];
    }
    const responseData = await response.json();
    return responseData.exercises || [];
}

async function createCustomExercise() {
    const section = document.getElementById('customExerciseSection');
    section.style.display = 'block';
    const exerciseType = document.getElementById('customExerciseType').value;
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
async function addQuestionField() {
    const container = document.getElementById('dialogueFields');
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'questions';
    container.appendChild(input);
    container.appendChild(document.createElement('br'));
}
async function addListeningQuestionField() {
    const container = document.getElementById('listeningFields');
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'listeningQuestions';
    container.appendChild(input);
    container.appendChild(document.createElement('br'));
}
async function addTopicKeywordField() {
    const container = document.getElementById('topicFields');
    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'topicKeywords';
    container.appendChild(input);
    container.appendChild(document.createElement('br'));
}
async function loadExercises() {
    const assignmentType = document.getElementById('assignmentType').value;
    const exerciseSelect = document.getElementById('exercise');
    exerciseSelect.innerHTML = ''; // Clear existing options
    let exercises = [];
    if (assignmentType === 'உரையாடல் பயிற்சி') {
        exercises = await fetchDialogueExercises();
    } else if (assignmentType === 'கதை சொல்லுதல் பயிற்சி') {
        exercises = await fetchStoryExercises();
    } else if (assignmentType === 'கேட்டல்‌ கருத்தறிதல் பயிற்சி') {
        exercises = await fetchListeningExercises();
    } else if (assignmentType === 'தலைப்பு பயிற்சி') {
        exercises = await fetchTopicExercises();
    }
    exercises.forEach(exercise => {
        const option = document.createElement('option');
        option.value = exercise.id;
        option.textContent = exercise.title || exercise.prompt || exercise.url || exercise.keywords.join(', ');
        exerciseSelect.appendChild(option);
    });
}
async function previewExercise() {
    const assignmentType = document.getElementById('assignmentType').value;
    const exerciseId = document.getElementById('exercise').value;
    const previewDiv = document.getElementById('exercisePreview');
    previewDiv.innerHTML = ''; // Clear previous preview
    let exercise = null;
    if (assignmentType === 'உரையாடல் பயிற்சி') {
        exercise = await fetchDialogueExerciseById(exerciseId);
        if (exercise) {
            previewDiv.innerHTML = `<h3>${exercise.title}</h3><ul>${exercise.questions.map(q => `<li>${q}</li>`).join('')}</ul>`;
        }
    } else if (assignmentType === 'கதை சொல்லுதல் பயிற்சி') {
        exercise = await fetchStoryExerciseById(exerciseId);
        if (exercise) {
            previewDiv.innerHTML = `<h3>${exercise.prompt}</h3>`;
        }
    } else if (assignmentType === 'கேட்டல்‌ கருத்தறிதல் பயிற்சி') {
        exercise = await fetchListeningExerciseById(exerciseId);
        if (exercise) {
            previewDiv.innerHTML = `<h3><a href="${exercise.url}" target="_blank">Listen Here</a></h3><ul>${exercise.questions.map(q => `<li>${q}</li>`).join('')}</ul>`;
        }
    } else if (assignmentType === 'தலைப்பு பயிற்சி') {
        exercise = await fetchTopicExerciseById(exerciseId);
        if (exercise) {
            previewDiv.innerHTML = `<h3>Keywords: ${exercise.keywords.join(', ')}</h3>`;
        }
    }
}


async function createCustomExercise() {
    const exerciseType = document.getElementById('customExerciseType').value;
    const userId = localStorage.getItem('userId'); // Retrieve userId from local
    console.log('Creating custom exercise for userId:', userId);
    const exerciseData = {};
    if (exerciseType === 'உரையாடல் பயிற்சி') {
        exerciseData.title = document.getElementById('title').value;
        const questionInputs = document.querySelectorAll('#dialogueFields input[name="questions"]');
        exerciseData.questions = Array.from(questionInputs).map(input => input.value);
    } else if (exerciseType === 'கதை சொல்லுதல் பயிற்சி') {
        exerciseData.storyTitle = document.getElementById('storyTitle').value;
        exerciseData.storyPrompt = document.getElementById('storyPrompt').value;
    } else if (exerciseType === 'கேட்டல்‌ கருத்தறிதல் பயிற்சி') {
        exerciseData.listeningTitle = document.getElementById('listeningTitle').value;
        exerciseData.listeningAudioURL = document.getElementById('listeningAudioURL').value;
        const listeningQuestionInputs = document.querySelectorAll('#listeningFields input[name="listeningQuestions"]');
        exerciseData.listeningQuestions = Array.from(listeningQuestionInputs).map(input => input.value);
    } else if (exerciseType === 'தலைப்பு பயிற்சி') {
        exerciseData.topicTitle = document.getElementById('topicTitle').value;
        const topicKeywordInputs = document.querySelectorAll('#topicFields input[name="topicKeywords"]');
        exerciseData.topicKeywords = Array.from(topicKeywordInputs).map(input => input.value);
    }
    console.log('Exercise Data:', exerciseData);
    // Send the data to the backend
    const response = await fetch('https://infinite-sands-52519-06605f47cb30.herokuapp.com/create_custom_exercise', {
        method: 'POST',
        headers: {
            'Authorization': sessionStorage.getItem('sessionToken'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: userId,
            exerciseType: exerciseType,
            exerciseData: exerciseData
            // Include other necessary fiel ds from the form
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
    return responseData;
}