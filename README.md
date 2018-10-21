# pirplePracticeHomeWork2
Making an app/API for homework2: Pizza Online Order Delivery

Building the API backend for a pizza delivery company.

1) New users can be created, user information can be edited and deleted.
    User information to be stored will be:
    a)First name, last name
    b)Email address
    c)Street address

2) Users can log in and log out by created or destroying a token.

3) When a user is logged in, they should be able to 'GET' all the possible menu items.
    These menu items can be hard coded in to the system.
    But I will experiment with a JSON file for flexibilty

4) A logged-in user should be able to fill a shopping cart with menu items

5) A logged-in user should be able to create an order.
    (Will be using stripe.com sandbox to experiment/testing)

6) When an order is placed an email should be sent to the customer/user.
    (Will be using mailgun.com to experiment/test)


Required Directories to work properly:
Each directory is preceeded by PATH_TO_APP_LOCATION

(Singular):

~/.data/cart

~/.data/menu

~/.data/order

(Plural)

~/.data/tokens 

~/.data/users

Current process is:
1) Create user at localhost:3000/users using POST method with the following elements:\n
    a)first name
    b)last name
    //c)email address (Email address not set yet)
    d)street number
    e)street name
    f)phone
    g)password
    h)tosAgreement (Must be set to true)

2) Once user creates an account they should generatea token in order to carts and
    process orders, to do so an object must be constructed with the following elements:

      {
        "phone" : "{the phone number you used}",
        "password" : "{the password you used}"
      }

    at the following url:
    localhost:3000/tokens using POST method

    Then apply the generated token (labled as "id" in the object) as the value
    for the 'token' key in the headers.

3) Once logged in user can fetch menu at localhost:3000/menu?menu=pizza using GET method
    (Currently only pizza menu exists, and is hard coded in to cartHandlers) 

4) Create a cart by going to localhost:3000/cart using POST method acceptable elements are:
    a)itemNumber 
    b)quantity
      (ie: {"itemNumber" : "Item 1","quantity" : 2})
  When cart is created a cartId will be generated, copy that id and follow directions below
  to place order

5) Once cart is created enter cartId in to url query like so:
    localhost:3000/order?cartId={cartId captured after placing items in to cart}
    using the POST method your cartId becomes your orderId and 'total amount' will be charged

6) Carts not processed can be deleted with the following url as an example:
    localhost:3000/cart?cartId={cartId} using the DELETE method

7) User can also retrieve cartId with the following url:
    localhost:3000/users?phone={phoneNumber} using the GET method
    The cartId is in the 'sessions' section of the object retrieved

8) Any time a message that says the token is missing in the header or is invalid
    a new token must be generated using step number 2


