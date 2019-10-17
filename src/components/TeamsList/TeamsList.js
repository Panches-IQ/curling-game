import React, { Component } from 'react';
import { appService } from '../../common/services/app';
import { map } from 'lodash';
import { PersonsList } from '../PersonsList/PersonsList';

export class TeamsList extends Component {
    constructor(props) {
        super(props);

        this.subscribers = [];
        this.state = {
            teams: []
        }
    }

    UNSAFE_componentWillMount() {
        this.subscribers.push(appService.persons
            .subscribe(teams => {
                this.setState({ teams })
            }));
    }

    componentWillUnmount() {
        this.subscribers.forEach(s => s.unsubscribe());
    }

    renderTeamList = () => map(this.state.teams, team => <PersonsList key={team.teamname} { ...team } />);

    render() {
        return <div className="persons-list-container">
            TEAMLIST
            { this.renderTeamList() }
            </div>;
    }
}
