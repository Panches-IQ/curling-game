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
            teamname: ''
        }
    }

    UNSAFE_componentWillMount() {        
        this.subscribers.push(appService.player
            .pipe(rxfilter(a => !!a))
            .subscribe(data => {
                const canAddPlayer = this.analyzePlayer(data);
                this.setState({ currentPlayer: data, modalShow: true, canAddPlayer, isNewPlayer: true });
            }));
        this.subscribers.push(appService.teamName
            .subscribe(teamname => {
                this.setState({ teamname });
            }));
    }

    componentWillUnmount() {
        this.subscribers.forEach(s => s.unsubscribe());
    }

    analyzePlayer = (player) => {
        const { team } = this.state;
        const teamPrice = reduce(team, (acc, i) => (acc + i.price), 0);
        if (teamPrice + player.price > this.config.budgetLimit || team.length > 3)
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
        return <div className="row">
            <div className="col-4">
                <img alt="" src={get(currentPlayer, 'image')}></img>
            </div>
            <div className="col-8">
                <div className="row">
                    <div className="col-4 text-left">Name:</div>
                    <div className="col-8 text-left font-weight-bold">{get(currentPlayer, 'player', '')}</div>
                </div>
                <div className="row">
                    <div className="col-4 text-left">Weight:</div>
                    <div className="col-8 text-left font-weight-bold">{get(currentPlayer, 'weight', '')}</div>
                </div>
                <div className="row">
                    <div className="col-4 text-left">Height:</div>
                    <div className="col-8 text-left font-weight-bold">{get(currentPlayer, 'height', '')}</div>
                </div>
                <div className="row">
                    <div className="col-4 text-left">Nationality:</div>
                    <div className="col-8 text-left font-weight-bold">{get(currentPlayer, 'nationality', '')}</div>
                </div>
                <div className="row">
                    <div className="col-4 text-left">Postion:</div>
                    <div className="col-8 text-left font-weight-bold">{get(currentPlayer, 'position', '')}</div>
                </div>
                <div className="row">
                    <div className="col-4 text-left">Price:</div>
                    <div className="col-8 text-left font-weight-bold">{get(currentPlayer, 'price', '')}</div>
                </div>
            </div>
        </div>
    }

    renderTeamName = () => {
        const { teamname } = this.state;
        return <div className="text-primary">Your team: {teamname}</div>
    }

    renderTeamPlayers = () => {
        return map(this.state.team, item => <TeamPlayerInfo key={item.id} onTeamPlayerClick={this.onTeamPlayerClick} { ...item } />);
    }

    render() { // console.log(this)
        const { modalShow, currentPlayer, canAddPlayer, isNewPlayer } = this.state;

        return <div className="team-container">
            { this.renderTeamName() }
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
                        <input type="button" className="btn btn-danger mx-1" value="Cancel" onClick={this.handleModal(false)}></input>
                        { !isNewPlayer ? <input className="btn btn-warning mx-1" type="button" value="Delete" onClick={this.deletePlayer}></input> : null }
                        { isNewPlayer ? <input className="btn btn-success mx-1" type="button" value="Add Player" disabled={!canAddPlayer} onClick={this.addPlayer}></input> : null }
                    </div>
                </Modal.Footer>
            </Modal>
            </div>;
    }
}
