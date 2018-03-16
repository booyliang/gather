import * as wikeList from '../actions/wike';

const LISTT_STATE = [];

export default function (state = LISTT_STATE, action = {}) {
	switch (action.type) {
		case wikeList.DELETE_WIKE: {
			const newState = [].concat(state);
			// action.payload.forEach(function (element, index) {
			// newState.forEach(function (item, smindex) {
			// 	// console.log(item, '===============', element.id)
			// 	console.log(item.id)
			// 	if (action.payload.includes(item.id)) {
			// 		console.log('aaaa')
			// 		newState.splice(smindex, 1);
			// 		smindex--
			// 	}
			// });
			for (let i = 0; i < newState.length; i++) {
				let item = newState[i];
				console.log(item.id)
				if (action.payload.includes(item.id)) {
					console.log('aaaa')
					newState.splice(i, 1);
					i--;
				}
			}
			// });
			console.log('action.payload', action.payload);
			console.log('state', newState);
			return newState;
		}

		case wikeList.LOAD_WIKE: {
			let newState = action.payload;
			return newState;
		}
	}
	return LISTT_STATE;

}