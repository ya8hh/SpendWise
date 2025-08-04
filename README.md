SpendWise 🧾
Expense tracker built with Expo + React Native. Allows users to sign up/sign in via Firebase Auth, manage multiple wallets, track income & expenses, and visualize spending trends using react-native-gifted-charts.

'Screen Shot':
## 📸 Screenshots

### App Splash
<img width="300"  alt="IMG_5388" src="https://github.com/user-attachments/assets/99e308ce-2bef-4f2b-bdd3-a2e3e7b5f197" />






### Authentication & Onboarding
| Login Screen | Sign Up Screen |
|--------------|----------------|
|  <img src="https://github.com/user-attachments/assets/f1dca64d-432d-4142-a3b2-d2f7cd295967" alt="Wallet Details" width="300" /> |<img width="300"  alt="IMG_5425"  alt="IMG_5390" src="https://github.com/user-attachments/assets/718ebed5-1945-43d1-a797-7aa6348cb5d2" /> |

---

### Wallet Management
| Wallet  |  Update Wallet  |
|---------------|----------------|
| <img width="300"  alt="IMG_5412" src="https://github.com/user-attachments/assets/2e933605-f645-4e7c-9472-73e70bc56156" />  | <img width="300"  alt="IMG_5415" src="https://github.com/user-attachments/assets/53d8b4a5-7243-4179-9e28-a572d53b8941" />  |

---

### Adding Transactions
| Search |  |
|------------|-------------|
| <img width="300"  alt="IMG_5477" src="https://github.com/user-attachments/assets/85d97760-b1e5-43d4-934a-5aa45faf3c39" /> |  |

---

### Dashboard & Charts
|  Stats | Transaction |
|--------------|-------------------|
| <img width="300"  alt="IMG_5476" src="https://github.com/user-attachments/assets/74a69c32-5ef6-444e-a450-db245a710f16" />| <img width="300"  alt="IMG_5424" src="https://github.com/user-attachments/assets/d059811a-377e-44a8-9c50-cd591742ed4d" /> |

---

### More Screens
| Profile | Update Profile  |
|------------------|--------------------|
| <img width="300"  alt="IMG_5394" src="https://github.com/user-attachments/assets/89b02739-4702-4eb3-817b-72a9540ccc0c" /> | <img width="300" alt="IMG_5413" src="https://github.com/user-attachments/assets/a9030e2a-dd44-491c-b6eb-8433c1ba01df" /> |


🚀 Features
Secure Authentication: Firebase Email/Password sign-up, login, and session management

Wallet Management: Create and switch between multiple wallets to track finances separately

Transaction Flow: Add income and expense entries with categories, notes, and dates

Dashboard Charts: Weekly stats shown via BarChart from react-native-gifted-charts

Modals & UX: Custom modal screens for adding/picking wallets, creating transactions

Firebase Cloud Firestore: Real-time storage and synchronization of transaction data
| Layer          | Technology                         |
| -------------- | ---------------------------------- |
| Frontend       | Expo, React Native, TypeScript     |
| Charts         | react-native-gifted-charts         |
| Authentication | Firebase Authentication            |
| Database       | Cloud Firestore (Firebase)         |
| Design         | Styled Components + custom theming |
| UI Components  | Modals, scrollable lists, charts   |



🧾 Usage & Workflow
Authentication

Sign up / log in with email & password using Firebase Auth

Secure handling and persistence of user sessions

Manage Wallets

Create, rename, or delete wallets via a modal UI

Switch between wallets to isolate transaction records

Add Transactions

Tap “Add Transaction” modal

Enter type (income/expense), amount, category, note, and date

Data is synced to Firestore in real-time

View Charts & Stats

Dashboard shows a weekly bar chart (income vs. expense)

Uses frontColor props to color income vs. expense bars clearly

 Testing & Debugging
Ensure correct rendering of chartData: every object needs value, label, and frontColor

Use console.log(chartData) to check data shape before passing to <BarChart />

Validate color props: colors.primary and colors.rose should be valid CSS color strings

