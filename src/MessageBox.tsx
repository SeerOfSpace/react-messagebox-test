import React, { ChangeEventHandler, Component, createRef, FormEventHandler, MouseEventHandler, RefObject } from 'react';
import './MessageBox.css';
import { SerializableMap as SMap } from './SerializableMap';

type messageType = { date: Date, user: string, msg: string }

export class MessageBox extends Component<{}, { messages: messageType[], users: SMap<string, string>, userChange: boolean }> {

	msgInput: RefObject<HTMLInputElement> = createRef();
	colorInput: RefObject<HTMLInputElement> = createRef();
	userInput: RefObject<HTMLInputElement> = createRef();
	messageWrapper: RefObject<HTMLInputElement> = createRef();
	messagesEnd: RefObject<HTMLInputElement> = createRef();

	currentUser: string;
	didMessageSubmit: boolean;

	readonly defaultColor = '#ffffff';
	readonly defaultUser = 'Anonymous';
	readonly lstrgState = 'msg-box-test-state';
	readonly lstrgCurrentUser = 'msg-box-test-current-user';

	constructor(props: any) {
		super(props);
		this.didMessageSubmit = false;

		this.currentUser = this.loadItem(this.lstrgCurrentUser) || this.defaultUser;
		let defaultState = { messages: [], users: new SMap([[this.currentUser, this.defaultColor]]), userChange: false };
		this.state = this.loadItem(this.lstrgState) || defaultState;
	}

	loadItem<T>(itemName: string) {
		let jsonStr = localStorage.getItem(itemName);
		if(jsonStr) {
			let item: T = JSON.parse(jsonStr, (key, value) => {
				switch(key) {
					case 'users': return SMap.fromJSON(value);
					case 'date': return new Date(value);
					default: return value;
				}
			});
			return item;
		}
		return undefined;
	}

	saveItem(item: any, itemName: string) {
		localStorage.setItem(itemName, JSON.stringify(item));
	}

	saveLocalStorage() {
		this.saveItem(this.state, this.lstrgState);
		this.saveItem(this.currentUser, this.lstrgCurrentUser)
	}

	componentDidMount() {
		this.setState({ userChange: false });
		this.scrollToBottom();
	}

	componentDidUpdate() {
		this.saveLocalStorage();
		if (this.didMessageSubmit) {
			this.scrollToBottom();
			this.didMessageSubmit = false;
		}
	}

	scrollToBottom() {
		//this.messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
		if(this.messagesEnd.current) {
			//let offsetBottom = this.messagesEnd.current.offsetTop + this.messagesEnd.current.offsetHeight;
			let offsetBottom = this.messagesEnd.current.offsetTop;
			this.messageWrapper.current?.scrollTo({ top: offsetBottom })
		}
	}

	handleMsgSubmit: FormEventHandler<HTMLFormElement> = (event) => {
		event.preventDefault();
		if (this.msgInput.current?.value) {
			let msg: messageType = { date: new Date(), user: this.currentUser, msg: this.msgInput.current.value }
			this.setState(state => ({ messages: [...state.messages, msg] }));
			this.msgInput.current.value = '';
			this.didMessageSubmit = true;
		}
	}

	handleUserCancel: MouseEventHandler<HTMLButtonElement> = (event) => {
		this.setState({ userChange: false });
	}

	handleUserChange: MouseEventHandler<HTMLButtonElement> = (event) => {
		this.setState({ userChange: true });
	}

	handleUserSubmit: FormEventHandler<HTMLFormElement> = (event) => {
		event.preventDefault();
		let user = this.userInput.current?.value || this.defaultUser;
		let color = this.state.users.get(user) || this.defaultColor;
		this.setState(state => ({ users: new SMap(state.users).set(user, color) }));
		this.currentUser = user;
		this.setState({ userChange: false });
	}

	handleColorOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		this.setState(state => ({ users: new SMap(state.users).set(this.currentUser, event.target.value) }));
	}

	getUserComponent() {
		let jsxe: JSX.Element;
		if (this.state.userChange) {
			jsxe = (
				<form onSubmit={this.handleUserSubmit} className='form-input'>
					<label>Username:</label>
					<input type='text' ref={this.userInput} />
					<button>Apply</button>
					<button type='button' onClick={this.handleUserCancel}>Cancel</button>
				</form>
			);
		} else {
			jsxe = (
				<div id='user-color'>
					<button type='button' className='astext' onClick={this.handleUserChange}>Change Username</button>
					<div id='color-wrapper' style={{ backgroundColor: this.state.users.get(this.currentUser) }}>
						<input type='color' id='color-input'
							ref={this.colorInput} value={this.state.users.get(this.currentUser)} onChange={this.handleColorOnChange} />
					</div>
				</div>
			);
		}
		return (
			<div id='user-component'>
				{jsxe}
			</div>
		);
	}

	formatDate(date: Date) {
		//return date.toLocaleString().replaceAll(' ', '').replaceAll(/[,/:]/g, '-');
		return date.toLocaleTimeString();
	}

	getMessages() {
		return (
			<div id='message-wrapper' ref={this.messageWrapper}>
				{this.state.messages.map(message => (
					<div key={JSON.stringify(message)}>
						<span className='mini'>[{this.formatDate(message.date)}]</span>
						<span> </span>
						<span className='bold' style={{ color: this.state.users.get(message.user) }}>{message.user}: </span>
						{message.msg}
					</div>
				))}
				<div ref={this.messagesEnd} />
			</div>
		);
	}

	render() {
		return (
			<div id='message-box'>
				{this.getMessages()}
				<div id='input-wrapper'>
					<form onSubmit={this.handleMsgSubmit} className='form-input'>
						<label>Message:</label>
						<input type='text' ref={this.msgInput} />
						<button>Submit</button>
					</form>
					{this.getUserComponent()}
				</div>
			</div>
		);
	}

}