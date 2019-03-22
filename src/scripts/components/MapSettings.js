import React from 'react';

export default class MapSettings extends React.Component {
  state = {
    columnIndex: 0,
    map: this.props.map,
    rowIndex: 0,
    settingsOpen: false
  };

  addColumn = (columnIndex) => {
    if (columnIndex > -1 && columnIndex <= this.props.mapWidth) {
      const map = this.state.map;
      for (let i = 0; i < this.props.mapHeight; i++) {
        map[i].splice(columnIndex, 0, ['blank']);
      }
      this.setState(() => ({ map }));
      this.props.changeMap(map, this.props.mapHeight, this.props.mapWidth + 1);
    }
  }

  addRow = (rowIndex) => {
    if (rowIndex > -1 && rowIndex <= this.props.mapHeight) {
      const map = this.state.map;
      const newRow = Array(this.props.mapWidth).fill(['blank']);
      map.splice(rowIndex, 0, newRow);
      this.setState(() => ({ map }));
      this.props.changeMap(map, this.props.mapHeight + 1, this.props.mapWidth);
    }
  }

  cancelUpdate = () => {
    this.props.changeMap(this.state.oldMap, this.state.oldMap.length, this.state.oldMap[0].length);
    this.setState((prevState) => ({
      map: prevState.oldMap.map(x => x),
      settingsOpen: false
    }));
  }

  handleColumnInput = (e) => {
    const columnIndex = e.target.value;
    this.setState(() => ({ columnIndex }));
  }

  handleColumnInput = (e) => {
    const columnIndex = e.target.value;
    this.setState(() => ({ columnIndex }));
  }

  handleRowInput = (e) => {
    const rowIndex = e.target.value;
    this.setState(() => ({ rowIndex }));
  }

  removeColumn = (columnIndex) => {
    if (columnIndex > -1 && columnIndex <= this.props.mapWidth) {
      const map = this.state.map;
      for (let i = 0; i < this.props.mapHeight; i++) {
        map[i].splice(columnIndex, 1);
      }
      this.setState(() => ({ map }));
      this.props.changeMap(map, this.props.mapHeight, this.props.mapWidth - 1);
    }
  }

  removeRow = (rowIndex) => {
    if (rowIndex > -1 && rowIndex <= this.props.mapHeight) {
      const map = this.state.map;
      map.splice(rowIndex, 1);
      this.setState(() => ({ map }));
      this.props.changeMap(map, this.props.mapHeight - 1, this.props.mapWidth);
    }
  }

  openSettings = () => {
    if (!this.state.settingsOpen) {
      const oldMap = [...Array(this.props.mapHeight).keys()].map((row) => this.props.map[row].map(x => x));
      this.setState(() => ({
        oldMap,
        settingsOpen: true
      }));
    } else {
      const map = this.state.oldMap;
      this.props.changeMap(map, map.length, map[0].length);
      this.setState(() => ({ map, settingsOpen: false }));
    }
  }

  resetMap = () => {
    const map = Array(50).fill(null).map((row) => Array(50).fill(['blank']));
    this.setState(() => ({ map }));
    this.props.changeMap(map, map.length, map[0].length);
  }

  // We need to store a copy of the map before changes in case the user
  // wishes to cancel their edits
  saveUpdate = () => {
    this.setState((prevState) => ({
      oldMap: prevState.map.map(x => x),
      settingsOpen: false
    }))
  }

  render() {
    return (
      <div className='map-settings'>
        <div className='map-settings__button' onClick={this.openSettings}>
          Map Settings
        </div>
        { 
          this.state.settingsOpen && 
          <div className='map-settings__menu'>
            <div className='map-settings--dimensions'>
              <div>Height: {this.props.mapHeight}</div>
              <div>Width: {this.props.mapWidth}</div>
            </div>
            <div className='map-settings--change-map'>
              <div className='map-settings--bold-padding'>
                Remove rightmost column
              </div>
              <div className='map-settings--row' onClick={() => this.addRow(0)}>
                Add row to top
              </div>
              <div className='map-settings--row' onClick={() => this.addRow(this.props.mapHeight)}>
                Add row to bottom
              </div>
              <div className='map-settings--row' onClick={() => this.removeRow(0)}>
                Remove top row
              </div>
              <div className='map-settings--row' onClick={() => this.removeRow(this.props.mapHeight - 1)}>
                Remove bottom row
              </div>
            </div>
            <div className='map-settings--change-map'>
              <div className='map-settings--row' onClick={() => this.addRow(this.state.rowIndex)}>
                Add row inside
              </div>
              <div className='map-settings--row' onClick={() => this.removeRow(this.state.rowIndex)}>
                Remove row inside
              </div>
              <div>
                0 &le;
                <input value={this.state.rowIndex} onChange={this.handleRowInput} />
                &le; {this.props.mapHeight}
              </div>
            </div>
            <div className='map-settings--change-map'>
              <div className='map-settings--column' onClick={() => this.addColumn(0)}>
                Add column to left
              </div>
              <div className='map-settings--column' onClick={() => this.addColumn(this.props.mapWidth)}>
                Add column to right
              </div>
              <div className='map-settings--column' onClick={() => this.removeColumn(0)}>
                Remove leftmost column
              </div>
              <div className='map-settings--column' onClick={() => this.removeColumn(this.props.mapWidth - 1)}>
                Remove rightmost column
              </div>
            </div>
            <div className='map-settings--change-map'>
              <div className='map-settings--column' onClick={() => this.addColumn(this.state.columnIndex)}>
                Add column inside
              </div>
              <div className='map-settings--column' onClick={() => this.removeColumn(this.state.columnIndex)}>
                Remove column inside
              </div>
              <div>
                0 &le;
                <input value={this.state.columnIndex} onChange={this.handleColumnInput} />
                &le; {this.props.mapWidth}
              </div>
              <div style={{ fontWeight: 'bold', visibility: 'hidden' }}>
                Remove rightmost column
              </div>
            </div>
            <div className='map-settings--close'>
              <div className='map-settings--button'
                onClick={this.saveUpdate}
              >Save</div>
              <div className='map-settings--button'
                onClick={this.cancelUpdate}
              >Cancel</div>
              <div className='map-settings--button'
                onClick={this.resetMap}
              >Reset</div>
            </div>
          </div>
        }
      </div>
      
    );
  }
}