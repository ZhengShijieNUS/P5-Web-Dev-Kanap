const orderIdElement = document.querySelector('#orderId')
const urlParams = new URLSearchParams(window.location.search)
const orderId = urlParams.get('orderId')

orderIdElement.textContent = orderId
