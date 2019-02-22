import React from 'react';
import Tile from './Tile';

export default class MapPane extends React.Component {
  componentDidMount() {
    const coords = this.mapPane.getBoundingClientRect();
    this.props.loadMapPosition(coords.x, coords.y);
  }

  render() {
    return (
      <div className='map-pane'
        ref={(mapPane) => this.mapPane = mapPane}
      >
        {this.props.map.map((tile, index) => {
          return <Tile colour={tile} key={tile + index} tileType={'map'} />
        })}
      </div>
    );
  }
}