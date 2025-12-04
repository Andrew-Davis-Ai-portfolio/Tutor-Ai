console.log("📜 Flame Division Certificate — JS loaded");

// Helper to read query parameters with a default fallback
function getParam(key, fallback = "") {
  const params = new URLSearchParams(window.location.search);
  const value = params.get(key);
  if (!value) return fallback;
  return decodeURIComponent(value);
}

// Simple ID generator if none is provided
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

  if (!nameEl || !courseEl || !dateEl || !idEl) {
    console.warn("⚠️ Certificate elements not found. Check element IDs.");
    return;
  }

  // --- NAME ---
  const studentName = getParam("name", "Student Name");
  nameEl.textContent = studentName;

  // --- COURSE ---
  const defaultCourse =
    "Flame Division Academy — Core Systems Builder Program";
  const courseName = getParam("course", defaultCourse);
  courseEl.textContent = courseName;

  // --- DATE ---
  const today = new Date();
  const isoToday = today.toISOString().slice(0, 10); // YYYY-MM-DD
  const dateValue = getParam("date", isoToday);
  dateEl.textContent = dateValue;

  // --- CERTIFICATE ID ---
  const idParam = getParam("id", "");
  if (idParam) {
    idEl.textContent = idParam.toUpperCase();
  } else {
    const base = `${studentName}-${dateValue}`;
    const slug = slugifyId(base);
    idEl.textContent = `FDA-${slug}`;
  }
});
