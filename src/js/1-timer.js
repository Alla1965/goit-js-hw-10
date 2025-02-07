// Імпорт бібліотек
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// Оголошення констант та змінних
const dateTimePicker = document.querySelector('.date-start');
const startButton = document.querySelector('.btn-start');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let userSelectedDate = null;
let timerId = null;

// Робимо кнопку СТАРТ неактивною
startButton.disabled = true;

// Настройка Flatpickr
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  // функція, яка виконується при закритті календарю
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    if (selectedDate <= new Date()) {
      iziToast.error({
        title: 'Помилка',
        message: 'Будь-ласка, оберіть дату у майбутньому',
        position: 'topRight',
        backgroundColor: '#ef4040',
      });
      startButton.disabled = true;
    } else {
      userSelectedDate = selectedDate;
      startButton.disabled = false;
    }
  },
};
// Виклик календарю
flatpickr(dateTimePicker, options);

// Функція для формату часу (додавання 0 спереду)
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

// Функція перетворенн ms в дні, години, хвилини та секунди
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day); //кількість целих дней в заданій кількості мілісекунд
  const hours = Math.floor((ms % day) / hour); //кількість годин
  const minutes = Math.floor(((ms % day) % hour) / minute); //кількість хвилин
  const seconds = Math.floor((((ms % day) % hour) % minute) / second); //кількість секунд

  return { days, hours, minutes, seconds };
}

// Функція оновлення інтерфейсу
function updateTimerDisplay({ days, hours, minutes, seconds }) {
  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

// Запуск таймера
startButton.addEventListener('click', () => {
  startButton.disabled = true;
  dateTimePicker.disabled = true;

  timerId = setInterval(() => {
    const now = new Date().getTime();
    const timeLeft = userSelectedDate - now;
    //Зупинка таймеру
    if (timeLeft <= 0) {
      clearInterval(timerId);
      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      dateTimePicker.disabled = false;
      iziToast.success({ title: 'Готово', message: 'Таймер завершен!' });
      return;
    }
    updateTimerDisplay(convertMs(timeLeft));
  }, 1000);
});
