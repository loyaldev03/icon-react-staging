const LOAD = 'userTracks/LOAD';
const LOAD_SUCCESS = 'userTracks/LOAD_SUCCESS';
const LOAD_FAIL = 'userTracks/LOAD_FAIL';

const ADD = 'userTracks/ADD';
const ADD_SUCCESS = 'userTracks/ADD_SUCCESS';
const ADD_FAIL = 'userTracks/ADD_FAIL';

const REMOVE = 'userTracks/REMOVE';
const REMOVE_SUCCESS = 'userTracks/REMOVE_SUCCESS';
const REMOVE_FAIL = 'userTracks/REMOVE_FAIL';

const initialState = {
	loaded: false,
	loading: false,
	success: null,
	error: null,
	allTracks: [
		{
			bgImg: require('../../../static/dynamicBG.jpg'),
			title: "dynamic",
			trackIconClassName: "icon-track-dynamic",
			isSubscribed: false
		},
		{
			bgImg: require('../../../static/strengthBG.jpg'),
			title: "strength",
			trackIconClassName: "icon-track-strength",
			isSubscribed: false
		},
		{
			bgImg: require('../../../static/lifestyleBG.jpg'),
			title: "lifestyle",
			trackIconClassName: "icon-track-lifestyle",
			isSubscribed: false
		},
		{
			bgImg: require('../../../static/hyperBG.jpg'),
			title: "hyper",
			trackIconClassName: "icon-track-hyper",
			isSubscribed: false
		},
		{
			bgImg: require('../../../static/hyperBG.jpg'),
			title: "masters-35-39",
			trackIconClassName: "icon-track-hyper",
			isSubscribed: false
		},
		{
			bgImg: require('../../../static/hyperBG.jpg'),
			title: "masters-40-44",
			trackIconClassName: "icon-track-hyper",
			isSubscribed: false
		},
		{
			bgImg: require('../../../static/hyperBG.jpg'),
			title: "masters-45-49",
			trackIconClassName: "icon-track-hyper",
			isSubscribed: false
		},
		{
			bgImg: require('../../../static/hyperBG.jpg'),
			title: "masters-50-54",
			trackIconClassName: "icon-track-hyper",
			isSubscribed: false
		},
		{
			bgImg: require('../../../static/hyperBG.jpg'),
			title: "masters-55-59",
			trackIconClassName: "icon-track-hyper",
			isSubscribed: false
		},
		{
			bgImg: require('../../../static/hyperBG.jpg'),
			title: "masters-60+",
			trackIconClassName: "icon-track-hyper",
			isSubscribed: false
		}
	],
	selectedTracks: [] // this will be automatically generated from allTracks
};

export default function reducer(state = initialState, action = {}) {
	switch (action.type) {
		case LOAD:
			return {
				...state,
				loading: true,
				loaded: false,
			};
		case LOAD_SUCCESS:
		case ADD_SUCCESS:
		case REMOVE_SUCCESS:
			let newAllTracks = {...state}.allTracks;
			let newSelectedTracks = [];

			state.allTracks.map(allTrack => {
				// mark all as false
				allTrack.isSubscribed = false;

				action.result.tracks.map(selectedTrack => {
					if (selectedTrack.trackName === allTrack.title) {

						let trackIndex = newAllTracks.findIndex(temp => {
							return temp.title === selectedTrack.trackName;
						});

						if (trackIndex >= 0) {
							newAllTracks[trackIndex].isSubscribed = true;
							newSelectedTracks.push(newAllTracks[trackIndex]);
						}
					}
				})
			});

			return {
				...state,
				allTracks: newAllTracks,
				selectedTracks: newSelectedTracks,
				loading: false,
				loaded: true,
				error: null
			};
		case LOAD_FAIL:
			return {
				...state,
				loading: false,
				loaded: false,
				error: action.error
			};
		default:
			return state;
	}
}

export function isLoaded(globalState) {
	return globalState.userTracks && globalState.userTracks.loaded;
}

export function load() {
	return {
		types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
		promise: (client) => client.get('/loadAuthTracks')
	};
}

export function addAsOnlyTrack(name) {
	return {
		types: [ADD, ADD_SUCCESS, ADD_FAIL],
		promise: (client) => client.post('/addAsOnlyTrack', {
			data: {
				name
			}
		})
	};
}

export function addToTrackList(name) {
	return {
		types: [ADD, ADD_SUCCESS, ADD_FAIL],
		promise: (client) => client.post('/addToTrackList', {
			data: {
				name
			}
		})
	};
}

export function remove(name) {
	return {
		types: [REMOVE, REMOVE_SUCCESS, REMOVE_FAIL],
		promise: (client) => client.post('/removeTrack', {
			data: {
				name
			}
		})
	};
}
