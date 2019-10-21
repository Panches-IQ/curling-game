import React, { Component } from 'react';
import { appService } from '../../common/services/app';
import { map } from 'lodash';
import { PersonsList } from '../PersonsList/PersonsList';
import './TeamsList.css';

export class TeamsList extends Component {
    constructor(props) {
        super(props);

        this.subscribers = [];
        this.state = {
            teams: []
        }
    }

    componentDidMount() {
        this.subscribers.push(appService.persons
            .subscribe(teams => {
                this.setState({ teams })
            }));
    }

    componentWillUnmount() {
        this.subscribers.forEach(s => s.unsubscribe());
    }

    renderNoTeams = () => {
        return <div className="text-info">No teams found. Press 'Get Person List' to load teams.</div>
    }

    renderTeamList = () => map(this.state.teams, team => <PersonsList key={team.teamname} { ...team } />);

    render() {
        return <div className="teams-list-container">
            { this.state.teams.length ? this.renderTeamList() : this.renderNoTeams() }
            </div>;
    }
}
