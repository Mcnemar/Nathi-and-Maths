"use strict";

const topics = [
  {name:"Functions & Algebra",desc:"Equations, expressions, functions and graphs"},
  {name:"Complex Numbers",desc:"Real and imaginary parts, modulus and arguments"},
  {name:"Calculus",desc:"Differentiation, integration and applications"},
  {name:"Geometry",desc:"Theorems, angles, circles, area and volume"},
  {name:"Trigonometry",desc:"Ratios, identities, equations and graphs"},
  {name:"Data Handling",desc:"Statistics, data representation and interpretation"},
  {name:"Probability",desc:"Events, rules and probability calculations"},
  {name:"Finance",desc:"Interest, growth, depreciation and financial calculations"}
];

const lessons = {
  "Functions & Algebra":"Start by identifying the equation or function. For a linear equation, simplify both sides, collect the variable terms on one side, then divide by the coefficient. Substitute your answer back into the original equation to check it.",
  "Calculus":"Differentiation describes the rate at which a function changes. For y = xⁿ, the power rule gives dy/dx = nxⁿ⁻¹. For example, d(x³)/dx = 3x². Integration is the reverse process of differentiation, with a constant of integration where appropriate.",
  "Trigonometry":"For right-angled triangles remember SOH-CAH-TOA: sin θ = opposite/hypotenuse, cos θ = adjacent/hypotenuse, tan θ = opposite/adjacent. Identify the sides relative to the angle before choosing a ratio.",
  "Geometry":"Read the diagram carefully, identify the theorem or formula that applies, write down the known values, substitute and show each step. Do not assume that a diagram is drawn to scale.",
  "Complex Numbers":"A complex number has the form a + bi, where i² = −1. The real part is a and the imaginary part is b. Powers of i repeat in a cycle: i, −1, −i, 1.",
  "Data Handling":"Start by identifying what the question asks. Common measures include mean, median, mode and range. For grouped data, use class midpoints and frequencies where appropriate.",
  "Probability":"Probability measures how likely an event is. For equally likely outcomes, P(A) = number of favourable outcomes / total number of outcomes. Probabilities range from 0 to 1 inclusive.",
  "Finance":"Identify the principal, rate, time and whether the problem involves simple or compound interest. Keep rate and time units consistent before substituting into the formula."
};

const questionBank = [
 {topic:"Functions & Algebra",q:"Solve for x: 2x + 5 = 17",a:["x = 5","x = 6","x = 7","x = 8"],correct:1,explain:"Subtract 5 from both sides: 2x = 12. Divide both sides by 2: x = 6. Check: 2(6) + 5 = 17."},
 {topic:"Functions & Algebra",q:"Solve for x: 3x = 21",a:["x = 6","x = 7","x = 8","x = 9"],correct:1,explain:"Divide both sides by 3: x = 21 ÷ 3 = 7."},
 {topic:"Trigonometry",q:"In a right-angled triangle, which ratio is opposite ÷ hypotenuse?",a:["sin θ","cos θ","tan θ","cot θ"],correct:0,explain:"SOH tells us that sine is opposite divided by hypotenuse."},
 {topic:"Geometry",q:"What is the area formula for a circle?",a:["A = 2πr","A = πr²","A = πd","A = r² ÷ π"],correct:1,explain:"The area of a circle is A = πr². Square the radius, then multiply by π."},
 {topic:"Calculus",q:"What is the derivative of x²?",a:["x","2x","x²","2"],correct:1,explain:"Using the power rule, multiply by the exponent and reduce the exponent by one: 2x¹ = 2x."},
 {topic:"Complex Numbers",q:"What is the value of i²?",a:["1","−1","i","−i"],correct:1,explain:"By definition, the imaginary unit satisfies i² = −1."},
 {topic:"Probability",q:"A fair coin is tossed once. What is the probability of getting heads?",a:["0","1/4","1/2","1"],correct:2,explain:"There is one favourable outcome (heads) out of two equally likely outcomes. Probability = 1/2."}
];

const STORAGE_KEY = "nathiStats_v3";
let stats = loadStats();
let currentPractice = null;
let questionAnswered = false;

function loadStats() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved && Number.isFinite(saved.correct) && Number.isFinite(saved.attempts) && saved.topics) return saved;
  } catch (error) { console.warn("Progress could not be read.", error); }
  return {correct:0, attempts:0, topics:{}};
}
function saveStats() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(stats)); }
  catch (error) { console.warn("Progress could not be saved on this device.", error); }
}
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(el => el.classList.toggle("active", el.id === id));
  document.querySelectorAll(".bottom-nav button").forEach(el => el.classList.toggle("active", el.dataset.screen === id));
  window.scrollTo({top:0,behavior:"smooth"});
  if (id === "progress") renderProgress();
}
function usePrompt(value) {
  document.getElementById("question").value = value;
  document.getElementById("question").focus();
}
function addMessage(text, type) {
  const container = document.getElementById("chat");
  const message = document.createElement("div");
  message.className = "message " + type;
  if (type === "ai") {
    const heading = document.createElement("strong");
    heading.textContent = "Nathi";
    message.appendChild(heading);
  }
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  message.appendChild(paragraph);
  container.appendChild(message);
  container.scrollTop = container.scrollHeight;
}
function detectTopic(question) {
  const s = question.toLowerCase();
  if (/differentiat|derivative|integrat|calculus/.test(s)) return "Calculus";
  if (/sin|cos|tan|trigon|soh|cah|toa/.test(s)) return "Trigonometry";
  if (/circle|triangle|angle|area|volume|theorem/.test(s)) return "Geometry";
  if (/complex|imaginary|powers of i|\bi\^/.test(s)) return "Complex Numbers";
  if (/probab/.test(s)) return "Probability";
  if (/mean|median|mode|standard deviation|data/.test(s)) return "Data Handling";
  if (/interest|depreciation|finance|annuity/.test(s)) return "Finance";
  return "Functions & Algebra";
}
function tutorAnswer(question) {
  const s = question.toLowerCase();
  const topic = detectTopic(question);
  if (/2x\s*\+\s*5\s*=\s*17/.test(s)) return "Topic: Functions & Algebra\n\nStep 1: Subtract 5 from both sides.\n2x = 12\n\nStep 2: Divide both sides by 2.\nx = 6\n\nAnswer: x = 6\n\nCheck: 2(6) + 5 = 17.";
  if (/teach me|explain|from the beginning|help me/.test(s)) return "Topic: " + topic + "\n\n" + lessons[topic] + "\n\nNext step: Ask me for a worked example on " + topic + ".";
  if (/x\s*[\+\-]\s*\d+\s*=\s*\d+/.test(s)) return "This appears to be a linear equation. First, identify the constant term. What operation can you use on both sides to move that constant away from the term containing x?";
  if (/x\^?2|quadratic/.test(s)) return "This looks like a quadratic equation. First write it in the form ax² + bx + c = 0. Then decide whether factorisation, completing the square or the quadratic formula is most suitable.";
  if (/area.*circle|circle.*area/.test(s)) return "Use A = πr². Substitute the radius, square it, then multiply by π. Tell me the radius and we can work through the calculation.";
  return "Topic detected: " + topic + "\n\n" + lessons[topic] + "\n\nSend the full question, including any given values, and I will help you plan the solution. This offline demonstration tutor has a limited set of prepared responses; live AI tutoring is not connected yet.";
}
let selectedImageData = null;
let tutorHistory = [];

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function askNathi(event) {
  event.preventDefault();
  const field = document.getElementById("question");
  const question = field.value.trim();
  if (!question && !selectedImageData) return;
  const level = document.getElementById("levelSelect").value;
  const imageForRequest = selectedImageData;
  const visiblePrompt = question || "Please read this Mathematics question from my photo and guide me through it.";
  addMessage(visiblePrompt + (imageForRequest ? "\n[Mathematics photo attached]" : ""), "user");
  field.value = "";
  const fileInput = document.getElementById("questionImage");
  fileInput.value = "";
  selectedImageData = null;
  document.getElementById("imagePreview").hidden = true;
  document.getElementById("imageName").textContent = "No photo selected";
  const sendButton = document.getElementById("sendQuestion");
  sendButton.disabled = true;
  const loading = document.createElement("div");
  loading.className = "message ai loading";
  loading.textContent = "Nathi is working through the question…";
  const chat = document.getElementById("chat");
  chat.appendChild(loading);
  chat.scrollTop = chat.scrollHeight;
  try {
    const response = await fetch("/api/tutor", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({level, message:visiblePrompt, image:imageForRequest, history:tutorHistory.slice(-10)})
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "The tutor service is not available yet.");
    loading.remove();
    addMessage(data.answer || "I could not prepare an explanation. Please try again.", "ai");
    tutorHistory.push({role:"user",content:visiblePrompt});
    tutorHistory.push({role:"assistant",content:data.answer || ""});
    tutorHistory = tutorHistory.slice(-10);
    document.getElementById("aiStatus").textContent = "Live tutor connected. Check each step and ask Nathi whenever something is unclear.";
  } catch (error) {
    loading.remove();
    const fallback = tutorAnswer(visiblePrompt);
    const detail = error && error.message ? error.message : "Unknown connection error";
    addMessage(fallback + "\n\nLive AI connection problem: " + detail + ". The answer above is from offline practice, not the AI service.", "ai");
    document.getElementById("aiStatus").textContent = "Live AI connection problem: " + detail;
    console.warn("Tutor request failed:", error);
  } finally {
    sendButton.disabled = false;
  }
}

function handleImageSelection(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
    alert("Please choose a JPG, PNG or WEBP image."); event.target.value = ""; return;
  }
  if (file.size > 5 * 1024 * 1024) {
    alert("Please choose an image smaller than 5 MB."); event.target.value = ""; return;
  }
  fileToDataUrl(file).then(data => {
    selectedImageData = data;
    const preview = document.getElementById("imagePreview");
    preview.src = data; preview.hidden = false;
    document.getElementById("imageName").textContent = file.name;
  }).catch(() => alert("The image could not be opened. Please try another photo."));
}

function buildTopics() {
  const home = document.getElementById("homeTopics");
  const learn = document.getElementById("learnTopics");
  topics.forEach(topic => {
    [home, learn].forEach(container => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "topic";
      const title = document.createElement("span");
      title.textContent = topic.desc;
      button.append(document.createTextNode(topic.name), title);
      button.addEventListener("click", () => {
        usePrompt("Teach me " + topic.name + " from the beginning");
        showScreen("tutor");
      });
      container.appendChild(button);
    });
  });
}
function newPractice() {
  const candidates = questionBank.filter(item => !currentPractice || item.q !== currentPractice.q);
  currentPractice = candidates[Math.floor(Math.random() * candidates.length)] || questionBank[0];
  questionAnswered = false;
  document.getElementById("practiceTopic").textContent = currentPractice.topic;
  document.getElementById("practiceQuestion").textContent = currentPractice.q;
  document.getElementById("feedback").textContent = "";
  const answers = document.getElementById("answers");
  answers.replaceChildren();
  currentPractice.a.forEach((answer, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = String.fromCharCode(65 + index) + ". " + answer;
    button.addEventListener("click", () => answerPractice(index));
    answers.appendChild(button);
  });
}
function answerPractice(index) {
  if (!currentPractice || questionAnswered) return;
  questionAnswered = true;
  stats.attempts++;
  if (!stats.topics[currentPractice.topic]) stats.topics[currentPractice.topic] = {correct:0,attempts:0};
  stats.topics[currentPractice.topic].attempts++;
  const isCorrect = index === currentPractice.correct;
  if (isCorrect) {
    stats.correct++;
    stats.topics[currentPractice.topic].correct++;
  }
  saveStats();
  [...document.querySelectorAll("#answers button")].forEach((button, i) => {
    button.disabled = true;
    if (i === currentPractice.correct) button.classList.add("correct");
    else if (i === index) button.classList.add("wrong");
  });
  document.getElementById("feedback").textContent = (isCorrect ? "Correct. Well done! " : "Not quite. The correct answer is " + currentPractice.a[currentPractice.correct] + ". ") + currentPractice.explain;
}
function renderProgress() {
  const percentage = stats.attempts ? Math.round(stats.correct / stats.attempts * 100) : 0;
  document.getElementById("overall").textContent = percentage + "%";
  document.getElementById("progressText").textContent = stats.attempts ? stats.correct + " correct out of " + stats.attempts + " attempts on this device." : "Complete a question to start tracking your progress on this device.";
  const list = document.getElementById("progressList");
  list.replaceChildren();
  topics.forEach(topic => {
    const result = stats.topics[topic.name];
    const row = document.createElement("div");
    const name = document.createElement("span");
    const score = document.createElement("strong");
    name.textContent = topic.name;
    score.textContent = result && result.attempts ? Math.round(result.correct / result.attempts * 100) + "%" : "Not attempted";
    row.append(name, score);
    list.appendChild(row);
  });
}
function resetProgress() {
  if (!window.confirm("Reset all Nathi & Maths practice progress saved on this device?")) return;
  stats = {correct:0,attempts:0,topics:{}};
  saveStats();
  renderProgress();
}
document.querySelectorAll(".bottom-nav button").forEach(button => button.addEventListener("click", () => showScreen(button.dataset.screen)));
document.getElementById("questionForm").addEventListener("submit", askNathi);
document.getElementById("questionImage").addEventListener("change", handleImageSelection);
document.getElementById("nextQuestion").addEventListener("click", newPractice);
document.getElementById("resetProgress").addEventListener("click", resetProgress);
document.getElementById("levelSelect").addEventListener("change", event => {
  const level = event.target.value;
  document.querySelector(".level-select").setAttribute("aria-label", "Selected NC(V) Level " + level);
});
buildTopics();
newPractice();

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) { window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js").catch(err => console.warn("Offline support unavailable:", err))); }
