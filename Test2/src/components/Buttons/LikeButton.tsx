import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolate, Extrapolation } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const LikeButton = () => {
  const liked = useSharedValue(0);

  const outlineStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(liked.value, [0, 1], [1, 0], Extrapolation.CLAMP),
        },
      ],
    };
  });

  const fillStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: liked.value,
        },
      ],
    };
  });

  return (
    <Pressable onPress={() => {(liked.value = withSpring(liked.value ? 0 : 1)); console.log('Liked');}}>
      <Animated.View style={[StyleSheet.absoluteFillObject, outlineStyle]}>
        <MaterialCommunityIcons name={"heart-outline"} size={32} color={"black"} />
      </Animated.View>
      <Animated.View style={fillStyle}>
        <MaterialCommunityIcons name={"heart"} size={32} color={"red"} />
      </Animated.View>
    </Pressable>
  );
};

export default LikeButton;

