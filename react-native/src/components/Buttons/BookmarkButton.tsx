import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolate, Extrapolation } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const BookmarkButton = () => {
  const bookmarked = useSharedValue(0);

//   const outlineStyle = useAnimatedStyle(() => {
//     return {
//       transform: [
//         {
//           scale: interpolate(liked.value, [0, 1], [1, 0], Extrapolation.CLAMP),
//         },
//       ],
//     };
//   });

  const fillStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: bookmarked.value,
        },
      ],
    };
  });

  return (
    <Pressable onPress={() => {(bookmarked.value = withSpring(bookmarked.value ? 0 : 1)); console.log('Bookmarked');}}>
      <Animated.View style={[StyleSheet.absoluteFillObject]}>
        <MaterialCommunityIcons name={"bookmark-outline"} size={32} color={"black"} />
      </Animated.View>
      <Animated.View style={fillStyle}>
        <MaterialCommunityIcons name={"bookmark"} size={32} color={"black"} />
      </Animated.View>
    </Pressable>
  );
};

export default BookmarkButton;

