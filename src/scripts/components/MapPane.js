import React from 'react';
import Tile from './Tile';

export default class MapPane extends React.Component {
  // state = {
  //   map: blankMap,
  //   mouseX: 0,
  //   mouseY: 0,
  //   tile: this.props.tile
  // }

  // onMouseMove = (e) => {
  //   e.persist();
  //   const oldTile = this.state.tile;
  //   const map = this.state.map;
  //   map[tile] = 'black';
  //   if (tile !== oldTile) {
  //     map[oldTile] = 'white';
  //   }
  // }

  componentDidMount() {
    const coords = this.mapPane.getBoundingClientRect();
    this.props.loadMapPosition(coords.x, coords.y);
    this.setState(() => ({
      mouseX: this.props.mouseX,
      mouseY: this.props.mouseY,
      tile: this.props.tile
    }));
  }

  // componentDidUpdate(oldProps, newProps) {
  //   console.log('old', oldProps.tile, 'new', newProps.tile, 'state', this.state.tile);
  //   if (this.state.tile !== oldProps.tile) {
  //     this.setState(() => ({ tile: newProps.tile }));
  //   }
  // }

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