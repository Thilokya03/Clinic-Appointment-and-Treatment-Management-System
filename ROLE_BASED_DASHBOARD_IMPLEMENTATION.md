# Role-Based Dashboard Implementation Guide

## Overview
This document describes the comprehensive role-based authentication and dashboard system implemented for the Clinic Appointment and Treatment Management System (CATMS).

## Architecture

### Authentication System
- **AuthContext**: Centralized authentication state management
- **ProtectedRoute**: Component for guarding routes based on authentication and roles
- **RoleDashboard**: Router that conditionally renders dashboards based on user role

### User Roles
1. **Administrator** (`admin`)
2. **Branch Manager** (`branch_manager`)
3. **Doctor** (`doctor`)
4. **Staff** (`staff`) - Non-medical staff
5. **Patient** (`patient`)

## File Structure

```
frontend/src/
├── context/
│   └── AuthContext.jsx              # Authentication context provider
├── components/
│   └── ProtectedRoute.jsx           # Route protection component
└── pages/
    └── Dashboard/
        ├── Dashboard.css            # Comprehensive dashboard styles
        ├── RoleDashboard.jsx        # Role-based dashboard router
        ├── AdminDashboard.jsx       # Administrator dashboard
        ├── BranchManagerDashboard.jsx  # Branch Manager dashboard
        ├── DoctorDashboard.jsx      # Doctor dashboard
        ├── StaffDashboard.jsx       # Staff dashboard
        └── PatientDashboard.jsx     # Patient dashboard
```

## Dashboard Functionalities by Role

### 1. Administrator Dashboard
**Features:**
- Manage Branches
- Manage Branch Managers
- Generate Reports
- System Settings

**Stats Displayed:**
- Total Branches
- Branch Managers
- Total Doctors
- System Rating

### 2. Branch Manager Dashboard
**Features:**
- Manage Doctors
- Manage Staff
- Generate Reports
- Branch Settings

**Stats Displayed:**
- Total Doctors
- Total Staff
- Appointments
- Branch Rating

### 3. Doctor Dashboard
**Features:**
- Manage Schedule
- Patient History
- My Schedule
- Prescriptions

**Stats Displayed:**
- Today's Patients
- Pending Appointments
- Completed Consultations
- Patient Rating

**Additional Sections:**
- Today's Schedule (table with time, patient, type, status)

### 4. Staff Dashboard (Non-Medical)
**Features:**
- Add Patient
- Manage Payments
- Add Treatments
- Doctor Schedule
- Insurance Companies
- Treatment Catalogs

**Stats Displayed:**
- Total Patients
- Pending Payments
- Appointments Today
- Total Treatments

**Additional Sections:**
- Recent Tasks (quick access to recent activities)

### 5. Patient Dashboard
**Features:**
- Patient History
- Book Appointment
- Manage Payments
- Prescriptions

**Stats Displayed:**
- Upcoming Appointments
- Active Prescriptions
- Medical Records
- Completed Visits

**Additional Sections:**
- Upcoming Appointments (list)
- Recent Medical Records (list)

## Implementation Details

### AuthContext (`frontend/src/context/AuthContext.jsx`)
```javascript
// Provides authentication state and methods
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Methods: login, logout, checkAuth
}

export function useAuth() {
  return useContext(AuthContext);
}
```

**Key Features:**
- Manages authentication state (user, token, role)
- Persists auth data in localStorage
- Auto-checks authentication on mount
- Provides login/logout methods

### ProtectedRoute (`frontend/src/components/ProtectedRoute.jsx`)
```javascript
export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, role, loading } = useAuth();
  
  // Redirects to /login if not authenticated
  // Redirects to /dashboard if role not allowed
  // Shows loading state while checking auth
}
```

**Key Features:**
- Guards routes based on authentication
- Validates user role against allowed roles
- Handles loading state during auth check

### RoleDashboard (`frontend/src/pages/Dashboard/RoleDashboard.jsx`)
```javascript
export default function RoleDashboard() {
  const { role } = useAuth();
  
  switch (role) {
    case 'admin': return <AdminDashboard />;
    case 'branch_manager': return <BranchManagerDashboard />;
    case 'doctor': return <DoctorDashboard />;
    case 'staff': return <StaffDashboard />;
    case 'patient': return <PatientDashboard />;
    default: return <div>Invalid role</div>;
  }
}
```

### Dashboard Styling (`frontend/src/pages/Dashboard/Dashboard.css`)

**Key CSS Classes:**
- `.dashboard-container` - Main container
- `.dashboard-header` - Header with title and user badge
- `.user-badge` - Role badge (with role-specific variants)
- `.dashboard-stats` - Grid of stat cards
- `.stat-card` - Individual stat card with icon and value
- `.dashboard-grid` - Grid of main feature cards
- `.dashboard-card` - Individual feature card with hover effects
- `.dashboard-section` - Content sections (activity lists, tables)
- `.activity-list` - List of activities/tasks
- `.schedule-table` - Table for schedules

**Design Features:**
- Gradient backgrounds for cards and badges
- Smooth hover animations
- Responsive grid layouts
- Dark theme support
- Modern glassmorphic design

## App.jsx Updates

### AuthProvider Wrapper
```javascript
<Router>
  <AuthProvider>
    <Routes>
      {/* All routes here */}
    </Routes>
  </AuthProvider>
</Router>
```

### Protected Route Examples
```javascript
// Main dashboard - all authenticated users
<Route index element={
  <ProtectedRoute>
    <RoleDashboard />
  </ProtectedRoute>
} />

// Admin only
<Route path="branchmanagers" element={
  <ProtectedRoute allowedRoles={['admin']}>
    <BranchManagers />
  </ProtectedRoute>
} />

// Admin and Branch Manager
<Route path="staff" element={
  <ProtectedRoute allowedRoles={['admin', 'branch_manager']}>
    <Staff />
  </ProtectedRoute>
} />
```

## Login.jsx Updates

### Using AuthContext
```javascript
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  
  // On successful login
  login(data.user, data.token, role);
}
```

## Theme Support

All dashboards support light and dark themes using CSS variables:

```css
:root {
  --bg: #ffffff;
  --text: #0f172a;
  --pink-1: #2563eb;
  --pink-2: #9333ea;
  --pink-3: #f97316;
  --shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

:root[data-theme="dark"] {
  --bg: #0f172a;
  --text: #f1f5f9;
  --shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}
```

## Navigation Flow

1. User visits `/login`
2. Selects role (Patient or Staff)
3. Enters credentials
4. On successful login:
   - `login()` method stores user, token, role in localStorage
   - User redirected to `/dashboard`
5. `ProtectedRoute` checks authentication
6. `RoleDashboard` renders appropriate dashboard based on role
7. User can navigate to role-specific features
8. `ProtectedRoute` guards each route based on allowed roles

## Security Features

1. **JWT Token Authentication**: All API requests include JWT token
2. **Role-Based Access Control (RBAC)**: Routes protected by role
3. **Client-Side Route Guards**: ProtectedRoute component
4. **Persistent Sessions**: Token stored in localStorage
5. **Auto-Logout on Invalid Token**: AuthContext handles this

## Testing the Implementation

### Test as Administrator:
1. Login as admin
2. Should see: Manage Branches, Manage Branch Managers, Generate Reports, System Settings
3. Can access `/dashboard/branchmanagers`

### Test as Branch Manager:
1. Login as branch_manager
2. Should see: Manage Doctors, Manage Staff, Generate Reports, Branch Settings
3. Can access `/dashboard/staff`, `/dashboard/adddoctor`

### Test as Doctor:
1. Login as doctor
2. Should see: Manage Schedule, Patient History, My Schedule, Prescriptions
3. Can access `/dashboard/doctordashboard`, `/dashboard/doctorchange`

### Test as Staff:
1. Login as staff
2. Should see: Add Patient, Manage Payments, Add Treatments, Doctor Schedule, Insurance Companies, Treatment Catalogs

### Test as Patient:
1. Login as patient
2. Should see: Patient History, Book Appointment, Manage Payments, Prescriptions

## Next Steps

### Backend Integration:
1. Connect dashboard cards to actual API endpoints
2. Fetch real stats from backend
3. Implement actual navigation to feature pages

### Feature Pages:
1. Create pages for each dashboard card (e.g., `/dashboard/manage-branches`)
2. Implement CRUD operations
3. Add form validation and error handling

### Enhanced Security:
1. Implement token refresh mechanism
2. Add server-side role validation
3. Add audit logging

### UI Enhancements:
1. Add loading skeletons for data fetching
2. Implement real-time updates with WebSockets
3. Add notifications system
4. Implement search and filtering

## Troubleshooting

### Issue: "Cannot read property 'role' of null"
**Solution**: Make sure AuthProvider wraps all routes in App.jsx

### Issue: Redirected to login after successful authentication
**Solution**: Check if token is being stored correctly in localStorage

### Issue: Dashboard shows "Invalid role"
**Solution**: Verify role value matches one of: admin, branch_manager, doctor, staff, patient

### Issue: Protected route not working
**Solution**: Check allowedRoles array matches the user's role exactly

## Conclusion

This implementation provides a complete role-based authentication and dashboard system with:
- ✅ Centralized authentication management
- ✅ Role-based route protection
- ✅ Five distinct role dashboards
- ✅ Modern, responsive UI with theme support
- ✅ Secure token-based authentication
- ✅ Scalable architecture for future features

All dashboard components follow a consistent pattern making it easy to maintain and extend the system.
