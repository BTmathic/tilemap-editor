import React from 'react';

export default class MapSettings extends React.Component {
  state = {
    settingsOpen: false
  };

  toggleSettings = () => {
    this.setState((prevState) => ({ settingsOpen: !prevState.settingsOpen }));
  }

  render() {
    return (
      <div className='map-settings'>
        <div className='map-settings__button' onClick={this.toggleSettings}>
          Map Settings
        </div>
        { this.state.settingsOpen && 
          <div className='map-settings__menu'>
            <div className='map-settings--dimensions'>
              <div>Width: ...</div>
              <div>Height: ...</div>
            </div>
            <div className='map-settings--add-row'>
              <div>
                Add row to top
              </div>
              <div>
              Add row to bottom
              </div>
              <div>
              Add row inside
              </div>
            </div>
            <div className='map-settings--add-column'>
              <div>
              Add column to left
              </div>
              <div>
              Add column to right
              </div>
              <div>
              Add column inside
              </div>
            </div>
          </div>
        }
      </div>
      
    );
  }
}