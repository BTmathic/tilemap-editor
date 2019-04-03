import React from 'react';
import TileEdit from './TileEdit';
import TileMenu from './TileMenu';
import TilePane from './TilePane';
import MapPane from './MapPane';
import MapView from './MapView';
import MapSettings from './MapSettings';

export default class Editor extends React.Component {
  state = {
    activeEdit: '',
    activeTile: '',
    borderToggle: true,
    drag: false,
    editTileColumnIndex: '',
    editTileRowIndex: '',
    mapDOMHeight: 0,
    mapDOMWidth: 0,
    mapScrollOffsetX: 0,
    mapScrollOffsetY: 0,
    mapShiftLeft: 0,
    mapShiftTop: 0,
    mouseX: 0,
    mouseY: 0,
    pageScrollOffset: window.scrollY,
    tilesOnPane: 'castle',
    viewMap: false
  }

  changeMap = (map, mapHeight, mapWidth) => {
    this.setState(() => ({ 
      map,
      mapHeight,
      mapWidth
     }), this.storeMap);
  }

  handleTileEdit = (activeEdit) => {
    this.setState(() => ({ activeEdit }));
  }

  changeTiles = (tiles) => {
    this.setState(() => ({ tilesOnPane: tiles}));
  }

  handleScroll = () => {
    const pageScrollOffset = window.scrollY;
    this.setState(() => ({ pageScrollOffset }));
  }

  // Get position of mapPane in the window
  loadMapPosition = (mapDOMHeight, mapDOMWidth, shiftLeft, shiftTop, mapTopLeftX, mapTopLeftY) => {
    const mapShiftLeft = 32*shiftLeft;
    const mapShiftTop = 32*shiftTop;
    this.setState(() => ({
      mapDOMHeight,
      mapDOMWidth,
      mapShiftLeft,
      mapShiftTop,
      mapX: mapTopLeftX,
      mapY: mapTopLeftY
    }));
  }

  // Save the current edit of a tiles layers to the map
  onEditSave = () => {
    const map = this.state.map;
    map[this.state.editTileRowIndex][this.state.editTileColumnIndex] = this.state.activeEdit;
    this.setState(() => ({
      activeEdit: '',
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
  onMapClick = (e) => {
    const map = this.state.map;
    const mouseX = e.clientX - this.state.mapX + this.state.mapShiftLeft;
    const mouseY = e.clientY - this.state.mapY + this.state.mapShiftTop; // + this.state.pageScrollOffset;
    const tileColumnIndex = Math.floor(mouseX/32);
    const tileRowIndex = Math.floor(mouseY/32);
    //e.persist();
    if (this.state.drag) {
      const currentTile = tileRowIndex > -1 ? map[tileRowIndex][tileColumnIndex] : null;
      if ( // mouse inside the MapPane DOM window, including scroll
        mouseX - this.state.mapShiftLeft > -1 &&
        mouseX - this.state.mapShiftLeft < this.state.mapDOMWidth &&
        mouseY > 0 &&
        mouseY - this.state.mapShiftTop < this.state.mapDOMHeight &&
        tileColumnIndex > -1 && tileRowIndex > -1 &&
        tileColumnIndex < map[0].length && tileRowIndex < map.length &&
        currentTile.length < 8 // we do not want to allow pointlessly adding tile after tile after tile
      ) {
        const newTile = this.state.activeTile;
        
        const prevTile = currentTile.slice(-1)[0];
        if (newTile.type !== prevTile.type || newTile.tileClass !== prevTile.tileClass) {
          if (currentTile.length === 1) {
            map[tileRowIndex][tileColumnIndex].type = this.state.tilesOnPane;
          }
          map[tileRowIndex][tileColumnIndex] = map[tileRowIndex][tileColumnIndex].concat(this.state.activeTile);
          this.setState(() => ({ map }), this.storeMap);
        }
      } else { // mouse outside MapPaneDOM
        this.setState(() => ({ activeTile: '', drag: false }));
      }
    } else { // clicking on the map loads a popup with each layer tile to edit
      if (tileRowIndex > -1 && tileColumnIndex > -1 && tileColumnIndex < map[0].length && tileRowIndex < map.length
        && mouseX - this.state.mapShiftLeft < this.state.mapDOMWidth &&
        mouseY - this.state.mapShiftTop < this.state.mapDOMHeight
      ) {
        this.setState(() => ({
          activeEdit: map[tileRowIndex][tileColumnIndex].slice(0),
          editTileColumnIndex: tileColumnIndex,
          editTileRowIndex: tileRowIndex
        }));
      }
      this.onMouseDrag(false);
    }
  }

  onMouseDrag = (mouseDown) => {
    this.setState(() => ({
      mouseDown
    }));
  }

  onMouseDragMove = (e) => {
    if (this.state.mouseDown) {
      this.onMapClick(e);
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

  // When clicking on a tile on TilePane, we pickup the tile and drag
  // it around to to be able to use it on MapPane
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

  // save map changes locally to not lose work accidentally
  storeMap = () => {
    localStorage.setItem('map', JSON.stringify(this.state.map));
  }

  toggleBorders = () => {
    this.setState((prevState) => ({ borderToggle: !prevState.borderToggle}));
  }

  toggleFullMap = () => {
    this.setState((prevState) => ({ viewMap: !prevState.viewMap }));
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('mousemove', this.onMouseDragMove);
  }

  componentWillMount() {
    const initialMap = Array(50).fill(null).map((row) => {
      return Array(50).fill([{
        tile: '',
        type: 'castle'
      }]);
    });
    const loadMap = localStorage.getItem('map');
    this.setState(() => ({
      map: loadMap ? JSON.parse(loadMap) : initialMap,
      mapHeight: loadMap ? JSON.parse(loadMap).length : 50,
      mapWidth: loadMap ? JSON.parse(loadMap)[0].length : 50
    }));
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('mousemove', this.onMouseDragMove);
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
        <div className='view-map-button' onClick={this.toggleFullMap}>
          View Map
        </div>
        {
          this.state.viewMap &&
          <MapView map={this.state.map} toggleFullMap={this.toggleFullMap} />
        }
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
            <TileEdit
              activeEdit={this.state.activeEdit}
              confirmDelete={this.state.confirmDelete}
              handleTileEdit={this.handleTileEdit}
              onEditClick={this.onEditClick}
              onEditSave={this.onEditSave}
            />
            
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
                onMouseDown={() => this.onMouseDrag(true)}
                onMouseUp={() => this.onMouseDrag(false)}
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
            <div className='map-pane'>
              <MapPane
                loadMapPosition={this.loadMapPosition}
                activeTile={this.state.activeTile}
                borderToggle={this.state.borderToggle}
                map={this.state.map}
                mapHeight={this.state.mapHeight}
                mapWidth={this.state.mapWidth}
                onMapClick={this.onMapClick}
                tilesOnPane={this.state.tilesOnPane}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}