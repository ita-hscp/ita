
async function createAssignment() {
    const formData = new FormData(document.getElementById('assignmentForm'));
    const assignment={
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
window.onload = function() {
    let selectAssignmentType = document.getElementById('assignmentType');
    //     <select id="assignmentType" name="assignmentType"> if assignment_type is selected, call getExercisesForAssignmentType in the backend
    selectAssignmentType.addEventListener('change', async function() {
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
        { id: 1, title: 'வாஸ்கோடகாமா', description: 'வாஸ்கோடகாமா ' ,exerciseId:101},
        { id: 2, title: 'கொல்லாமை', description: 'கொல்லாமை” என்ற திருக்குறள்‌ கதையைக்‌ கேட்டு, அதைப்‌ பற்றி‌ உங்கள்‌ கருத்துக்களைப்‌ பகிரவும்.' ,exerciseId:102},
        { id: 3, title: 'பொங்கல்', description: 'பொங்கல்' ,exerciseId:103},
        { id: 4, title: 'தமிழ் மொழி', description: 'தமிழ் மொழி' ,exerciseId:104}
    ];
    if (!response.ok) {
        return [];
    }
    const responseData = await response.json();
    return responseData.exercises || [];
}