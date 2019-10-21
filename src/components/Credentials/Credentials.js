import React, { Component } from 'react';
import { appService } from '../../common/services/app';
import './Credentials.css';

export class Credentials extends Component {
    constructor(props) {
        super(props);

        this.subscribers = [];
        this.state = {
            team: [],
            name: '',
            email: ''
        }
    }

    componentDidMount() {
        this.subscribers.push(appService.team
            .subscribe(team => {
                this.setState({ team });
            }));
    }

    componentWillUnmount() {
        this.subscribers.forEach(s => s.unsubscribe());
    }

    onEmailChange = (e) => {
        this.setState({ email: e.target.value }, () => {
            this.onTeamNameChange();
        });
    }

    onNameChange = (e) => {
        this.setState({ name: e.target.value }, () => {
            this.onTeamNameChange();
        });
    }

    onTeamNameChange = () => {
        const { name, email } = this.state;
        appService.teamName.next(`${name || ''}${name || email ? ':' : ''} ${email}`);
    }

    canPlay = () => {
        const { team, name, email } = this.state;
        return team.length > 3 && name && email && /@/.test(email);
    }

    render() {
        const { email, name } = this.state;
        return <div className="team-container">
            <div className="credentials-separator"></div>
            <div className="row">
                <div className="col-10">
                    <div className="row">
                        <div className="col-3 text-right">Your name:</div>
                        <input className="col-8" id="name" type="text" onChange={this.onNameChange} value={name}></input>
                    </div>
                    <div className="row">
                        <div className="col-3 text-right">Your E-mail:</div>
                        <input className="col-8" id="email" type="text" onChange={this.onEmailChange} value={email}></input>
                    </div>
                </div>
                <div className="col-2">
                    <div className="play-button-wrapper">
                        <input className="btn btn-xl btn-primary play-button" type="button" onChange={this.onPlayClick} disabled={!this.canPlay()} value="PLAY!"></input>
                    </div>
                </div>
            </div>
        </div>;
    }
}
