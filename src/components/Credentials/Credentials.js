import React, { Component } from 'react';
import { appService } from '../../common/services/app';

export class Credentials extends Component {
    constructor(props) {
        super(props);

        this.subscribers = [];
        this.state = {
            team: [],
            name: '',
            email: '',
            teamname: ''
        }
    }

    UNSAFE_componentWillMount() {
        this.subscribers.push(appService.team
            .subscribe(team => {
                this.setState({ team });
            }));
    }

    componentWillUnmount() {
        this.subscribers.forEach(s => s.unsubscribe());
    }

    onEmailChange = (e) => {
        this.setState({ email: e.target.value });
    }

    onNameChange = (e) => {
        this.setState({ name: e.target.value });
    }

    onTeamNameChange = (e) => {
        this.setState({ teamname: e.target.value });
    }

    canPlay = () => {
        const { team, name, email, teamname } = this.state;
        return team.length > 3 && teamname && name && email && /\@/.test(email);
    }

    render() {
        const { email, name, teamname } = this.state;
        return <div className="team-container">
            CREDENTIALS
            <div className="teamname-wrapper">
                <label htmlFor="teamname">Team Name:</label>
                <input id="teamname" type="text" onChange={this.onTeamNameChange} value={teamname}></input>
            </div>
            <div className="name-wrapper">
                <label htmlFor="name">Name:</label>
                <input id="name" type="text" onChange={this.onNameChange} value={name}></input>
            </div>
            <div className="email-wrapper">
                <label htmlFor="email">E-mail:</label>
                <input id="email" type="text" onChange={this.onEmailChange} value={email}></input>
            </div>
            <div className="play-button-wrapper">
                <input type="button" onChange={this.onPlayClick} disabled={!this.canPlay()} value="PLAY!"></input>
            </div>
            </div>;
    }
}
