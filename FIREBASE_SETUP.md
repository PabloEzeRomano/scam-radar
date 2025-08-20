# Firebase Setup Guide

## Migration from Supabase to Firebase

This project has been migrated from Supabase (PostgreSQL + Drizzle ORM) to Firebase (Firestore).

## Required Environment Variables

Create a `.env.local` file in your project root with the following Firebase configuration:

```bash
# Firebase Configuration
# Get these values from your Firebase project console
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Firestore Database
4. Go to Project Settings > General
5. Scroll down to "Your apps" section
6. Click the web icon (</>) to add a web app
7. Copy the configuration values to your `.env.local` file

## Firestore Security Rules

Set up basic security rules in your Firestore console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to reports
    match /reports/{document} {
      allow read: if true;
      allow write: if true; // You may want to restrict this based on your needs
    }

    // Allow read/write access to users
    match /users/{document} {
      allow read, write: if true; // You may want to restrict this based on your needs
    }
  }
}
```

## Data Structure

The data structure remains the same, but now uses Firestore collections instead of PostgreSQL tables:

- **users** collection: Stores user information
- **reports** collection: Stores scam reports

## Changes Made

- ✅ Removed Drizzle ORM and PostgreSQL dependencies
- ✅ Removed Supabase client and server files
- ✅ Added Firebase SDK
- ✅ Created Firebase configuration and services
- ✅ Updated API routes to use Firebase
- ✅ Maintained the same data models and API structure

## Installation

After setting up your environment variables, install the dependencies:

```bash
yarn install
```

## Development

Start the development server:

```bash
yarn dev
```

The application will now use Firebase instead of Supabase for all data operations.
