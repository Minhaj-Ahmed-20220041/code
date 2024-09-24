## API Documentation

##### Auth APIs

<details>
<summary> Customer Register</summary>

Method: ```POST```\
URL: ```localhost:3001/auth/customer/register```
<br>Request Body sample:
```json
{
    "firstName":"sujan",
    "lastName":"kha",
    "email":"sujan001@email.com",
    "username":"sujan123",
    "password":"Sujan@123"
}
```
Success response sample:
```json
{"userId": "662ee1f4ee447a942f011372"}
```
Error Response sample:
```json
{"error": "Username already taken!"}
```
</details>

<details>
<summary> Customer Login  </summary>

Method: ```POST```\
URL: ```localhost:3001/auth/customer/login```
<br>Request Body sample:
```json
{
    "username":"sujan123",
    "password":"sujan123"
}
```
Success response sample:
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjI3OGIzY2Y2OWU2MmI4YTdlYWUwYjgiLCJpYXQiOjE3MTQ0NjM1NTIsImV4cCI6MTcxNDU0OTk1Mn0.YVyNgvKRS-H5alKqy0zR8a0GFQI4Hogmty2iZgEl764",
    "user": {
        "id": "66278b3cf69e62b8a7eae0b8",
        "name": "sujan"
    }
}
```
Error Response sample:
```json
{"error": "Invalid username or password"}
```
</details>

<details>
<summary> i. Forget Password </summary>

Method: ```POST```\
URL: ```localhost:3001/auth/forget-password```
<br>Request Body sample:
```json
{"email":"sujan123@gmai.com"}
```
Success response sample:
```json
{"message":"Verification email has been sent."}
```
Error Response sample:
```json
{ "error": "No user found for the given Email!"}
```
</details>

<details>
<summary>ii. Verify Forget Password</summary>

Method: ```PATCH```\
URL: ```localhost:3001/auth/verify-forget-password```
<br>Request Body sample:
```json
{
    "email":"sujan001@email.com",
    "verificationCode":"D04iV"
}
```
Success response sample:
```json
{"resetToken":"aedef6dbe5f88d248891eb67797ed93d4ea6d6dc64967d9a31092aeac98a301c"}
```
Error Response sample:
```json
{ "error": "Invalid verificaiton code!"}
```
</details>

<details>
<summary>iii. Reset Password</summary>

Method: ```PATCH```\
URL: ```localhost:3001/auth/reset-password```
<br>Request Body sample:
```json
{
    "resetToken":"aedef6dbe5f88d248891eb67797ed93d4ea6d6dc64967d9a31092aeac98a301c",
    "newPassword": "Sujan@1234"
}
```
Success response sample:
```json
{
    "message": "Password reset successful!"
}
```
Error Response sample:
```json
{ "error": "Not Authorized!"}
```
</details>

##### User APIs

<details>
<summary>Get user</summary>
Use token from the login response to get API authorization.

Method: ```GET```\
URL: ```localhost:3001/user/{userId}```
<br>Request Header: 
```
Authorization = "Bearer <token>"
```
Success response sample:
```json
{
    "firstName": "sujan",
    "lastName": "kha",
    "email": "sujan100@email.com",
    "username": "sujan1234"
}
```
Error Response sample:
```json
{
    "message": "Invalid user ID"
}
```
</details>


##### Product APIs
<details>
<summary>Add product</summary>
The API is authorized to admin user only. To access the API, you need to login with admin account and use the JWT token from the login response.

Method: ```POST``` \
URL: ```localhost:3001/product```
<br>Request Header: 
```
Authorization = "Bearer <token>"
```
<br>Request Body sample:
Since we are addind images as well: the request is ``` Content-Type: multipart/form-data ``` and the body will have two parameters ``` images and productInfo ```.

```
images: [List of images]
productInfo: "{
    "name": "iPhone 13 Pro Max",
    "brand": "Apple",
    "category": "smartphone",
    "price": 1099,
    "discount": 5,
    "description": "The iPhone 13 Pro Max is the latest flagship smartphone from Apple. It features a stunning 6.7 inch Super Retina XDR display, the powerful A15 Bionic chip, and a triple-lens camera system with enhanced low-light performance.",
    "specifications": {
      "display": "6.7 inch Super Retina XDR",
      "processor": "Apple A15 Bionic",
      "memory": "6GB",
      "storage": "128GB",
      "rearCamera": "Triple-lens (12MP main, 12MP ultrawide, 12MP telephoto)",
      "frontCamera": "12MP",
      "battery": "4352mAh",
      "operatingSystem": "iOS 15",
      "wifi": "Wi-Fi 6E (802.11ax)",
      "bluetooth": "Bluetooth 5.2"
    },
    "quantity": 100,
    "colors": [
      "Graphite",
      "Gold",
      "Silver",
      "Sierra Blue"
    ],
    "releaseYear":"2020",
    "isFeatured":true
  }"
```
Success response sample:
```json
{
    "productId": "663df83be8bdfe0a1373ef3e",
    "productLink": "http://localhost:3001/product/663df83be8bdfe0a1373ef3e"
}
```
Error Response sample:
```json
{"error": "Product info is missing!"}
```
</details>

<details>
<summary>Add products in bulk</summary>
Using a json file with list of product infos, we can import/upload mutiple products at once.

Method: ```POST```\
URL: ```localhost:3001/product/bulk```
<br>Request Header: 
```Authorization = "Bearer <token>"```
<br>Request Body:
Since we are uploading json file: the request is of ``` Content-Type: multipart/form-data ``` and the body will have a file with parameter name ``` products ```.
Success response sample:
```json
{
    "message": "Upload successful.",
    "processedProducts": 20
}
```
Error Response sample:
```json
{"error": "Product data file is missing!"}
```
</details>

<details>
<summary>List products (by category)</summary>
The API returns a list of products paginated and sorted by  as query parameters.
It is to be used to list products by category.

Method: ```GET``` \
URL: ```http://localhost:3001/product/list/by```
<br>Request query parameters:  `category` `page` `limit` `sortBy` `sortOrder`
category => product category
page => current page number
limit => number of product in 1 page
sortBy => sort field
sordOrder => ascending or descending 
e.g. ```List smartphone: http://localhost:3001/product/list/by?category=smartphone&page=1&limit=5&sortBy=createdAt&sortOrder=desc
        List Laptop: http://localhost:3001/product/list/by?category=laptop&page=1&limit=5&sortBy=createdAt&sortOrder=desc
        List Smartwatch: http://localhost:3001/product/list/by?category=smartwatch&page=1&limit=5&sortBy=createdAt&sortOrder=desc
```

Success response sample:
```json
{
    "products": [
        {
            "_id": "6667d9239d9ae3701e59d6a2",
            "name": "OnePlus Watch",
            "brand": "OnePlus",
            "category": "smartwatch",
            "price": 212.17,
            "discount": 10,
            "images": [
                "https://dummyimage.com/786x800/000/fff&text=Smartwatch",
                "https://dummyimage.com/731x800/000/fff&text=Smartwatch_2"
            ],
            "description": "A smartwatch with fitness tracking features.",
            "specifications": {
                "display": "1.8-inch OLED",
                "processor": "Dual-core 1.5 GHz",
                "memory": "2GB RAM",
                "storage": "32GB",
                "battery": "350mAh",
                "operatingSystem": "watchOS",
                "wifi": "802.11ac",
                "bluetooth": "5.0"
            },
            "availability": {
                "inStock": true,
                "quantity": 0
            },
            "colors": [
                "White",
                "Pink"
            ],
            "releaseYear": "2023",
            "isFeatured": false,
            "productLink": "http://localhost:3001/product/6667d9239d9ae3701e59d6a2",
            "discountedPrice": "359.10"
        }
    ],
    "totalProducts": 225,
    "limit": 10,
    "page": 5,
    "totalPages": 45,
    "hasPrevPage": true,
    "hasNextPage": true,
    "prevPage": 4,
    "nextPage": 6
}
```
Error Response sample:
```json
{"error": "<Error message>"}
```
</details>

<details>
<summary>List Featured Products</summary>
The API returns list of featured products only.

Method: ```GET``` \
URL: ```http://localhost:3001/product/list/featured```

Success response sample:
```json
[
  {
    "_id": "66459deb090ff7a7dbf9a979",
    "name": "iPhone 17 Ultra",
    "brand": "Apple",
    "category": "smartphone",
    "price": 1850,
    "discount": 12,
    "images": [
      "https://res.cloudinary.com/dqo0ru8nk/image/upload/v1715838444/gadgetzone/products/ktyod6spo9crswcrijhw.jpg"
    ],
    "description": "The iPhone 13 Pro Max is the latest flagship smartphone from Apple. It features a stunning 6.7 inch Super Retina XDR display, the powerful A15 Bionic chip, and a triple-lens camera system with enhanced low-light performance.",
    "specifications": {
      "display": "6.7 inch Super Retina XDR",
      "processor": "Apple A15 Bionic",
      "memory": "6GB",
      "storage": "128GB",
      "rearCamera": "Triple-lens (12MP main, 12MP ultrawide, 12MP telephoto)",
      "frontCamera": "12MP",
      "battery": "4352mAh",
      "operatingSystem": "iOS 15",
      "wifi": "Wi-Fi 6E (802.11ax)",
      "bluetooth": "Bluetooth 5.2"
    },
    "availability": {
      "inStock": true,
      "quantity": 50
    },
    "colors": [
      "Graphite",
      "Gold",
      "Silver",
      "Sierra Blue"
    ],
    "releaseYear": "2020",
    "isFeatured": true,
    "productLink": "http://localhost:3001/product/66459deb090ff7a7dbf9a979",
    "discountedPrice": "458.10"
  }
]
```
Error Response sample:
```json
{"error": "<Error message>"}
```
</details>

<details>
<summary>Get product detail</summary>

Method: ```GET```\
URL: ```http://localhost:3001/product/{productId}```\
Success response sample:
```json
{
    "_id": "6641baa569ee827cd56d412e",
    "name": "iPhone 13 Pro Max",
    "brand": "Apple",
    "category": "smartphone",
    "price": 1099,
    "discount": 0,
    "images": [],
    "description": "The iPhone 13 Pro Max is the latest flagship smartphone from Apple. It features a stunning 6.7 inch Super Retina XDR display, the powerful A15 Bionic chip, and a triple-lens camera system with enhanced low-light performance.",
    "specifications": {
        "display": "6.7 inch Super Retina XDR",
        "processor": "Apple A15 Bionic",
        "memory": "6GB",
        "storage": "128GB",
        "rearCamera": "Triple-lens (12MP main, 12MP ultrawide, 12MP telephoto)",
        "frontCamera": "12MP",
        "battery": "4352mAh",
        "operatingSystem": "iOS 15",
        "wifi": "Wi-Fi 6E (802.11ax)",
        "bluetooth": "Bluetooth 5.2"
    },
    "availability": {
        "inStock": true,
        "quantity": 50
    },
    "colors": [
        "Graphite",
        "Gold",
        "Silver",
        "Sierra Blue"
    ],
    "releaseYear": "2020",
    "isFeatured": true,
    "productLink": "http://localhost:3001/product/6641baa569ee827cd56d412e"
}
```
Error Response sample:
```json
{"error": "Product not found!"}
```
</details>

<details>
<summary>Search products</summary>
The API searchs products and returns a list of products(paginated). Currently searching is done in the name, description and brand of products.

Method: ```GET``` \
URL: ```http://localhost:3001/product/search/by```
<br>Request query parameters:  `keyword` `category` `page` `limit` `sortBy` `sortOrder` `minPrice` `maxPrice`
keyword => search keyword
category => product category
page => current page number
limit => number of product in 1 page
sortBy => sort field
sordOrder => ascending or descending 
minPrice & maxPrice => price range
e.g. ```http://localhost:3001/product/search/by?keyword=apple&page=1&limit=5&sortBy=createdAt&sortOrder=desc&minPrice=900&maxPrice=1000&category=smartphone
```

Success response sample:
```json
{
    "keyword": "apple",
    "products": [
        {
            "_id": "6667d9239d9ae3701e59d64e",
            "name": "Apple iPhone 13 Pro",
            "brand": "Google",
            "category": "smartphone",
            "price": 903.18,
            "discount": 0,
            "images": [
                "https://dummyimage.com/706x800/000/fff&text=Smartphone",
                "https://dummyimage.com/671x800/000/fff&text=Smartphone_2"
            ],
            "description": "A versatile device suitable for various tasks.",
            "specifications": {
                "display": "6.5-inch OLED",
                "processor": "Octa-core 2.8 GHz",
                "memory": "8GB RAM",
                "storage": "128GB",
                "frontCamera": "12MP",
                "rearCamera": "48MP + 12MP + 8MP",
                "battery": "4000mAh",
                "operatingSystem": "Android 11",
                "wifi": "802.11ac",
                "bluetooth": "5.0"
            },
            "availability": {
                "inStock": true,
                "quantity": 0
            },
            "colors": [
                "Black"
            ],
            "releaseYear": "2023",
            "isFeatured": false,
            "createdBy": "663d9849db9dea98db64b5d9",
            "createdAt": "2024-06-11T04:57:07.455Z",
            "updatedAt": "2024-06-11T04:57:07.495Z",
            "__v": 0,
            "productLink": "http://localhost:3001/product/6667d9239d9ae3701e59d64e"
        },
    ],
    "totalProducts": 3,
    "limit": 10,
    "page": 1,
    "totalPages": 1,
    "hasPrevPage": false,
    "hasNextPage": false,
    "prevPage": null,
    "nextPage": null
}
```
Error Response sample:
```json
{"error": "<Error message>"}
```
</details>

##### Cart APIs

<details>
<summary> Add to cart</summary>
API to add product to the cart, if the product already exist in the cart list, the quantity will be updated. Only the user can add to their cart.

Method: ```POST```\
URL: ```localhost:3001/cart/```
<br>Request Header: 
```Authorization = "Bearer <token>"```
<br>Request Body sample:

```json
{
    "productId":"6641636e42c1d177bfc53c5e",
    "quantity":1
}
```
Success response sample:
```json
{"message": "Added to your cart!"}
```
Error Response sample:
```json
{"error": "Error message"}
```
</details>

<details>
<summary> List cart items</summary>
API to list items in a user's cart.
Implement the API to list products in the cart of a user. Need to provide auth token. 

Method: ```GET```\
URL: ```localhost:3001/cart/list```
<br>Request Header: 
```Authorization = "Bearer <token>"```

Success response sample:
```json
[
    {
        "productId": "66416596df5830ee2ca38a6d",
        "name": "iPhone 13 Pro Max",
        "images": [
            "https://res.cloudinary.com/dqo0ru8nk/image/upload/v1715561879/gadgetzone/products/cwqe2f6tegnoutmw8ioe.jpg",
            "https://res.cloudinary.com/dqo0ru8nk/image/upload/v1715561881/gadgetzone/products/gcwer7guibhrbwdeqkah.jpg",
        ],
        "price": 1099,
        "quantity": 1,
        "description": "The iPhone 13 Pro Max is the latest flagship smartphone from Apple. It features a stunning 6.7 inch Super Retina XDR display, the powerful A15 Bionic chip, and a triple-lens camera system with enhanced low-light performance."
    },
    {
        "productId": "6667d9239d9ae3701e59d64e",
        "name": "Apple iPhone 13 Pro",
        "images": [
            "https://dummyimage.com/706x800/000/fff&text=Smartphone",
            "https://dummyimage.com/671x800/000/fff&text=Smartphone_2"
        ],
        "price": 903.18,
        "quantity": 1,
        "description": "A versatile device suitable for various tasks."
    }
]
```
Error Response sample:
```json
{"error": "Error message"}
```
</details>

<details>
<summary> Update product of cart</summary>
API to update product quantity in the cart.

Method: ```POST```\
URL: ```localhost:3001/cart/update```
<br>Request Header: 
```Authorization = "Bearer <token>"```
<br>Request Body sample:

```json
{
    "productId":"6641636e42c1d177bfc53c5e",
    "quantity":10
}
```
Success response sample:
```json
{"message": "Cart updated successfully"}
```
Error Response sample:
```json
{"error": "Error message"}
```
</details>

<details>
<summary> Delete product from cart</summary>
API to delete a product from the cart.

Method: ```DELETE```\
URL: ```localhost:3001/cart/remove/{productId}```
<br>Request Header: 
```Authorization = "Bearer <token>"```

Success response sample:
```json
{"message": "Item removed successfully"}
```
Error Response sample:
```json
{"error": "Error message"}
```
</details>

##### Order APIs

<details>
<summary> Place order</summary>
API to place order for the items present in a user's cart.

Method: ```POST```\
URL: ```localhost:3001/order/```
<br>Request Header: 
```Authorization = "Bearer <token>"```
<br>Request Body sample:

```json
{
    "billingInfo":{
        "fullName":"Sujan Khapung",
        "phoneNumber":"+61411111111",
        "email":"sujan@email.com",
        "address":"unit 11, 22 victoria street",
        "city":"wynyard",
        "state":"NSW",
        "country":"Australia",
        "zipCode": "2222"
    },
    "paymentInfo":{
        "cardNumber":"1234567890123456",
        "nameInCard":"Sujan Khapung",
        "expiryDate":"06/30",
        "cvv":"123"
    }
}
```
Success response sample:
```json
{
  "orderBy": "6634c3e819349c5bdcf3c22e",
  "orderStatus": "order_placed",
  "discount": 0,
  "shippingInfo": {
    "fullName": "Sujan Khapung",
    "phoneNumber": "+61411111111",
    "email": "sujan@email.com",
    "address": "unit 11, 22 victoria street",
    "city": "wynyard",
    "state": "NSW",
    "zipCode": "2222",
    "country": "Australia"
  },
  "paymentStatus": "paid",
  "createdAt": "2024-07-19T05:21:26.307Z",
  "_id": "6699f7d6689d22216ad271d9",
  "items": [
    {
      "productId": "6641636e42c1d177bfc53c5e",
      "quantity": 3,
      "price": 2159.1,
      "_id": "6699f7d6689d22216ad271db"
    }
  ],
  "updatedAt": "2024-07-19T05:21:26.355Z",
  "subTotal": 6477.3,
  "shippingCharge": 10,
  "grandTotal": 6487.3,
  "__v": 0
}
```
Error Response sample:
```json
{"error": "Error message"}
```
</details>

<br>
Postman collection: 

```https://warped-shadow-715695.postman.co/workspace/Team-Workspace~24275b40-915a-48d8-80ac-84175f2f12cd/collection/8875321-a6c06989-e715-42d4-9987-27863641fad0?action=share&creator=8875321```