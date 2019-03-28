import React from 'react';
import html2canvas from 'html2canvas';
import Tile from './Tile';

export default class MapView extends React.Component {
  onSave = () => {
    html2canvas(this.map).then(canvas => {
      this.saveAs(canvas.toDataURL(), 'tilemap.png');
    }).catch((e) => {
      console.log('Something went wrong', e);
    });
  }

  saveAs = (uri, filename) => {
    const link = document.createElement('a');
    if (typeof link.download === 'string') {
      link.href = uri;
      link.download = filename;
      document.body.appendChild(link); // Firefox requirement
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(uri);
    }
  }

  render() {
    return (
      <div>
        <div className='map-view'>
          <div ref={(map) => this.map = map}
            className='map-view--visible'
            style={{
              height: this.props.map.length*32,
              width: this.props.map[0].length*32
            }}
          >
            {
              this.props.map.map((mapRow, rowIndex) => {
                return (
                  mapRow.map((tileClasses, columnIndex) => {
                    return tileClasses.map((tileClass, layer, arr) => {
                      const layers = arr.length - 1;
                      return (
                        <Tile
                          tile={{
                            type: tileClass.type,
                            tileClass: tileClass.tileClass
                          }}
                          borderToggle={false}
                          column={columnIndex}
                          key={tileClass + rowIndex + layer}
                          layer={layer}
                          mapWidth={1700}
                          row={rowIndex}
                          topLayer={layers === layer}
                          tileType={'map'}
                        />
                      );
                    });
                  })
                );
              })
            }
          </div>
        </div>
        <div className='map-view--options'>
          <div className='map-view--option' onClick={this.onSave}>
            Save
          </div>
          <div className='map-view--option' onClick={this.props.toggleFullMap}>
            Close
          </div>
        </div>
      </div>
    );
  }
}