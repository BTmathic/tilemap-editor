import React from 'react';

export default (props) => (
  <div className={`tile ${props.tileClass} ${props.tileType === 'map' ? 'map-tile' : ''}`}
    style={{
      left: props.column*32 % (props.mapWidth*32) ? props.column*32 % (props.mapWidth*32) : 0,
      outline: `${props.borderToggle && props.topLayer ? '1px' : '0'} solid gray`,
      top: 32*Math.floor(props.row) ? 32*Math.floor(props.row) : 0,
      zIndex: props.layer
    }}
    onClick={(e) => {
      if (props.tileType === 'newTile') {
        props.onTileClick(props.tileClass, e.clientX - 25, e.clientY - 25);
      } else if (props.tileType === 'map') {
        props.onMapClick(e, props.layer);
      }
    }}
  >
  </div>
);