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

    componentDidMount() {        
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

    renderPlayerDetails = (player) => {
        const fields = ['player', 'position', 'weight', 'height', 'nationality', 'dominant-hand', 'price'];
        const labels = ['Name', 'Position', 'Weight', 'Height', 'Nationality', 'Work hand', 'Price']
        return <div className="row">
            <div className="col-4">
                <img alt="" src={get(player, 'image')}></img>
            </div>
            <div className="col-8">
                { map(fields, (i, indx) => <div key={i} className="row">
                    <div className="col-5 text-left">{labels[indx]}:</div>
                    <div className="col-7 text-left font-weight-bold">{get(player, `[${i}]`, 'n/a')}</div>
                </div>) }
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
            <Modal show={modalShow} onHide={this.handleModal(false)}>
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
