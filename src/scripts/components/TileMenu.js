import React from 'react';

export default (props) => {
  const options = ['Castle', 'Mountains', 'Woods', 'Paths', 'City', 'CityII'];
  return (
    <div className = 'tile-pane__menu' >
      {options.map((tiles) => {
        return (
          <div className='tile-pane--option'
            onClick={() => props.changeTiles(tiles.toLowerCase())}
            key={tiles}
          >
            {tiles}
          </div>
      )})}
      </div>
    );
  }