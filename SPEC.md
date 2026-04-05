# User Dashboard - SaaS Ticket Management System

## 1. Project Overview

**Project Name:** User Dashboard - Ticket Management System  
**Type:** Single Page Application (React)  
**Core Functionality:** A comprehensive user dashboard for raising tickets, tracking status, viewing analytics, and managing user profile with AI-driven priority calculation and real-time SLA tracking.  
**Target Users:** End customers who need to submit and track support tickets.

---

## 2. UI/UX Specification

### Layout Structure

**Overall Layout:**
- Fixed sidebar navigation (280px width on desktop, collapsible on mobile)
- Main content area with scrollable pages
- Top header bar with user info and notification bell

**Page Sections:**
- Sidebar: Logo area, navigation menu, user profile mini card, logout button
- Main Area: Page title, content container, floating action buttons where needed
- Modal overlays for: Ticket details, success popups, chat simulation

**Responsive Breakpoints:**
- Mobile: < 768px (sidebar becomes hamburger menu)
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Visual Design

**Color Palette:**
- Background Primary: #0F0F1A (deep dark)
- Background Secondary: #1A1A2E (card backgrounds)
- Background Tertiary: #252542 (elevated elements)
- Accent Primary: #7C3AED (purple)
- Accent Secondary: #3B82F6 (blue)
- Gradient: linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)
- Text Primary: #FFFFFF
- Text Secondary: #A1A1AA
- Text Muted: #71717A
- Success: #22C55E
- Warning: #F59E0B
- Error: #EF4444
- Glass: rgba(255, 255, 255, 0.05) with backdrop-blur

**Priority Colors:**
- High Priority: #EF4444 (red)
- Medium Priority: #F59E0B (orange)
- Low Priority: #22C55E (green)

**Emotion Colors:**
- Angry: #EF4444
- Frustrated: #F97316
- Neutral: #6B7280
- Calm: #22C55E

**Typography:**
- Font Family: 'Outfit' (headings), 'DM Sans' (body)
- Heading 1: 32px, 700 weight
- Heading 2: 24px, 600 weight
- Heading 3: 18px, 600 weight
- Body: 14px, 400 weight
- Small: 12px, 400 weight

**Spacing System:**
- Base unit: 4px
- XS: 4px, SM: 8px, MD: 16px, LG: 24px, XL: 32px, 2XL: 48px

**Visual Effects:**
- Glassmorphism: background blur 12px, border 1px solid rgba(255,255,255,0.1)
- Card shadows: 0 8px 32px rgba(0, 0, 0, 0.3)
- Hover transitions: 0.3s ease
- Page transitions: fade in 0.3s
- Counter animations: count up over 1.5s
- Progress bar animations: width transition 0.5s ease

### Components

**Sidebar Navigation:**
- Logo at top
- Nav items with icons (Lucide React)
- Active state: gradient background, white text
- Hover state: slight background highlight
- User mini card at bottom

**Stat Cards:**
- Glassmorphism background
- Icon with gradient
- Animated counter
- Label and trend indicator

**Ticket Cards (Glassmorphism):**
- Rounded corners (16px)
- Glass effect background
- Emotion badge (colored pill)
- Priority indicator (colored left border)
- Status badge
- SLA countdown timer

**Form Elements:**
- Dark input fields with subtle border
- Focus state: gradient border glow
- Labels above inputs
- Error state: red border

**Buttons:**
- Primary: gradient background
- Secondary: transparent with border
- Hover: slight scale and glow
- Disabled: opacity 0.5

**Modals:**
- Centered overlay
- Glassmorphism background
- Smooth scale-in animation

---

## 3. Functionality Specification

### Core Features

**1. Sidebar Navigation:**
- Navigate between all pages
- Collapse on mobile
- Active state highlighting

**2. User Home Page (Dashboard):**
- Welcome message with user name
- System explanation text
- 5 stat cards with animated counters:
  - Total Tickets Raised
  - Active Tickets
  - Resolved Tickets
  - Average Resolution Time (hours)
  - SLA Breach Alerts
- Recent 3 tickets summary

**3. Raise Ticket Page:**
- Form fields:
  - Subject (text input, required)
  - Description (textarea, required)
  - Category (dropdown): Technical Issue, Billing Issue, Product Complaint, Feature Request, General Inquiry
  - Emotion Selection (buttons): Angry, Frustrated, Neutral, Calm
  - Attachment upload (optional, file input)
- On submit:
  - Generate unique Ticket ID (format: TKT-XXXXXX)
  - Assign business priority based on category
  - Calculate emotion weight (Angry: 1.0, Frustrated: 0.75, Neutral: 0.5, Calm: 0.25)
  - Calculate final priority score
  - Predict TTR (Time to Resolution) - simulated
  - Store in state
  - Set initial status = Pending
  - Show success popup with Ticket ID

**4. My Tickets Page:**
- Table/Grid display with columns:
  - Ticket ID
  - Subject
  - Emotion Badge (colored)
  - Final Priority Score
  - Predicted TTR (hours)
  - Status (with colored badge)
  - SLA Timer (countdown)
  - Action (View, Add Comment, Cancel, Reopen)
- Status options: Pending, Under Review, In Progress, Escalated, Resolved
- Color coding for priority
- Filter by status
- Search by ticket ID

**5. Ticket Details Page:**
- Full ticket information card
- Emotion detected display
- Priority breakdown visualization (progress bars)
- Predicted TTR
- SLA Limit
- Escalation flag if applicable
- Timeline UI:
  - Created → Assigned → Processing → Resolved
  - Each step with timestamp
- Priority calculation breakdown:
  - Final Priority = (Emotion × 0.5) + (Waiting Time × 0.3) + (Business Priority × 0.2)
  - Visual display of each component

**6. Notifications Page:**
- List of notifications:
  - Ticket status updates
  - Escalation alerts
  - SLA breach warnings
  - Resolution confirmations
- Real-time simulation using setInterval (every 10 seconds)
- Unread indicator
- Mark as read functionality

**7. Analytics Page (My Analytics):**
- 4 charts using Recharts:
  - Pie Chart: Emotion distribution
  - Line Chart: Resolution time trend (last 7 days)
  - Bar Chart: Priority distribution (High/Medium/Low)
  - Line/Area Chart: Satisfaction trend
- All charts with animations

**8. Feedback Page:**
- Show after ticket status = Resolved
- Rating form: 1-5 stars (clickable)
- Optional comment textarea
- Store rating in state
- Display Customer Satisfaction Score (CSAT) - average of all ratings

**9. Profile Page:**
- View/Edit name
- View/Edit email
- Display total tickets count
- Display average resolution time
- Save button

### Smart Features

**SLA Countdown Timer:**
- For each active ticket, show live countdown
- Format: XXh XXm remaining
- If < 1 hour remaining: red blinking warning
- If breached: show "SLA BREACHED" badge

**Download Ticket Report:**
- Button to download PDF
- Uses html2canvas + jsPDF or similar
- Generates ticket summary PDF

**AI Suggestion Box:**
- When typing in description field
- Show suggestions based on keywords:
  - "restart" → "Have you tried restarting your device?"
  - "billing" → "Check the billing invoice section in your account settings"
  - "error" → "Please share the exact error message if possible"
  - "login" → "Try clearing browser cache and cookies"

**Live Chat Simulation:**
- Floating chat button (bottom right)
- Opens chat window
- Simulated bot responses
- Demo conversation

**Auto Status Simulation:**
- Every 30 seconds, simulate ticket progress
- Pending → Under Review (after 30s)
- Under Review → In Progress (after 60s)
- In Progress → Resolved (after 90s)
- Demo mode with one sample ticket

---

## 4. Acceptance Criteria

### Visual Checkpoints:
- [ ] Dark mode with blue-purple gradient theme applied
- [ ] Glassmorphism effect visible on cards
- [ ] Sidebar navigation fully functional
- [ ] All pages accessible and responsive
- [ ] Animations smooth on page transitions
- [ ] Stat counters animate on load

### Functional Checkpoints:
- [ ] Can raise a new ticket with all fields
- [ ] Ticket ID generated and displayed
- [ ] Priority calculated correctly
- [ ] Tickets displayed in My Tickets page
- [ ] Can view ticket details
- [ ] Timeline displays correctly
- [ ] SLA countdown works
- [ ] Notifications appear in real-time
- [ ] Charts render in Analytics page
- [ ] Can submit feedback with star rating
- [ ] Profile can be updated
- [ ] Chat simulation works

### Technical Checkpoints:
- [ ] No console errors
- [ ] All routes work
- [ ] State management functional
- [ ] Responsive on mobile/tablet/desktop
