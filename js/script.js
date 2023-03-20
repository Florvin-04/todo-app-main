const switchThemeBtn = document.querySelector("[toggle-btn]");
const body = document.querySelector("body");
const header = document.querySelector(".header");

switchThemeBtn.addEventListener("click", () => {
  body.classList.toggle("dark-theme");
  switchThemeBtn.classList.toggle("dark-theme");
  header.classList.toggle("dark-theme");
});
