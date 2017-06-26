# Node Skeleton

## Project Setup

1. Create your own empty repo on GitHub
2. Clone this repository (do not fork)
  - Suggestion: When cloning, specify a different folder name that is relevant to your project
3. Remove the git remote: `git remote rm origin`
4. Add a remote for your origin: `git remote add origin <your github repo URL>`
5. Push to the new origin: `git push -u origin master`
6. Verify that the skeleton code now shows up in your repo on GitHub

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
!["Screenshot of main page"](https://github.com/SeanSFitz/ResourceWall/blob/master/screenshots/MainPage.png)
!["Screenshot of my resources"](https://github.com/SeanSFitz/ResourceWall/blob/master/screenshots/MyResources.png)
!["Screenshot of resource details & comments"](https://github.com/SeanSFitz/ResourceWall/blob/master/screenshots/ResourceDetails%2BComments.png)
!["Screenshot of responsive main page"](https://github.com/SeanSFitz/ResourceWall/blob/master/screenshots/ResponsiveDesign.png)
