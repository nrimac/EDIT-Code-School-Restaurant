function reserveTable(tableId) {
  let table = restaurant.TableState.filter((tab) =>
    tab.Id === tableId ? true : false
  )[0];

  if (table.Active === true) {
    alert("Stol je zauzet!");
    return;
  }

  restaurant.orderTable(table);
}

function makeTableUnavailable(table) {
  table.Active = true;
  let tableCard = document.getElementById(`${table.Id}`);

  tableCard.classList.remove("available");
  tableCard.classList.add("unavailable");
}

function makeTableAvailable(tableId) {
  restaurant.TableState.forEach((table) => {
    if (tableId == table.id) {
      table.Active = false;
      table.NumberOfPeople = 0;
      table.Check = 0;
      table.OrderedDishes.ReadyMeals = [];
      table.OrderedDishes.CustomMeals = [];
    }
  });

  let tableCard = document.getElementById(`${tableId}`);

  tableCard.classList.remove("unavailable");
  tableCard.classList.add("available");

  initialize();
}
