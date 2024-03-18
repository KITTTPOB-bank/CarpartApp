import {Animated, FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useRef, useState} from 'react';

import SlideItem from '../component/SlideItem';
import Pagination from '../component/Pagination';
import { SafeAreaView } from 'react-native';

import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import translations from '../component/textlanguage'

const i18n = new I18n(translations);

i18n.locale = Localization.locale;

i18n.enableFallback = true;

const Slides = [
  {
    id: 1,
    img: require('../assets/front_camry2021.jpg'),
    description: 'ตัวอย่างรูปรถยนต์มุมที่ 1',

  },
  {
    id: 2,
    img: require('../assets/side_camry2021.jpg'),
    description: 'ตัวอย่างรูปรถยนต์มุมที่ 2',

  },
  {
    id: 3,
    img: require('../assets/back_camry2021.jpg'),
    description: 'ตัวอย่างรูปรถยนต์มุมที่ 3',

  },
];

const HelpToggleScreen = () => {

    const [index, setIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
  
    const handleOnScroll = event => {
      Animated.event(
        [
          {
            nativeEvent: {
              contentOffset: {
                x: scrollX,
              },
            },
          },
        ],
        {
          useNativeDriver: false,
        },
      )(event);
    };
  
    const handleOnViewableItemsChanged = useRef(({viewableItems}) => {
      // console.log('viewableItems', viewableItems);
      setIndex(viewableItems[0].index);
    }).current;
  
    const viewabilityConfig = useRef({
      itemVisiblePercentThreshold: 50,
    }).current;
  
    return (
      <SafeAreaView>
         <Text style={styles.title}>{i18n.t('examplephoto')}</Text>
        <FlatList
          data={Slides}
          renderItem={({item}) => <SlideItem item={item} />}
          horizontal
          pagingEnabled
          snapToAlignment="center"
          showsHorizontalScrollIndicator={false}
          onScroll={handleOnScroll}
          onViewableItemsChanged={handleOnViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />
        <Pagination data={Slides} scrollX={scrollX} index={index} />
      </SafeAreaView>
    );
  };

  const styles = StyleSheet.create({
    title: {
      fontSize: 22,
      color: 'black',
      fontFamily: "PakkadThin",
      textAlign: 'center',
      marginTop: 30,
      marginBottom: -40
    },
  });
  
  export default HelpToggleScreen;
