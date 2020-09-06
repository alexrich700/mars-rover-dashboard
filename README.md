# Mars Rover Dashboard

### Big Picture

This dashboard allows users to view recent images taken by the mars rovers and the NASA image of the day by consuming the NASA API. This project was built for Udacity's Functional Programming with Javascript using Immutable.js.

### Getting Started

Follow these steps to get started:

1. Clone this repo and install the dependencies

 - [ ] To clone the repo, remember to clone just the starter branch:

```git clone --single-branch --branch starter <repo-name>```

 - [ ] For this project we are using yarn as our package manager, so to install your depencies run:

```yarn install``` 

**If you don’t have yarn installed globally, follow their installation documentation here according to your operating system: https://yarnpkg.com/lang/en/docs/install

2. Next you'll need a NASA developer API key in order to access the API endpoints. To do that, go here: https://api.nasa.gov/. If you want to simply look around at what api endpoints NASA offers, you can use their provided DEMO_KEY to do this.

3. In your repo, you will see a .env-example file with a place for your API key. Rename or copy the file to one called `.env` and enter in your key. Now that you have your key, just remember to add it as a parameter to every request you make to NASA.

5. Run `yarn start` in your terminal and go to `http:localhost:3000` to check that your app is working. If you don't see an image on the page, check that your api key is set up correctly.




