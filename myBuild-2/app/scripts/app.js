let text = document.querySelector("#obj");

function Car(make, model, year) {
    this.make = make;
    this.model = model;
    this.year = year;
}

var mycar = new Car("Eagle", "Talon TSi", 1993);

text.innerHTML = mycar;  
console.log(mycar);