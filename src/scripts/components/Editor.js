import React from 'react';
import TileMenu from './TileMenu';
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
    editTileColumnIndex: '',
    editTileRowIndex: '',
    mapDOMHeight: 0,
    mapDOMWidth: 0,
    mapScrollOffsetX: 0,
    mapScrollOffsetY: 0,
    mouseX: 0,
    mouseY: 0,
    pageScrollOffset: window.scrollY,
    tilesOnPane: 'castle'
  }

  changeMap = (map, mapHeight, mapWidth) => {
    this.setState(() => ({ 
      map,
      mapHeight,
      mapWidth
     }), this.storeMap);
  }

  changeTiles = (tiles) => {
    this.setState(() => ({ tilesOnPane: tiles}));
  }

  handleScroll = () => {
    const pageScrollOffset = window.scrollY;
    this.setState(() => ({ pageScrollOffset }));
  }

  // Get position of mapPane on the window
  loadMapPosition = (mapDOMHeight, mapDOMWidth, mapScrollLeft, mapScrollTop, mapTopLeftX, mapTopLeftY) => {
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
    map[this.state.editTileRowIndex][this.state.editTileColumnIndex] = this.state.activeEdit;
    this.setState(() => ({
      activeEdit: '',
      confirmDelete: 0,
      editTileColumnIndex: '',
      editTileRowIndex: '',
      map
    }), this.storeMap);
  }

  // This function has two main parts, either clicking on the MapPane or elsewhere
  // If dragging a tile, clicking the map places the tile in the corresponding spot,
  // layering one on top of another if consecutive tiles are placed. If not dragging
  // a tile, clicking brings up the placed tiles to allow deleting, if there are any.
  // Otherwise, clicking outside the map removes the active tile from being dragged.
  onMapClick = (e, layer) => {
    const map = this.state.map;
    const mouseX = e.clientX - this.state.mapX + this.state.mapScrollOffsetX;
    const mouseY = e.clientY - this.state.mapY + this.state.mapScrollOffsetY + this.state.pageScrollOffset;
    const tileColumnIndex = Math.floor(mouseX/32);
    const tileRowIndex = Math.floor(mouseY/32);
    e.persist();
    if (this.state.drag) {
      const currentTile = map[tileRowIndex][tileColumnIndex];
      if ( // mouse inside the MapPane DOM window, including scroll
        mouseX - this.state.mapScrollOffsetX > -1 &&
        mouseX - this.state.mapScrollOffsetX < this.state.mapDOMWidth &&
        mouseY > 0 &&
        mouseY - this.state.mapScrollOffsetY < this.state.mapDOMHeight &&
        tileColumnIndex > -1 && tileRowIndex > -1 &&
        tileColumnIndex < map[0].length && tileRowIndex < map.length &&
        currentTile.length < 8 // we do not want to allow pointlessly adding tile after tile after tile
      ) {
        if (currentTile.length === 1) {
          map[tileRowIndex][tileColumnIndex].type = this.state.tilesOnPane;
        }
        map[tileRowIndex][tileColumnIndex] = map[tileRowIndex][tileColumnIndex].concat(this.state.activeTile);
        this.setState(() => ({ map }), this.storeMap);
      } else { // mouse outside MapPaneDOM
        this.setState(() => ({ activeTile: '', drag: false }));
      }
    } else { // clicking on the map loads a popup with each layer tile to edit
      this.setState(() => ({
        activeEdit: map[tileRowIndex][tileColumnIndex].slice(),
        editTileColumnIndex: tileColumnIndex,
        editTileRowIndex: tileRowIndex
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

  storeMap = () => {
    // save map changes locally
    localStorage.setItem('map', JSON.stringify(this.state.map));
  }

  toggleBorders = () => {
    this.setState((prevState) => ({ borderToggle: !prevState.borderToggle}));
  }

  componentDidMount() {
    // add window resize listener as CSS changes but JS does not
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillMount() {
    const initialMap = Array(40).fill(null).map((row) => {
      return Array(40).fill([{
        tile: '',
        type: 'castle'
      }]);
    });
    const loadMap = localStorage.getItem('map');
    this.setState(() => ({
      map: loadMap ? JSON.parse(loadMap) : initialMap,
      mapHeight: loadMap ? JSON.parse(loadMap).length : 40,
      mapWidth: loadMap ? JSON.parse(loadMap)[0].length : 40
    }));
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
        <MapSettings 
          changeMap={this.changeMap}
          map={this.state.map}
          mapHeight={this.state.mapHeight}
          mapWidth={this.state.mapWidth}
        />
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
                <div>
                  {this.state.activeEdit.map((tile, index, arr) => {
                    if (index) {
                      return (
                        <div
                          className={`tile ${arr[0]} ${tile.type} ${tile.tileClass} ${this.state.confirmDelete === index ? 'tile--delete' : ''}`}
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
                <div className='edit-tiles--button'
                  onClick={() => this.setState(() => ({ activeEdit: ['blank'] }))}
                >
                  Reset
                </div>
              </div>
            </div>
          }
          {
            this.state.activeTile &&
            <div>
              <div
                className={`tile ${this.state.activeTile.type} ${this.state.activeTile.tileClass}`}
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
            <div className='tile-pane'>
              <TileMenu changeTiles={this.changeTiles} />
              <TilePane
                borderToggle={true}
                onTileClick={this.onTileClick}
                tilesOnPane={this.state.tilesOnPane}
              />
            </div>
            <MapPane
              loadMapPosition={this.loadMapPosition}
              activeTile={this.state.activeTile}
              borderToggle={this.state.borderToggle}
              map={this.state.map}
              mapWidth={this.state.mapWidth}
              onMapClick={this.onMapClick}
              tilesOnPane={this.state.tilesOnPane}
            />
          </div>
        </div>
      </div>
    );
  }
}