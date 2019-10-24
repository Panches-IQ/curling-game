import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { appService } from '../../common/services/app';

export class Game extends Component {
    constructor(props) {
        super(props);

        this.subscribers = [];
        this.state = {
            showModal: false
        }
    }

    componentDidMount() {
        this.subscribers.push(appService.gamePlay
            .subscribe(state => {
                this.setState({ showModal: state });
            }));
    }

    componentWillUnmount() {
        this.subscribers.forEach(s => s.unsubscribe());
    }

    hideModal = () => {
        this.setState({ showModal: false });
    }

    renderGameGreeting = () => {
        return <h4>You win!</h4>;
    }

    render() {
        const { showModal } = this.state;

        return <div className="game-container">
            <Modal show={showModal} onHide={this.hideModal}>
                <Modal.Header>
                    <h1>GAME INFO</h1>
                </Modal.Header>
                <Modal.Body>
                    <div>{this.renderGameGreeting()}</div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="buttons">
                        <input type="button" className="btn btn-success mx-1" value="OK" onClick={this.hideModal}></input>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>;
    }
}
