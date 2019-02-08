import React from 'react';

export default (props) => (
  <div className='tile' style={{borderColor: props.colour}}
    onClick={(e) => {
      if (props.tileType === 'newTile') {
        props.onTileClick(props.colour, e.clientX - 25, e.clientY - 25)
      }
    }}
  >
  </div>
);