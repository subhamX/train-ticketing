import React from "react";
import Head from "../Head/head.component";
import "./About.component.css";


const About = () => {
  return (
    <div className='about-wrapper'>
      <Head />
      {/* content from http://github.com/subhamX/train-ticketing/blob/master/README.md */}
      {/* <script src="https://gist-it.appspot.com/https://github.com/subhamX/train-ticketing/blob/master/README.md"></script>
       */}

      <main>
        <article
          id="5bd36af2-ae2b-4ad0-b5c0-23fc7a37eeed"
          className="page sans"
        >
          <header>
            <h1 className="page-title">Train Ticketing</h1>
          </header>
          <div className="page-body">
            <p id="9a02d194-9be7-4254-9f56-f03651423481">
              The following website is a Railway Ticket Booking Portal. This
              project embraces the Client-Server architecture, where the server
              and database are hosted separately and the client communicates via
              REST APIs.
            </p>
            <p id="25206ca2-a48e-480c-b502-a5096054709a">
              The latest version of the{" "}
              <strong>Railway Reservation System</strong> is deployed at{" "}
              <a href="https://traintkt.herokuapp.com/">
                <strong>traintkt.herokuapp.com</strong>
              </a>
              <strong>,</strong> and the source code can be explored{" "}
              <a href="https://github.com/subhamX/train-ticketing/">here</a>.
            </p>
            <h2 id="c7736d65-0b63-4b73-80b9-0c4383483ccd">
              Project Design Overview
            </h2>
            <figure id="1095e9a7-e18f-4e89-81a7-04d37861149b" className="image">
              <a href="Railways%201095e9a7e18f4e8981a704d37861149b/Untitled.png">
                <img
                  style={{ width: "6654px" }}
                  src="/Railways%201095e9a7e18f4e8981a704d37861149b/Untitled.png"
                />
              </a>
            </figure>
            <h2 id="d53100b7-5fa3-4553-925d-90d9ae860292">ER Diagram</h2>
            <figure id="350b368e-b9e4-4999-ba9b-3f3cb02e2d25" className="image">
              <a href="Railways%201095e9a7e18f4e8981a704d37861149b/Untitled%201.png">
                <img
                  style={{ width: "1476px" }}
                  src="/Railways%201095e9a7e18f4e8981a704d37861149b/Untitled%201.png"
                />
              </a>
            </figure>
            <p id="1269ada6-a750-49fc-9171-5c7d9c10cea2">
              <em>
                Note: All blue and bolded attributes are primary key. All
                attributes with ? is indicating that the field can be NULL.
                Relations having [X] are dynamically created where X is some
                variable.
              </em>
            </p>
            <hr id="0a97ef00-747b-400a-a028-aa4aad0be71c" />
            <p id="4b117e7d-0ca4-4a9a-916b-9314f76b3c3c"></p>
            <h2 id="7a9b1a58-2c08-4128-853e-a91f4c27a7b9">Key Features</h2>
            <ol
              id="104eaef2-34b4-4d8e-966e-2dbc99bdb139"
              className="numbered-list"
              start={1}
            >
              <li>
                The project uses dynamic SQL techniques, procedures, triggers,
                for consistency, and faster query execution.
              </li>
            </ol>
            <ol
              id="f1f72de0-3cd4-4187-85eb-6d354291d7db"
              className="numbered-list"
              start={2}
            >
              <li>
                Client can browse though the trains catalogue, their details and
                all active booking instances of it.
              </li>
            </ol>
            <ol
              id="34f7a957-2648-48fd-91ba-32586dd775bc"
              className="numbered-list"
              start={3}
            >
              <li>
                The project implements an easy to use trains search view with
                autosuggestions for train stations. Client can enter source,
                destination and date of journey and find if there are any trains
                available for following parameters.
              </li>
            </ol>
            <ol
              id="73313e05-0200-4c17-88ea-399fc571dbaf"
              className="numbered-list"
              start={4}
            >
              <li>
                Both booking tickets and cancel tickets operation can be
                performed on multiple passengers at once.
              </li>
            </ol>
            <ol
              id="ba75de27-1c27-49b0-8741-1dd932993499"
              className="numbered-list"
              start={5}
            >
              <li>
                Admin can add trains, coaches, and booking instances from the
                user interface and need not write any SQL query.
              </li>
            </ol>
            <ol
              id="7084c61c-4bae-495d-a1bd-68f0d582d1a6"
              className="numbered-list"
              start={6}
            >
              <li>
                Our portal supports multiple coaches, and the Admin can define
                which coach schema to choose at the time of adding a booking
                instance.
              </li>
            </ol>
            <h2 id="9e36b741-1c01-4b0f-ad02-da87cc7a189d">Technology Stack</h2>
            <ol
              id="15ab3498-6397-41df-b2af-b26c220331ff"
              className="numbered-list"
              start={1}
            >
              <li>TypeScript</li>
            </ol>
            <ol
              id="0562801b-89d9-41b0-aeac-7d78a644538f"
              className="numbered-list"
              start={2}
            >
              <li>ReactJS (Frontend)</li>
            </ol>
            <ol
              id="c5e6bca9-a074-49e6-89df-178003bf122d"
              className="numbered-list"
              start={3}
            >
              <li>NodeJS (Backend)</li>
            </ol>
            <ol
              id="14744b02-904d-4541-af5e-5152cfa594e4"
              className="numbered-list"
              start={4}
            >
              <li>PostgreSQL (Database)</li>
            </ol>
            <h2 id="6cc215d8-f692-404b-9ffa-8910d8420ce8">
              Functionalities Of Our Project
            </h2>
            <p id="8889ede3-65d7-4f1c-8486-424cae6ee104">
              Use cases have been divided based on the end user i.e.&nbsp;Admin
              and Booking Agents.
            </p>
            <h3 id="a720a2f6-3d51-4c2c-a6eb-2d5e8d7db0d9">
              Functionalites for Admin
            </h3>
            <ol
              id="edd0272b-3337-426f-84f4-d500b3567988"
              className="numbered-list"
              start={1}
            >
              <li>
                Separate Authentication for Admin, and a dedicated admin
                dashboard.
              </li>
            </ol>
            <ol
              id="06dce9d5-865f-4e93-ae3b-7ce2c9e1f178"
              className="numbered-list"
              start={2}
            >
              <li>
                Admin can add new <code>Trains</code>, <code>Coaches</code> with
                different seating schemas into the database for the dashboard.
              </li>
            </ol>
            <ol
              id="2c055944-e34d-4c89-bbe7-327edd809ead"
              className="numbered-list"
              start={3}
            >
              <li>
                Add and update <code>Reservation status</code> for trains.
              </li>
            </ol>
            <ol
              id="971e9091-13aa-4e3c-bd60-e584758771c1"
              className="numbered-list"
              start={4}
            >
              <li>
                Admin can perform the above operations without writing any
                database query by using our
                <strong>simple and convenient User Interface</strong>.
              </li>
            </ol>
            <h3 id="873613ea-3a27-449f-b61f-2953228aac1f">Demo</h3>
            <figure id="293de5e2-c413-4374-ac4d-40fb3769a3e2" className="image">
              <a href="Railways%201095e9a7e18f4e8981a704d37861149b/Untitled%202.png">
                <img
                  style={{ width: "1920px" }}
                  src="/Railways%201095e9a7e18f4e8981a704d37861149b/Untitled%202.png"
                />
              </a>
            </figure>
            <p id="a41363a9-a201-4527-a9b2-0a000dad141f">
              Trains Search Route can help users quickly find the available
              trains based on starting location, ending location, and the
              journey date. To ease searching for a specific station,{" "}
              <strong>
                we autocomplete the source and destination fields based on the
                keywords
              </strong>{" "}
              entered by users with the possible stations.
            </p>
            <figure id="1cfb5d1c-401f-4752-9e13-03de5da116f2" className="image">
              <a href="Railways%201095e9a7e18f4e8981a704d37861149b/Untitled%203.png">
                <img
                  style={{ width: "1920px" }}
                  src="/Railways%201095e9a7e18f4e8981a704d37861149b/Untitled%203.png"
                />
              </a>
            </figure>
            <p id="541144ae-8d96-481a-96f9-7579528b4044"></p>
            <figure id="abc7b391-0979-431e-8b07-09813446af50" className="image">
              <a href="Railways%201095e9a7e18f4e8981a704d37861149b/Untitled%204.png">
                <img
                  style={{ width: "1920px" }}
                  src="/Railways%201095e9a7e18f4e8981a704d37861149b/Untitled%204.png"
                />
              </a>
            </figure>
            <p id="9e7c4ee3-916d-4e19-978b-3fa1afc889a0">
              Tickets Booking View
            </p>
            <figure id="09944252-221c-4d4e-84d1-fdd0d0ee542f" className="image">
              <a href="Railways%201095e9a7e18f4e8981a704d37861149b/Untitled%205.png">
                <img
                  style={{ width: "1920px" }}
                  src="/Railways%201095e9a7e18f4e8981a704d37861149b/Untitled%205.png"
                />
              </a>
            </figure>
            <p id="63c50a84-cae0-4ab2-b029-28beb7aa3e08">
              User Profile Dashboard showing all past tickets
            </p>
            <figure id="daa08d1a-9b4e-4ee3-a9cc-ef30d04749fc" className="image">
              <a href="Railways%201095e9a7e18f4e8981a704d37861149b/Untitled%206.png">
                <img
                  style={{ width: "1920px" }}
                  src="/Railways%201095e9a7e18f4e8981a704d37861149b/Untitled%206.png"
                />
              </a>
            </figure>
            <p id="91615edd-fb79-4b8b-86cf-b4ae0d71a6f9">
              Users can cancel the confirmed tickets before the train departure.
              This operation releases the seat for other passengers for booking
              while the train’s booking status is “Active”. The refund of the
              cancellation of tickets will be resolved every day during
              maintenance hours, this regular update reduces the storage
              overhead, by releasing the details of refunds.{" "}
            </p>
            <figure id="a7e61d61-8278-4e56-ba9b-b6e2b353c387" className="image">
              <a href="Railways%201095e9a7e18f4e8981a704d37861149b/Untitled%207.png">
                <img
                  style={{ width: "1920px" }}
                  src="/Railways%201095e9a7e18f4e8981a704d37861149b/Untitled%207.png"
                />
              </a>
            </figure>
            <p id="3c8fb225-5592-40ef-9d96-88bd1f41acbc"></p>
            <figure id="89d50a0c-7a9f-4e6c-bb24-32981b8b35dd" className="image">
              <a href="Railways%201095e9a7e18f4e8981a704d37861149b/Untitled%208.png">
                <img
                  style={{ width: "1920px" }}
                  src="/Railways%201095e9a7e18f4e8981a704d37861149b/Untitled%208.png"
                />
              </a>
            </figure>
            <h2 id="58902cce-0aa7-4f5d-ad8b-771f5f61761b">
              API Endpoints Overview
            </h2>
            <p id="b05127ab-11c6-4c66-91ea-c89366fb2fc4">
              <code>POST user/profile</code> → Gives back information of the
              user; Only the authenticated user can see his data
            </p>
            <p id="64910f3a-cb0e-4ea4-99d7-4549118278e9">
              <code>GET trains/list</code> → shows a list of all available
              trains; Public View
            </p>
            <p id="d8559783-5fc4-479b-92ac-67d10e77b4c1">
              <code>GET trains/info/:id</code> → shows train information, and
              all bookings available; Public View
            </p>
            <p id="30d3bd7c-495b-40e3-ac8b-0ab738a84948">
              <code>GET /trains/current/active</code> → Shows all trains which
              are active booking phase; Public View
            </p>
            <p id="fd834ca4-2ab7-4109-99de-a68c3f9df92a">
              <code>GET /cities/all</code> → Returns a list of all cities which
              are either source or destination; Public View.
            </p>
            <p id="828d021b-90c8-4b19-a180-05623660fb8b">
              <code>POST tickets/book</code> → Allows user to book a ticket;
              Must be authenticated
            </p>
            <p id="b6bb4806-94e8-40d1-a9a5-8601f731c85f">
              <code>POST tickets/cancel</code> → Route to cancel berths from
              tickets; Must be authenticated; Can cancel only his/her ticket
            </p>
            <p id="c0f74037-fc90-4ffa-aeb0-38c0aaa12eae">
              <code>GET tickets/info/:pnr</code> → Gives back passenger list,
              and other info; Must be authenticated
            </p>
            <p id="d7108363-90ee-4e10-9284-96711b4575a0">
              <code>GET tickets/all/</code> → Gives back tickets for a user;
              Must be authenticated
            </p>
            <p id="71ed9bce-96d4-4e37-a9c8-905da0033b71">
              <code>GET /coaches/list</code> → See all coaches; Public View;
            </p>
            <p id="8d8202af-dd00-4480-ba71-506d5322ad98">
              <code>GET /coaches/:id</code> → Coach Information; Public View
            </p>
            <p id="1f6db473-341f-4e0e-9b96-f7e5f3955f86">
              <code>POST admin/addbookinginstance</code> → Add a train for
              booking; Must be an admin
            </p>
            <p id="c39872cb-0911-4993-8f1b-f50652cb9b11">
              <code>POST admin/trains/add</code> → Add a new train; Must be an
              admin
            </p>
            <p id="5d7bfea2-35eb-41b6-8a1c-4d843f886115">
              <code>POST admin/coaches/add</code> → Add a coach; Must be an
              admin;
            </p>
            <p id="12fb7b5e-8a2a-4ccf-a74f-099d1b2118aa">
              <code>GET chart/:train_number/:date</code> → See the reservation
              chart; Public View
            </p>
          </div>
        </article>
      </main>
    </div>
  );
};

export default About;
