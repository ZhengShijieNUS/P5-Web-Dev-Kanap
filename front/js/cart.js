/**
 *
 * 1. Loop the localStorage and read each item
 * 2. Get the details through the API
 * 3. insert the details into the DOM element
 * 3. Get the details
 *
 *  */

const productCatalogueApi = 'http://localhost:3000/api/products'
const cart_items_section = document.querySelector('#cart__items');

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
        console.log(`color: ${color}, quantity: ${quantity}`)
      }
    }

    const article = document.createElement('article')
    article.setAttribute('data-id',productId)
    article.setAttribute('data-color',color)
    article.classList.add('cart__item')

    const cart__item__img_div = document.createElement('div')
    cart__item__img_div.classList.add('cart__item__img')
    const img = document.createElement('img')
    img.setAttribute('src',imgSrc)
    img.setAttribute('alt',imgAlt)
    cart__item__img_div.appendChild(img)
    article.appendChild(cart__item__img_div)

    const cart__item__content_div = document.createElement('div')
    cart__item__content_div.classList.add('cart__item__content')

    const cart__item__content__description_div = document.createElement('div')
    cart__item__content__description_div.classList.add('cart__item__content__description')
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
    cart__item__content__settings_div.classList.add('cart__item__content__settings')
    
    const cart__item__content__settings__quantity_div = document.createElement('div')
    cart__item__content__settings__quantity_div.classList.add('cart__item__content__settings__quantity')
    const quantity_p = document.createElement('p')
    quantity_p.textContent = 'Quantity : '
    const itemQuantityInput = document.createElement('input')
    itemQuantityInput.setAttribute('type','number')
    itemQuantityInput.classList.add('itemQuantity')
    itemQuantityInput.setAttribute('name','itemQuantity')
    itemQuantityInput.setAttribute('min','1')
    itemQuantityInput.setAttribute('max','100')
    itemQuantityInput.setAttribute('value',parseInt(quantity))
    cart__item__content__settings__quantity_div.appendChild(quantity_p)
    cart__item__content__settings__quantity_div.appendChild(itemQuantityInput)
    cart__item__content__settings_div.appendChild(cart__item__content__settings__quantity_div)

    const cart__item__content__settings__delete_div = document.createElement('div')
    cart__item__content__settings__delete_div.classList.add('cart__item__content__settings__delete')
    const deleteItem_p = document.createElement('p')
    deleteItem_p.classList.add('deleteItem')
    deleteItem_p.textContent = 'Delete'
    cart__item__content__settings__delete_div.appendChild(deleteItem_p)
    cart__item__content__settings_div.appendChild(cart__item__content__settings__delete_div)
    
    cart__item__content_div.appendChild(cart__item__content__settings_div)

    article.appendChild(cart__item__content_div)

    cart_items_section.appendChild(article)
  }
}

function showTheCartDetail () {
  if (localStorage.length !== 0) {
    for (let i = 0; i < localStorage.length; i++) {
      const _id = localStorage.key(i)
      const itemInCart = JSON.parse(localStorage.getItem(_id))
      fetch(productCatalogueApi + '/' + _id)
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
    }
  }
}


showTheCartDetail()
