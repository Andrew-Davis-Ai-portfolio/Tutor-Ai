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
      const courseTitle = lessonId || LESSONS[lessonSelect?.value]?.title || "Flame Division Academy Track";
      const certUrl = buildCertificateUrl(name, courseTitle);

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
            <button type="button" class="fd-btn fd-btn-secondary" id="btn-copy-cert">
              🔗 Copy Certificate Link
            </button>
          </div>

          <p class="eval-note">
            <strong>Note:</strong> If any part of your submission is found invalid,
            your certificate may be revoked. Flame Division certifies systems — not intentions.
          </p>
        </div>
      `;

      // Wire up the copy button after injecting HTML
      const copyBtn = document.getElementById("btn-copy-cert");
      if (copyBtn && navigator.clipboard) {
        copyBtn.addEventListener("click", () => {
          navigator.clipboard.writeText(window.location.origin + window.location.pathname.replace(/\/index\.html?$/, "/") + certUrl)
            .then(() => {
              copyBtn.textContent = "✅ Link Copied";
              setTimeout(() => {
                copyBtn.textContent = "🔗 Copy Certificate Link";
              }, 2000);
            })
            .catch(() => {
              alert("Could not copy link. You can open the certificate and copy the URL from the browser.");
            });
        });
      }
    });
  }
});console.log("🔥 Tutor AI Lab Console — tutor.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const lessonSelect = document.getElementById("lesson-select");
  const lessonTitle = document.getElementById("lesson-title");
  const lessonTextEl = document.getElementById("lesson-text");
  const btnPlay = document.getElementById("btn-play");
  const btnStop = document.getElementById("btn-stop");
  const form = document.getElementById("submission-form");
  const resultEl = document.getElementById("evaluation-result");

  // ---- LESSON DATA (EDIT THIS) ----
  // TODO: customize copy for your academy.
  const lessons = {
    lesson1: {
      title: "Lesson 1 — Create Your Repo",
      text: `
<p>Objective: Create a clean, public GitHub repository for your build.</p>
<ol>
  <li>Create a new public repo named after your project.</li>
  <li>Add a <code>README.md</code> that explains what the system will do.</li>
  <li>Create the initial file structure (HTML, CSS, JS folders if needed).</li>
  <li>Commit and push your changes.</li>
  <li>Only move to Lesson 2 after the repo link loads without errors.</li>
</ol>
`
    },
    lesson2: {
      title: "Lesson 2 — Wire HTML, CSS, and JS",
      text: `
<p>Objective: Prove that your page structure and wiring are correct.</p>
<ol>
  <li>Create <code>index.html</code> and link your <code>style.css</code> and <code>main.js</code> (or similar).</li>
  <li>Open DevTools and confirm there are <strong>no 404 errors</strong> for linked files.</li>
  <li>Add at least one interactive element (button, link, etc.).</li>
  <li>Verify that clicking it triggers a visible change or console log.</li>
  <li>Only move to Lesson 3 once the interaction works end-to-end.</li>
</ol>
`
    },
    lesson3: {
      title: "Lesson 3 — Add TTS & Interactions",
      text: `
<p>Objective: Add responsible text-to-speech or other feedback to your system.</p>
<ol>
  <li>Use the Web Speech API or another TTS service to read instructions aloud.</li>
  <li>Bind TTS to a clear, labeled button (no auto-play without user action).</li>
  <li>Make sure the spoken text matches what is on screen.</li>
  <li>Test in at least one modern browser (Chrome / Edge / Safari).</li>
  <li>Confirm there are no unsafe or misleading claims in the spoken script.</li>
</ol>
`
    }
  };

  // Render initial lesson
  function renderLesson(id) {
    const lesson = lessons[id];
    if (!lesson) return;
    lessonTitle.textContent = lesson.title;
    lessonTextEl.innerHTML = lesson.text.trim();
  }

  renderLesson(lessonSelect.value);

  lessonSelect.addEventListener("change", () => {
    cancelSpeech();
    renderLesson(lessonSelect.value);
  });

  // ---- TTS HELPERS ----
  function speak(text) {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-Speech is not supported in this browser.");
      return;
    }
    cancelSpeech();

    const utterance = new SpeechSynthesisUtterance(text);
    // TODO: adjust voice, rate, and pitch for your vibe.
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    window.speechSynthesis.speak(utterance);
  }

  function cancelSpeech() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  btnPlay.addEventListener("click", () => {
    const activeLesson = lessons[lessonSelect.value];
    if (!activeLesson) return;

    // Strip HTML tags for TTS
    const tmpDiv = document.createElement("div");
    tmpDiv.innerHTML = activeLesson.text;
    const text = tmpDiv.textContent || tmpDiv.innerText || "";
    speak(`${activeLesson.title}. ${text}`);
  });

  btnStop.addEventListener("click", () => {
    cancelSpeech();
  });

  // ---- SUBMISSION FORM LOGIC ----
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    cancelSpeech();

    const name = document.getElementById("student-name").value.trim();
    const repoUrl = document.getElementById("repo-url").value.trim();
    const lessonId = document.getElementById("lesson-id").value.trim();
    const explanation = document.getElementById("explanation").value.trim();
    const checkStructure = document.getElementById("check-structure").checked;
    const checkWiring = document.getElementById("check-wiring").checked;
    const checkFunction = document.getElementById("check-function").checked;
    const checkResponsibility = document.getElementById(
      "check-responsibility"
    ).checked;

    const issues = [];

    if (!name) issues.push("Student name is missing.");
    if (!repoUrl) issues.push("Repo or live URL is required.");
    if (!lessonId) issues.push("Lesson / module name is required.");
    if (!explanation) issues.push("Explanation (≤ 5 sentences) is required.");

    if (!checkStructure)
      issues.push("You must confirm your structure is clear.");
    if (!checkWiring) issues.push("You must confirm HTML, CSS, and JS are wired.");
    if (!checkFunction)
      issues.push("You must confirm the core feature runs without errors.");
    if (!checkResponsibility)
      issues.push("You must confirm the system is ethical and safe.");

    // Render result locally — real certification still happens by you / GPT
    if (issues.length > 0) {
      resultEl.style.borderColor = "rgba(248, 113, 113, 0.9)";
      resultEl.style.background =
        "linear-gradient(120deg, rgba(127,29,29,0.6), rgba(15,23,42,0.9))";
      resultEl.style.color = "#fecaca";

      resultEl.innerHTML = `
        <strong>❌ NOT CERTIFIED — FIX REQUIRED</strong>
        <br/><br/>
        Issues detected:
        <ul>${issues.map((i) => `<li>${i}</li>`).join("")}</ul>
        <p>Correct these items before submitting to Tutor AI for evaluation.</p>
      `;
    } else {
      resultEl.style.borderColor = "rgba(74, 222, 128, 0.9)";
      resultEl.style.background =
        "linear-gradient(120deg, rgba(22,101,52,0.6), rgba(15,23,42,0.9))";
      resultEl.style.color = "#bbf7d0";

      resultEl.innerHTML = `
        <strong>Submission Ready for Tutor AI Review</strong>
        <p>
          This does <em>not</em> mean you are certified yet. It means your self-check passed.
          Send the following package to Flame Division Academy Tutor AI:
        </p>
        <ul>
          <li><strong>Student:</strong> ${name}</li>
          <li><strong>Lesson:</strong> ${lessonId}</li>
          <li><strong>Repo / URL:</strong> <a href="${repoUrl}" target="_blank" rel="noopener">${repoUrl}</a></li>
        </ul>
        <p><strong>Explanation:</strong> ${explanation}</p>
        <p>Next: paste this link and explanation into your evaluation request.</p>
      `;
    }
  });
});

// --- Flame Division Tutor AI → Certificate integration patch ---
(function () {
  function slugifyId(text) {
    return text
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9\-]/g, "")
      .toUpperCase();
  }

  window.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("submission-form");
    var resultBox = document.getElementById("evaluation-result");

    if (!form || !resultBox) return;

    var nameInput = document.getElementById("student-name");
    var lessonIdInput = document.getElementById("lesson-id");
    var repoInput = document.getElementById("repo-url");
    var explanationInput = document.getElementById("explanation");

    var checkStructure = document.getElementById("check-structure");
    var checkWiring = document.getElementById("check-wiring");
    var checkFunction = document.getElementById("check-function");
    var checkResponsibility = document.getElementById("check-responsibility");

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Basic required-field check
      var name = (nameInput.value || "").trim();
      var repo = (repoInput.value || "").trim();
      var lesson = (lessonIdInput.value || "").trim();
      var expl = (explanationInput.value || "").trim();

      if (!name || !repo || !lesson || !expl) {
        resultBox.innerHTML = `
          <div style="padding:1rem; border-radius:8px; background:#2b1515; color:#ffd7d7;">
            <strong>⚠️ Incomplete submission.</strong>
            <p>All fields in the Submission Console must be filled before Tutor AI can evaluate.</p>
          </div>
        `;
        return;
      }

      // Self-check boxes
      if (
        !checkStructure.checked ||
        !checkWiring.checked ||
        !checkFunction.checked ||
        !checkResponsibility.checked
      ) {
        resultBox.innerHTML = `
          <div style="padding:1rem; border-radius:8px; background:#2b1f10; color:#ffe2b8;">
            <strong>⏸ Self-Check not complete.</strong>
            <p>All four checkboxes (Structure, Wiring, Function, Responsibility) must be true before requesting evaluation.</p>
          </div>
        `;
        return;
      }

      // If we reach here → evaluation accepted, build certificate URL
      var today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      var courseTitle = lesson || "Flame Division Academy — Verified Track";

      var params = new URLSearchParams();
      params.set("name", name);
      params.set("course", courseTitle);
      params.set("date", today);

      var baseId = name + "-" + courseTitle + "-" + today;
      params.set("id", "FDA-" + slugifyId(baseId));

      var certPath = "certificates/index.html?" + params.toString();
      var certUrl = certPath; // relative (works inside this site)

      resultBox.innerHTML = `
        <div style="padding:1rem; border-radius:12px; background:#0f1b26; color:#f7f7ff; border:1px solid rgba(245,181,68,0.4);">
          <h3 style="margin:0 0 .5rem 0;">✅ Evaluation Request Accepted</h3>
          <p style="margin:0 0 .5rem 0;">
            Submission received for <strong>${courseTitle}</strong>.
          </p>
          <p style="margin:0 0 1rem 0;">
            You may now view your provisional Flame Division Academy certificate. Final status depends on manual or AI review of your system.
          </p>
          <div style="display:flex; flex-wrap:wrap; gap:.5rem; align-items:center;">
            <a href="${certUrl}" target="_blank" rel="noopener"
               class="fd-btn fd-btn-primary">
              🎖 View Your Certificate
            </a>
            <button type="button" id="btn-copy-cert-link"
                    class="fd-btn fd-btn-secondary">
              🔗 Copy Certificate Link
            </button>
          </div>
          <p style="margin-top:.75rem; font-size:.8rem; opacity:.8;">
            Note: If your repo or behavior fails review, this certificate can be revoked. Flame Division certifies <em>systems</em>, not intentions.
          </p>
        </div>
      `;

      // Wire copy button
      var copyBtn = document.getElementById("btn-copy-cert-link");
      if (copyBtn && navigator.clipboard) {
        copyBtn.addEventListener("click", function () {
          var fullUrl = window.location.origin +
            window.location.pathname.replace(/\/index\.html?$/, "/") +
            certPath;

          navigator.clipboard.writeText(fullUrl)
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
    });
  });
})();
