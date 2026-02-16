const cars = [
    {brand: "BMW", year: 2014},
    {brand: "Aidi", year: 2018},
    {brand: "Toyota", year: 2009}
];
// function checkCar (жопень) {
//     if (жопень.year <2015) {
//         console.log (`${жопень.brand} -старя`);
//     } else {
//         console.log (`${жопень.brand} -новая`);
//     }
// }
function checkCar(car) {
    return car.year > 2015;
}
let newCount = 0;
let oldCount = 0;
let oldestCar = cars[0];
for (let i=1; i < cars.length; i++) {
    if (cars[i].year < oldestCar.year) {
        oldestCar = cars[i];
    }
    }
for (let i=0; i < cars.length; i++) {
    const isNew = checkCar(cars[i]);
    if (isNew) {
        newCount++;
    } else {
        oldCount++;
    }
} 
console.log("Новых:", newCount);
console.log("Старих:", oldCount);
console.log("Самая старая", oldestCar.brand, oldestCar.year);