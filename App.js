import React, {useEffect} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  Image,
} from 'react-native';
import {Modal} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const [customData, setCustomData] = React.useState({});
  const [images, setImages] = React.useState([]);
  const [width, onChangeWidth] = React.useState('');
  const [height, onChangeHeight] = React.useState('');
  const [depth, onChangeDepth] = React.useState('');
  const [price, setPrice] = React.useState('₹0');
  const [visible, setVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const imgHeader = () => {
    return (
      <View style={styles.galleryTextContainer}>
        {visible ? (
          <Text onPress={e => setVisible(false)} style={styles.txtGalleryClose}>
            Close
          </Text>
        ) : null}
      </View>
    );
  };

  useEffect(() => {
    axios
      .get(`https://9xdqvausr2.execute-api.us-east-2.amazonaws.com/getPrices`)
      .then(res => {
        setCustomData(res.data.priceData);
        setImages(res.data.images);
        getPrice();
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    getPrice();
  });

  getPrice = () => {
    // console.log("customData", customData)
    let selectedDepth, selectedHeight, selectedWidth;
    if (
      depth &&
      depth != '0' &&
      height &&
      height != '0' &&
      width &&
      width != '0'
    ) {
      selectedDepth = getNearInputIndex(depth, Object.keys(customData));
      if (selectedDepth && selectedDepth != '0') {
        selectedHeight = getNearInputIndex(
          height,
          Object.keys(customData[selectedDepth.toString()]),
        );
        if (selectedHeight && selectedHeight != '0') {
          selectedWidth = getNearInputIndex(
            width,
            Object.keys(
              customData[selectedDepth.toString()][selectedHeight.toString()],
            ),
          );
        } else {
          alertError();
        }
      } else {
        alertError();
      }
      if (selectedHeight && selectedWidth && selectedDepth) {
        console.log(selectedHeight, selectedWidth, selectedDepth);
        setPrice(
          '₹' +
            customData[selectedDepth.toString()][selectedHeight.toString()][
              selectedWidth.toString()
            ],
        );
      }
    }
  };

  alertError = () => {
    setPrice('Price not available');
  };

  getNearInputIndex = (num, array) => {
    const arr = array.sort();
    let index;
    for (index = 0; index < arr.length; index++) {
      if (parseInt(arr[index]) >= num) {
        break;
      }
    }
    return arr[index];
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View>
        {isLoading ? (
                  <Spinner
                  visible
                  textContent={'Loading...'}
                />
        ) : (
          <View style={styles.parentContainer}>
            <View style={styles.galleryTextContainer}>
              {!visible ? (
                <Text onPress={e => setVisible(true)} style={styles.txtGallery}>
                  Gallery
                </Text>
              ) : null}
            </View>
            <View style={styles.container}>
              <View style={styles.imgContainer}>
                <Image
                  style={styles.topImg}
                  source={require('./assets/Wicker_box.png')}
                />
              </View>
              <View style={styles.inputMainContainer}>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Width:</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={data => {
                      onChangeWidth(data);
                      // getPrice();
                    }}
                    value={width}
                    placeholder="Enter Width"
                    placeholderTextColor="#163172"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Depth:</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={data => {
                      onChangeDepth(data);
                      // getPrice();
                    }}
                    value={depth}
                    placeholderTextColor="#163172"
                    placeholder="Enter depth"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Height:</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={data => {
                      onChangeHeight(data);
                      // getPrice();
                    }}
                    value={height}
                    placeholder="Enter height"
                    placeholderTextColor="#163172"
                    keyboardType="numeric"
                  />
                </View>
                <Text style={styles.priceText}>{price}</Text>
              </View>
            </View>
            <View>
              <Modal visible={visible} transparent={true}>
                <ImageViewer imageUrls={images} renderHeader={imgHeader} />
              </Modal>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    // backgroundColor: '#EAFAF1',
    // backgroundColor: '#ADEFD1FF',
    // backgroundColor: '#F6F6F6',
    backgroundColor: '#67cfe8',
    width: '100%',
    height: '100%',
  },
  container: {
    padding: 10,
    margin: 10,
  },
  input: {
    margin: 10,
    fontSize: 25,
    width: 150,
    borderColor: '#1E56A0',
    borderWidth: 2,
    textAlign: 'center',
    color: '#163172',
    backgroundColor: 'white',
  },
  inputLabel: {
    fontSize: 30,
    fontWeight: '600',
    textAlignVertical: 'center',
    color: '#163172',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  galleryTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    margin: 5,
  },
  inputMainContainer: {
    // backgroundColor: 'white',
    padding: 5,
  },
  parentContainer: {
    padding: 10
  },
  imgContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  topImg: {
    height: 100,
    width: '80%',
    resizeMode: 'stretch',
  },
  txtGallery: {
    alignContent: 'flex-end',
    fontSize: 20,
  },
  txtGalleryClose: {
    color: 'white',
    fontSize: 20,
  },
  priceText: {
    fontSize: 45,
    marginTop: 30,
    alignSelf: 'center',
    color: '#163172',
  },
});

export default App;
