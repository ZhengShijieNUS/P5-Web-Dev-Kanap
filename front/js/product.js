const getProductByIdApiUrl = 'http://localhost:3000/api/products'
const addToCartButton = document.querySelector('#addToCart')

/**
 * The function to get the id from URL search parameters
 *
 * @returns _id of the product
 */
function getProductId () {
  const urlParams = new URLSearchParams(window.location.search)
  const _id = urlParams.get('_id')

  return _id
}

/**
 * Create the page html tag of a product to display details
 *
 * @param {The product detail data obtain from API} item
 */
function createProductDetail (item) {
  const imageUrl = item.imageUrl
  const altTxt = item.altTxt
  const name = item.name
  const description = item.description
  const price = item.price
  const colorsList = item.colors

  // insert img info into html
  const productImg = document.getElementsByClassName('item__img')[0]
  const productImgDetail = document.createElement('img')
  productImgDetail.setAttribute('src', imageUrl)
  productImgDetail.setAttribute('alt', altTxt)
  productImg.appendChild(productImgDetail)

  // insert name info into html
  const productName = document.getElementById('title')
  productName.textContent = name

  // insert price into html
  const productPrice = document.getElementById('price')
  productPrice.textContent = price

  // insert description into html
  const productDescription = document.getElementById('description')
  productDescription.textContent = description

  // insert colors into html
  const productColorList = document.getElementById('colors')
  for (const color of colorsList) {
    let option = document.createElement('option')
    option.value = color
    option.textContent = color
    productColorList.appendChild(option)
  }
}

/**
 * To get the color that user selected
 * @returns the color selected by the user
 */
function getUsersSelectedColor () {
  const productColorList = document.getElementById('colors')
  const selectedOption =
    productColorList.options[productColorList.selectedIndex]

  const colorSelected = selectedOption.value

  return colorSelected
}

/**
 * To get the quantity that user selected
 * @returns the quantity selected by the user
 */
function getUsersSelectedQuantity () {
  const quantityElement = document.querySelector('#quantity')
  return quantityElement.value
}

/**
 * To get rendering the product details to the page
 */
function updateTheProductDetailIntoPage () {
  fetch(getProductByIdApiUrl + '/' + getProductId())
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error,Status:${response.status}`)
      }

      return response.json()
    })
    .then(data => {
      createProductDetail(data)
    })
    .catch(err => {
      console.error('Fetch error: ' + err.message)
    })
}

updateTheProductDetailIntoPage()

// data structure in localStorage
// eg: _id:[{ black: 0 }, { orange: 2 }]

/**
 * Helper function, to update the localStorage with user input data
 * @param {string} _id 
 * @param {string} color 
 * @param {number} quantity 
 */
function updateLocalStorageWithUserInput(_id,color,quantity){

  if (localStorage.getItem(_id) !== null) {
    const items = JSON.parse(localStorage.getItem(_id))

    let isFounded = false

    for (let i = 0; i < items.length; i++) {
      let item = items[i]

      //If the item's color exists in the item, then update the quantity directly
      if (color in item) {
        isFounded = true
        item[color] = item[color] + quantity
        break
      }
    }

    //If the product is added before but just the color is 1st time added, then add the new color to the array
    if (!isFounded) {
      items.push({ [color]: quantity })
    }

    localStorage.setItem(_id, JSON.stringify(items))
  } else {
    //If the product is 1st time added, create the record in the localStorage
    const newItems = [{ [color]: quantity }]
    localStorage.setItem(_id, JSON.stringify(newItems))
  }

}

function isValidQuantity(quantity){
  if(quantity > 0){
    return true
  }

  return false
}

addToCartButton.addEventListener('click', () => {
  const _id = getProductId()
  const color = getUsersSelectedColor()
  const quantity = parseInt(getUsersSelectedQuantity()) // convert quantity from string to number

  if(isValidQuantity(quantity)){
    updateLocalStorageWithUserInput(_id,color,quantity)
  }else{
    alert("Please enter a valid quantity")
  }
})
