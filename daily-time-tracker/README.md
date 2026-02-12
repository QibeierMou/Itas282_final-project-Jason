# Daily Time Tracker (Time Clock Application)

**Name:** Jason  
**Date:** February 12, 2026  

---

## 📌 Project Topic (Elevator Pitch)

The Daily Time Tracker is a simple React web application that allows users to track how much time they spend studying, eating, and exercising each day to improve time management and daily habits.

---

## 🧠 Needs Analysis

Many students struggle with managing their time and often do not know how much time they actually spend on important daily activities.

Although productivity and fitness apps already exist, many are:

- Too complicated  
- Focused on only one activity  
- Require accounts or paid subscriptions  

This project provides a simple and free tool that:

- Tracks study, eating, and exercise time  
- Works without user accounts  
- Shows clear daily totals  
- Is easy to use and distraction-free  

The goal is simplicity and awareness.

---

## 👥 Stakeholders

- **Sponsor:** Jason (Developer and Project Owner)  
- **Client:** Students who want better time management  
- **End Users:** Individuals tracking daily habits  
- **Instructor:** Evaluates and provides feedback  

---

## 👤 User Types

### Primary User
- Student or individual  
- Basic computer and web browsing skills  
- No technical knowledge required  

### User Actions

Users can:

- Start a timer  
- Stop a timer  
- View total time spent  
- Reset daily tracking  

---

## 📖 User Stories

### 1️⃣ Study Timer
**As a user, I want to start a study timer so I can track study time.**  

**Acceptance Criteria:**
- Timer increases every second  
- Timer stops when stop is pressed  

---

### 2️⃣ Exercise Timer
**As a user, I want to track exercise time.**  

**Acceptance Criteria:**
- Timer records time correctly  
- Pausing does not reset time  

---

### 3️⃣ Eating Timer
**As a user, I want to track eating time.**  

**Acceptance Criteria:**
- Time displays in minutes and seconds  
- Time saves correctly  

---

### 4️⃣ View Totals
**As a user, I want to see total time for each activity.**  

**Acceptance Criteria:**
- Totals update automatically  
- All totals are clearly visible  

---

### 5️⃣ Data Persistence
**As a user, I want my data saved automatically.**  

**Acceptance Criteria:**
- Data remains after page refresh  
- LocalStorage is used  

---

### 6️⃣ Reset Timers
**As a user, I want to reset all timers.**  

**Acceptance Criteria:**
- Reset button sets all times to zero  

---

### 7️⃣ Simple Interface
**As a user, I want a simple interface.**  

**Acceptance Criteria:**
- All timers are on one page  
- Buttons are clearly labeled  

---

### 8️⃣ Single Active Timer
**As a user, I want only one timer running at a time.**  

**Acceptance Criteria:**
- Starting one timer stops the others  

---

## 🛠 Technology Stack

### Frontend
- React  
- JavaScript (JSX)  
- React Hooks (`useState`, `useEffect`)  

### Styling
- Basic CSS  

### Data Storage
- Browser LocalStorage  

### Hosting
- GitHub Pages or Netlify (Free Tier)  

### Cost
- No paid services required  

---

## 📅 Key Tasks & Milestones

### 🚀 Milestone 1 – Setup & UI (Weeks 1–2)
- Create React project  
- Design layout  
- Create timer components  

### ⚙️ Milestone 2 – Timer Logic (Weeks 3–5)
- Add start/stop functionality  
- Ensure only one timer runs  
- Display time updates  

### 💾 Milestone 3 – Data Storage (Weeks 6–8)
- Add LocalStorage  
- Add reset feature  
- Show daily summary  

### ✅ Final Phase (Weeks 9–12)
- Testing and debugging  
- Deployment  
- Final documentation  

---

## ⚠️ Limitations and Risks

- Closing the browser stops the timer  
- Data does not sync between devices  
- Users must manually start and stop timers  
- Project scope must remain simple to fit within a 3-month timeline  

---

## 📚 References

- React Documentation: https://react.dev  
- MDN Web Docs: https://developer.mozilla.org  
- GitHub Pages: https://pages.github.com  
