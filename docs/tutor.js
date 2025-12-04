console.log("🔥 Tutor AI Lab Console — tutor.js loaded");

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
