import React from 'react';
import Tile from './Tile';

//const tiles = ['red', 'blue', 'green', 'pink', 'orange', 'purple', 'lightgrey', 'magenta'];
const tiles = ['tile00', 'tile01', 'tile02', 'tile03', 'tile04', 'tile05', 'tile06', 'tile07',
               'tile10', 'tile11', 'tile12', 'tile13', 'tile14', 'tile15', 'tile16', 'tile17',
               'tile20', 'tile21', 'tile22', 'tile23', 'tile24', 'tile25', 'tile26', 'tile27',
               'tile30', 'tile31', 'tile32', 'tile33', 'tile34', 'tile35', 'tile36', 'tile37',
               'tile40', 'tile41', 'tile42', 'tile43', 'tile44', 'tile45', 'tile46', 'tile47',
               'tile50', 'tile51', 'tile52', 'tile53', 'tile54', 'tile55', 'tile56', 'tile57',
               'tile60', 'tile61', 'tile62', 'tile63', 'tile64', 'tile65', 'tile66', 'tile67',
               'tile70', 'tile71', 'tile72', 'tile73', 'tile74', 'tile75', 'tile76', 'tile77',
               'tile80', 'tile81', 'tile82', 'tile83', 'tile84', 'tile85', 'tile86', 'tile87',
               'tile90', 'tile91', 'tile92', 'tile93', 'tile94', 'tile95', 'tile96', 'tile97',
               'tile100', 'tile101', 'tile102', 'tile103', 'tile104', 'tile105', 'tile106', 'tile107',
               'tile110', 'tile111', 'tile112', 'tile113', 'tile114', 'tile115', 'tile116', 'tile117',
               'tile120', 'tile121', 'tile122', 'tile123', 'tile124', 'tile125', 'tile126', 'tile127',
               'tile130', 'tile131', 'tile132', 'tile133', 'tile134', 'tile135', 'tile136', 'tile137',
               'tile140', 'tile141', 'tile142', 'tile143', 'tile144', 'tile145', 'tile146', 'tile147',
               'tile150', 'tile151', 'tile152', 'tile153', 'tile154', 'tile155', 'tile156', 'tile157'];

export default class TilePane extends React.Component {
  state = {
    tilesOnPane: 'castle'
  }

  render() {
    return (
      <div className={`tile-pane ${this.state.tilesOnPane}`}>
        {tiles.map((tileClass) => {
          return <Tile tileClass={tileClass} key={tileClass} tileType={'newTile'}
            onTileClick={this.props.onTileClick}
          />
        })}
      </div>
    );
  }
}