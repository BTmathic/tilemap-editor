import React from 'react';
import TilePane from './TilePane';
import MapPane from './MapPane';
import MapSettings from './MapSettings';

export default class Editor extends React.Component {
  state = {
    activeEdit: '',
    activeTile: '',
    borderToggle: true,
    confirmDelete: 0,
    drag: false,
    editTileIndex: '',
    mapHeight: 40,
    map: Array(40).fill(null).map((row) => Array(40).fill(['blank'])),
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

  // Two step delete function to edit the layers of tiles on the map
  // First click simply selects a tile and warns/asks to confirm user wants
  // the tile deleted. Second click deletes the tile. None of this is binding
  // as the user must confirm saving the edits before the map is changed
  onEditClick = (index) => {
    if (this.state.confirmDelete == index) {
      const activeEdit = this.state.activeEdit;
      activeEdit.splice(index, 1);
      this.setState(() => ({ activeEdit, confirmDelete: 0 }));
    } else {
      this.setState(() => ({ confirmDelete: index}));
    }
  }

  // Save the current edit to a tile onto the map
  onEditSave = () => {
    const map = this.state.map;
    map[this.state.editTileIndex] = this.state.activeEdit;
    this.setState(() => ({
      activeEdit: '',
      confirmDelete: 0,
      editTileIndex: '',
      map
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
    const tileColumnIndex = Math.floor(mouseX/32);
    const tileRowIndex = Math.floor(mouseY/32);
    if (this.state.drag) {
      if ( // mouse inside the MapPane DOM window, including scroll
          mouseX - this.state.mapScrollOffsetX > -1 &&
          mouseX - this.state.mapScrollOffsetX < this.state.mapDOMWidth &&
          mouseY > 0 &&
          mouseY - this.state.mapScrollOffsetY < this.state.mapDOMHeight &&
          tileColumnIndex > -1 && tileRowIndex > -1 &&
          tileColumnIndex < map[0].length && tileRowIndex < map.length &&
          map[tileRowIndex][tileColumnIndex].length < 8 // we do not want to allow pointlessly adding tile after tile after tile
      ) {
        map[tileRowIndex][tileColumnIndex] = map[tileRowIndex][tileColumnIndex].concat(this.state.activeTile);
        this.setState(() => ({ map }));
      } else { // mouse outside MapPaneDOM
        this.setState(() => ({ activeTile: '', drag: false }));
      }
    } else { // clicking on the map loads a popup with each layer tile to edit
      this.setState(() => ({
        activeEdit: map[tileRowIndex][tileColumnIndex].slice(),
        editTileIndex: tileIndex
      }));
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
    if (!this.state.activeEdit) {
      this.setState(() => ({
        activeTile: tile,
        drag: true,
        mouseX,
        mouseY
      }));
    }
  }

  toggleBorders = () => {
    this.setState((prevState) => ({ borderToggle: !prevState.borderToggle}));
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
      <div className='editor-page'>
        <div>
          <h1>Tilemap Editor</h1>
        </div>
        <MapSettings />
        <div
          className='toggle-borders'
          onClick={this.toggleBorders}
          style={{ outline: `${this.state.borderToggle ? '2px' : '0'} solid gray` }}
        >
          Borders
        </div>
        <div className='editor' onMouseMove={this.onMouseMove}>
          {
            this.state.activeEdit &&
            <div className='edit-tiles'>
              <h2>Tiles</h2>
              <div className='edit-tile__tiles'>
                <div className={this.state.tilesOnPane}>
                  {this.state.activeEdit.map((tile, index, arr) => {
                    if (index) {
                      return (
                        <div
                          className={`tile ${tile} ${this.state.confirmDelete === index ? 'tile--delete' : ''}`}
                          key={index}
                          onClick={() => this.onEditClick(index)}
                        ></div>
                      );
                    } else if (arr.length === 1) {
                      return <div>No tiles</div>;
                    }
                  })}
                </div>
              </div>
              <div style={{ visibility: !!this.state.confirmDelete ? 'visible' : 'hidden' }}>Are you sure?</div>
              <h4>Select tiles you wish to remove</h4>
              <div className='edit-tiles--buttons'>
                <div className='edit-tiles--button'
                  onClick={() => this.onEditSave()}
                >
                  Save
                </div>
                <div className='edit-tiles--button'
                  onClick={() => this.setState(() => ({ activeEdit: '', confirmDelete: 0 }))}
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
                  outline: '1px solid gray',
                  outlineOffset: '-1px',
                  top: this.state.mouseY,
              zIndex: 10
            }}
                onClick={(e) => { this.onMapClick(e, 1) }}
              >
              </div>
            </div>
          }
          <div className='editor--fixed'>
            <TilePane
              borderToggle={true}
              onTileClick={this.onTileClick}
              tilesOnPane={this.state.tilesOnPane}
            />
            <MapPane
              loadMapPosition={this.loadMapPosition}
              activeTile={this.state.activeTile}
              borderToggle={this.state.borderToggle}
              map={this.state.map}
              tilesOnPane={this.state.tilesOnPane}
              onMapClick={this.onMapClick}
            />
          </div>
        </div>
      </div>
    );
  }
}