# React Restaurant Vehicle Parking Console 

## Problem Statement

Modern restaurants often encounter difficulties in efficiently managing limited parking space. As a result, customers may struggle to find available parking, and staff do not have a centralized system to track vehicle entries, exits, or slot utilization. There is a clear need for a lightweight, efficient, and offline-capable system that can achieve the following goals: 
 1. Enable customers to book parking slots in real time.
 2. Allow restaurant staff to monitor and manage parking activity.
 3. Store all data locally for reliability, even without internet access.
This project aims to address these challenges by developing a React-based Parking Management Console specifically designed for restaurants. The application will handle vehicle entries, exits, bookings, and history using IndexedDB to ensure offline-first support, while offering a simple admin interface for complete control and transparency.

## Approach and Design Choices
### Role-Based Access Control

The application features three distinct user roles, each with dedicated permissions and access to specific features:
#### User

Can log in and book one active parking slot at a time.
Can view their own booking history and active booking.
Cannot access or view other users' data.
#### Staff

Can view all parking slot statuses.
Can manage slots by marking them as occupied, or available.
#### Admin

Has full control over the system.
Can add staff users and manage user access.
Can view and audit all parking slot details, logs, booking records, and vehicle history.
Functions as the primary operator of the system console.
### Architecture and Technologies Used

 1. React It allows you to build UI components that update efficiently and handle user interactions.
 2. IndexedDB via Dexie.js: Used to store all parking data locally in the browser, enabling offline support and persistence.
 3. Tailwind CSS: For fast, responsive, and consistent styling across all components.
 4. React Router DOM: Enables navigation and protected routes based on user roles.
 5. Progressive Web App (PWA) support: Allows the app to be installable and usable offline, ideal for restaurants with limited or unstable internet connectivity.
### Core Functionalities and Behaviors

 1. One-slot per user: Prevents double-booking and ensures fair use of parking slots.
 2. Real-time slot updates: Uses Dexie.js hooks or polling for real-time visual feedback of parking status.
 3. Protective routing: Role-specific routes prevent unauthorized access to modules.
 4. Timestamped logging: All entries and exits are logged with accurate timestamps for future auditing.
 5. Admin console: Centralized dashboard for oversight and control.

### Installation

#### Clone the Repository

git clone https://github.com/KolaganiNavya-egov/Parking_Booking.git
cd Parking_Booking

#### Install Dependencies

npm install

#### Run the Application

`npm start`
