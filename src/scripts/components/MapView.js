import React from 'react';
import Tile from './Tile';

export default class MapView extends React.Component {
  state = {
    activeClasslist: [],
    saved: 'Save',
    scale: 8
  }

  onSave = () => {
    this.setState(() => ({ saved: 'Saving...' }));
    const canvas = document.getElementById('canvas');
    const height = this.props.map.length * 32;
    const width = this.props.map[0].length * 32;
    canvas.height = height;
    canvas.width = width;
    canvas.style.height = height + 'px';
    canvas.style.width = width + 'px';
    this.save().then(canvas => {
      const image = new Image();
      image.src = canvas.toDataURL();
      this.saveAs(canvas.toDataURL(), 'tilemap.png');
    }).catch((e) => {
      console.log('Something went wrong', e);
    });
  }

  save = () => {
    
    return new Promise((resolve, reject) => {
      const canvas = document.getElementById('canvas');
      const context = canvas.getContext('2d');
      for (let row=0; row < this.props.map.length; row++) {
        for (let col=0; col < this.props.map[0].length; col++) {
          const layers = this.props.map[row][col].slice(1);
          for (let i = 0; i < layers.length; i++) {
            let imageUrl, style;
            const div = document.getElementById('layer' + i);
            const layer = layers[i];
            const tileIndices = layer.tileClass.slice(4);
            const tileXPosition = this.getCoords(6.25 * tileIndices.slice(2, 4));
            const tileYPosition = this.getCoords(6.25 * tileIndices.slice(0, 2));
            const image = new Image();
            image.src = imageUrl;
            div.classList.add(layer.type);
            div.classList.add(layer.tileClass);
            style = div.currentStyle || window.getComputedStyle(div, false);
            imageUrl = style.backgroundImage.slice(5, -2);
            image.src = imageUrl;
            // context.drawImage(source, [position/size in background-image], [where, size to render])
            context.drawImage(image, tileXPosition, tileYPosition, 32, 32, 32 * col, 32 * row, 32, 32);
            div.classList.remove(layer.type);
            div.classList.remove(layer.tileClass);
          }
        }
      }

      resolve(canvas);
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
    this.props.toggleFullMap();
  }

  getCoords = (percent) => {
    return percent * 512 / 100;
  }

  render() {
    return (
      <div className='map-view--container'>
        { [0,1,2,3,4,5,6,7].map((i) => {
          return (
            <div id={`layer${i}`} className='tile map-tile' key={i}
              style={{ height: '32px', left: '0px', top: '0px', width: '32px' }}>
            </div>
          );
        })}
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
                    return tileClasses.slice(1).map((tileClass, layer, arr) => {
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
          <div className='map-view--option' onClick={() => this.onSave(this.map)}>
            { this.state.saved }
          </div>
          <div className='map-view--option' onClick={this.props.toggleFullMap}>
            Close
          </div>
        </div>
        { this.state.saved === 'Save' && 
          <canvas id='canvas'
            style={{
              background: 'black',
              position: 'relative',
              top: '100vh',
              zIndex: 20
            }}>
          </canvas>
        }
      </div>
    );
  }
}