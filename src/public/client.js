let store = Immutable.Map({
  name:  "Alex",
  apod: '',
  rovers: ['Curiosity', 'Opportunity', 'Spirit'],
  tab: 'tab-info',
  roverData: null,
  roverPhotos: [],
});

const root = document.getElementById('root');

const render = async (rootParam, state) => {
  rootParam.innerHTML = App(state);
};

// listenes for load 
window.addEventListener('load', () => {
  render(root, store);
});

// ------------------------------------------------------  UTIL FUNCTIONS BELOW
function RoverImages(imgArray) {
  const output = imgArray.map(
    img => `<img src="${img}" class="rover-images" />`
  );
  return output.join('');
}

const updateStore = (storeParam, newState) => {
  store = storeParam.merge(newState);
  render(root, store);
};

function setTab(tab) {
  store = store.set('tab', tab);
  render(root, store);
}
// ------------------------------------------------------  UTIL FUNCTIONS ABOVE

// ------------------------------------------------------  API CALLS BELOW
const getImageOfTheDay = state => {
  const stateObj = state.toJS();
  const { apod } = stateObj;

  fetch(`http://localhost:3000/apod`)
    .then(res => res.json())
    .then(apod => {
      updateStore(state, { apod });
    });
};

const getRoverData = (rover, state) => {
  fetch(`http://localhost:3000/rover`)
    .then(response => response.json())
    .then(r => {
      const roversByName = {
        // curiosity: {}
      };

      r.rovers.forEach(roverPram => {
        roversByName[roverPram.name.toLowerCase()] = roverPram;
      });

      const { max_date: maxDate } = roversByName[rover];
      fetch(`http://localhost:3000/rover/${rover}/${maxDate}`)
        .then(response => response.json())
        .then(roverPhotos => {
          updateStore(state, {
            roverData: roversByName[rover],
            roverPhotos: roverPhotos.photos.map(photo => photo.img_src),
          });
        });
    });
};
// ------------------------------------------------------  API CALLS ABOVE

// ------------------------------------------------- COMPONENTS BELOW
const ImageOfTheDay = apod => {
  // If image does not already exist, or it is not from today -- request it again
  // console.log('Before request')
  const today = new Date();
  const photodate = new Date(apod.date);
  console.log(apod)
  console.log(!apod ? 'true' : 'False')

  if (
    (!apod || photodate === today.getDate()) &&
    !ImageOfTheDay._imagesRequested
  ) {
    ImageOfTheDay._imagesRequested = true;
    getImageOfTheDay(store);
  }
  console.log(apod)

  if (!apod) {
    return `<h1>Loading...</h1>`;
  }
  // console.log('after')
  // checks if the media type is video
  if (apod.media_type === 'video') {
    return `
      ${Greeting(store.get("name"))}
      <div id="tab-info">
        <p>Today's featured <a href="${apod.image.url}">can be found here.</a></p>
        <p>${apod.title}</p>
        <p>${apod.explanation}</p>
      </div>
      `;
  }
  return `
  ${Greeting(store.get("name"))}
      <div id="tab-info">
          <img src="${apod.image.url}" height="350px" width="100%" />
          <p>${apod.image.explanation}</p>
      </div>            
      `;
};

const RoverData = (rover, state) => {
  if (RoverData._called !== rover) {
    RoverData._called = rover;
    getRoverData(rover, state);
  }
  if (!state.get('roverData') || !state.get('roverPhotos').size) {
    return `<h1>Loading...</h1>`;
  }
  return `
    <div class="content">
      <h1>${state.getIn(['roverData', 'name'])}</h1>
      <ul>
        <li>Launch date: <strong>${state.getIn(['roverData', 'launch_date'])}</strong></li>
        <li>Landing date:  <strong>${state.getIn(['roverData', 'landing_date'])}</strong></li>
        <li>Status: <strong>${state.getIn(['roverData', 'status'])}</strong></li>
        <li>Most recent photos taken on: <strong>${state.getIn(['roverData', 'max_date'])}</strong></li>
      </ul>
      <div class="rover-image-container">
        ${RoverImages(state.get('roverPhotos').toJS())}
      </div>
    </div>
  `;
};
// ------------------------------------------------- COMPONENTS ABOVE

const Greeting = (name) => {
  if (name) {
      return `
          <h1>Welcome, ${name}!</h1>
      `
  }

  return `
      <h1>Hello!</h1>
  `
}

// create content
const App = state => {
  const stateObj = state.toJS();
  console.log(stateObj)
  const { rovers, apod, tab } = stateObj;
  const activeRoverArr = rovers.filter(name => tab === name.toLowerCase());
  return `
    <div class="tab-container">
      <button class="tablink" onclick="setTab('tab-info')">Picture of the Day</button>
      <button class="tablink" onclick="setTab('curiosity')">Curiosity</button>
      <button class="tablink" onclick="setTab('spirit')">Spirit</button>
      <button class="tablink" onclick="setTab('opportunity')">Opportunity</button>
      ${
        activeRoverArr[0]
          ? RoverData(activeRoverArr[0].toLowerCase(), state)
          : ImageOfTheDay(apod)
      }
    </div>
  `;
};