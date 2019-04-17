import React from 'react';
import Tile from './Tile';

export default class MapPane extends React.Component {
  state = {
    mapShiftLeft: 0,
    mapShiftTop: 0
  }

  // handle resizing if user makes map smaller than the map display
  // on their screen
  // Possibly just don't allow it to go smaller, cropping an image
  // after downloading if fairly easy anyway
  handleResize = () => {
    const coords = this.mapPane.getBoundingClientRect();
    const mapWidth = Math.min(Math.floor((window.innerWidth * 0.95 - 380) / 32) * 32, 1600);
    const mapHeight = Math.min(Math.floor((window.innerHeight * 0.95 - 100) / 32) * 32, 1600);
    this.setState(() => ({
      coords,
      mapHeight,
      mapWidth
    }), () => this.shiftMap(this.state.mapShiftTop, this.state.mapShiftLeft));
  }

  // When map is smaller than on screen display, something goes wrong
  // when shifting map down
  shiftMap = (vert, horiz) => {
    let mapShiftLeft = this.state.mapShiftLeft + horiz;
    let mapShiftTop = this.state.mapShiftTop + vert;
    if (mapShiftLeft < 0) {
      mapShiftLeft = 0;
    } else if (mapShiftLeft + this.state.mapWidth/32 > this.props.mapWidth) {
      mapShiftLeft = this.props.mapWidth - this.state.mapWidth/32;
    }
    if (mapShiftTop < 0) {
      mapShiftTop = 0;
    } else if (mapShiftTop + this.state.mapHeight/32 > this.props.mapHeight) {
      mapShiftTop = this.props.mapHeight - this.state.mapHeight/32;
    }
    this.props.loadMapPosition(this.state.mapHeight, this.state.mapWidth, mapShiftLeft, mapShiftTop, this.state.coords.x, this.state.coords.y + window.scrollY)
    this.setState(() => ({
      mapShiftLeft,
      mapShiftTop
    }));
  }
  
  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    const coords = this.state.coords;
    return (
      <div>
        <div className='map-scroll map-scroll-up'
          onClick={() => this.shiftMap(-5, 0)}
          style={{
            left: coords ? coords.x + this.state.mapWidth/2 : 0,
            top: coords ? coords.y - 50 : 0
          }}
        ></div>
        <div className='map-scroll map-scroll-down'
          onClick={() => this.shiftMap(5, 0)}
          style={{
            left: coords ? coords.x + this.state.mapWidth/2 : 0,
            top: coords ? coords.y + this.state.mapHeight : 0
          }}
        ></div>
        <div className='map-scroll map-scroll-left'
          onClick={() => this.shiftMap(0, -5)}
          style={{ left: coords ? coords.x - 40 : 0 }}
        ></div>
        <div className='map-scroll map-scroll-right'
          onClick={() => this.shiftMap(0, 5)}
          style={{ left: coords ? coords.x + this.state.mapWidth + 20 : 0 }}
        ></div>
        <div className='map__display'
          style={{
            height: this.state.mapHeight,
            width: this.state.mapWidth
          }}
          ref={(mapPane) => this.mapPane = mapPane}
        >
          <div className={`map__display--visible`}>
            {
              this.props.map.slice(this.state.mapShiftTop).map((mapRow, rowIndex) => {
                return (
                  mapRow.slice(this.state.mapShiftLeft).map((tileClasses, columnIndex) => {
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
      </div>
    );
  }
}