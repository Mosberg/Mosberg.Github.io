// Dynamic visit counter
(() => {
  const counterKey = "visitCount";
  const lastVisitKey = "lastVisit";
  let visits = parseInt(localStorage.getItem(counterKey), 10) || 0;
  let lastVisit = localStorage.getItem(lastVisitKey);
  visits++;
  localStorage.setItem(counterKey, visits);
  const now = new Date();
  localStorage.setItem(lastVisitKey, now.toISOString());
  let lastVisitText = lastVisit
    ? new Date(lastVisit).toLocaleString([], {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "This is your first visit 🎉";
  document.getElementById(
    "visitCounter"
  ).textContent = `👋 You’ve visited ${visits} time${
    visits !== 1 ? "s" : ""
  }. Last visit: ${lastVisitText}`;
})();
