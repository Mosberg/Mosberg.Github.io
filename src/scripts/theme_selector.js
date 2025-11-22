// Theme selector
(() => {
  const select = document.getElementById("themeSelectEl");
  const defaultTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("homepageTheme", theme);
    select.value = theme;
  }
  const saved = localStorage.getItem("homepageTheme") || defaultTheme;
  applyTheme(saved);
  select.addEventListener("change", () => applyTheme(select.value));
})();
