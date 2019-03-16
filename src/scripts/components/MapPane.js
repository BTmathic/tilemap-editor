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
        <div className={`map-pane--visible`}>
          {
            this.props.map.map((mapRow, rowIndex) => {
              return (
                mapRow.map((tileClasses, columnIndex) => {
                return tileClasses.map((tileClass, layer, arr) => {
                  const layers = arr.length - 1;
                  return (
                    <Tile
                      tile={{
                        type: tileClass.type,
                        tileClass: tileClass.tileClass
                      }}
                      borderToggle={this.props.borderToggle}
                      column={columnIndex}
                      key={tileClass + rowIndex + layer}
                      layer={layer}
                      mapWidth={this.props.mapWidth}
                      row={rowIndex}
                      topLayer={layers === layer}
                      tileType={'map'}
                      onMapClick={this.props.onMapClick}
                    />
                  );
                });
              })
            );
          })}
        </div>
      </div>
    );
  }
}