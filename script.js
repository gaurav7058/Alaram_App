let timers = [];

document.getElementById('start-timer').addEventListener('click', function() {
    let hours = parseInt(document.getElementById('hours').value) || 0;
    let minutes = parseInt(document.getElementById('minutes').value) || 0;
    let seconds = parseInt(document.getElementById('seconds').value) || 0;

    if (hours === 0 && minutes === 0 && seconds === 0) {
        alert("Please set a valid time!");
        return;
    }

    let totalSeconds = hours * 3600 + minutes * 60 + seconds;
    addTimer(totalSeconds);
});

function addTimer(duration) {
    let timerContainer = document.getElementById('timers-container');
    let noTimersMsg = document.querySelector('.no-timers-msg');

    if (noTimersMsg) {
        noTimersMsg.remove();
    }

    let timerId = timers.length;
    let timerDiv = document.createElement('div');
    timerDiv.className = 'timer';
    timerDiv.innerHTML = `
        <span id="timer-${timerId}">Time Left : ${formatTime(duration)}</span>
        <button class="toggle-timer" data-id="${timerId}">Stop Timer</button>
    `;

    timerContainer.appendChild(timerDiv);

    let interval = setInterval(function() {
        if (duration <= 0) {
            clearInterval(interval);
            document.getElementById(`timer-${timerId}`).textContent = "Time's up!";
            timerDiv.classList.add('timer-ended');
            playAlarm();

            // Change button to delete after timer ends
            let button = timerDiv.querySelector('.toggle-timer');
            button.textContent = "Delete Timer";
            button.className = "delete-timer";
            button.addEventListener('click', function() {
                timerDiv.remove();
                checkIfNoTimers();
            });
            return;
        }

        duration--;
        document.getElementById(`timer-${timerId}`).textContent = `Time Left : ${formatTime(duration)}`;
    }, 1000);

    timers.push({ interval, duration, isPaused: false });

    timerDiv.querySelector('.toggle-timer').addEventListener('click', function() {
        let timerData = timers[timerId];
        if (!timerData.isPaused) {
            clearInterval(timerData.interval);
            timerData.isPaused = true;
            this.textContent = "Start Timer";
            document.getElementById(`timer-${timerId}`).textContent += " (Paused)";
        } else {
            timerData.isPaused = false;
            this.textContent = "Stop Timer";
            resumeTimer(timerId);
        }
    });
}

function resumeTimer(timerId) {
    let timerData = timers[timerId];
    timerData.interval = setInterval(function() {
        if (timerData.duration <= 0) {
            clearInterval(timerData.interval);
            document.getElementById(`timer-${timerId}`).textContent = "Time's up!";
            let timerDiv = document.querySelector(`[data-id="${timerId}"]`).parentElement;
            timerDiv.classList.add('timer-ended');
            playAlarm();

            // Change button to delete after timer ends
            let button = timerDiv.querySelector('.toggle-timer');
            button.textContent = "Delete Timer";
            button.className = "delete-timer";
            button.addEventListener('click', function() {
                timerDiv.remove();
                checkIfNoTimers();
            });
            return;
        }

        timerData.duration--;
        document.getElementById(`timer-${timerId}`).textContent = `Time Left : ${formatTime(timerData.duration)}`;
    }, 1000);
}

function formatTime(seconds) {
    let hrs = Math.floor(seconds / 3600);
    let mins = Math.floor((seconds % 3600) / 60);
    let secs = seconds % 60;

    return `${String(hrs).padStart(2, '0')} : ${String(mins).padStart(2, '0')} : ${String(secs).padStart(2, '0')}`;
}

function playAlarm() {
    let alarmSound = document.getElementById('alarm-sound');
    alarmSound.play();
}

function checkIfNoTimers() {
    if (document.getElementById('timers-container').children.length === 0) {
        let noTimersMessage = document.createElement('p');
        noTimersMessage.className = 'no-timers-msg';
        noTimersMessage.textContent = "You have no timers currently!";
        document.getElementById('timers-container').appendChild(noTimersMessage);
    }
}
