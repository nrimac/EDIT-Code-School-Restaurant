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
    return brojRezervacija;
  },

  averagePrice() {
    //prosjecna cijena narucenih i gotovih narucenih jela
    let brojJela = this.AllTables.reduce(
      (accumulator, table) =>
        (accumulator +=
          table.OrderedDishes.ReadyMeals.length +
          table.OrderedDishes.CustomMeals.length),
      0
    );
    let prosjecnaCijena = this.profitOfTheDay / brojJela;

    return prosjecnaCijena;
  },

  profitOfTheDay() {
    let profit = 0;

    this.AllTables.forEach((table) => {
      profit += table.OrderedDishes.ReadyMeals.reduce(
        (accumulator, dish) => (accumulator += dish.Price)
      );

      profit += table.OrderedDishes.CustomMeals.reduce(
        (accumulator, dish) => (accumulator += dish.Price)
      );
    });

    return profit;
  },

  mostOrdered() {},

  leastOrdered() {},

  customDishes() {
    //broj narucenih custom disheva, prosjecnu cijenu, najcesci sastojak, najrjedji sastojak
    let allCustomDishes = this.Menu.CustomMeals;
    let brojNarucenih = allCustomDishes.length;
    let prosjecnaCijena =
      allCustomDishes.reduce(
        (accumulator, dish) => (accumulator += dish.Price)
      ) / brojNarucenih;
    let najcesci;
    let najrjedji;

    //e sad

    return [prosjecnaCijena, najcesci, najrjedji];
  },

  report() {
    this.numberOfTablesInADay();
    this.averagePrice();
    this.profitOfTheDay();
    this.mostOrdered();
    this.leastOrdered();
    this.customDishes();
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
