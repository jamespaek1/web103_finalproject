cat > planning/entity_relationship_diagram.md << 'ENDOFFILE'

# Entity Relationship Diagram

Reference the Creating an Entity Relationship Diagram final project guide in the course portal for more information about how to complete this deliverable.

## Create the List of Tables

1. users
2. events
3. recipes
4. event_dishes (join table for events and recipes)
5. rsvps (join table for users and events)

## Add the Entity Relationship Diagram

### users

| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | primary key |
| name | text | user display name |
| email | text | unique email address |
| bio | text | short user bio |
| avatar_url | text | profile image URL |
| created_at | timestamp | account creation date |

### events

| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | primary key |
| host_id | integer | foreign key to users.id |
| title | text | event title |
| description | text | event description |
| event_date | date | date of the event |
| event_time | time | time of the event |
| location | text | event location |
| created_at | timestamp | event creation date |

### recipes

| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | primary key |
| name | text | recipe name |
| description | text | recipe description |
| category | text | appetizer, main, side, dessert, or drink |
| image_url | text | recipe image URL |
| created_by | integer | foreign key to users.id |

### event_dishes (join table)

| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | primary key |
| event_id | integer | foreign key to events.id |
| recipe_id | integer | foreign key to recipes.id |
| claimed_by | integer | foreign key to users.id |
| notes | text | optional notes about the dish |
| claimed_at | timestamp | when the dish was claimed |

### rsvps (join table)

| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | primary key |
| user_id | integer | foreign key to users.id |
| event_id | integer | foreign key to events.id |
| created_at | timestamp | when the RSVP was made |

## Relationships

- **One-to-many**: users to events (a user can host many events)
- **Many-to-many**: events to recipes (via event_dishes join table)
- **Many-to-many**: users to events (via rsvps join table)
ENDOFFILE