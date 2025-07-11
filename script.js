
function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 10) return "morning";
  if (hour < 16) return "afternoon";
  return "evening";
}

function startPeriod() {
  localStorage.setItem("cycleStart", new Date().toISOString());
  alert("Cycle start saved.");
  updateGreeting();
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
  checkEmergencyReset(mood, getCyclePhase(getCycleDay()));
}

function showSuggestion(mood, phase) {
  let suggestion = "You're doing your best.";
  if (phase === "Luteal" && mood === "overwhelmed") suggestion = "Try a 3-min body scan.";
  else if (mood === "foggy") suggestion = "Try light movement and water.";
  else if (phase === "Menstrual") suggestion = "Your body is resting. Permission to do less.";

  document.getElementById("suggestion").innerText = suggestion;
}

function updateGreeting() {
  if (!localStorage.getItem("cycleStart")) return;
  const phase = getCyclePhase(getCycleDay());
  const time = getTimeOfDay();
  let text = "Hi there.";

  if (time === "morning") text = "☀️ Good morning. A fresh start.";
  if (time === "afternoon") text = "🌿 It's okay to pause this afternoon.";
  if (time === "evening") text = "🌙 You’ve done enough for today.";

  if (phase === "Luteal") text += " Be extra gentle with yourself.";
  if (phase === "Menstrual") text += " Today is for stillness and care.";

  document.getElementById("greeting").innerText = text;
  document.getElementById("phase-display").innerText = "Cycle Phase: " + phase;
}

function checkEmergencyReset(mood, phase) {
  const showReset = (phase === "Luteal" && mood === "overwhelmed") || mood === "fragile";
  document.getElementById("emergency-reset").style.display = showReset ? "block" : "none";
}

window.onload = function () {
  if (localStorage.getItem("cycleStart")) {
    updateGreeting();
    showSuggestion("foggy", getCyclePhase(getCycleDay()));
    checkEmergencyReset("foggy", getCyclePhase(getCycleDay()));
  }
}
