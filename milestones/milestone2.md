cat > milestones/milestone2.md << 'ENDOFFILE'

# Milestone 2

This document should be completed and submitted during **Unit 6** of this course. You **must** check off all completed tasks in this document in order to receive credit for your work.

## Checklist

This unit, be sure to complete all tasks listed below. To complete a task, place an `x` between the brackets.

- [x] In `planning/wireframes.md`: add wireframes for at least three pages in your web app.
  - [x] Include a list of pages in your app
- [x] In `planning/entity_relationship_diagram.md`: add the entity relationship diagram you developed for your database.
  - [x] Your entity relationship diagram should include the tables in your database.
- [x] Prepare your three-minute pitch presentation, to be presented during Unit 7 (the next unit).
  - [x] You do **not** need to submit any materials in advance of your pitch.
- [x] In this document, complete all three questions in the **Reflection** section below

## Reflection

### 1. What went well during this unit?

Creating the wireframes helped us visualize the user experience and catch layout issues early. The entity relationship diagram clarified how our tables connect, especially the many-to-many relationships through the event_dishes and rsvps join tables. Having Milestone 1 planning done made this step much smoother since we already knew our features and user stories.

### 2. What were some challenges your group faced in this unit?

Designing the event detail page was tricky because it needs to show a lot of information (event details, claimed dishes, RSVP list) without feeling cluttered. We also debated whether the dish claiming modal should show all recipes or only unclaimed ones, and settled on showing all with a visual indicator for already-claimed dishes.

### 3. What additional support will you need in upcoming units as you continue to work on your final project?

We would appreciate guidance on translating our ERD into actual PostgreSQL migration files and seed data. We also want to make sure our React component hierarchy follows best practices for container and presenter components as required by the baseline features.

ENDOFFILE

