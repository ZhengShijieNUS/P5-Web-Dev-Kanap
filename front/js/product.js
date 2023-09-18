const getProductByIdApiUrl = 'http://localhost:3000/api/products'

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
