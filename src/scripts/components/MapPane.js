import React from 'react';
import Tile from './Tile';

export default class MapPane extends React.Component {
  state = {
    scrollLeft: 0,
    scrollTop: 0
  }

  handleScroll = () => {
    const scrollLeft = this.mapPane.scrollLeft;
    const scrollTop = this.mapPane.scrollTop;
    this.setState(() => ({
      scrollLeft,
      scrollTop
    }));
    this.props.loadMapPosition(this.state.coords.height, this.state.coords.width, scrollLeft, scrollTop, this.state.coords.x, this.state.coords.y + window.scrollY);
  }
  
  componentDidMount() {
    const coords = this.mapPane.getBoundingClientRect();
    this.setState(() => ({ coords }));
    this.props.loadMapPosition(coords.height, coords.width, this.state.scrollLeft, this.state.scrollTop, coords.x, coords.y + window.scrollY);
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