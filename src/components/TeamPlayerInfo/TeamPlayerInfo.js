import React from 'react';
import './TeamPlayerInfo.css';

export const TeamPlayerInfo = (props) => { // console.log(props)
    const { onTeamPlayerClick, image, id, player, position, price } = props;
    return <div className="team-player-container" onClick={onTeamPlayerClick(id)}>
        <div className="img-container row">
            <img alt="" src={image} className="player-img"></img>
        </div>
        <h4 className="text-primary text-bold">{player}</h4>
        <div className="row">
            <div className="col-6 text-right">Position:</div>
            <div className="col-6 text-left">{position}</div>
        </div>
        <div className="row">
            <div className="col-6 text-right">Price:</div>
            <div className="col-6 text-left">{price}</div>
        </div>
    </div>;
}
