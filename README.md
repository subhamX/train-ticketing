# Railways

The following website is a Railway Ticket Booking Portal. This project embraces the Client-Server architecture, where the server and database are hosted separately and the client communicates via REST APIs. 

The latest version of the **Railway Reservation System** is deployed at **[traintkt.appspot.com](https://traintkt.appspot.com/)**.


## Project Design Overview

![docs/design.png](docs/design.png)

## ER Diagram

![docs/erdiagram.png](docs/erdiagram.png)


*Note: All blue and bolded attributes are primary key. All attributes with ? is indicating that the field can be NULL. Relations having [X] are dynamically created where X is some variable.*

<hr/>

<!-- Home Page  -->
<img src="./docs/home.png" />

## Key Features

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
    <img src="./docs/trains.png" />


3. Search for Available trains based on Starting location, Ending location, and Journey date. To ease searching for specific cities(location), we provide **incremental search** feature for the user.
   
    <!-- Search trains page view -->
    <img src="./docs/incremental_search_trains.png" />
    <br><br>
    <!-- Search results -->
    <img src="./docs/search_results.png">

4. Booking Agent can book tickets for multiple passangers on available trains.
   
    <!-- Ticket booking input view -->
    <img src="./docs/book_ticket.png">

5. View all the tickets booked, i.e., canceled, confirmed, so far under the `My Tickets` section on the `Profile` page.
    
    <!-- Ticket booking input view -->
    <img src="./docs/my_tickets.png">


6. Cancel confirmed tickets. This operation releases the seat for other passengers for booking while the train's booking status is "Active". The refund of the cancelation of tickets will be resolved every day during maintainance hours, this reegular update reduces the storage overhead, by releasing the details of refunds.
   
    <!-- cancel ticket view on profile -->
    <img src="./docs/cancel_booked_ticket.png">
    <br><br>
    <!-- refund on ticket view on profile -->
    <img src="./docs/cancel_ticket_refund.png">


## API Endpoints Overview

`POST user/profile` → Gives back information of the user; Only the authenticated user can see his data

`GET trains/list` → shows a list of all available trains; Public View

`GET trains/info/:id` → shows train information, and all bookings available; Public View [TO UPDATE]

`GET /trains/current/active` → Shows all trains which are active booking phase; Public View

`GET /cities/all` → Returns a list of all cities which are either source or destination; Public View.

`POST tickets/book` → Allows user to book a ticket; Must be authenticated

`POST tickets/cancel` → Route to cancel berths from tickets; Must be authenticated; Can cancel only his/her ticket

`GET tickets/info/:pnr` → Gives back passenger list, and other info; Must be authenticated

`GET tickets/all/` → Gives back tickets for a user; Must be authenticated

`GET /coaches/list` → See all coaches; Public View;

`GET /coaches/:id` → Coach Information; Public View

`POST admin/addbookinginstance` → Add a train for booking; Must be an admin

`POST admin/trains/add` → Add a new train; Must be an admin

`POST admin/coaches/add` → Add a coach; Must be an admin;

`GET chart/:train_number/:date` → See the reservation chart; Public View

## Google Cloud Deployment

1. Build the frontend. Ensure that `.env` is updated with the correct server URL.  
```bash
npm run build
```
2. Run the following command to build the server code.
```bash
npm run watch
```
3. Now copy the `build/` directory from `frontend/` to `server/`.
```bash
cp frontend/build/ server/build/ 
```
4. Add `app.yaml` inside `server/` with the following content. Replace `[DATA]` with correct value.
```yaml
runtime: nodejs12
instance_class: [DATA]

env_variables:
  PG_USERNAME : [DATA]
  PG_HOST : [DATA]
  PG_DATABASE : [DATA]
  PG_PASSWORD : [DATA]
  PG_PORT : [DATA]

  JWT_SECRET : [DATA]
  JWT_REFRESH_SECRET : [DATA]
  SESSION_SECRET : [DATA]
  CLIENT_URL : [DATA]
  NODE_ENV: production

automatic_scaling:
  max_instances: [DATA]


handlers:
  - url: /api/.*
    secure: always
    script: auto
  # Serve all static files with url ending with a file extension
  - url: /(.*\..+)$
    secure: always
    static_files: build/\1
    upload: build/(.*\..+)$
  # Catch all handler to index.html
  - url: /.*
    secure: always
    static_files: build/index.html
    upload: build/index.html

```
5. Now add `.gcloudignore` file inside `server/` and add the following content.
```
node_modules/
src/
.env
.prettierrc.json
.prettierignore
tsconfig.json
```
6. Deploy the project to app engine.
```bash
gcloud app deploy
```