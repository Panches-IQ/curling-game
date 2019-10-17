import React, { Component } from 'react';
import { personService } from '../../common/services/person';

export class Header extends Component {
    constructor(props) {
        super(props);
    }

    getPersons = () => personService.getPlayersList();

    render() {
        return <div className="team-container">
            HEADER: Welcome to fantasy curling game!
            <input type="button" onClick={this.getPersons} value="Get Persons List"></input>
            </div>;
    }
}
