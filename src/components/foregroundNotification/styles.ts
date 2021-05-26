import EStyleSheet from 'react-native-extended-stylesheet';

export const CONTAINER_HEIGHT = 108;

export default EStyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 9999,
    justifyContent: 'flex-end',
    maxWidth: '$deviceWidth',
    minWidth: '$deviceWidth / 1.9',
    height: CONTAINER_HEIGHT,
    width:'100%',
    backgroundColor: '$primaryDarkText',
    shadowOffset: {
      height: 5,
    },
    shadowColor: '#5f5f5fbf',
    shadowOpacity: 0.3,
    elevation: 3,
    top:0,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
    paddingRight: 10,
    paddingLeft:16,
  },
});
