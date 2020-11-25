# Railways

The following website is a Railway Ticket Booking Portal. This project embraces the Client-Server architecture, where the server and database are hosted separately and the client communicates via REST APIs. 

The latest version of the **Railway Reservation System** is deployed at **[cs301.tech](https://cs301.tech/)**.

<!-- Home Page  -->
<img src="./docs/home.png" width="90%" />

## Key Features
*(Here **User** refers to **Booking Agent**)
1. Users can look for all trains, with their details and all active, inactive and expired booking instances of that train.

2. Users can enter source, destination and date of journey and find if there are any trains available for following parameters.

3. Users can book tickets for multiple passengers at once.

4. Users can cancel multiple confirmed seats.

5. Admin can add trains, coaches, and booking instances from the 
user interface and need not write any SQL query.

6. Our portal supports multiple coaches and the Admin can define which coach schema to choose at the time of adding a booking instance.

## Technology Stack
1. TypeScript
2. ReactJS (Frontend)
3. NodeJS (Backend)
4. PostgreSQL (Database)

## Functionalities Of Our Project
Use cases have been divided based on the end user i.e. Admin and Booking Agents.
    
### Functionalites for Admin
1. Seperate Authentication for Admin.
   
2. Add `Trains` and the relevant information into the database for Reservation.

3. Add `Coaches` with different seating schemas

4. Add and update `Reservation status` for trains.

    Admin can perform the above operations without writing any database query by using our **simple and convenient User Interface**.

### Functionalites for Booking Agent
1. Seperate Authentication for Booking Agents.

2. View all trains, with their details and all active, inactive, and expired booking instances of that train on the `Trains` page.
    
    <!-- Trains page view -->
    <img src="./docs/trains.png" width="90%" />


3. Search for Available trains based on Starting location, Ending location, and Journey date. To ease searching for specific cities(location), we provide **incremental search** feature for the user.
   
    <!-- Search trains page view -->
    <img src="./docs/incremental_search_trains.png" width="90%" />
    <br><br>
    <!-- Search results -->
    <img src="./docs/search_results.png" width="90%">

4. Booking Agent can book tickets for multiple passangers on available trains.
   
    <!-- Ticket booking input view -->
    <img src="./docs/book_ticket.png" width="90%">

5. View all the tickets booked, i.e., canceled, confirmed, so far under the `My Tickets` section on the `Profile` page.
    
    <!-- Ticket booking input view -->
    <img src="./docs/my_tickets.png" width="90%">


6. Cancel confirmed tickets. This operation releases the seat for other passengers for booking while the train's booking status is "Active". The refund of the cancelation of tickets will be resolved every day during maintainance hours, this reegular update reduces the storage overhead, by releasing the details of refunds.
   
    <!-- cancel ticket view on profile -->
    <img src="./docs/cancel_booked_ticket.png" width="90%">
    <br><br>
    <!-- refund on ticket view on profile -->
    <img src="./docs/cancel_ticket_refund.png" width="90%">






