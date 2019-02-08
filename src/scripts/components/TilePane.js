import React from 'react';
import Tile from './Tile';

const tiles = ['red', 'blue', 'green', 'pink', 'orange', 'purple', 'lightgrey', 'magenta']

export default class TilePane extends React.Component {
  
  render() {
    return (
      <div className='tile-pane'>
        {tiles.map((tile) => {
          return <Tile colour={tile} key={tile} tileType={'newTile'}
            onTileClick={this.props.onTileClick}
          />
        })}
      </div>
    );
  }
}