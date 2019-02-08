import React from 'react';
import TilePane from './TilePane';
import MapPane from './MapPane';

export default class Editor extends React.Component {
  state = {
    activeTile: '',
    drag: false,
    mouseX: 0,
    mouseY: 0
  }

  onClick = () => {
    if (this.state.drag) {
      // place tile down if over the map
      // swap tile if over tiles
      // do nothing otherwise
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
              border: '2px solid cyan',
              position: 'absolute',
              left: this.state.mouseX,
              top: this.state.mouseY
            }}
            onClick={this.onClick}
            //onMouseMove={this.onMouseMove}
          >
          </div>
        }
        <TilePane onTileClick={this.onTileClick} />
        <MapPane />
      </div>
    );
  }
}