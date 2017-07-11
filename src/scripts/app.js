import React from 'react'
import ReactDOM from 'react-dom'
import {combineReducers, createStore} from 'redux' 

const states = []

function render() {
  ReactDOM.render(<App />, document.querySelector('.container'))
}

const onLightClick = (e) => {
	store.dispatch(
  			{
	  			type: "COLOR_CHANGE",
	  			color: e.target.value
	  		})
	}

const onBackward = (e) => {
	if (e.target.className.includes('inactive')) return
	store.dispatch(
  			{
	  			type: "UNDO",
	  		}
	  	)
}

const onForward = (e) => {
	if (e.target.className.includes('inactive')) return
	store.dispatch(
			{
				type: "REDO"
			}
		)
}

const atBack = () => {
	return store.getState().index === 1
}

const atFront = () => {
	return store.getState().index === store.getState().history.length - 1
}

class App extends React.Component {
	constructor() {
		super()
		this.state = store.getState()
	}

	componentWillMount() {
		store.subscribe(() => {
			this.setState(store.getState())
		})
	}

	render() {
		return (
			<div className="app">
				<div className="butts">
					<button 
						onClick={onBackward} 
						className={atBack()? "inactive" : ""}
						value="backward">
						back
					</button>
					<button 
						onClick={onForward} 
						className={atFront()? "inactive" : ""}
						value="forward">
						forward
					</button>
				</div>
				<Stoplight {...this.state.history[this.state.index]} />
				<HistoryScroll index={this.state.index} history={this.state.history} />
			</div>
			)
	}
}

const Stoplight = (props) => 
	<div id="stoplight">
		{["red","yellow","green"].map(
			myColor => 
				<button 
					key={myColor}
					className={`light ${myColor} ${props.color === myColor ? "active" : ""}`} 
					value={myColor} 
					onClick={onLightClick}
				/>
			)
		}
	</div>

const HistoryScroll = (props) => 
	<div id="scroll">
		{console.log(props.history)}
		{props.history.slice(0,props.index + 1).map(state => 
			<p className={"historical-color " + state.color}>
				{state.color}
			</p>)
		}
	</div>

const color = (state = "", action) => {
	switch (action.type) {
		case "COLOR_CHANGE":
			return action.color
		default: 
			return state
	}
}

const current = (state = 0, action) => {
	switch (action.type) {
		case "UNDO": 
			return states[state - 1]
		case "REDO": 
			return states[state + 1]
		default: 
			return states[state]
	}
}

const history = (state = [], action) => {

}

const initialState = {
	history: [{
	}],
	index: 0
}

const combineWithHistory = reducers => 
 	function(state = initialState, action) {

 		switch (action.type) {
 			case "UNDO": 
 				return {
 					history: state.history,
 					index: state.index - 1
 				}

 			case "REDO":
 				return {
 					history: state.history,
 					index: state.index + 1
 				}

	 		default: 
		 		var oldCurrent = state.history[state.index] // little reducers will work with the current state. they don't need to know about history.
				var newCurrent = Object.keys(reducers).reduce((nextState,key) => {
					nextState[key] = reducers[key](oldCurrent[key],action)
					return nextState
				}, {})
				return {
					history: state.history.concat(newCurrent),
					index: state.index + 1
				}
		}
	}


const store = createStore(combineWithHistory({color}))

window.store = store
store.getCurrent = () => store.getState().history[store.getState().index]
render()
