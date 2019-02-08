import React from 'react';
import Tile from './Tile';

const map = [
  'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white'
];

export default () => (
  <div className='map-pane'>
    {map.map((tile, index) => {
      return <Tile colour={tile} key={tile + index} tileType={'map'} />
    })}
  </div>
);