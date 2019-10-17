import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { appService } from '../../common/services/app';
import { TeamPlayerInfo } from '../TeamPlayerInfo/TeamPlayerInfo';
import { map, get, reduce, filter, find } from 'lodash';
import { filter as rxfilter } from 'rxjs/operators';

export class Team extends Component {
    constructor(props) {
        super(props);

        this.subscribers = [];
        this.config = {
            budgetLimit: 200000
        };
        this.state = {
            team: [], // array of players objects
            modalShow: false,
            currentPlayer: null,
            isNewPlayer: false,
            budget: 0
        }
    }

    UNSAFE_componentWillMount() {        
        this.subscribers.push(appService.player
            .pipe(rxfilter(a => !!a))
            .subscribe(data => {
                const canAddPlayer = this.analyzePlayer(data);
                this.setState({ currentPlayer: data, modalShow: true, canAddPlayer, isNewPlayer: true });
            }));
    }

    componentWillUnmount() {
        this.subscribers.forEach(s => s.unsubscribe());
    }

    analyzePlayer = (player) => {
        // check for budget and team roles
        const { team, budget } = this.state;
        if (budget + player.price > this.config.budgetLimit || team.length > 3)
            return false;
        
        return reduce(team, (acc, i) => (acc && i.team !== player.team), true);
    }

    addPlayer = () => {
        const team = this.state.team.concat([this.state.currentPlayer]);
        appService.team.next(team);
        this.setState({ team, modalShow: false, currentPlayer: null });
    }

    deletePlayer = () => {
        const team = filter(this.state.team, i => i.id !== this.state.currentPlayer.id);
        appService.team.next(team);
        this.setState({ team, modalShow: false, currentPlayer: null });
    }

    handleModal = (state) => () => {
        this.setState({ modalShow: state, currentPlayer: state ? this.state.currentPlayer : null });
    }

    onTeamPlayerClick = (id) => () => {
        const currentPlayer = find(this.state.team, i => i.id === id);
        this.setState({ currentPlayer, modalShow: true, isNewPlayer: false });
    }

    renderPlayerName = (currentPlayer) => {
        return <div>{get(currentPlayer, 'player', 'n-a')}</div>;
    }

    renderPlayerDetails = (currentPlayer) => {
        return <div>
            <img alt="" src={get(currentPlayer, 'image')}></img>
        </div>
    }

    renderTeamPlayers = () => {
        return map(this.state.team, item => <TeamPlayerInfo onTeamPlayerClick={this.onTeamPlayerClick} { ...item } />);
    }

    render() { // console.log(this)
        const { modalShow, currentPlayer, canAddPlayer, isNewPlayer } = this.state;

        return <div className="team-container">
            TEAM
            { this.renderTeamPlayers() }
            <Modal show={modalShow}>
                <Modal.Header>
                    <h1>{this.renderPlayerName(currentPlayer)}</h1>
                </Modal.Header>
                <Modal.Body>
                    <div>{this.renderPlayerDetails(currentPlayer)}</div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="buttons">
                        <input type="button" value="Cancel" onClick={this.handleModal(false)}></input>
                        { !isNewPlayer ? <input type="button" value="Delete" onClick={this.deletePlayer}></input> : null }
                        { isNewPlayer ? <input type="button" value="Add Player" disabled={!canAddPlayer} onClick={this.addPlayer}></input> : null }
                    </div>
                </Modal.Footer>
            </Modal>
            </div>;
    }
}
