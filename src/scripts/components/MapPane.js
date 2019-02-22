import React from 'react';
import Tile from './Tile';

export default class MapPane extends React.Component {
  componentDidMount() {
    const coords = this.mapPane.getBoundingClientRect();
    this.props.loadMapPosition(coords.x, coords.y);
  }

  render() {
    return (
      <div className={`map-pane ${this.props.tilesOnPane}`}
        ref={(mapPane) => this.mapPane = mapPane}
      >
        {this.props.map.map((tileClass, index) => {
          return <Tile tileClass={tileClass} key={tileClass + index} tileType={'map'} />
        })}
      </div>
    );
  }
}