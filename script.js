const workoutForm = document.getElementById('workout-form');
const workoutChartCtx = document.getElementById('workoutChart').getContext('2d');
const mealForm = document.getElementById('meal-form');
const mealResults = document.getElementById('meal-results');
const mealChartCtx = document.getElementById('mealChart').getContext('2d');
const calendarContainer = document.getElementById('calendar-container');
const weatherInfo = document.getElementById('weather-info');

let workoutChart, mealChart;

const weatherWorkouts = {
    Clear: [
        { type: 'Outdoor Running', description: 'Perfect weather for a jog in the park' },
        { type: 'Cycling', description: 'Great conditions for a bike ride' }
    ],
    Clouds: [
        { type: 'Power Walking', description: 'Cool weather for a brisk walk' },
        { type: 'Outdoor Yoga', description: 'Peaceful conditions for outdoor yoga' }
    ],
    Rain: [
        { type: 'Indoor Cardio', description: 'Stay dry with indoor exercises' },
        { type: 'Home Strength Training', description: 'Perfect time for muscle building' }
    ],
    Snow: [
        { type: 'Indoor HIIT', description: 'High-intensity indoor workout' },
        { type: 'Home Gym Session', description: 'Focus on strength training indoors' }
    ],
    Extreme: [
        { type: 'Indoor Low-Impact', description: 'Safe exercises at home' },
        { type: 'Stretching', description: 'Gentle indoor movement' }
    ]
};

const dietTypes = {
    protein: {
        query: 'high protein chicken beef fish',
        meals: [
            { name: 'Grilled Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
            { name: 'Salmon Fillet', calories: 208, protein: 22, carbs: 0, fat: 13 },
            { name: 'Turkey and Quinoa Bowl', calories: 350, protein: 35, carbs: 25, fat: 12 },
            { name: 'Tuna Steak', calories: 184, protein: 42, carbs: 0, fat: 1 }
        ]
    },
    carbs: {
        query: 'pasta rice potato bread',
        meals: [
            { name: 'Whole Grain Pasta', calories: 350, protein: 12, carbs: 74, fat: 1.3 },
            { name: 'Brown Rice Bowl', calories: 280, protein: 6, carbs: 58, fat: 2.2 },
            { name: 'Sweet Potato Hash', calories: 250, protein: 4, carbs: 52, fat: 5 },
            { name: 'Quinoa Stir-Fry', calories: 320, protein: 11, carbs: 62, fat: 4 }
        ]
    },
    balanced: {
        query: 'balanced healthy meal',
        meals: [
            { name: 'Chicken & Rice Bowl', calories: 400, protein: 25, carbs: 45, fat: 12 },
            { name: 'Mediterranean Salad', calories: 350, protein: 15, carbs: 35, fat: 15 },
            { name: 'Tofu Stir-Fry', calories: 380, protein: 20, carbs: 40, fat: 14 },
            { name: 'Fish Tacos', calories: 420, protein: 28, carbs: 42, fat: 16 }
        ]
    },
    junk: {
        query: 'fast food burger pizza',
        meals: [
            { name: 'Cheeseburger', calories: 550, protein: 25, carbs: 42, fat: 29 },
            { name: 'Pizza Slice', calories: 285, protein: 12, carbs: 36, fat: 10 },
            { name: 'French Fries', calories: 365, protein: 4, carbs: 44, fat: 17 },
            { name: 'Chicken Wings', calories: 430, protein: 38, carbs: 0, fat: 32 }
        ]
    }
};

const calendar = new FullCalendar.Calendar(calendarContainer, {
    initialView: 'dayGridMonth',
    events: [],
    dateClick: (info) => {
        const workoutType = prompt('Enter workout type:');
        if (workoutType) {
            calendar.addEvent({
                title: workoutType,
                start: info.dateStr,
                allDay: true,
            });
        }
    },
});
calendar.render();

function suggestWorkouts(weatherCondition) {
    const workoutSuggestions = document.getElementById('workout-suggestions');
    if (!workoutSuggestions) return;

    const condition = weatherCondition.toLowerCase();
    let workoutList;

    if (condition.includes('clear')) {
        workoutList = weatherWorkouts.Clear;
    } else if (condition.includes('cloud')) {
        workoutList = weatherWorkouts.Clouds;
    } else if (condition.includes('rain') || condition.includes('drizzle')) {
        workoutList = weatherWorkouts.Rain;
    } else if (condition.includes('snow')) {
        workoutList = weatherWorkouts.Snow;
    } else {
        workoutList = weatherWorkouts.Extreme;
    }

    const suggestionsHTML = workoutList
        .map(workout => `
            <div class="workout-suggestion">
                <h4>${workout.type}</h4>
                <p>${workout.description}</p>
            </div>
        `)
        .join('');

    workoutSuggestions.innerHTML = suggestionsHTML;
}

workoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const type = document.getElementById('workout-type').value;
    const duration = document.getElementById('workout-duration').value;

    if (duration <= 0) {
        alert('Duration must be a positive number.');
        return;
    }

    updateWorkoutChart(type, duration);
    workoutForm.reset();
});

function updateWorkoutChart(type, duration) {
    if (!workoutChart) {
        workoutChart = new Chart(workoutChartCtx, {
            type: 'bar',
            data: {
                labels: [type],
                datasets: [{
                    label: 'Workout Duration (mins)',
                    data: [duration],
                    backgroundColor: '#E17564',
                    borderColor: '#BE3144',
                    borderWidth: 1,
                }]
            },
            options: {
                scales: {
                    y: { beginAtZero: true, ticks: { color: 'black' } },
                    x: { ticks: { color: 'black' } }
                }
            }
        });
    } else {
        workoutChart.data.labels.push(type);
        workoutChart.data.datasets[0].data.push(duration);
        workoutChart.update();
    }
}

function getMealPlan(dietType) {
    return dietTypes[dietType].meals;
}

function displayMeals(meals) {
    mealResults.innerHTML = meals.map(meal => `
        <div class="meal-card">
            <h3>${meal.name}</h3>
            <p>Calories: ${meal.calories} kcal</p>
            <p>Protein: ${meal.protein}g</p>
            <p>Carbs: ${meal.carbs}g</p>
            <p>Fat: ${meal.fat}g</p>
        </div>
    `).join('');
}

function updateMealChart(meals) {
    if (!mealChart) {
        mealChart = new Chart(mealChartCtx, {
            type: 'pie',
            data: {
                labels: meals.map(meal => meal.name),
                datasets: [{
                    label: 'Calories',
                    data: meals.map(meal => meal.calories),
                    backgroundColor: ['#E17564', '#BE3144', '#872341', '#09122C'],
                    borderColor: ['#E17564', '#BE3144', '#872341', '#09122C'],
                    borderWidth: 1
                }]
            }
        });
    } else {
        mealChart.data.labels = meals.map(meal => meal.name);
        mealChart.data.datasets[0].data = meals.map(meal => meal.calories);
        mealChart.update();
    }
}

mealForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const dietType = document.getElementById('diet-type').value;
    if (!dietType) {
        alert('Please select a diet type');
        return;
    }
    const meals = getMealPlan(dietType);
    displayMeals(meals);
    updateMealChart(meals);
});

const OPENWEATHER_API_KEY = '9e876817cc5456f83515f084a1b6fdb0';

async function fetchWeather() {
    const city = 'Bengaluru';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const weatherDescription = data.weather[0].description;
        weatherInfo.innerHTML = `🌡️ ${data.main.temp}°C, ${weatherDescription}`;
        
        suggestWorkouts(weatherDescription);
    } catch (error) {
        weatherInfo.innerHTML = 'Error fetching weather data';
        console.error('Error:', error);
    }
}

fetchWeather();
