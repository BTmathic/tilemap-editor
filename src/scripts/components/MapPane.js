import React from 'react';
import Tile from './Tile';

export default class MapPane extends React.Component {
  state = {
    scrollLeft: 0,
    scrollTop: 0
  }

  handleScroll = () => {
    this.setState(() => ({
      scrollLeft: this.mapPane.scrollLeft,
      scrollTop: this.mapPane.scrollTop
    }), () => this.props.loadMapPosition(this.state.scrollLeft, this.state.scrollTop, this.state.coords.x, this.state.coords.y));
  }
  
  componentDidMount() {
    const coords = this.mapPane.getBoundingClientRect();
    this.setState(() => ({ coords }));
    this.props.loadMapPosition(this.state.scrollLeft, this.state.scrollTop, coords.x, coords.y);
  }

  render() {
    return (
      <div className='map-pane' onScroll={this.handleScroll} ref={(mapPane) => this.mapPane = mapPane}>
        <div className={`map-pane--visible ${this.props.tilesOnPane}`}>
          {this.props.map.map((tileClasses, index) => {
            return (
              tileClasses.map((tileClass, layer) => {
              return (
                <Tile
                  tileClass={tileClass}
                  index={index}
                  key={tileClass + index + layer}
                  layer={layer}
                  tileType={'map'}
                  // onMapClick should only attach once per layer
                  // technically it really only needs to attach to the grid
                  // not any of the tiles
                  onMapClick={this.props.onMapClick}
                />
              );
            })
          );
        })}
        </div>
      </div>
    );
  }
}