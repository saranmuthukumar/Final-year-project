# UML Diagrams for Alumni Platform

Here are the Use Case and Sequence diagrams based on the features of your Alumni-Student platform.

## Use Case Diagram

```mermaid
graph LR
    %% Actors
    subgraph Actors
        S((Student))
        A((Alumni))
        Ad((Admin))
    end
    
    %% Use Cases
    subgraph Alumni Platform System
        UC1([Authentication & Onboarding])
        UC2([Profile Management])
        UC3([Directory Search & Networking])
        UC4([Messaging System])
        UC5([Job & Internship Portal])
        UC6([Events & Webinars Management])
        UC7([Donations & Fundraising])
        UC8([Admin Dashboard & Verification])
    end
    
    %% Student Relationships
    S --> |Login/Register| UC1
    S --> |Update details| UC2
    S --> |Search Alumni| UC3
    S --> |Communicate| UC4
    S --> |View & Apply| UC5
    S --> |Register & Attend| UC6
    
    %% Alumni Relationships
    A --> |Login/Register| UC1
    A --> |Update professional| UC2
    A --> |Search Users| UC3
    A --> |Communicate/Mentor| UC4
    A --> |Post & Apply| UC5
    A --> |Host & Attend| UC6
    A --> |Make Contribution| UC7
    
    %% Admin Relationships
    Ad --> |Secure Login| UC1
    Ad --> |Manage Platform| UC8
    Ad --> |Approve Posts| UC5
    Ad --> |Manage Configs| UC6
    Ad --> |Verify Users| UC3
```

---

## Sequence Diagrams

### 1. User Authentication & Profile Verification Flow

```mermaid
sequenceDiagram
    actor User as Student/Alumni
    participant Frontend as React Frontend
    participant Backend as Node.js / Express API
    participant DB as MongoDB
    actor Admin as System Admin

    User->>Frontend: Fills Registration Form
    Frontend->>Backend: POST /api/auth/register
    Backend->>Backend: Hash Password (Bcrypt)
    Backend->>DB: Save User Data
    DB-->>Backend: Returning User Object
    Backend-->>Frontend: 201 Created (Success & JWT Token)
    Frontend-->>User: Redirect to Dashboard

    User->>Frontend: Submits Profile Details
    Frontend->>Backend: PUT /api/profile/:id (with Auth Token)
    Backend->>Backend: Validate Token
    Backend->>DB: Update Profile in DB
    DB-->>Backend: Profile Updated
    Backend-->>Frontend: 200 OK
    Frontend-->>User: Profile Verified/Updated Success

    alt If verification is required
        Backend->>Admin: Trigger Verification Notification
        Admin->>Frontend: Reviews Profile in Admin Panel
        Frontend->>Backend: POST /api/admin/verify/:userId
        Backend->>DB: Update User Status to 'Verified'
        DB-->>Backend: Status Updated
        Backend->>User: Send Notification (Profile Verified)
    end
```

### 2. Job Application Flow

```mermaid
sequenceDiagram
    actor Alumni
    actor Student
    participant Frontend
    participant JobController as Backend (JobController)
    participant NotificationController as Backend (NotificationController)
    participant DB as MongoDB

    %% Job Posting Phase
    Alumni->>Frontend: Fills "Post a Job" form
    Frontend->>JobController: POST /api/jobs
    JobController->>JobController: Validate permissions
    JobController->>DB: Save Job document
    DB-->>JobController: Job saved
    JobController-->>Frontend: 'Job successfully posted'
    Frontend-->>Alumni: Display Job on Dashboard
    
    %% Job Applying Phase
    Student->>Frontend: Browses jobs in Job Portal
    Frontend->>JobController: GET /api/jobs
    JobController->>DB: Fetch available jobs
    DB-->>JobController: Return Jobs Array
    JobController-->>Frontend: Send jobs list
    Frontend-->>Student: Renders jobs
    
    Student->>Frontend: Clicks "Apply" with Resume
    Frontend->>JobController: POST /api/jobs/:jobId/apply
    JobController->>DB: Add Student ID to Job applicants array
    DB-->>JobController: Success
    
    %% Notification Phase
    JobController->>NotificationController: Trigger application notification
    NotificationController->>DB: Create Notification for Alumni
    DB-->>NotificationController: Notification Saved
    NotificationController-->>Frontend: Push real-time alert
    
    JobController-->>Frontend: 200 OK Application received
    Frontend-->>Student: Application Success Message
    Frontend-->>Alumni: "New Application Received" Notification
```
