# Templeman Scripture

A Bible memorization application built with React Native following zero-slop principles for production-ready code.

## Features

- **User Authentication**: Secure login and registration system
- **YouVersion API Integration**: Access to thousands of Bible translations
- **Memorization Engine**: Spaced repetition system (SM-2 algorithm) for effective learning
- **Verse Selection**: Browse and search Bible verses easily
- **Progress Tracking**: Monitor your memorization progress
- **Gamification**: Achievement system to motivate continuous learning

## Requirements

This application satisfies the requirements specified in the Templeman Requirements Specification document, including:

- User Authentication and Profiles (Section 1.1)
- Bible Content and YouVersion Integration (Section 1.2)
- Memorization Engine (Section 1.3)
- Game Modes (Section 1.4)
- Gamification and Achievements (Section 1.5)

## Development Principles

This application follows the **Zero-Slop System Prompt** guidelines to ensure:

1. **No Silent Fallbacks**: Every API call, error, and state change is properly handled
2. **No Dud Buttons**: Every interactive element performs a meaningful action
3. **Complete Forms**: All forms submit to real endpoints with proper validation
4. **Real Data**: Uses actual YouVersion API integration for authentic content
5. **Complete State Management**: Handles loading, error, empty, and success states
6. **Proper Error Handling**: All errors are caught, logged, and presented to users
7. **Production Ready**: Code follows best practices for deployment

## Installation

```bash
npm install
```

## Running the Application

```bash
npx react-native start
```

Then in another terminal:

```bash
npx react-native run-android
# or
npx react-native run-ios
```

## Architecture

- **Components**: Reusable UI elements
- **Screens**: Main application views
- **Services**: Business logic and API integrations
- **Types**: TypeScript interfaces and types
- **Utils**: Helper functions

## Technologies Used

- React Native
- TypeScript
- YouVersion Bible API
- React Navigation
- AsyncStorage for local data persistence

## Zero-Slop Compliance

Every component and service in this application adheres to the 47 Laws of Zero-Slop Code:

1. No empty catch blocks
2. No silent fetch failures
3. Complete state handling (loading, error, success)
4. No swallowed promise rejections
5. No fallback to empty defaults
6. Proper form submission with validation
7. Real search functionality
8. And 40 more laws ensuring production-quality code

The application avoids common AI coding agent defects such as:
- Placeholder implementations
- Commented-out code blocks
- Incomplete features
- Silent failures
- Dead navigation links

## Contributing

Follow the zero-slop principles when contributing to maintain code quality.