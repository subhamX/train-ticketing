export interface UserSchema {
    username: string
    email: string
    first_name: string
    last_name: string
    password: string
    is_admin: boolean
    current_token: string
}

export interface Passenger {
    passenger_age: Number;
    passenger_name: String;
    passenger_gender: String;
    seat_number: Number;
    coach_id: String;
    seat_preference: String;
}

export interface TicketInstance {
    ticket_fare: number;
    journey_date: Date;
    train_number: String;
    transaction_number: String;
    type: String;
    passengers: Passenger[];
    booking_type: Number;
}

export interface transactionVerdict {
    verdict: "SUCCESS" | "INVALID_TRANSACTION" | "PENDING";
    message?: string;
}

