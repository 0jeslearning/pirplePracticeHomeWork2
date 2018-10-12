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
