let restaurant = JSON.parse(sessionStorage.getItem("restaurant"));
let activeTableId = parseInt(sessionStorage.getItem("activeTableId"));
let activeTable = restaurant.TableState.filter((table) =>
  table.Id === activeTableId ? true : false
)[0];

//table setup
let tableBody = document.getElementsByTagName("tbody")[0];

restaurant.Menu.ReadyMeals.forEach((dish) => {
  let newRow = `
  <td>${dish.Name}</td>
  <td>${dish.Ingredients}</td>
  <td>${dish.Description}</td>
  <td>${dish.Price}</td>
  <td>
    <input
      oninput="value=value.slice(0,2)"
      type="number"
      min="0"
      max="99"
      maxlength="2"
      style="text-align: center;"
    />
  </td>`;

  tableBody.innerHTML += newRow;
});

//close btn action
function closeCardBtn(btnClose) {
  btnClose.parentElement.parentElement.parentElement.parentElement.remove();
}

//add custom dish btn action
function addNewCustomDishCard() {
  let cardContainer = document.getElementById("card-container");

  let newCustomDishCard = document.createElement("div");
  newCustomDishCard.classList.add("col");
  newCustomDishCard.classList.add("l6");
  newCustomDishCard.classList.add("m12");
  newCustomDishCard.classList.add("s12");
  newCustomDishCard.innerHTML = `
  <div class="card">
              <div class="card-content">
                <div class="row">
                  <a
                    class="waves-effect waves-light btn red close-btn"
                    onclick="closeCardBtn(this)"
                    ><i class="material-icons centered">close</i></a
                  >
                </div>
                <div class="row">
                  <form class="col s12">
                    <div class="row">
                      <div class="input-field col s12">
                        <input class="naziv-jela" type="text" />
                        <label for="naziv-jela">Naziv</label>
                      </div>

                      <div class="input-field col s12">
                        <input class="opis-jela" type="text" />
                        <label for="opis-jela">Opis</label>
                      </div>

                      <div class="input-field col s12">
                        <input
                          class="cijena"
                          type="number"
                          oninput="value=value.slice(0,maxLength)"
                          type="number"
                          min="0"
                          max="99"
                          maxlength="5"
                        />
                        <label for="cijena">Cijena</label>
                      </div>

                      <div class="input-field col s12">
                        <input class="first-ing" type="text" />
                        <label for="first-ing">1. sastojak</label>
                      </div>
                      <div class="input-field col s12">
                        <input class="second-ing" type="text" />
                        <label for="second-ing">2. sastojak</label>
                      </div>
                      <div class="input-field col s12">
                        <input class="third-ing" type="text" />
                        <label for="third-ing">3. sastojak</label>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
  `;

  cardContainer.appendChild(newCustomDishCard);
}

//submit btn action
let submitBtn = document.getElementById("submit-btn");
submitBtn.addEventListener("click", () => {
  //ready meals
  for (let i = 0; i < restaurant.Menu.ReadyMeals.length; i++) {
    let amountOrdered = parseInt(
      document.getElementsByTagName("input")[i].value
    );
    let orderedDish = restaurant.Menu.ReadyMeals[i];

    if (isNaN(amountOrdered) === false) {
      for (let j = 0; j < amountOrdered; j++) {
        activeTable.OrderedDishes.ReadyMeals.push(orderedDish);
      }
    }
  }

  //custom meals
  let allCustomNames = document.querySelectorAll(".naziv-jela");
  let allCustomDescriptions = document.querySelectorAll(".opis-jela");
  let allCustomPrices = document.querySelectorAll(".cijena");
  let allCustomFirstIng = document.querySelectorAll(".first-ing");
  let allCustomSecondIng = document.querySelectorAll(".second-ing");
  let allCustomThirdIng = document.querySelectorAll(".third-ing");

  for (let i = 0; i < allCustomNames.length; i++) {
    if (
      allCustomNames[i].value !== "" &&
      isNaN(parseInt(allCustomPrices[i].value)) === false
    ) {
      let newCustomDish = new CustomDish(
        allCustomNames[i].value,
        allCustomDescriptions[i].value,
        parseInt(allCustomPrices[i].value),
        allCustomFirstIng[i].value,
        allCustomSecondIng[i].value,
        allCustomThirdIng[i].value
      );

      restaurant.Menu.CustomMeals.push(newCustomDish);
      activeTable.OrderedDishes.CustomMeals.push(newCustomDish);
    }
  }
  activeTable.OrderedDishes.ReadyMeals.forEach(
    (dish) => (this.Check += dish.Price)
  );
  activeTable.OrderedDishes.CustomMeals.forEach(
    (dish) => (this.Check += dish.Cost)
  );
  restaurant.AllTables.push(activeTable);

  sessionStorage.setItem(
    "restaurant-allTables",
    JSON.stringify(restaurant.AllTables)
  );
  sessionStorage.setItem(
    "restaurant-tableState",
    JSON.stringify(restaurant.TableState)
  );
  sessionStorage.setItem("restaurant-menu", JSON.stringify(restaurant.Menu));

  location.href = "../pages/index.html";
});
