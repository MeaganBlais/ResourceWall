# Resource Wall

## Option 5: Resource Wall
Pinterest for learners.

Allow learners to save learning resources like tutorials, blogs and videos in a central place that is publicly available to any user.

## Features:
* users can save an external URL along with a title and description
* users can search for already-saved resources created by any user
* users can categorize any resource under a topic and create new categories
* users can comment on any resource
* users can rate any resource
* users can change their ratings
* users can like any resource
* users can unlike any resource
* users can view all their own and all liked resources on one page ("My resources")
* users can register, log in, log out and update their profile

## Getting Started

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Run migrations: `npm run knex migrate:latest`
  - Check the migrations folder to see what gets created in the DB
6. Run the server: `npm run local`
7. Visit `http://localhost:8080/`

## Dependencies

- Node 5.10.x or above
- NPM 3.8.x or above

## Screenshots
!["Main Page"](https://github.com/SeanSFitz/ResourceWall/blob/master/screenshots/MainPage.png)
!["Registration"](https://github.com/SeanSFitz/ResourceWall/blob/master/screenshots/Registration.png)
!["Search"](https://github.com/SeanSFitz/ResourceWall/blob/master/screenshots/Search.png)
!["UpdateProfile"](https://github.com/SeanSFitz/ResourceWall/blob/master/screenshots/UpdateProfile.png)
!["My Resources"](https://github.com/SeanSFitz/ResourceWall/blob/master/screenshots/MyResources.png)
!["Resource Details & Comments"](https://github.com/SeanSFitz/ResourceWall/blob/master/screenshots/ResourceDetails%2BComments.png)
!["Responsive Main Page"](https://github.com/SeanSFitz/ResourceWall/blob/master/screenshots/ResponsiveDesign.png)
