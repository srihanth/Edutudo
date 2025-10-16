// ---------------- Loader Script ----------------
window.onload = function() {
  setTimeout(function() {
    const loader = document.getElementById("loader");
    const content = document.getElementById("content");

    if (loader) loader.style.display = "none";
    if (content) content.style.display = "block";
  }, 3000); // 3 seconds
};

// ---------------- Section Navigation ----------------
function showSection(section) {
  const sections = ["home", "ecet", "diploma", "aichat", "login"];
  sections.forEach(id => {
    const sec = document.getElementById(id + "-section");
    if (sec) sec.style.display = (id === section) ? "block" : "none";
  });
}

// ---------------- Login Card Flip ----------------
function flipLogin() {
  document.getElementById("login-card").classList.toggle("flipped");
}

// ---------------- AI Chat ----------------
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatbox = document.getElementById("chatbox");
const typingIndicator = document.getElementById("typing-indicator");

chatForm?.addEventListener("submit", e => {
  e.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;

  addMessage("user", message);
  chatInput.value = "";
  typingIndicator.style.display = "block";

  setTimeout(() => {
    typingIndicator.style.display = "none";
    addMessage("bot", "This is a demo AI response for: " + message);
  }, 1000);
});

function addMessage(sender, text) {
  const div = document.createElement("div");
  div.className = `ai-chat-message ${sender}`;
  div.textContent = text;
  chatbox.appendChild(div);
  chatbox.scrollTop = chatbox.scrollHeight;
}
