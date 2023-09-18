const listAllProductApiUrl = 'http://localhost:3000/api/products'
const productList = document.querySelector('#items')

function formProductPageUrl (_id) {
  return './product.html?_id=' + _id
}

/**
 * to create a product element in HTML
 */
function createProductElement (item) {
  const imageUrl = item.imageUrl
  const altTxt = item.altTxt
  const name = item.name
  const description = item.description
  const _id = item._id

  let product = document.createElement('a')
  product.setAttribute('href', formProductPageUrl(_id))

  let productInfo = document.createElement('article')

  let productImg = document.createElement('img')
  productImg.setAttribute('src', imageUrl)
  productImg.setAttribute('alt', altTxt)
  let productName = document.createElement('h3')
  productName.classList.add('productName')
  productName.textContent = name
  let productDescription = document.createElement('p')
  product.classList.add('productDescription')
  productDescription.textContent = description

  productInfo.appendChild(productImg)
  productInfo.appendChild(productName)
  productInfo.appendChild(productDescription)

  product.appendChild(productInfo)

  productList.appendChild(product)
}

function updateTheListOfProductsIntoPage () {
  //fetch the product data from the API
  fetch(listAllProductApiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error,Status:${response.status}`)
      }
      return response.json()
    })
    .then(data => {
      console.log(data)
      for (const item of data) {
        createProductElement(item)
      }
    })
    .catch(err => {
      console.error('Fetch error:', err)
    })
}

updateTheListOfProductsIntoPage()
