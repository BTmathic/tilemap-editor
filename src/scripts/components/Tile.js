import React from 'react';

export default (props) => (
  <div className={`tile ${props.tileClass}`}
    onClick={(e) => {
      if (props.tileType === 'newTile') {
        props.onTileClick(props.tileClass, e.clientX - 25, e.clientY - 25);
      } else if (props.tileType === 'map') {
        props.onMapClick(e);
      }
    }}
  >
  </div>
);