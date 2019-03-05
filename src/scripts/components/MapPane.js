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
        <div className={`map-pane--visible ${this.props.tilesOnPane}`}
          
        >
          {this.props.map.map((tileClass, index) => {
            return (
              <Tile
                tileClass={tileClass}
                key={tileClass + index}
                tileType={'map'}
                onMapClick={this.props.onMapClick}
              />
            );
          })}
        </div>
      </div>
    );
  }
}