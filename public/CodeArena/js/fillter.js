// Add this function to your JS code
function filterRooms(filterValue) {
  const tableRows = document.querySelectorAll('#board-list tbody tr');

  tableRows.forEach((row) => {
    const langColumn = row.querySelector('.item');
    if (filterValue === 'all' || langColumn.textContent === filterValue) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

// Add this code to your JS file to attach click handlers
const filterButtons = document.querySelectorAll('.filter-button');
filterButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    const filterValue = button.dataset.filter;
    filterRooms(filterValue);

    // Change button color
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
  });
});
