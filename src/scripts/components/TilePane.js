import React from 'react';
import Tile from './Tile';

const tiles = ['tile0000', 'tile0001', 'tile0002', 'tile0003', 'tile0004', 'tile0005', 'tile0006', 'tile0007', 'tile0008', 'tile0009', 'tile0010', 'tile0011', 'tile0012', 'tile0013', 'tile0014', 'tile0015',
              'tile0100', 'tile0101', 'tile0102', 'tile0103', 'tile0104', 'tile0105', 'tile0106', 'tile0107', 'tile0108', 'tile0109', 'tile0110', 'tile0111', 'tile0112', 'tile0113', 'tile0114', 'tile0115',
              'tile0200', 'tile0201', 'tile0202', 'tile0203', 'tile0204', 'tile0205', 'tile0206', 'tile0207', 'tile0208', 'tile0209', 'tile0210', 'tile0211', 'tile0212', 'tile0213', 'tile0214', 'tile0215',
              'tile0300', 'tile0301', 'tile0302', 'tile0303', 'tile0304', 'tile0305', 'tile0306', 'tile0307', 'tile0308', 'tile0309', 'tile0310', 'tile0311', 'tile0312', 'tile0313', 'tile0314', 'tile0315',
              'tile0400', 'tile0401', 'tile0402', 'tile0403', 'tile0404', 'tile0405', 'tile0406', 'tile0407', 'tile0408', 'tile0409', 'tile0410', 'tile0411', 'tile0412', 'tile0413', 'tile0414', 'tile0415',
              'tile0500', 'tile0501', 'tile0502', 'tile0503', 'tile0504', 'tile0505', 'tile0506', 'tile0507', 'tile0508', 'tile0509', 'tile0510', 'tile0511', 'tile0512', 'tile0513', 'tile0514', 'tile0515',
              'tile0600', 'tile0601', 'tile0602', 'tile0603', 'tile0604', 'tile0605', 'tile0606', 'tile0607', 'tile0608', 'tile0609', 'tile0610', 'tile0611', 'tile0612', 'tile0613', 'tile0614', 'tile0615',
              'tile0700', 'tile0701', 'tile0702', 'tile0703', 'tile0704', 'tile0705', 'tile0706', 'tile0707', 'tile0708', 'tile0709', 'tile0710', 'tile0711', 'tile0712', 'tile0713', 'tile0714', 'tile0715',
              'tile0800', 'tile0801', 'tile0802', 'tile0803', 'tile0804', 'tile0805', 'tile0806', 'tile0807', 'tile0808', 'tile0809', 'tile0810', 'tile0811', 'tile0812', 'tile0813', 'tile0814', 'tile0815',
              'tile0900', 'tile0901', 'tile0902', 'tile0903', 'tile0904', 'tile0905', 'tile0906', 'tile0907', 'tile0908', 'tile0909', 'tile0910', 'tile0911', 'tile0912', 'tile0913', 'tile0914', 'tile0915',
              'tile1000', 'tile1001', 'tile1002', 'tile1003', 'tile1004', 'tile1005', 'tile1006', 'tile1007', 'tile1008', 'tile1009', 'tile1010', 'tile1011', 'tile1012', 'tile1013', 'tile1014', 'tile1015',
              'tile1100', 'tile1101', 'tile1102', 'tile1103', 'tile1104', 'tile1105', 'tile1106', 'tile1107', 'tile1108', 'tile1109', 'tile1110', 'tile1111', 'tile1112', 'tile1113', 'tile1114', 'tile1115',
              'tile1200', 'tile1201', 'tile1202', 'tile1203', 'tile1204', 'tile1205', 'tile1206', 'tile1207', 'tile1208', 'tile1209', 'tile1210', 'tile1211', 'tile1212', 'tile1213', 'tile1214', 'tile1215',
              'tile1300', 'tile1301', 'tile1302', 'tile1303', 'tile1304', 'tile1305', 'tile1306', 'tile1307', 'tile1308', 'tile1309', 'tile1310', 'tile1311', 'tile1312', 'tile1313', 'tile1314', 'tile1315',
              'tile1400', 'tile1401', 'tile1402', 'tile1403', 'tile1404', 'tile1405', 'tile1406', 'tile1407', 'tile1408', 'tile1409', 'tile1410', 'tile1411', 'tile1412', 'tile1413', 'tile1414', 'tile1415',
              'tile1500', 'tile1501', 'tile1502', 'tile1503', 'tile1504', 'tile1505', 'tile1506', 'tile1507', 'tile1508', 'tile1509', 'tile1510', 'tile1511', 'tile1512', 'tile1513', 'tile1514', 'tile1515',];

export default (props) => (
  <div className='tile-pane'>
    <div className={`tile-pane--visible ${props.tilesOnPane}`}>
      {tiles.map((tileClass) => {
        return <Tile tileClass={tileClass} key={tileClass} tileType={'newTile'}
          onTileClick={props.onTileClick}
        />
      })}
    </div>
  </div>
);