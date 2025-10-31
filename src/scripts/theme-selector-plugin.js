document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("themeSelectEl");
  const desc = document.getElementById("themeDescriptionEl");
  const resetBtn = document.getElementById("resetThemeEl");
  const defaultTheme = "dark";

  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("homepageTheme", theme);
    const selected = select.querySelector(`option[value="${theme}"]`);
    desc.textContent = selected?.dataset.desc || "";
    select.value = theme;
  };

  const savedTheme = localStorage.getItem("homepageTheme") || defaultTheme;
  applyTheme(savedTheme);

  select.addEventListener("change", (e) => applyTheme(e.target.value));
  resetBtn.addEventListener("click", () => {
    localStorage.removeItem("homepageTheme");
    applyTheme(defaultTheme);
  });

  select.addEventListener("input", () => {
    const selected = select.options[select.selectedIndex];
    desc.textContent = selected?.dataset.desc || "";
  });
});
