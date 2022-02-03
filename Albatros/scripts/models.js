class Table {
  constructor(id, maxNumberOfPeople) {
    this.Id = id;
    this.MaxNumberOfPeople = maxNumberOfPeople;

    this.NumberOfPeople = 0;
    this.Check = 0;
    this.OrderedDishes = {
      ReadyMeals: [],
      CustomMeals: [],
    };
    this.Active = false;
  }

  // orderFood(numberOfPeople) {
  //   //ispis menija i spremanje narudzbi
  //   this.NumberOfPeople = numberOfPeople;
  //   sessionStorage.setItem("restaurant", JSON.stringify(restaurant));
  //   sessionStorage.setItem("activeTableId", this.Id);

  //   location.href = "../pages/order.html";
  // }
}

class Dish {
  constructor(id, name, ingredients, description, price) {
    this.Id = id;
    this.Name = name;
    this.Ingredients = ingredients;
    this.Description = description;
    this.Price = price;
  }
}

class CustomDish {
  constructor(name, description, cost, firstIng, secondIng, thirdIng) {
    this.Name = name;
    this.Description = description;
    this.Cost = cost;
    this.FirstIng = firstIng;
    this.SecondIng = secondIng;
    this.ThirdIng = thirdIng;
  }
}
