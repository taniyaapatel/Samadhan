// Just a little animation effect
document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("click", () => {
    alert(`You clicked on ${card.innerText}`);
  });
});
