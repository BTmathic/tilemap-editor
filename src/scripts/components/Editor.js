import React from 'react';
import TilePane from './TilePane';
import MapPane from './MapPane';

export default class Editor extends React.Component {
  state = {
    activeEdit: ['blank', 'tile0107'],
    activeTile: '',
    drag: false,
    mapHeight: 40,
    map: Array(1600).fill(['blank']),
    mapDOMHeight: 0,
    mapDOMWidth: 0,
    mapScrollOffsetX: 0,
    mapScrollOffsetY: 0,
    mapWidth: 40,
    mouseX: 0,
    mouseY: 0,
    pageScrollOffset: window.scrollY,
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

  handleScroll = () => {
    const pageScrollOffset = window.scrollY;
    this.setState(() => ({ pageScrollOffset }));
  }

  // Get position of mapPane on the window
  loadMapPosition = (mapDOMHeight, mapDOMWidth, mapScrollLeft, mapScrollTop, mapTopLeftX, mapTopLeftY) => {
    console.log(mapTopLeftY, window.scrollY, this.state.pageScrollOffset);
    this.setState(() => ({
      mapDOMHeight,
      mapDOMWidth,
      mapScrollOffsetX: mapScrollLeft,
      mapScrollOffsetY: mapScrollTop,
      mapX: mapTopLeftX,
      mapY: mapTopLeftY
    }));
  }

  // This function has two main parts, either clicking on the MapPane or elsewhere
  // If dragging a tile, clicking the map places the tile in the corresponding spot,
  // layering one on top of another if consecutive tiles are placed. If not dragging
  // a tile, clicking brings up the placed tiles to allow deleting, if there are any.
  // Otherwise, clicking outside the map removes the active tile from being dragged.
  onMapClick = (e, layer) => {
    e.persist();
    const map = this.state.map;
    const mouseX = e.clientX - this.state.mapX + this.state.mapScrollOffsetX;
    const mouseY = e.clientY - this.state.mapY + this.state.mapScrollOffsetY + this.state.pageScrollOffset;
    // console.log(e.clientY, this.state.mapY);
    // console.log(mouseY);
    const tileIndex = Math.floor(mouseX / 33) + this.state.mapWidth * Math.floor(mouseY / 33);
    if (this.state.drag) {
      if ( // mouse inside the MapPane DOM window, including scroll
          mouseX - this.state.mapScrollOffsetX > -1 &&
          mouseX - this.state.mapScrollOffsetX < this.state.mapDOMWidth &&
          mouseY > 0 &&
          mouseY - this.state.mapScrollOffsetY < this.state.mapDOMHeight &&
          tileIndex > -1 &&
          tileIndex < map.length &&
          map[tileIndex].length < 8 // we do not want to allow pointlessly adding tile after tile after tile
      ) {
        map[tileIndex] = map[tileIndex].concat(this.state.activeTile);
        this.setState(() => ({ map }));
      } else { // mouse outside MapPaneDOM
        this.setState(() => ({ activeTile: '', drag: false }));
      }
    } else {
      // add a popup with each layered tile (if any)?
      //console.log(map[tileIndex]);
      this.setState(() => ({ activeEdit: map[tileIndex] }));
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
    console.log(this.state.activeEdit);
    return (
      <div>
        <div>
          <h1>Tilemap Editor</h1>
        </div>
        <div className='editor' onMouseMove={this.onMouseMove}>
          {
            this.state.activeEdit &&
            <div className='edit-tiles'>
              <h2>Tiles</h2>
              <div className='edit-tile__tiles'>
                <div className={this.state.tilesOnPane}>
                  {this.state.activeEdit.map((tile, index) => {
                    return <div className={`tile ${tile}`} key={index}></div>
                  })}
                </div>
              </div>
              <div className='edit-tiles--buttons'>
                <div className='edit-tiles--button'>
                  Save
                </div>
                <div className='edit-tiles--button'
                  onClick={() => this.setState(() => ({ activeEdit: '' }))}
                >
                  Close
                </div>
              </div>
            </div>
          }
          {
            this.state.activeTile &&
            <div className={this.state.tilesOnPane}>
              <div
                className={`tile ${this.state.activeTile}`}
                style={{
                  position: 'absolute',
                  left: this.state.mouseX,
                  top: this.state.mouseY,
                  zIndex: 10
                }}
                onClick={(e) => { this.onMapClick(e, 1) }}
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