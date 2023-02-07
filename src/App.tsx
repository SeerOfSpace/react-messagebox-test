import React from 'react';
import logo from './logo.svg';
import './App.css';
//import { NameForm } from './NameForm';
import { MessageBox } from './MessageBox';

function App() {
	return (
		<div>
			<img src={logo} className="App-logo" alt="logo" />
			<h1>Message Box Test</h1>
			<MessageBox />
		</div>
	);
}

export default App;
