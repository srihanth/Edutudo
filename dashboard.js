// Example small feature: alert when Explore Now button is clicked
document.addEventListener("DOMContentLoaded", () => {
  const exploreBtn = document.querySelector(".btn-white");
  if (exploreBtn) {
    exploreBtn.addEventListener("click", () => {
      alert("Exploring Edutudo");
    });
  }
});
