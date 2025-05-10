# CTSE-ECommerce-Application-using-Microservices-Architecture
CTSE-ECommerce Application using Microservices Architecture

### api gateway service - 8085:8080
### user service - 5009:5001
### auth service - 5010:5002
### product service - 5011:5003
### order service - 5012:5004
### inventory service - 5013:5005
### cart service - 5014:5006
### payment service - 5015:5007
### notification service - 5016:5008


#### {{baseUrl}} = http://16.16.141.252:8080
port numbers
* api gateway service - 8085:8080
* user service - 5009:5001
* auth service - 5010:5002
* product service - 5011:5003
* order service - 5012:5004
* inventory service - 5013:5005
* cart service - 5014:5006
* payment service - 5015:5007
 
## User Service - IT21810664 Perera K.C.G.S.

#### Register user

```http
  POST {{baseUrl}}/api/users/register/user-service/register
```

```http
{
  "username": "nimal",
  "email": "n@gmail.com",
  "password": "12345",
  "role": "admin"
}

```

#### Get all users

```http
  GET {{baseUrl}}/api/users/user-service
```

#### Get user by ID

```http
  GET {{baseUrl}}/api/users/user-service/67ff850c919c8b2beb12dc03
```

#### Update user

```http
  PUT {{baseUrl}}/api/users/user-service/67ff850c919c8b2beb12dc03
```

```http
{
  "email": "gavithra@gmail.com",
  "password": "12345"
}

```

#### Reset password

```http
  PUT {{baseUrl}}/api/users/user-service/67ff850c919c8b2beb12dc03/reset-password
```

```http
{
  "newPassword": "12345"
}

```

#### Delete user

```http
  DELETE {{baseUrl}}/api/users/user-service/67ff850c919c8b2beb12dc03
```

## Auth Service - IT21810664 Perera K.C.G.S.

#### Login user

```http
  POST{{baseUrl}}/auth/auth-service/login
```

```http
{
  "username": "nimal",
  "password": "12345"
}


```
## Product Service - IT21321986 Neththasinghe N.A.M.H.

#### Create product

```http
  POST {{baseUrl}}/api/admin/products/product-service/
```

```http
{
  "name": "Sketchbook",
  "description": "A4 sketchbook with 80 plain pages.",
  "price": 890,
  "category": "Stationery",
  "weight": "700",
  "imageUrl": "https://example.com/images/sketchbook.jpg"
}

```

#### Get all products

```http
  GET {{baseUrl}}/api/products/product-service/
```

#### Get product by ID

```http
  GET {{baseUrl}}/api/products/product-service/681e2b4d1dbc652faf6e6235
```

#### Update product

```http
  PUT {{baseUrl}}/api/products/product-service/681e2b4d1dbc652faf6e6235
```

```http
{
  "name": "Sketchbook Kids"
}

```

#### Delete product

```http
  DELETE {{baseUrl}}/api/products/product-service/681e2b4d1dbc652faf6e6235
```


## Inventory Service - IT21812262 Rasanjana J.A.D.

#### Add to inventory

```http
  POST {{baseUrl}}/api/inventories/inventory-service/
```

```http
{
  "pid":"681e2b4d1dbc652faf6e6235",
  "productId": "SB700",
  "quantity": 5000,
  "remainingQuantity": 5000
}


```

#### Get all inventories

```http
  GET {{baseUrl}}/api/inventories/inventory-service/
```

#### Get one inventory

```http
  GET {{baseUrl}}/api/inventories/inventory-service/pid/681e2b4d1dbc652faf6e6235
```

#### Update inventory

```http
  PUT {{baseUrl}}/api/inventories/inventory-service/pid/681e2b4d1dbc652faf6e6235
```

```http
  {
     "quantity": 500
  }


```

#### Delete inventory

```http
  Delete {{baseUrl}}/api/inventories/inventory-service/pid/681e2b4d1dbc652faf6e6235
```

## Cart Service - IT21812262 Rasanjana J.A.D.

#### Add to cart

```http
  POST {{baseUrl}}/api/carts/cart-service/
```

```http
{
  "userid": "67ff7459abba927f00609cfe",
  "items": [
        {
      "pid": "680270c14de26dce4964dd64",
      "quantity": 1000
    },
            {
      "pid": "6802704dc4a790ce6d459b0c",
      "quantity": 2000
    },
            {
      "pid": "680270cd4de26dce4964dd6a",
      "quantity": 500
    },
            {
      "pid": "68027045c4a790ce6d459b0a",
      "quantity": 800
    }
  ]
}

```

#### Get all carts

```http
  GET {{baseUrl}}/api/carts/cart-service/
```

#### Get one cart

```http
  GET {{baseUrl}}/api/carts/cart-service/67ff7459abba927f00609cfe/cart-id
```

#### Update cart

```http
  PUT {{baseUrl}}/api/carts/cart-service/67ff7459abba927f00609cfe

```

```http
{
  "userid": "67ff7459abba927f00609cfe",
  "items": [
        {
      "pid": "680270c14de26dce4964dd64",
      "quantity": 1000
    },
            {
      "pid": "6802704dc4a790ce6d459b0c",
      "quantity": 500
    },
            {
      "pid": "680270cd4de26dce4964dd6a",
      "quantity": 750
    },
            {
      "pid": "68027045c4a790ce6d459b0a",
      "quantity": 650
    }
  ]
}

```

#### Delete cart

```http
  Delete {{baseUrl}}/api/carts/cart-service/67ff7459abba927f00609cfe
```

## Order Service - IT21321986 Neththasinghe N.A.M.H.

#### Create order

```http
  POST {{baseUrl}}/api/orders/order-service/
```

```http
{
  "userId": "6615a21e2bfc8f3e4e5f2a10",
  "cartId": "680007afbf687faded911fe1",
  "shippingAddress": {
    "street": "New Kandy road",
    "city": "Colombo",
    "postalCode": "10000",
    "country": "Sri Lanka"
  },
  "totalAmount": 1500,
  "paymentStatus": "pending"
}


```

#### Get all orders 

```http
  GET {{baseUrl}}/api/orders/order-service/
```

#### Get order by ID

```http
  GET {{baseUrl}}/api/orders/order-service/681e2bdbd24b2a40f63318af
```

#### Update order

```http
  PUT {{baseUrl}}/api/orders/order-service/681e2bdbd24b2a40f63318af
```

```http
{
  "shippingAddress": {
    "street": "main street",
    "city": "Colombo",
    "postalCode": "10100",
    "country": "Sri Lanka"
  }
}

```

#### Complete order

```http
  PUT {{baseUrl}}/api/orders/order-service/681e2bdbd24b2a40f63318af/complete-order
```

#### Cancel order

```http
  PUT {{baseUrl}}/api/orders/order-service/681e2bdbd24b2a40f63318af/cancel-order
```

#### Get completed order history

```http
  GET {{baseUrl}}/api/orders/order-service/orders/completed
```

```http
{
    "userId": "67ff7459abba927f00609cfe"
}

```

#### Delete order

```http
  DELETE {{baseUrl}}/api/orders/order-service/681e2bdbd24b2a40f63318af
```

## Payment Service - IT21818516 Talakotunna T.Y.A.

#### Make payment

```http
  POST {{baseUrl}}/api/payments
```

```http
{
    "userId": "67ff7459abba927f00609cfe"
}

```
