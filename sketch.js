
//var form

//Create variables here
var dog,sadDog,happyDog,garden,washroom, database;
var foodS,foodStock;
var fedTime,lastFed,currentTime;
var feed, positopn, addFood;
var foodObj;
var gameState,readState;

function preload()

{
  sadDog=loadImage("images/Dog.png");
happyDog=loadImage("images/Happy.png");
garden=loadImage("images/Garden.png");
washroom=loadImage("images/Wash Room.png");
bedroom=loadImage("images/Bed Room.png");
}

function setup() {
	createCanvas(700, 700);
  database = firebase.database();
  console.log(database);
 
  foodObj= new Food();

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  });

  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState= data.val();
  });

  dog = createSprite(550,250,10,10);
  dog.addImage(sadDog);
  dog.scale=0.2
 
 // var dogo = database.ref('Food');
 // dogo.on("value", readStock, showError);

  feed = createButton("FEED DRAGO MILK")
  feed.position(600,100)
  feed.mousePressed(FeedDog);

  addFood = createButton("ADD FOOD")
  addFood.position(400,100)
  addFood.mousePressed(AddFood)


} 

function draw(){
  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }
   
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
   }

drawSprites();
}
function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS)
}

//function showError(){
//  console.log("Error in writing to the database");
//}

function update(state){
  
  database.ref('/').update({
    gameState: state
  })

}
function AddFood(){
foodS++
database.ref('/').update({
  Food:foodS
})
}
function FeedDog(){
dog.addImage(happyDog);
foodObj.updateFoodStock(foodObj.getFoodStock()-1)
 database.ref('/').update({
   Food:foodObj.getFoodStock(),
   FeedTime:hour (),
   gameState:"Hungry"
 })
}
