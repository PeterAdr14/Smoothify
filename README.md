# Smoothify

## The basis for the code is through React Native using the Expo simulator: [Create Expo app page](https://docs.expo.dev/tutorial/create-your-first-app/)

## Note: This app works for iOS, but remains untested for Android

### Frontend: (React Native: Javascript, Typescript)
- The screen layout is defined at its base through ./_layout.tsx
- The app utilizes tab navigation, which is defined in ./(tabs)/_layout.tsx
- With the current construction, any file in (tabs) would create a new tab
  - These contain the majority of the visual features associated with each of the individual pages
  - (tabs) contains index.tsx, generate.tsx, and profile.tsx in addition to the layout file
  - index.tsx is the default page
  - The subpages are handled using states in the individual pages
  - Reoccurring custom components are kept in the components folder
  - Within generate.tsx and profile.tsx
    - Google Cloud Platform APIs for GET, POST, and DELETE operations
    - Open AI API call (generate only)
    - Apple Authentication call (profile only)

### Backend: (Google Cloud Platform: Golang)
- Using a single Cloud Run function for each database operation
- config
  - Establishes the database connection from .env login information
- controllers
  - The database operations themselves
  - Each operation checks that the user exists before the operation
    - Get (get all of the user's recipes)
    - Health (check the database connectivity)
    - Create_Recipe (posts a new recipe in the database)
    - Create_User (posts a new user in the database)
    - Delete (deletes a recipe from the database)
- main.go
  - This file is what is executed
- modules
  - This outlines the objects containing the columns for the information taken from the database
- router
  - This sets the routes for each database operation 
