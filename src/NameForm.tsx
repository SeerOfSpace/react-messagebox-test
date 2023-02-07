import React, { ChangeEventHandler, FormEventHandler } from "react";

export class NameForm extends React.Component<{}, { value: string }> {
	constructor(props: any) {
		super(props);
		this.state = { value: '' };

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
		alert('A name was submitted: ' + this.state.value);
		event.preventDefault();
	}

	handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		this.setState({ value: event.target.value });
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<label>
					Name:
					<input type="text" value={this.state.value} onChange={this.handleChange} />
				</label>
				<input type="submit" value="Submit" />
			</form>
		);
	}
}