document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.querySelector(".menu-toggle");
    const nav = document.querySelector("nav");

    toggleButton.addEventListener("click", () => {
        nav.classList.toggle("open");
        toggleButton.textContent = nav.classList.contains("open") ? "✖" : "☰";
    });

    nav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");
            toggleButton.textContent = "☰";
        });
    });
});
