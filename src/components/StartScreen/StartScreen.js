import React, { Component } from 'react';
import { TeamsList } from '../TeamsList';
import { Team } from '../Team';
import { Credentials } from '../Credentials';
import { Header } from '../Header';

export class StartScreen extends Component {
    constructor(props) {
        super(props);
    }

    render() { // console.log(this)
        return <div className="start-screen-container">
            <Header />
            <TeamsList />
            <Team />
            <Credentials />
        </div>
    }
}
