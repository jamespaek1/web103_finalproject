# Milestone 1

This document should be completed and submitted during **Unit 5** of this course. You **must** check off all completed tasks in this document in order to receive credit for your work.

## Checklist

This unit, be sure to complete all tasks listed below. To complete a task, place an `x` between the brackets.

- [x] Read and understand all required features
  - [x] Understand you **must** implement **all** baseline features and **two** custom features
- [x] In `readme.md`: update app name to your app's name
- [x] In `readme.md`: add all group members' names
- [x] In `readme.md`: complete the **Description and Purpose** section
- [x] In `readme.md`: complete the **Inspiration** section
- [x] In `readme.md`: list a name and description for all features (minimum 6 for full points) you intend to include in your app (in future units, you will check off features as you complete them and add GIFs demonstrating the features)
- [x] In `planning/user_stories.md`: add all user stories (minimum 10 for full points)
- [x] In `planning/user_stories.md`: use 1-3 unique user roles in your user stories
- [x] In this document, complete all thre questions in the **Reflection** section below

## Reflection

### 1. What went well during this unit?

Our group aligned quickly on the PotluckHub concept. Everyone could relate to the problem of coordinating dishes for group meals, which made brainstorming user stories and features feel natural. We were able to identify all the required database relationships (one-to-many for users to events, many-to-many for events to recipes and users to events) early on, which gave us confidence that the idea supports all baseline requirements. Breaking the work into clear deliverables also helped us divide tasks efficiently across the team.

### 2. What were some challenges your group faced in this unit?

The biggest challenge was scoping the app appropriately. We had a lot of ambitious ideas — like real-time notifications and ingredient shopping lists — but had to be realistic about what we could deliver within the project timeline. Deciding which two custom features to commit to (filtering/sorting and the claim modal) required us to weigh complexity against impact. We also spent time making sure our user stories were specific enough to guide development without being too narrow.

### 3. What additional support will you need in upcoming units as you continue to work on your final project?

We anticipate needing guidance on setting up the many-to-many relationship with the join table in PostgreSQL, particularly around writing the migration and seed files. We may also need support with deploying both the frontend and backend to Render and making sure they communicate correctly in production. Finally, implementing the modal for the dish claiming feature is new territory for some team members, so we may look for additional resources or examples on building modals in React.
