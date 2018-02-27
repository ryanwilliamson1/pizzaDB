var app=angular.module("cartApp",[]);
app.controller('cartCtrl', function($scope){
    // Q1) add two more pizza objects 
    $scope.pizzas=[
        {name:'Pepperoni',price:9.99,img: "pepperoni.jpg"},
        {name:'Alfredo',price:10.99,img: "chickenAlf.jpg"},
        {name:'Works',price:12.99,img:"works.jpg"},
        {name:'Veg',price:13.99,img:"veg.jpg"}
    ]
    // add two variables: cart, and total for web page cart.html
 	$scope.cart=JSON.parse(localStorage.getItem("cart"))
 	if($scope.cart==null)
    {
        $scope.cart=[]
        $scope.total=0.0
        $scope.numItems=0
    }
    else
    {
        $scope.numItems=$scope.cart.reduce((total, item) => total + item.quantity,0)
        // update total price in Q5
    }
    // Q2: addToCart() function
    $scope.addToCart=function(item) {
        let index=$scope.cart.findIndex(x=>x.name==item.name)
        if(index==-1) //item is not in the cart
        {
            item.quantity=1
            //item has four props: name, price, img, quantity
            $scope.cart.push(item)
        }
        else
            $scope.cart[index].quantity+=1
        $scope.numItems+=1
        toggleStorage.setItem("cart", JSON.stringify($scope.cart))
        //store cart locally, so every web page locally can access it
    }
    //Q3: removeFromCart() function
    $scope.removeFromCart=function(item) {
    localStorage.setItem("cart", JSON.stringify($scope.cart))
    $scope.calcTotalPrice()
    $scope.numItems-=1
    }
    //Q4: clearCart() function
    $scope.clearCart=function(){
    $scope.cart.splice(0,$scope.numItems)
    $scope.numItems=0
    localStorage.clear()
    $scope.calcTotalPrice()
    }

    //Q5: calcTotalPrice() function
	$scope.calcTotalPrice=function() {
        total=0.0
        for(item in cart) {
            total+=item.price
        }
    }
})