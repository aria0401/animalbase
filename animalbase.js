"use strict";

window.addEventListener("DOMContentLoaded", start);

let allAnimals = [];

// The prototype for all animals:
const Animal = {
  name: "",
  desc: "-unknown animal-",
  type: "",
  age: 0,
  star: "☆",
};

const settings = {
  filterBy: "*",
  sortedBy: "name",
  sortDirection: "asc",
};

function start() {
  console.log("ready");

  // TODO: Add event-listeners to filter and sort buttons
  document.querySelectorAll('[data-action="filter"]').forEach((element) => {
    element.addEventListener("click", getFilter);
  });

  document.querySelectorAll('[data-action="sort"]').forEach((element) => {
    element.addEventListener("click", getSort);
  });

  loadJSON();
}

function getFilter() {
  const filter = this.dataset.filter;
  setFilter(filter);
}

function setFilter(filter) {
  // const filteredAnimals = filterAnimalByTipe(filter);
  // displayList(filteredAnimals);
  settings.filterBy = filter;
  buildList();
}

function filterAnimalByTipe(allAnimals) {
  const result = allAnimals.filter(filterFuncion);
  function filterFuncion(animal) {
    if (animal.type === settings.filterBy) {
      return true;
    } else if (settings.filterBy === "*") {
      return true;
    }
  }
  console.log(result);
  return result;
}

///////

function getSort(event) {
  const sort = event.target.dataset.sort;
  const sortDirection = event.target.dataset.sortDirection;
  if (sortDirection === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }
  setSorted(sort, sortDirection);
}

function setSorted(sort, sortDirection) {
  // const sortedAnimals = sortAnimalByProperty(sort);
  // displayList(sortedAnimals);
  settings.sortedBy = sort;
  settings.sortDirection = sortDirection;
  buildList();
}

function sortAnimalByProperty(sortedList) {
  //   let sortedList = allAnimals;
  let direction = 1;
  if (settings.sortDirection === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }
  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(a, b) {
    if (a[settings.sortedBy] < b[settings.sortedBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }

  //   displayList(sortedList);
  return sortedList;
}

function buildList() {
  // FUTURE: Filter and sort currentList before displaying
  const currentList = filterAnimalByTipe(allAnimals);
  const sortedList = sortAnimalByProperty(currentList);
  displayList(sortedList);
}

async function loadJSON() {
  const response = await fetch("animals.json");
  const jsonData = await response.json();
  // when loaded, prepare data objects
  prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
  allAnimals = jsonData.map(preapareObject);

  // buildList(); //not yet

  // TODO: This might not be the function we want to call first
  displayList(allAnimals);
}

function preapareObject(jsonObject) {
  const animal = Object.create(Animal);

  const texts = jsonObject.fullname.split(" ");
  animal.name = texts[0];
  animal.desc = texts[2];
  animal.type = texts[3];
  animal.age = jsonObject.age;
  return animal;
}

function displayList(animals) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  animals.forEach(displayAnimal);
}

function displayAnimal(animal) {
  // create clone

  const clone = document
    .querySelector("template#animal")
    .content.cloneNode(true);

  // set clone data

  // TODO: Show star ⭐ or ☆

  clone.querySelector("[data-field=name]").textContent = animal.name;
  clone.querySelector("[data-field=desc]").textContent = animal.desc;
  clone.querySelector("[data-field=type]").textContent = animal.type;
  clone.querySelector("[data-field=age]").textContent = animal.age;

  clone.querySelector("[data-field=star]").textContent = animal.star;

  // TODO: Add event listener to click on star
  clone
    .querySelector("[data-field=star]")
    .addEventListener("click", displayStar);

  function displayStar() {
    if (this.textContent === animal.star) {
      this.textContent = "⭐";
    } else {
      this.textContent = animal.star;
    }
  }

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
