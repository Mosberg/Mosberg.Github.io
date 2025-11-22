// Dynamic year
(() => {
  const startYear = 2025;
  const currentYear = new Date().getFullYear();
  document.getElementById("year").textContent =
    startYear === currentYear ? currentYear : `${startYear}–${currentYear}`;
})();
