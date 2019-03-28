import React from 'react';
//import domtoimage from 'dom-to-image';
import Tile from './Tile';

export default class MapView extends React.Component {
  onSave = () => {
    console.log('save!');
    // domtoimage.toJpeg(this.map, { quality: 1 })
    //   .then((dataUrl) => {
    //     const link = document.createElement('a');
    //     link.download = 'tilemap.jpeg';
    //     link.href = dataUrl;
    //     //link.click();
    //   })
    //   .catch((e) => {
    //     console.log('Something went wrong', e)
    //   });
  }

  render() {
    return (
      <div>
        <div className='map-view'>
          <div ref={(map) => this.map = map} className='map-view--visible'>
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