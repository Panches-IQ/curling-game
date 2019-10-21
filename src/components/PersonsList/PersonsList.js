import React, { Component } from 'react';
import { map } from 'lodash';
import { personService } from '../../common/services/person';
import { appService } from '../../common/services/app';
import { filter as rxfilter } from 'rxjs/operators';
import { constants } from '../../common/helpers/constants';
import './PersonsList.css';

export class PersonsList extends Component {
    constructor(props) {
        super(props);

        this.subscribers = [];
        this.state = {
            expanded: false,
            teamname: props.teamname
        }
    }

    componentDidMount() {
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
        return <div className="team-name btn btn-primary btn-sm btn-block my-2" onClick={this.handleExpand}>{teamname}</div>;
    }

    renderPerson = (item) => {
        return <div className="row" key={item.id}>
            <div onClick={this.onPersonSelect(item)} className="col-6 text-right person-name btn btn-link">
                {item.player} 
            </div>
            <div className="col-6 text-left person-price">Price: {item.price}</div>
        </div>
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
