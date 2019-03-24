import React from 'react';

export default class TileEdit extends React.Component {
  state = {
    activeEdit: this.props.activeEdit,
    confirmDelete: 0
  }

  handleTileEdit = (activeEdit, confirmDelete) => {
    this.props.handleTileEdit(activeEdit);
    this.setState(() => ({ activeEdit, confirmDelete }));
  }

  // Two step delete function to edit the layers of tiles on the map
  // First click simply selects a tile and warns/asks to confirm user wants
  // the tile deleted. Second click deletes the tile. None of this is binding
  // as the user must confirm saving the edits before the map is changed
  onEditClick = (index) => {
    this.setState(() => ({ index }));
    if (this.state.confirmDelete == index) {
      const activeEdit = this.state.activeEdit;
      activeEdit.splice(index, 1);
      this.setState(() => ({ activeEdit, confirmDelete: 0 }));
    } else {
      this.setState(() => ({ confirmDelete: index }));
    }
  }

  // Save the current edit to a tile onto the map
  onEditSave = () => {
    this.props.onEditSave();
    this.setState(() => ({
      activeEdit: '',
      confirmDelete: 0,
    }));
  }

  onMoveClick = (index) => {
    if (index !== this.state.index - 1 && index !== this.state.index) {
      //console.log(this.state.index, index);
      const activeEdit = this.state.activeEdit;
      const oldTile = activeEdit[this.state.index];
      activeEdit.splice(index + 1, 0, oldTile);
      if (this.state.index < index) {
        activeEdit.splice(this.state.index, 1);
      } else {
        activeEdit.splice(this.state.index + 1, 1);
      }
      this.setState(() => ({
        activeEdit,
        confirmDelete: 0
      }));
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activeEdit !== this.props.activeEdit) {
      this.setState(() => ({
        activeEdit: this.props.activeEdit,
        confirmDelete: 0
      }));
    }
  }

  render() {
    return (
      <div className='edit-tiles'>
        <h2>Tiles</h2>
        <div className='edit-tile__tiles'>
          <div>
            {
              this.state.activeEdit.map((tile, index, arr) => {
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
              })
            }
          </div>
        </div>
        <div style={{ visibility: !!this.state.confirmDelete ? 'visible' : 'hidden' }}>
          <div className='edit-tiles__move'>
            { this.state.activeEdit.length > 2 &&
              this.state.activeEdit.map((_, index) => {
                return (
                  <div
                    className={
                      index !== this.state.index - 1 && index !== this.state.index
                      ? `tile` : 'tile--no-move'
                    }
                    key={index}
                    onClick={() => this.onMoveClick(index)}
                  ></div>
                );
              })
            }
          </div>
          { this.state.activeEdit.length > 3 && <div>Drag to move or click again to delete</div> }
        </div>
        <h4>Select tiles you wish to move or delete</h4>
        <div className='edit-tiles--buttons'>
          <div className='edit-tiles--button' onClick={() => this.onEditSave()}>
            Save
          </div>
          <div className='edit-tiles--button' onClick={() => this.handleTileEdit('', 0)}>
            Close
          </div>
          <div className='edit-tiles--button' onClick={() => this.handleTileEdit([''])}>
            Reset
          </div>
        </div>
      </div>
      );
  }
}