M.AutoInit();

const parallax = document.getElementById("parallax");

window.addEventListener("scroll", function () {
  let offset = window.pageYOffset;
  parallax.style.backgroundPositionY = offset * 0.7 + "px";
});

const restaurant = {
  numberOfTablesAtRestaurant: 10,
  AllTables: [],
  TableState: [
    new Table(1, 1),
    new Table(2, 2),
    new Table(3, 2),
    new Table(4, 2),
    new Table(5, 3),
    new Table(6, 3),
    new Table(7, 4),
    new Table(8, 4),
    new Table(9, 4),
    new Table(10, 4),
  ],
  Menu: {
    ReadyMeals: [
      new Dish(
        1,
        "Burek",
        ["sir", "lisnato", "maslac", "mljeveno meso", "crveni luk"],
        "Sir i meso u lisnatom tijestu, puno ukusnije nego sto zvuci",
        10
      ),
      new Dish(
        2,
        "Riblja juha",
        ["bakalar", "voda", "sol", "papar"],
        "Juha od bakalara",
        25
      ),
      new Dish(
        3,
        "Lazanje",
        ["tjestenina", "pomidora", "blitva", "mlijeko"],
        "Talijansko jelo, sastojci naslagani jedni na druge, odvojeni tjesteninom",
        70
      ),
      new Dish(
        4,
        "Carbonara",
        ["tjestenina", "vrhnje", "panceta", "sir"],
        "Daj svi znaju sta je karbonara, jel stvarno treba opis???",
        60
      ),
      new Dish(
        5,
        "Tortellini",
        ["tortellini", "vrhnje", "brasno", "panceta", "guacamole"],
        "Talijanska pasta, ali u gromadama; nije isto kao spageti",
        50
      ),
      new Dish(
        6,
        "Biftek u tartufati",
        ["biftek", "tartufata"],
        "Biftek u tartufati",
        75
      ),
    ],
    CustomMeals: [],
    addCustomDish(customDish) {
      this.Menu.CustomMeals.push(customDish);
    },
  },

  orderTable(table) {
    //narucivanje stola
    table.orderFood = function (numberOfPeople) {
      //ispis menija i spremanje narudzbi
      this.NumberOfPeople = numberOfPeople;
      sessionStorage.setItem("restaurant", JSON.stringify(restaurant));
      sessionStorage.setItem("activeTableId", this.Id);

      location.href = "../pages/order.html";
    };

    if (table.MaxNumberOfPeople === 1) {
      makeTableUnavailable(table);
      table.orderFood(1);
    } else {
      while (true) {
        let brojLjudi = parseInt(
          prompt(
            `Unesite broj ljudi koji rezerviraju stol (max:${table.MaxNumberOfPeople})`
          )
        );

        if (brojLjudi <= table.MaxNumberOfPeople && brojLjudi > 0) {
          makeTableUnavailable(table);
          table.orderFood(brojLjudi);
          break;
        } else {
          alert("Nije unesen vazeci broj ljudi!");
        }
      }
    }
  },

  numberOfTablesInADay() {
    //suma svih rezervacija
    let brojRezervacija = this.AllTables.length;
    alert(`Broj danasnjih rezervacija je ${brojRezervacija}`);
  },

  averagePrice() {
    //prosjecna cijena narucenih i gotovih narucenih jela
    let brojJela = 0;

    this.AllTables.forEach(
      (table) =>
        (brojJela +=
          table.OrderedDishes.ReadyMeals.length +
          table.OrderedDishes.CustomMeals.length)
    );

    if (brojJela === 0) {
      return;
    }
    let prosjecnaCijena = this.profitOfTheDay() / brojJela;

    alert(`Prosjecna cijena svih jela je ${prosjecnaCijena} HRK`);
  },

  profitOfTheDay() {
    let profit = 0;

    this.AllTables.forEach((table) => {
      table.OrderedDishes.ReadyMeals.forEach((meal) => (profit += meal.Price));
      table.OrderedDishes.CustomMeals.forEach((meal) => (profit += meal.Cost));
    });

    return profit;
  },

  mostOrdered() {
    let mealsCounter = [];
    this.Menu.ReadyMeals.forEach((meal) => {
      mealsCounter[meal.Id - 1] = [meal, 0];
      this.AllTables.forEach((table) => {
        table.OrderedDishes.ReadyMeals.forEach((orderedMeal) => {
          if (orderedMeal.Name === meal.Name) {
            mealsCounter[meal.Id - 1][1]++;
          }
        });
      });
    });

    let max;
    mealsCounter.forEach((mealCounter) => {
      if (mealCounter[0].Id === 1 || mealCounter[1] > max[1]) {
        max = mealCounter;
      }
    });

    alert(`Najcesce naruceno jelo je ${max[0].Name}`);
  },

  leastOrdered() {
    let mealsCounter = [];
    this.Menu.ReadyMeals.forEach((meal) => {
      mealsCounter[meal.Id - 1] = [meal, 0];
      this.AllTables.forEach((table) => {
        table.OrderedDishes.ReadyMeals.forEach((orderedMeal) => {
          if (orderedMeal.Name === meal.Name) {
            mealsCounter[meal.Id - 1][1]++;
          }
        });
      });
    });

    let min;
    mealsCounter.forEach((mealCounter) => {
      if (mealCounter[0].Id === 1 || mealCounter[1] < min[1]) {
        min = mealCounter;
      }
    });

    alert(`Najrjedje naruceno jelo je ${min[0].Name}`);
  },

  customDishes() {
    //broj narucenih custom disheva, prosjecnu cijenu, najcesci sastojak, najrjedji sastojak
    let brojCustomDisheva = 0;
    let prosjecnaCijena = 0;

    this.AllTables.forEach(
      (table) => (brojCustomDisheva += table.OrderedDishes.CustomMeals.length)
    );

    if (brojCustomDisheva === 0) {
      return;
    }

    this.AllTables.forEach((table) =>
      table.OrderedDishes.CustomMeals.forEach(
        (meal) => (prosjecnaCijena += meal.Cost)
      )
    );

    prosjecnaCijena /= brojCustomDisheva;

    alert(
      `Kupljeno je ${brojCustomDisheva} custom disheva\nNjihova prosjecna cijena: ${prosjecnaCijena} HRK`
    );
  },

  report() {
    this.numberOfTablesInADay();
    alert(`Danasnji profit: ${this.profitOfTheDay()} HRK`);
    this.averagePrice();
    this.mostOrdered();
    this.leastOrdered();
    this.customDishes();
    refreshPage();
  },
};

let allTables = JSON.parse(sessionStorage.getItem("restaurant-allTables"));
let tableState = JSON.parse(sessionStorage.getItem("restaurant-tableState"));
let menu = JSON.parse(sessionStorage.getItem("restaurant-menu"));

if (allTables != null) {
  restaurant.AllTables = allTables;
  restaurant.TableState = tableState;
  restaurant.Menu = menu;
}

function initialize() {
  document.getElementById("table-container").innerHTML = ``;

  restaurant.TableState.forEach((table) => {
    let availability;
    let image;
    let buttonText;
    let buttonFunction;

    if (table.Active === false) {
      availability = "available";
      buttonText = "REZERVIRAJ STOL";
      buttonFunction = `reserveTable(${table.Id})`;
    } else {
      availability = "unavailable";
      buttonText = "OSLOBODI STOL";
      buttonFunction = `makeTableAvailable(${table.Id})`;
    }

    switch (table.MaxNumberOfPeople) {
      case 1:
        image = "../images/one-seat-table.png";
        break;
      case 2:
        image = "../images/two-seat-table.png";
        break;
      case 3:
        image = "../images/three-seat-table.png";
        break;
      case 4:
        image = "../images/four-seat-table.png";
        break;
      default:
        break;
    }

    let newTable = `
  <div class="col s12 m12 l6">
  <div class="card-action ${availability}" id="${table.Id}">&nbsp;</div>
  <div class="card blue-grey darken-1">
    <div class="card-content white-text">
      <span class="card-title">
        <strong>Stol ${table.Id}.</strong>
      </span>
      <img src="${image}" />
    </div>
    <div class="card-action">
      <a id = "btn-${table.Id}" onclick="${buttonFunction}">${buttonText}</a>
    </div>
  </div>
</div>
  `;

    document.getElementById("table-container").innerHTML += newTable;
  });
}

initialize();
