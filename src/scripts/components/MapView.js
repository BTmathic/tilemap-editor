import React from 'react';
import Tile from './Tile';

export default (props) => (
  <div>
    <div className='map-view'>
      <div className='map-view--visible'>
        {
          props.map.map((mapRow, rowIndex) => {
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
      <div className='map-view--option' onClick={() => console.log('save!')}>
        Save
      </div>
      <div className='map-view--option' onClick={props.toggleFullMap}>
        Close
      </div>
    </div>
  </div>
);