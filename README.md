# React Restaurant Vehicle Parking Console 

## Problem Statement

Modern restaurants often encounter difficulties in efficiently managing limited parking space. As a result, customers may struggle to find available parking, and staff do not have a centralized system to track vehicle entries, exits, or slot utilization. There is a clear need for a lightweight, efficient, and offline-capable system that can achieve the following goals: 
 1. Enable customers to book parking slots in real time 
 2. Allow restaurant staff to monitor and manage parking activity 
 3. Store all data locally for reliability, even without internet access 
This project aims to address these challenges by developing a React-based Parking Management Console specifically designed for restaurants. The application will handle vehicle entries, exits, bookings, and history using IndexedDB to ensure offline-first support, while offering a simple admin interface for complete control and transparency.

## Approach and Design Choices
### Role-Based Access Control
The application features three distinct user roles, each with dedicated permissions and access to specific features:
#### User
o	Can log in and book one active parking slot at a time.
o	Can view their own booking history and active booking.
o	Cannot access or view other users' data.
#### Staff
o	Can view all parking slot statuses.
o	Can manage slots by marking them as occupied, or available.
#### Admin
o	Has full control over the system.
o	Can add staff users and manage user access.
o	Can view and audit all parking slot details, logs, booking records, and vehicle history.
o	Functions as the primary operator of the system console.
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


In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
