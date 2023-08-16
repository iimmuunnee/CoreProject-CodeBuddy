function filterRooms(chatFilter, langFilter) {
  const tableRows = document.querySelectorAll("#board-list tbody tr");

  tableRows.forEach((row) => {
    const chatTypeColumn = row.querySelector("td:nth-child(2)"); 
    const langColumn = row.querySelector("td:nth-child(3)"); 

    if (
      (langFilter === "all" || langColumn.textContent === langFilter) &&
      (chatFilter === "전체" || chatTypeColumn.textContent === chatFilter)
    ) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}


const chatFilterButtons = document.querySelectorAll(".filter");
const langFilterButtons = document.querySelectorAll(".filter-button");

chatFilterButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    button.classList.toggle("active");
    filter();
  });
});

langFilterButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    button.classList.toggle("active");
    filter();
  });
});

function filter() {
  const activeChatFilter = document.querySelector(".filter.active");
  const activeLangFilter = document.querySelector(".filter-button.active");

  const chatFilterValue = activeChatFilter ? activeChatFilter.textContent.trim() : "전체";
  const langFilterValue = activeLangFilter ? activeLangFilter.dataset.filter : "all";

  filterRooms(chatFilterValue, langFilterValue);
}