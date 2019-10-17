import React, { Component } from 'react';
import { map } from 'lodash';
import { personService } from '../../common/services/person';
import { appService } from '../../common/services/app';
import { filter as rxfilter } from 'rxjs/operators';
import { constants } from '../../common/helpers/constants';

export class PersonsList extends Component {
    constructor(props) {
        super(props);

        this.subscribers = [];
        this.state = {
            expanded: false,
            teamname: props.teamname
        }
    }

    UNSAFE_componentWillMount() {
        this.subscribers.push(appService.state
            .pipe(rxfilter(a => a.type === constants.TEAMLIST_CLOSE && a.payload.teamname !== this.state.teamname))
            .subscribe(() => {
                if (this.state.expanded) this.setState({ expanded: false });
            }));
    }

    componentWillUnmount() {
        this.subscribers.forEach(s => s.unsubscribe());
    }

    handleExpand = () => {
        this.setState({ expanded: !this.state.expanded }, () => {
            if (this.state.expanded) appService.state.next({ type: constants.TEAMLIST_CLOSE, payload: { teamname: this.state.teamname } })
        });
    }

    onPersonSelect = (item) => () => personService.getPerson(item);

    renderTeamName = () => {
        const { teamname } = this.state;
        return <div className="team-name" onClick={this.handleExpand}>{teamname}</div>;
    }

    renderPerson = (item) => {
        return <div key={item.id} onClick={this.onPersonSelect(item)} className="person">
            {item.player}: {item.price}
            </div>;
    }

    renderPersonList = () => {
        const { persons } = this.props;

        return <div className="persons-list">
            { map(persons, this.renderPerson) }
            </div>;
    }

    render() { // console.log(this);
        const { expanded } = this.state;

        return <div className="persons-list-container">
            { this.renderTeamName() }
            { expanded ? this.renderPersonList() : null }
            </div>;
    }
}
