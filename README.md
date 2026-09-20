# SmartResolve

SmartResolve is a full-stack complaint management system designed to help organizations create, assign, track, resolve, and monitor complaints through role-based workflows.

The system provides separate workflows for Users, Support Staff, Supervisors, and Administrators, with JWT authentication, Google OAuth2, complaint assignment, status tracking, SLA monitoring, comments, notifications, and administrative management.

---

## 🚀 Features

### Authentication
- User registration and login
- JWT-based authentication
- Google OAuth2 login
- Protected routes
- Role-based authorization
- Current-user profile endpoint

### Complaint Management
- Create complaints
- View personal complaints
- View all complaints for authorized roles
- Complaint categories
- Complaint priorities
- Complaint status tracking
- Complaint assignment to support staff
- Complaint comments
- Complaint details
- SLA deadline tracking
- SLA breach detection
- Status history

### Role-Based Workflow

#### USER
- Create complaints
- View own complaints
- Track complaint status
- View assigned support staff
- Add comments
- Receive notifications

#### SUPPORT
- View assigned complaints
- Update complaint status
- Add comments
- Track SLA status

#### SUPERVISOR
- View all complaints
- Monitor complaint statistics
- Assign complaints to support staff
- Monitor SLA performance
- View support users

#### ADMIN
- View overall system dashboard
- Manage users
- Change user roles
- View all complaints
- Assign support staff
- Monitor system statistics
- Monitor SLA breaches
- Manage administrative operations

---

## 🏗️ Project Architecture

```text
SmartResolve/
│
├── SmartResolve/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── smartresolve/
│   │   │   │           └── backend/
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── application-local.properties
│   │   │
│   │   └── test/
│   │
│   ├── pom.xml
│   └── ...
│
├── smartresolve-frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── styles/
│   │   └── utils/
│   │
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
