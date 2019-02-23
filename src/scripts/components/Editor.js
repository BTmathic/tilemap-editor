import React from 'react';
import TilePane from './TilePane';
import MapPane from './MapPane';

export default class Editor extends React.Component {
  state = {
    activeTile: '',
    drag: false,
    map: Array(1600).fill('blank'),
    mapScrollOffsetX: 0,
    mapScrollOffsetY: 0,
    mouseX: 0,
    mouseY: 0,
    pageScrollOffset: 0,
    tilesOnPane: 'castle'
  }

  handleScroll = (e) => {
    const pageScrollOffset = window.scrollY;
    this.setState(() => ({ pageScrollOffset }));
  }

  // Get position of mapPane on the window
  loadMapPosition = (mapScrollLeft, mapScrollTop, mapTopLeftX, mapTopLeftY) => {
    this.setState(() => ({
      mapScrollOffsetX: mapScrollLeft,
      mapScrollOffsetY: mapScrollTop,
      mapX: mapTopLeftX,
      mapY: mapTopLeftY
    }));
  }

  // place tile down if over the map
  // swap tile if over tiles
  // do nothing otherwise
  onMapClick = (e) => {
    if (this.state.drag) {
      e.persist();
      const mouseX = e.clientX - this.state.mapX + this.state.mapScrollOffsetX;
      const mouseY = e.clientY - this.state.mapY + this.state.mapScrollOffsetY + this.state.pageScrollOffset;
      const tileIndex = Math.floor(mouseX / 33) + 40 * Math.floor(mouseY / 33);
      if (mouseX > -1 && tileIndex > -1 && tileIndex < 1600) { // change tile < 100 condition
        const map = this.state.map;
        map[tileIndex] = this.state.activeTile;
        this.setState(() => ({ activeTile: '', map }));
      }
      this.setState((prevState) => ({ drag: !prevState.drag }));
    }
  }

  onMouseMove = (e) => {
    if (this.state.drag) {
      const scrollY = window.scrollY
      e.persist();
      this.setState(() => ({
        mouseX: e.clientX - 25,
        mouseY: e.clientY - 25 + scrollY
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

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  render() {
    return (
      <div>
        <div>
          <h1>Tilemap Editor</h1>
        </div>
        <div className='editor' onMouseMove={this.onMouseMove}>
          {this.state.activeTile &&
            <div className={this.state.tilesOnPane}>
              <div
                className={`tile ${this.state.activeTile}`}
                style={{
                  position: 'absolute',
                  left: this.state.mouseX,
                  top: this.state.mouseY
                }}
                onClick={this.onMapClick}
              >
              </div>
            </div>
          }
          <div className='editor--fixed'>
            <TilePane onTileClick={this.onTileClick} tilesOnPane={this.state.tilesOnPane} />
            <MapPane
              loadMapPosition={this.loadMapPosition}
              activeTile={this.state.activeTile}
              map={this.state.map}
              tilesOnPane={this.state.tilesOnPane}
            />
          </div>
          <div className='map-dimensions'>Dimensions</div>
        </div>
      </div>
    );
  }
}