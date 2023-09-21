/**
 *
 * 1. Loop the localStorage and read each item
 * 2. Get the details through the API
 * 3. insert the details into the DOM element
 * 3. Get the details
 *
 *  */

const productCatalogueApi = 'http://localhost:3000/api/products'
const cart_items_section = document.querySelector('#cart__items')

/**
 * Helper function, function to create the view on the page for each article
 * 
 * @param {*} itemDetailRes response from the API
 * @param {*} itemInCart the array containing the color and its quantity
 * @param {*} productId the product specific id
 */
function createCartArticleViewDOM (itemDetailRes, itemInCart, productId) {
  for (let i = 0; i < itemInCart.length; i++) {
    const imgSrc = itemDetailRes.imageUrl
    const imgAlt = itemDetailRes.altTxt
    const name = itemDetailRes.name
    const price = itemDetailRes.price

    let color = ''
    let quantity = ''
    // To get the color and quantity from itemInCart dynamically
    for (const key in itemInCart[i]) {
      if (itemInCart[i].hasOwnProperty(key)) {
        color = key
        quantity = itemInCart[i][key]
      }
    }

    const article = document.createElement('article')
    article.setAttribute('data-id', productId)
    article.setAttribute('data-color', color)
    article.classList.add('cart__item')

    const cart__item__img_div = document.createElement('div')
    cart__item__img_div.classList.add('cart__item__img')
    const img = document.createElement('img')
    img.setAttribute('src', imgSrc)
    img.setAttribute('alt', imgAlt)
    cart__item__img_div.appendChild(img)
    article.appendChild(cart__item__img_div)

    const cart__item__content_div = document.createElement('div')
    cart__item__content_div.classList.add('cart__item__content')

    const cart__item__content__description_div = document.createElement('div')
    cart__item__content__description_div.classList.add(
      'cart__item__content__description'
    )
    const name_h2 = document.createElement('h2')
    const color_p = document.createElement('p')
    const price_p = document.createElement('p')
    name_h2.textContent = name
    color_p.textContent = color
    price_p.textContent = price
    cart__item__content__description_div.appendChild(name_h2)
    cart__item__content__description_div.appendChild(color_p)
    cart__item__content__description_div.appendChild(price_p)
    cart__item__content_div.appendChild(cart__item__content__description_div)

    const cart__item__content__settings_div = document.createElement('div')
    cart__item__content__settings_div.classList.add(
      'cart__item__content__settings'
    )

    const cart__item__content__settings__quantity_div =
      document.createElement('div')
    cart__item__content__settings__quantity_div.classList.add(
      'cart__item__content__settings__quantity'
    )
    const quantity_p = document.createElement('p')
    quantity_p.textContent = 'Quantity : '
    const itemQuantityInput = document.createElement('input')
    itemQuantityInput.setAttribute('type', 'number')
    itemQuantityInput.classList.add('itemQuantity')
    itemQuantityInput.setAttribute('name', 'itemQuantity')
    itemQuantityInput.setAttribute('min', '1')
    itemQuantityInput.setAttribute('max', '100')
    itemQuantityInput.setAttribute('value', parseInt(quantity))
    cart__item__content__settings__quantity_div.appendChild(quantity_p)
    cart__item__content__settings__quantity_div.appendChild(itemQuantityInput)
    cart__item__content__settings_div.appendChild(
      cart__item__content__settings__quantity_div
    )

    const cart__item__content__settings__delete_div =
      document.createElement('div')
    cart__item__content__settings__delete_div.classList.add(
      'cart__item__content__settings__delete'
    )
    const deleteItem_p = document.createElement('p')
    deleteItem_p.classList.add('deleteItem')
    deleteItem_p.textContent = 'Delete'
    cart__item__content__settings__delete_div.appendChild(deleteItem_p)
    cart__item__content__settings_div.appendChild(
      cart__item__content__settings__delete_div
    )

    cart__item__content_div.appendChild(cart__item__content__settings_div)

    article.appendChild(cart__item__content_div)

    cart_items_section.appendChild(article)
  }
}

/**
 * Helper function, to calculate the number of articles currently on the page
 * 
 * @returns the number of the articles currently on the page
 */
function calculateTotalQuantityOfArticles () {
  const articlesList = cart_items_section.getElementsByTagName('article')
  return articlesList.length
}

/**
 * Helper function, to calculate the total cost currently on the page
 * 
 * @returns the total cost
 */
function calculateTotalPrice () {
  const totalPriceElement = document.getElementById('totalPrice')
  const articlesList = cart_items_section.getElementsByTagName('article')

  let sum = 0

  for (let i = 0; i < articlesList.length; i++) {
    const article = articlesList[i]

    const unitPrice = article.querySelectorAll(
      '.cart__item__content__description p'
    )[1].textContent
    const quantity = article.querySelector('input').value

    const currentProductCost = parseInt(unitPrice) * parseInt(quantity)

    sum += currentProductCost
  }

  return sum
}

/**
 * Function to update and display the number of articles and total price currently on the page
 */
function updateCartPrice () {
  const totalQuantityOfArticles = calculateTotalQuantityOfArticles()
  const totalCost = calculateTotalPrice()

  const totalQuantity = document.querySelector('#totalQuantity')
  const totalPrice = document.querySelector('#totalPrice')

  totalQuantity.textContent = totalQuantityOfArticles
  totalPrice.textContent = totalCost
}

/**
 * Helper function, invoked when the quantity stored in the local storage changes
 * 
 * @param {*} _id the product id
 * @param {*} color the color selected
 * @param {*} quantity the quantity to update
 */
function updateLocalStorageToSpecificQuantity (_id, color, quantity) {
  if (localStorage.getItem(_id) !== null) {
    const items = JSON.parse(localStorage.getItem(_id))

    for (let i = 0; i < items.length; i++) {
      let item = items[i]

      //If the item's color exists in the item, then update the quantity directly
      if (color in item) {
        item[color] = quantity
        break
      }
    }

    localStorage.setItem(_id, JSON.stringify(items))
  }
}

/**
 * Helper function, invoked when a specific color of a product stored in the local storage is removed
 * 
 * @param {*} _id 
 * @param {*} color 
 */
function deleteFromLocalStorageForSpecificArticle(_id, color){
  if(localStorage.getItem(_id) !== null){
    const items = JSON.parse(localStorage.getItem(_id))

    //Iterate the array, find out the specific color one and delete it from the array
    for(let i = 0; i < items.length; i++){
      const item = items[i]

      if (color in item) {
        items.splice(i, 1)
        break
      }
    }

    //Update the array to localStorage
    localStorage.setItem(_id, JSON.stringify(items))

    //if array is empty, remove the _id from the local storage
    if(items.length === 0){
      localStorage.removeItem(_id)
    }
  }
}

/**
 * Function to update the GUI if there is quantity changes on the page
 * @param {*} inputElements 
 */
function addEventListenerForQuantityChanges (inputElements) {
  for (const element of inputElements) {
    element.addEventListener('change', () => {
      const article = element.closest('article')
      const _id = article.dataset.id
      const color = article.dataset.color
      const quantity = parseInt(element.value)

      //update localstorage
      updateLocalStorageToSpecificQuantity(_id, color, parseInt(quantity))

      //update the the total price through ajax request to partially update the page instead of reloading the full page
      fetch(productCatalogueApi)
        .then(() => {
          updateCartPrice()
        })
        .catch(err => {
          console.error('Fetch error: ' + err.message)
        })

    })
  }
}

/**
 * Function to update the GUI if there is article removed from the page
 * @param {*} deleteItemElements 
 */
function addEventListenerForDeleteArticle(deleteItemElements){
  for (const element of deleteItemElements){
    element.addEventListener('click',() => {
      const article = element.closest('article')
      const _id = article.dataset.id
      const color = article.dataset.color

      //delete the item from localstorage
      deleteFromLocalStorageForSpecificArticle(_id, color)

      //update the the total price and GUI through ajax request to partially update the page instead of reloading the full page
      fetch(productCatalogueApi)
        .then(() => {
          cart_items_section.removeChild(article)
          updateCartPrice()
        })
        .catch(err => {
          console.error('Fetch error: ' + err.message)
        })

    })
  }
}

/**
 * The function to rendering the cart based on the data stored in the local storage
 * @param {*} fetchPromises an array of promises, storing the promised api results for later usage
 */
function loadLocalStorageContentToCartPage(fetchPromises){
  for (let i = 0; i < localStorage.length; i++) {
    const _id = localStorage.key(i)
    const itemInCart = JSON.parse(localStorage.getItem(_id))
    const fetchPromise = fetch(productCatalogueApi + '/' + _id)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error,Status:${response.status}`)
        }

        return response.json()
      })
      .then(response => {
        createCartArticleViewDOM(response, itemInCart, _id)
      })
      .catch(err => {
        console.error('Fetch error: ' + err.message)
      })

    fetchPromises.push(fetchPromise)
  }

}

/**
 * Main function of cart.js, the entrance of all the functions
 */
function showTheCartDetail () {
  updateCartPrice()

  if (localStorage.length !== 0) {
    const fetchPromises = [] // Store fetch promises in an array

    loadLocalStorageContentToCartPage(fetchPromises)

    // Use Promise.all to wait for all fetch promises to resolve
    Promise.all(fetchPromises).then(() => {
      updateCartPrice() // Call updateCartPrice() after all fetch requests are completed

      const inputElements = cart_items_section.querySelectorAll('input')
      const deleteItemElements = cart_items_section.querySelectorAll('.deleteItem')

      // Add event listener for inputElements for quantity changes
      addEventListenerForQuantityChanges(inputElements)

      // Add event litener for deleteItemElements for item deleted
      addEventListenerForDeleteArticle(deleteItemElements)

    })
  }
}

showTheCartDetail()
