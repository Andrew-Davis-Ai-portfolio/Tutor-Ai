console.log("📜 Flame Division Certificate — JS loaded");

function getParam(key, fallback = "") {
  const params = new URLSearchParams(window.location.search);
  const value = params.get(key);
  if (!value) return fallback;
  return decodeURIComponent(value);
}

function slugifyId(text) {
  return text
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9\-]/g, "")
    .toUpperCase();
}

document.addEventListener("DOMContentLoaded", () => {
  const nameEl = document.getElementById("cert-name");
  const courseEl = document.getElementById("cert-course");
  const dateEl = document.getElementById("cert-date");
  const idEl = document.getElementById("cert-id");

  // --- Name ---
  const studentName = getParam("name", "Student Name");
  nameEl.textContent = studentName;

  // --- Course ---
  const courseDefault = "Flame Division Academy — Core Systems Builder Program";
  const courseName = getParam("course", courseDefault);
  courseEl.textContent = courseName;

  // --- Date ---
  const today = new Date();
  const isoToday = today.toISOString().slice(0, 10); // YYYY-MM-DD
  const dateValue = getParam("date", isoToday);
  dateEl.textContent = dateValue;

  // --- Certificate ID ---
  const idParam = getParam("id", "");
  if (idParam) {
    idEl.textContent = idParam.toUpperCase();
  } else {
    // generate a simple deterministic ID stub based on name + date
    const base = `${studentName}-${dateValue}`;
    const slug = slugifyId(base);
    idEl.textContent = `FDA-${slug}`;
  }
});
