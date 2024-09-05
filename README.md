# Diary App Demo

This demo showcases a diary application using react-native-pager-view, expo-router, and react query with infinite scroll functionality and dynamic navigation. It demonstrates key features and highlights current issues looking to be resolved.

## Video demo of issues
https://www.loom.com/share/6f5877a86c464233ae9166ad37ad54e3?sid=18517d92-596d-427f-820e-151e216d0f00

## Product requirements

- **Infinite Scroll**: Swipe left or right to navigate between days.
- **Button Navigation**: Use arrow buttons to move forward or backward.
- **Direct Navigation**: Navigate to specific dates using URL parameters.
- **Efficient Data Fetching**: Loads data only for the current and adjacent pages.
- **Smooth Transitions**: Aims for fluid animations between pages.

## Current Issues

We're actively working on resolving the following issues:

1. **UI Freezing**: The interface may freeze after swiping through several pages. If this occurs, restart the app.
2. **Animation Inconsistency**: Page transition animations may stop working after navigating through multiple pages.

## Setup and Running the App

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the iOS simulator:
   ```bash
   npx expo run:ios
   ```

3. Once the app is running, navigate from the index page to the Diary page to explore the functionality.


## Implementation Details

### Navigation

- Implements infinite scroll for day-to-day navigation.
- Provides forward and backward navigation buttons.
- Supports direct navigation to specific dates using Expo Router:
  ```jsx
  router.replace(`/diary/${day}`);
  ```

### Data Fetching

- Fetches data for the current page and adjacent (previous and next) pages.
- Aims to provide an instantaneous feel while avoiding over-fetching.

### User Experience Goals

- Smooth animations and transitions between pages.
- Minimal jankiness in data display during transitions.
- Pre-loading of adjacent page data before swipe animations occur.

## Feedback and Contributions

We welcome feedback and contributions to improve this demo. Please feel free to open issues or submit pull requests with your suggestions or fixes.
