import React from 'react';
import TilePane from './TilePane';
import MapPane from './MapPane';
import blankMap from '../../maps/blankMap';

export default class Editor extends React.Component {
  state = {
    activeTile: '',
    drag: false,
    map: blankMap,
    mouseX: 0,
    mouseY: 0
  }

  // Get position of mapPane on the window
  loadMapPosition = (topLeftX, topLeftY) => {
    this.setState(() => ({
      mapX: topLeftX,
      mapY: topLeftY
    }));
  }

  // place tile down if over the map
  // swap tile if over tiles
  // do nothing otherwise
  onMapClick = (e) => {
    if (this.state.drag) {
      e.persist();
      const mouseX = e.clientX - this.state.mapX;
      const mouseY = e.clientY - this.state.mapY;
      const tileIndex = Math.floor(mouseX / 34) + 20 * Math.floor(mouseY / 34);
      if (mouseX > -1 && tileIndex > -1 && tileIndex < 400) { // change tile < 100 condition
        const map = this.state.map;
        map[tileIndex] = this.state.activeTile;
        this.setState(() => ({ activeTile: '', map }));
      }
    }
    this.setState((prevState) => ({ drag: !prevState.drag }))
  }

  onMouseMove = (e) => {
    if (this.state.drag) {
      e.persist();
      this.setState(() => ({
        mouseX: e.clientX - 25,
        mouseY: e.clientY - 25
      }));
    }
  }

  onTileClick = (tile, mouseX, mouseY) => {
    this.setState(() => ({
      activeTile: tile,
      drag: true,
      mouseX,
      mouseY
    }));
  }

  render() {
    return (
      <div className='editor' onMouseMove={this.onMouseMove}>
        { this.state.activeTile && 
          <div
            className='tile'
            style={{
              border: `2px solid ${this.state.activeTile}`,
              position: 'absolute',
              left: this.state.mouseX,
              top: this.state.mouseY
            }}
            onClick={this.onMapClick}
          >
          </div>
        }
        <TilePane onTileClick={this.onTileClick} />
        <MapPane
          loadMapPosition={this.loadMapPosition}
          activeTile={this.state.activeTile}
          map={this.state.map} 
        />
      </div>
    );
  }
}