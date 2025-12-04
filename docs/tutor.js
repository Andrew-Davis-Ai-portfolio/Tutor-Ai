// tutor.js
// Flame Division Academy Tutor AI — Lab Console + Certificate Integration

console.log("🧪 Tutor AI Lab Console loaded");

document.addEventListener("DOMContentLoaded", () => {
  // ELEMENT HOOKS
  const lessonSelect = document.getElementById("lesson-select");
  const lessonTitle = document.getElementById("lesson-title");
  const lessonText = document.getElementById("lesson-text");
  const btnPlay = document.getElementById("btn-play");
  const btnStop = document.getElementById("btn-stop");

  const submissionForm = document.getElementById("submission-form");
  const resultBox = document.getElementById("evaluation-result");

  const nameInput = document.getElementById("student-name");
  const repoInput = document.getElementById("repo-url");
  const lessonIdInput = document.getElementById("lesson-id");
  const explanationInput = document.getElementById("explanation");

  const checkStructure = document.getElementById("check-structure");
  const checkWiring = document.getElementById("check-wiring");
  const checkFunction = document.getElementById("check-function");
  const checkResponsibility = document.getElementById("check-responsibility");

  // -----------------------
  // LESSON DATA
  // -----------------------
  const LESSONS = {
    lesson1: {
      title: "Lesson 1 — Create Your Repo",
      text: `
Objective: Create a clean, public GitHub repository for your build.

1. Create a new public repo named after your project.
2. Add a README.md that explains what the system will do.
3. Create the initial file structure (HTML, CSS, JS folders if needed).
4. Commit and push your changes.
5. Only move to Lesson 2 after the repo link loads without errors.
      `.trim()
    },
    lesson2: {
      title: "Lesson 2 — Wire HTML / CSS / JS",
      text: `
Objective: Connect your core files into a working system.

1. Create index.html, style.css, and main.js or app.js.
2. Link CSS and JS inside index.html with correct relative paths.
3. Add at least one interactive feature powered by JS.
4. Confirm there are no 404s in the browser dev tools.
5. Submit only after everything is visually and functionally stable.
      `.trim()
    },
    lesson3: {
      title: "Lesson 3 — Add TTS & Interactions",
      text: `
Objective: Add guided audio or interactive messaging to your system.

1. Choose either the Web Speech API (speechSynthesis) or a TTS service.
2. Wire a button that plays a short guided instruction or welcome message.
3. Ensure audio can be started and stopped by the user.
4. Confirm the page still works with audio muted.
5. Submit only when interaction, structure, and ethics are all aligned.
      `.trim()
    }
  };

  function renderLesson(key) {
    const lesson = LESSONS[key] || LESSONS.lesson1;
    lessonTitle.textContent = lesson.title;
    lessonText.textContent = ""; // clear
    // Preserve line breaks
    lesson.text.split("\n").forEach(line => {
      const p = document.createElement("p");
      p.textContent = line.trim();
      lessonText.appendChild(p);
    });
  }

  // Initialize lesson panel
  if (lessonSelect && lessonTitle && lessonText) {
    renderLesson(lessonSelect.value);
    lessonSelect.addEventListener("change", () => {
      renderLesson(lessonSelect.value);
    });
  }

  // -----------------------
  // SIMPLE TTS USING Web Speech API
  // -----------------------
  let currentUtterance = null;

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
    stopSpeech();

    const text = Array.from(lessonText.querySelectorAll("p"))
      .map(p => p.textContent)
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
  // CERTIFICATE URL BUILDER
  // -----------------------
  function slugifyId(text) {
    return text
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9\-]/g, "")
      .toUpperCase();
  }

  function buildCertificateUrl(studentName, courseTitle) {
    const base = "certificates/index.html";

    const today = new Date();
    const isoDate = today.toISOString().slice(0, 10); // YYYY-MM-DD

    const params = new URLSearchParams();
    params.set("name", studentName);
    params.set("course", courseTitle || "Flame Division Academy — Master Systems Architect Track");
    params.set("date", isoDate);

    // Build a deterministic-ish ID
    const idBase = `${studentName}-${courseTitle}-${isoDate}`;
    params.set("id", "FDA-" + slugifyId(idBase));

    return `${base}?${params.toString()}`;
  }

  // -----------------------
  // SUBMISSION / EVALUATION LOGIC
  // -----------------------
  if (submissionForm && resultBox) {
    submissionForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = nameInput.value.trim();
      const repo = repoInput.value.trim();
      const lessonId = lessonIdInput.value.trim();
      const explanation = explanationInput.value.trim();

      const checks = {
        structure: checkStructure.checked,
        wiring: checkWiring.checked,
        func: checkFunction.checked,
        responsibility: checkResponsibility.checked
      };

      const missingChecks = Object.entries(checks)
        .filter(([, ok]) => !ok)
        .map(([key]) => key);

      // Basic validation
      if (!name || !repo || !lessonId || !explanation) {
        resultBox.innerHTML = `
          <div class="eval-card eval-error">
            <h3>⚠️ Incomplete Submission</h3>
            <p>All required fields must be filled before Tutor AI can evaluate.</p>
          </div>
        `;
        return;
      }

      if (missingChecks.length > 0) {
        resultBox.innerHTML = `
          <div class="eval-card eval-warning">
            <h3>⏸ Self-Check Not Complete</h3>
            <p>Before requesting evaluation, you must confirm all four:</p>
            <ul>
              <li>Structure</li>
              <li>Wiring</li>
              <li>Function</li>
              <li>Responsibility</li>
            </ul>
            <p>Review your system, fix issues, and check all boxes.</p>
          </div>
        `;
        return;
      }

      // If we get here, everything is good → "pass" + cert URL
const courseTitle =
  lessonId || (LESSONS[lessonSelect?.value]?.title || "Flame Division Academy Track");

// Build certificate URL parameters
const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
const params = new URLSearchParams();
params.set("name", name);
params.set("course", courseTitle);
params.set("date", today);

const idBase = `${name}-${courseTitle}-${today}`;
params.set("id", "FDA-" + slugifyId(idBase));

/**
 * 🔥 IMPORTANT:
 * This is the ONLY place we define the certificate URL now.
 * Point it to the exact working location of your cert page.
 *
 * If your cert lives at:
 *   https://andrew-davis-ai-portfolio.github.io/Tutor-Ai/certificates/index.html
 * then use the line below as-is.
 */
const certUrl =
  "https://andrew-davis-ai-portfolio.github.io/Tutor-Ai/certificates/index.html?" +
  params.toString();

resultBox.innerHTML = `
  <div class="eval-card eval-success">
    <h3>✅ Evaluation Request Accepted</h3>
    <p>
      Tutor AI has received your submission for:
      <strong>${courseTitle}</strong>.
    </p>
    <p>
      Keep this link as your provisional certificate preview.
      Final verification still depends on manual or AI review of your system.
    </p>

    <div class="eval-actions">
      <a class="fd-btn fd-btn-primary" href="${certUrl}" target="_blank" rel="noopener">
        🎖 View Your Certificate
      </a>
      <button type="button" class="fd-btn fd-btn-secondary" id="btn-copy-cert-link">
        🔗 Copy Certificate Link
      </button>
    </div>

    <p class="eval-note">
      <strong>Note:</strong> If any part of your submission is found invalid,
      your certificate may be revoked. Flame Division certifies systems — not intentions.
    </p>
  </div>
`;

// Wire copy button
var copyBtn = document.getElementById("btn-copy-cert-link");
if (copyBtn && navigator.clipboard) {
  copyBtn.addEventListener("click", function () {
    navigator.clipboard.writeText(certUrl)
      .then(function () {
        copyBtn.textContent = "✅ Link Copied";
        setTimeout(function () {
          copyBtn.textContent = "🔗 Copy Certificate Link";
        }, 2000);
      })
      .catch(function () {
        alert("Could not copy link. Open the certificate and copy the URL from the browser.");
      });
  });
}
