console.log("📜 Flame Division Certificate — JS loaded");

// Safe param reader (NO decoding)
function getParam(key, fallback = "") {
  const params = new URLSearchParams(window.location.search);
  const value = params.get(key);
  return value || fallback;
}

// ID generator
function slugifyId(text) {
  return text
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9\-]/g, "")
    .toUpperCase();
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("🔥 DOM Loaded — Running Autofill");

  const nameEl = document.getElementById("cert-name");
  const courseEl = document.getElementById("cert-course");
  const dateEl = document.getElementById("cert-date");
  const idEl = document.getElementById("cert-id");

  if (!nameEl || !courseEl || !dateEl || !idEl) {
    console.warn("⚠️ Missing certificate elements");
    return;
  }

  // NAME
  const studentName = getParam("name", "Student Name");
  nameEl.textContent = studentName;

  // COURSE
  const defaultCourse =
    "Flame Division Academy — Master Systems Architect Track";
  const courseName = getParam("course", defaultCourse);
  courseEl.textContent = courseName;

  // DATE
  const today = new Date();
  const isoToday = today.toISOString().slice(0, 10);
  const dateValue = getParam("date", isoToday);
  dateEl.textContent = dateValue;

  // CERTIFICATE ID
  const idParam = getParam("id", "");
  idEl.textContent = idParam
    ? idParam.toUpperCase()
    : "FDA-" + slugifyId(`${studentName}-${dateValue}`);
});
