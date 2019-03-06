import React from 'react';

export default (props) => (
  <div className={`tile ${props.tileClass} ${props.tileType === 'map' ? 'map-tile' : ''}`}
    // change 41 to width and height + 1
    style={{
      left: props.index * (32 + 1) % (40 * (32 + 1)) ? props.index * (32 + 1) % (40 * (32 + 1)) : 0,
      top: (32 + 1) * Math.floor(props.index / 40) ? (32 + 1) * Math.floor(props.index / 40) : 0,
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