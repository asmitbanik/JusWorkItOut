const workoutForm = document.getElementById('workout-form');
const workoutChartCtx = document.getElementById('workoutChart').getContext('2d');
const mealForm = document.getElementById('meal-form');
const mealResults = document.getElementById('meal-results');
const mealChartCtx = document.getElementById('mealChart').getContext('2d');
const calendarContainer = document.getElementById('calendar-container');
const weatherInfo = document.getElementById('weather-info');

let workoutChart, mealChart;

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

workoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const type = document.getElementById('workout-type').value;
    const duration = document.getElementById('workout-duration').value;

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
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: `black`
                        }
                    },
                    x: {
                        ticks: {
                            color: 'black' 
                        }
                    },

                }
            }
        });
    } else {
        workoutChart.data.labels.push(type);
        workoutChart.data.datasets[0].data.push(duration);
        workoutChart.update();
    }
}

mealForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = document.getElementById('meal-query').value;
    const meals = await fetchMeals(query);
    displayMeals(meals);
    updateMealChart(meals);
    mealForm.reset();
});

mealForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = document.getElementById('meal-query').value;
    const meals = await fetchMeals(query);
    displayMeals(meals);
    updateMealChart(meals);
    mealForm.reset();
});

async function fetchMeals(query) {
    const url = `https://api.edamam.com/search?q=${query}&app_id=YOUR_APP_ID&app_key=YOUR_APP_KEY`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.hits.map(hit => ({
            name: hit.recipe.label,
            calories: hit.recipe.calories.toFixed(0),
        }));
    } catch (error) {
        console.error('Error fetching meals:', error);
        return [];
    }
}

function displayMeals(meals) {
    mealResults.innerHTML = meals.map(meal => `<p><strong>${meal.name}</strong>: ${meal.calories} kcal</p>`).join('');
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
                    backgroundColor: ['#E17564', '#BE3144', '#872341', '#09122C', '#fff'],
                    borderColor: ['#E17564', '#BE3144', '#872341', '#09122C', '#fff'],
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

async function fetchWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=New York&appid=YOUR_API_KEY&units=metric`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        weatherInfo.innerHTML = `🌡️ ${data.main.temp}°C, ${data.weather[0].description}`;
    } catch (error) {
        weatherInfo.innerHTML = 'Error fetching weather data';
    }
}

fetchWeather();
