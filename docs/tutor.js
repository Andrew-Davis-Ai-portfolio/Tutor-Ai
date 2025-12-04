// tutor.js
// Flame Division Academy Tutor AI — Lab Console + Certificate Redirect

console.log("🧪 Tutor AI Lab Console loaded");

document.addEventListener("DOMContentLoaded", function () {
  // -----------------------
  // LESSON PANEL
  // -----------------------
  var lessonSelect = document.getElementById("lesson-select");
  var lessonTitle = document.getElementById("lesson-title");
  var lessonText = document.getElementById("lesson-text");
  var btnPlay = document.getElementById("btn-play");
  var btnStop = document.getElementById("btn-stop");

  var LESSONS = {
    lesson1: {
      title: "Lesson 1 — Create Your Repo",
      text: [
        "Objective: Create a clean, public GitHub repository for your build.",
        "1. Create a new public repo named after your project.",
        "2. Add a README.md that explains what the system will do.",
        "3. Create the initial file structure (HTML, CSS, JS folders if needed).",
        "4. Commit and push your changes.",
        "5. Only move to Lesson 2 after the repo link loads without errors."
      ]
    },
    lesson2: {
      title: "Lesson 2 — Wire HTML / CSS / JS",
      text: [
        "Objective: Connect your core files into a working system.",
        "1. Create index.html, style.css, and main.js or app.js.",
        "2. Link CSS and JS inside index.html with correct relative paths.",
        "3. Add at least one interactive feature powered by JS.",
        "4. Confirm there are no 404s in the browser dev tools.",
        "5. Submit only after everything is visually and functionally stable."
      ]
    },
    lesson3: {
      title: "Lesson 3 — Add TTS & Interactions",
      text: [
        "Objective: Add guided audio or interactive messaging to your system.",
        "1. Choose either the Web Speech API (speechSynthesis) or a TTS service.",
        "2. Wire a button that plays a short guided instruction or welcome message.",
        "3. Ensure audio can be started and stopped by the user.",
        "4. Confirm the page still works with audio muted.",
        "5. Submit only when interaction, structure, and ethics are all aligned."
      ]
    }
  };

  function renderLesson(key) {
    var lesson = LESSONS[key] || LESSONS.lesson1;
    if (!lessonTitle || !lessonText) return;

    lessonTitle.textContent = lesson.title;
    lessonText.innerHTML = "";
    lesson.text.forEach(function (line) {
      var p = document.createElement("p");
      p.textContent = line;
      lessonText.appendChild(p);
    });
  }

  if (lessonSelect) {
    renderLesson(lessonSelect.value);
    lessonSelect.addEventListener("change", function () {
      renderLesson(lessonSelect.value);
    });
  }

  // -----------------------
  // SIMPLE TTS
  // -----------------------
  var currentUtterance = null;

  function stopSpeech() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    currentUtterance = null;
  }

  function playLesson() {
    if (!window.speechSynthesis) {
      alert("Speech synthesis is not supported in this browser.");
      return;
    }
    if (!lessonText) return;

    stopSpeech();

    var text = Array.prototype
      .slice.call(lessonText.querySelectorAll("p"))
      .map(function (p) { return p.textContent; })
      .join(" ");

    if (!text.trim()) return;

    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.rate = 1;
    currentUtterance.pitch = 1;
    currentUtterance.lang = "en-US";
    window.speechSynthesis.speak(currentUtterance);
  }

  if (btnPlay) {
    btnPlay.addEventListener("click", playLesson);
  }
  if (btnStop) {
    btnStop.addEventListener("click", stopSpeech);
  }

  // -----------------------
  // CERTIFICATE REDIRECT
  // -----------------------
  function slugifyId(text) {
    return text
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9\-]/g, "")
      .toUpperCase();
  }

  function buildCertificateUrl(studentName, courseTitle) {
    var today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    var params = new URLSearchParams();
    params.set("name", studentName);
    params.set("course", courseTitle);
    params.set("date", today);

    var idBase = studentName + "-" + courseTitle + "-" + today;
    params.set("id", "FDA-" + slugifyId(idBase));

    // 🔥 ABSOLUTE URL TO YOUR WORKING CERT PAGE
    return "https://andrew-davis-ai-portfolio.github.io/Tutor-Ai/certificates/index.html?" +
      params.toString();
  }

  // -----------------------
  // SUBMISSION CONSOLE
  // -----------------------
  var form = document.getElementById("submission-form");
  var resultBox = document.getElementById("evaluation-result");

  if (form) {
    var nameInput = document.getElementById("student-name");
    var repoInput = document.getElementById("repo-url");
    var lessonInput = document.getElementById("lesson-id");
    var explanationInput = document.getElementById("explanation");

    var checkStructure = document.getElementById("check-structure");
    var checkWiring = document.getElementById("check-wiring");
    var checkFunction = document.getElementById("check-function");
    var checkResponsibility = document.getElementById("check-responsibility");

    form.addEventListener("submit", function (e) {
      e.preventDefault(); // stop default page reload

      var name = (nameInput.value || "").trim();
      var repo = (repoInput.value || "").trim();
      var lesson = (lessonInput.value || "").trim();
      var expl = (explanationInput.value || "").trim();

      // Basic required checks
      if (!name || !repo || !lesson || !expl) {
        if (resultBox) {
          resultBox.innerHTML = `
            <div style="padding:1rem; border-radius:8px; background:#2b1515; color:#ffd7d7;">
              <strong>⚠️ Incomplete submission.</strong>
              <p>All fields must be filled before Tutor AI can evaluate.</p>
            </div>
          `;
        }
        return;
      }

      if (
        !checkStructure.checked ||
        !checkWiring.checked ||
        !checkFunction.checked ||
        !checkResponsibility.checked
      ) {
        if (resultBox) {
          resultBox.innerHTML = `
            <div style="padding:1rem; border-radius:8px; background:#2b1f10; color:#ffe2b8;">
              <strong>⏸ Self-Check not complete.</strong>
              <p>All four checkboxes (Structure, Wiring, Function, Responsibility) must be true before requesting evaluation.</p>
            </div>
          `;
        }
        return;
      }

      // ✅ Passed checks – build cert URL and redirect
      var courseTitle = lesson || "Flame Division Academy — Verified Track";
      var certUrl = buildCertificateUrl(name, courseTitle);

      if (resultBox) {
        resultBox.innerHTML = `
          <div style="padding:1rem; border-radius:12px; background:#0f1b26; color:#f7f7ff; border:1px solid rgba(245,181,68,0.4);">
            <h3 style="margin:0 0 .5rem 0;">✅ Evaluation Request Accepted</h3>
            <p style="margin:0 0 .5rem 0;">
              Redirecting you to your provisional certificate for
              <strong>${courseTitle}</strong>…
            </p>
          </div>
        `;
      }

      // Small delay so they see the message, then jump
      setTimeout(function () {
        window.location.href = certUrl;
      }, 600);
    });
  }
});
