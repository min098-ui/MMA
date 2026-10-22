# BookShelf - Practical Exam MMA301 (FALL 2026)

Mobile application built with **React Native (Expo)**, **React Context**, and **Firebase (Authentication & Cloud Firestore)**.

---

## 1. Quick Setup & Run

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your Firebase credentials in `.env`:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Step 3: Start the App
```bash
npx expo start
```
- Press `w` to open in web browser.
- Or scan QR code with Expo Go on your mobile device (Android / iOS).

---

## 2. Firebase Setup Checklist

1. **Authentication**:
   - Go to Firebase Console -> **Authentication** -> **Sign-in method**.
   - Enable **Email/Password**.
   - Under **Users**, create the test account for the grader:
     - Email: `grader.<StudentCode>@example.com` (e.g. `grader.qe200012@example.com`)
     - Password: `Test1234!`

2. **Cloud Firestore**:
   - Go to Firebase Console -> **Firestore Database** -> Create database.
   - Go to **Rules** tab, paste the contents of `firestore.rules` and click **Publish**.
   - Under **Data** tab, verify the `books` collection is created when adding books.

---

## 3. Project Structure

```
c:\MMA301\
├── .env.example            # Environment variables template
├── .gitignore              # Ignores node_modules, .expo, .env
├── firestore.rules         # Security Rules enforcing types, lengths & permissions
├── App.js                  # Root app with Auth & Book providers and routing
├── src/
│   ├── config/
│   │   └── firebase.js     # Firebase SDK initialization with AsyncStorage persistence
│   ├── context/
│   │   ├── AuthContext.js  # Auth state, login, register, logout
│   │   └── BookContext.js  # Real-time Firestore sync, sorting, duplicate prevention, CRUD
│   ├── screens/
│   │   ├── HomeScreen.js   # Public screen: home-title, 3 feature cards, Login/Register buttons
│   │   ├── LoginScreen.js  # Email/password form, validation, error-auth
│   │   ├── RegisterScreen.js # Registration form, validation, form-success, error-auth
│   │   ├── ListScreen.js   # Protected screen: list-screen, book-form, book-item, books-empty, book-count, favorite-count, filters, search, summary
│   │   └── DetailScreen.js # Full details, edit mode with validation, delete confirmation, favorite toggle
│   ├── components/
│   │   └── Header.js       # Reusable header showing user email & Logout when logged in
│   └── styles/
│       └── theme.js        # Harmonious color palette, typography & spacing tokens
```

---

## 4. Required testID & Exact Text Verification

- `home-title`: Text `BookShelf`
- `form-success`: Text `Registration successful`
- `error-auth`: Shows Firebase authentication error message
- `list-screen`: Applied to List screen container when logged in
- `book-form`: Applied to the Add Book form container
- `book-success`: Text `Book added`
- `error-book`: Shows Firestore / duplicate error message
- `book-item`: Applied to each book row
- `books-empty`: Text `No books found`
- `book-count`: Plain integer showing count of currently displayed books
- `favorite-count`: Plain integer showing count of favorited books currently displayed

---

## 5. Submission Helper

To prepare `<StudentCode>.zip` (ensuring no `node_modules`, `.expo`, `.git`, or real `.env` are included):

In PowerShell:
```powershell
# Replace QE200012 with your real student code
$studentCode = "QE200012"

Get-ChildItem -Path . -Exclude "node_modules", ".expo", ".git", ".env", "$studentCode.zip", "dist" | 
  Compress-Archive -DestinationPath "$studentCode.zip" -Force
```
