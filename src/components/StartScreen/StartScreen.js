import React, { Component } from 'react';
import { TeamsList } from '../TeamsList';
import { Team } from '../Team';
import { Credentials } from '../Credentials';
import { Header } from '../Header';
import './StartScreen.css';
import { Game } from '../Game';

export class StartScreen extends Component {
    constructor(props) {
        super(props);
    }

    render() { // console.log(this)
        return <div className="start-screen-container m-4">
            <div className="row">
                <div className="col-12"><Header /></div>
            </div>
            <br></br>
            <div className="row start-info-wrapper">
                <div className="col-8"><TeamsList /></div>
                <div className="col-4"><Team /></div>
            </div>
            <div className="row">
                <div className="col"><Credentials /></div>
            </div>
            <Game />
        </div>
    }
}
