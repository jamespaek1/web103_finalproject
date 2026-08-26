# PotluckHub development history

This summary preserves the useful project decisions and lessons from the original development milestones without requiring a reviewer to navigate course submission templates.

## 1. Product scope

The team framed PotluckHub around two roles: hosts who create and manage gatherings, and guests who RSVP and claim dishes. Early scoping narrowed a larger idea set to a practical event-and-recipe workflow supported by 15 user stories.

## 2. Data and experience design

The team designed a five-table PostgreSQL model for users, events, recipes, RSVPs, and event dishes. Wireframes established the events list, event detail, recipe library, modal-based dish claiming, and profile views before implementation.

- [Entity relationship model](../planning/entity_relationship_diagram.md)
- [Wireframes](../planning/wireframes.md)
- [User stories](../planning/user_stories.md)

## 3. Full-stack implementation

The application combined a Vite and React client with an Express API and PostgreSQL. The team implemented dynamic routes, event and recipe operations, RSVPs, dish claims, GitHub OAuth, and Cloudinary image uploads.

## 4. Integration and product polish

The final build added filtering and sorting, a claim-dish modal, user profile views, validation, and deployment configuration. Integration work focused on connecting the client and server, resolving merge conflicts, assembling documentation, and preparing demonstration media.

## 5. Portfolio evidence and lessons

Three walkthroughs document the classroom build:

- [Core workflows](../public/gifs/milestone3-demo.gif)
- [Modal and navigation](../public/gifs/milestone4-demo.gif)
- [Final integrated walkthrough](../public/gifs/milestone5-demo.gif)

The original Render service is no longer relied on for portfolio review. A stable GitHub Pages evidence site now keeps the project understandable without a login or live database. The main lessons were to scope collaborative work early, define relational ownership clearly, keep deployment credentials out of source control, and document each teammate's final integration responsibilities.
