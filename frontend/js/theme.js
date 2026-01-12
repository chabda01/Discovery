const toggle = document.getElementById("themeToggle");
const html = document.documentElement;

toggle.addEventListener("click", () => {
  html.classList.toggle("dark");

  localStorage.setItem(
    "theme",
    html.classList.contains("dark") ? "dark" : "light"
  );
});

if (localStorage.getItem("theme") === "dark") {
  html.classList.add("dark");
}
