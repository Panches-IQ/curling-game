import React from 'react';

export const TeamPlayerInfo = (props) => {
    const { onTeamPlayerClick, weight, image, id, player } = props;
    return <div className="team-container" onClick={onTeamPlayerClick(id)}>
        <div className="img-container">
            <img alt="" src={image}></img>
        </div>
        <h2>{player}</h2>
        <div className="player-data-container">
            weight: {weight}
        </div>
        </div>;
}
