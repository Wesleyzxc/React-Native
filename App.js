import React, {useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  StatusBar,
  Image,
  TextInput,
  Linking,
  TouchableOpacity,
} from 'react-native';
import {Header, Colors} from 'react-native/Libraries/NewAppScreen';

async function getAnimeList(query, setLoading, setResults) {
  setLoading(true);
  query = encodeURI(query);
  try {
    url = `https://api.jikan.moe/v3/search/anime?q=${query}&limit=10`;
    let response = await fetch(url);
    let responseJson = await response.json();
    setLoading(false);
    setResults(responseJson.results);
    return responseJson;
  } catch (error) {
    console.error(error);
  }
}

function LoadingSpinner(props) {
  if (!props.loadState) {
    return <Text></Text>;
  } else {
    return (
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
}

function ClickURL(url) {
  Linking.openURL(url).catch(err => console.error('Error occurred', err));
}

function MultipleTouchables(props) {
  return (
    <TouchableOpacity
      style={styles.resultLink}
      onPress={() => ClickURL(props.results[props.resultKey].url)}>
      <Image
        style={styles.resultImage}
        loadingIndicatorSource={require('./resources/loadingimage.gif')}
        resizeMode="stretch"
        source={{
          uri: props.results[props.resultKey].image_url,
        }}
      />
    </TouchableOpacity>
  );
}

function ClickAnime(props) {
  if (props.results) {
    return (
      <View
        style={{
          justifyContent: 'space-evenly',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}>
        <MultipleTouchables results={props.results} resultKey={0} />
        <MultipleTouchables results={props.results} resultKey={1} />
        <MultipleTouchables results={props.results} resultKey={2} />
        <MultipleTouchables results={props.results} resultKey={3} />
        <MultipleTouchables results={props.results} resultKey={4} />
      </View>
    );
  } else return <View />;
}

const App: () => React$Node = () => {
  const [searchText, searchState] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState();
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Header />

      {global.HermesInternal == null ? null : (
        <View style={styles.engine}>
          <Text style={styles.footer}>Engine: Hermes</Text>
        </View>
      )}
      <View style={styles.body}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Search Anime</Text>
          <TextInput
            placeholder="Enter Series"
            style={{height: 40, borderColor: 'skyblue', borderWidth: 1}}
            onChangeText={value => searchState(value)}
            value={searchText}
          />
          <Button
            title="search anime"
            onPress={() => {
              response = getAnimeList(searchText, setLoading, setResults);
            }}
          />
        </View>
        <LoadingSpinner loadState={loading} />
      </View>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}>
        <ClickAnime results={results} />
      </ScrollView>
    </>
  );
};

const IMAGE_WIDTH = 100;
const IMAGE_HEIGHT = 150;

const styles = StyleSheet.create({
  resultLink: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    borderWidth: 3,
    borderColor: 'lightgrey',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  resultImage: {
    width: IMAGE_WIDTH - 5,
    height: IMAGE_HEIGHT - 6,
    backgroundColor: 'lightgrey',
    borderRadius: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
