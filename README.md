# Smoothify

## The basis for the code is through React Native using the Expo simulator: [Create Expo app page](https://docs.expo.dev/tutorial/create-your-first-app/)

## Note: This app works for iOS, but remains untested for Android

### Frontend: (React Native: Javascript, Typescript)
- The screen layout is defined at its base through ./_layout.tsx
- The app utilizes tab navigation, which is defined in ./(tabs)/_layout.tsx
- With the current construction, any file in (tabs) would create a new tab
  - These contain the majority of the visual features associated with each of the individual pages
  #### Smoothify Example:
  - (tabs) contains index.tsx, generate.tsx, and profile.tsx in addition to the layout file
  - index.tsx is the default page
  - The subpages are handled using states in the individual pages
  - Within generate.tsx and profile.tsx
    - Google Cloud Platform APIs for GET, POST, and DELETE operations
    - Open AI API call (generate only)
    - Apple Authentication call (profile only)

### Backend: (Google Cloud Platform: Golang)
- Using a Cloud Run function for each database operation
