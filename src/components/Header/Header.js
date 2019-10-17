import React, { Component } from 'react';
import { personService } from '../../common/services/person';
import './Header.css';

export class Header extends Component {
    constructor(props) {
        super(props);
    }

    getPersons = () => personService.getPlayersList();

    render() {
        return <div className="my-lg-3 mw-100 header-container">
            <h2 className="text-default">Welcome to fantasy curling game!</h2>
            <input className="btn btn-primary btn-lg" type="button" onClick={this.getPersons} value="Get Persons List"></input>
            </div>;
    }
}
