// keep header sticky when soft keyboard appears
const handleResize = () => {
  var windowHeight = window.innerHeight;
  var viewportHeight = window.visualViewport.height;
  var heightDifference = windowHeight - viewportHeight;
  if(heightDifference > 162){
    document.getElementById('header').style.top = window.visualViewport.offsetTop.toString() + 'px';
    document.querySelector('cart-contents').style.top = window.visualViewport.offsetTop.toString() + 56 + 'px';
  } else {
    document.getElementById('header').style.top = '0px';
    document.querySelector('cart-contents').style.top = '56px';
  }
}

if (window && window.visualViewport) visualViewport.addEventListener('resize', handleResize);


// universal constants
const products = document.querySelectorAll('.product');
const cartItems = document.querySelector('.total-items');
const cartWrapper = document.querySelector('.cart');
const clearCart = document.querySelector('.cart .clear-cart');
const cartContents = document.querySelector('.cart-contents');

cartWrapper.addEventListener('click',function(){
  var contentsShown = cartContents.classList.contains('show');
  if (contentsShown){
    cartContents.classList.remove('show')
  } else {
    cartContents.classList.add('show')
  }
})

clearCart.addEventListener('click',function(){
  var itemCount = cartItems.querySelector('.count');
  itemCount.innerHTML = "0";
  clearCart.classList.remove('show');
  cartWrapper.classList.remove('has-items');
  cartContents.innerHTML = "";
  setTimeout(() => {
    cartContents.classList.remove('show')
  },10);
})

products.forEach(product => {
  const inputGroup = product.querySelector('.input-group');
  const qtyInput = product.querySelector('input');
  const addToCartButton = product.querySelector('button');
  const cartTossWrapper = product.querySelector('.cart-toss-number');
  const itemName = product.querySelector('.product-title').innerHTML;
  const itemImage = product.querySelector('.product-image img').getAttribute('src');
  var cartTossNumber = product.querySelector('.cart-toss-number .number');
  
  console.log(itemImage);
  
  // enable/disable add to cart button
  qtyInput.addEventListener('change',function(){
    var inputValue = qtyInput.value;
    if(qtyInput.value){
      addToCartButton.disabled = false;
    } else {
      addToCartButton.disabled = true;
    }
    cartTossNumber.innerHTML = inputValue;
  })
  
  // begin add to cart
  addToCartButton.addEventListener('click',function(){
    cartTossWrapper.classList.add('show');
    inputGroup.classList.add('adding-to-cart');
    
    //calculations
    const cart = document.querySelector('.cart .count');
    var cartTotal = parseInt(cart.innerHTML);
    var newTotal = cartTotal + parseInt(qtyInput.value);
        
    //product information
    var cartContentsDiv = document.createElement("div");
    var cartContentsDivTitle = document.createElement("h4");
    var cartContentsDivImageWrapper = document.createElement("div");
    var cartContentsDivQty = document.createElement("div");
    cartContentsDivQty.appendChild(document.createTextNode(parseInt(qtyInput.value)))
    cartContentsDivTitle.appendChild(document.createTextNode(itemName));
    cartContentsDivImageWrapper.style.backgroundImage = 'url('+itemImage+')';
    cartContentsDivImageWrapper.classList.add('item-image');
    cartContentsDivQty.classList.add('item-qty');
    cartContentsDiv.appendChild(cartContentsDivImageWrapper);
    cartContentsDiv.appendChild(cartContentsDivTitle);
    cartContentsDiv.appendChild(cartContentsDivQty);
    cartContentsDiv.classList.add('cart-item');
    
    // animations
    var distanceFromTop = cartTossWrapper.getBoundingClientRect().top;
    var distanceFromRight = cartTossNumber.getBoundingClientRect().right;
    var viewportWidth = window.innerWidth;
    var transformDistanceY = distanceFromTop - 14;
    var transformDistanceX = viewportWidth - (distanceFromRight + 60);
    cartTossWrapper.style.transform = 'translateX('+transformDistanceX+'px)';
    cartTossNumber.style.transform = 'translateY(-'+transformDistanceY+'px)';
    
    // reset everything, adjust cart total
    qtyInput.value = null;
    addToCartButton.disabled = true;
    setTimeout(() => {
      inputGroup.classList.remove('adding-to-cart');
      cartTossWrapper.classList.remove('show');
      cart.innerHTML = newTotal;
      cartWrapper.classList.add('has-items');
      cartItems.classList.add('shake');
      setTimeout(()=>{
        cartItems.classList.remove('shake');
      }, 400)
    }, 750);
    setTimeout(() => {
      cartTossWrapper.style.transform = 'translateX(0px)';
      cartTossNumber.style.transform = 'translateY(0px)';
      clearCart.classList.add('show');
      cartContents.appendChild(cartContentsDiv);
    }, 1000);
  })
})