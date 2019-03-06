import React from 'react';
import TilePane from './TilePane';
import MapPane from './MapPane';

export default class Editor extends React.Component {
  state = {
    activeTile: '',
    drag: false,
    mapHeight: 40,
    map: Array(1600).fill(['blank']),
    mapScrollOffsetX: 0,
    mapScrollOffsetY: 0,
    mapWidth: 40,
    mouseX: 0,
    mouseY: 0,
    pageScrollOffset: 0,
    tilesOnPane: 'castle'
  }

  // change these two functions to a single one that fires with a submit 
  // button so we can caution before removing non-empty tiles
  changeMapHeight = (e) => {
    const mapHeight = e.currentTarget.value;
    let newMap = this.state.map;
    if (mapHeight > this.state.mapHeight) {
      for (let i = 0; i < mapHeight * this.state.mapWidth; i++) {
        newMap.push('blank');
      }
    } else {
      newMap = this.state.map.slice(0, mapHeight*this.state.mapWidth);
    }
    this.setState(() => ({ mapHeight, map: newMap }));
  }

  // change array as well, but do so carefully so as to not delete content (if possible)
  changeMapWidth = (e) => {
    const mapWidth = e.currentTarget.value;
    this.setState(() => ({ mapWidth }));
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
  onMapClick = (e, layer) => {
    e.persist();
    const map = this.state.map;
    const mouseX = e.clientX - this.state.mapX + this.state.mapScrollOffsetX;
    const mouseY = e.clientY - this.state.mapY + this.state.mapScrollOffsetY + this.state.pageScrollOffset;
    const tileIndex = Math.floor(mouseX / 33) + 40 * Math.floor(mouseY / 33);
    if (this.state.drag) {
      // this if statement doesn't notice the mapPane size, just the full map size
      if (mouseX > -1 && mouseX < this.state.mapWidth*33 && tileIndex > -1 && tileIndex < map.length) {
        // this doesn't swap tiles if you click the TilePane with a tile being dragged
        map[tileIndex] = map[tileIndex].concat(this.state.activeTile);
        this.setState(() => ({ map }));
      } else {
        this.setState(() => ({ activeTile: '', drag: false }));
      }
    } else {
      // console.log('test click when not dragging for tile removal');
      console.log(map[tileIndex]);
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
    // add window resize listener as CSS changes but JS does not
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
                  top: this.state.mouseY,
                  zIndex: 10
                }}
                onClick={(e) => {this.onMapClick(e, 1)}}
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
              onMapClick={this.onMapClick}
            />
          </div>
          <div className='map-dimensions'>Map Dimensions
            <form>
              <div>
                <label>Height:</label>
                <input name='Height: ' type='number' value={this.state.mapHeight} onChange={this.changeMapHeight} />
              </div>
              <div>
                <label>Width:</label>
                <input name='Width: ' type='number' value={this.state.mapWidth} onChange={this.changeMapWidth} />
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}