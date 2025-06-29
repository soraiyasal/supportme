
function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 10) return "morning";
  if (hour < 16) return "afternoon";
  return "evening";
}

function startPeriod() {
  localStorage.setItem("cycleStart", new Date().toISOString());
  alert("Cycle start saved.");
}

function getCycleDay() {
  const start = new Date(localStorage.getItem("cycleStart"));
  const today = new Date();
  return Math.floor((today - start) / (1000 * 60 * 60 * 24)) % 28;
}

function getCyclePhase(day) {
  if (day <= 5) return "Menstrual";
  if (day <= 13) return "Follicular";
  if (day <= 16) return "Ovulation";
  return "Luteal";
}

function saveReflection() {
  const mood = document.getElementById("mood").value;
  const notes = document.getElementById("notes").value;
  const today = new Date().toISOString().split("T")[0];
  const data = JSON.parse(localStorage.getItem("reflections") || "{}");

  data[today] = {
    mood: mood,
    notes: notes,
    time: getTimeOfDay(),
    cycleDay: getCycleDay()
  };

  localStorage.setItem("reflections", JSON.stringify(data));
  alert("Reflection saved.");
  showSuggestion(mood, getCyclePhase(getCycleDay()));
}

function showSuggestion(mood, phase) {
  let suggestion = "You're doing your best.";
  if (phase === "Luteal" && mood === "overwhelmed") suggestion = "Try a 3-min body scan.";
  else if (mood === "foggy") suggestion = "A glass of water and a window break?";
  else if (phase === "Menstrual") suggestion = "Give yourself permission to rest.";

  document.getElementById("suggestion").innerText = suggestion;
}

function setGreeting() {
  const phase = getCyclePhase(getCycleDay());
  const time = getTimeOfDay();
  let text = "Hi there.";

  if (time === "morning" && phase === "Follicular") {
    text = "New energy—go gently.";
  } else if (phase === "Luteal") {
    text = "You're in the luteal phase—move softly today.";
  }

  document.getElementById("greeting").innerText = text;
}

window.onload = function () {
  if (localStorage.getItem("cycleStart")) {
    setGreeting();
    showSuggestion("foggy", getCyclePhase(getCycleDay()));
  }
}
