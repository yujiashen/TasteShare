import React, { useState, useEffect } from 'react';
import { Pressable, GestureResponderEvent } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type CommentButtonProps = {
    onPress: (event: GestureResponderEvent) => void;
  };
  
  const CommentButton: React.FC<CommentButtonProps> = ({ onPress }) => {
    const [isPressed, setIsPressed] = useState(false);
  
    const handlePress = (event: GestureResponderEvent) => {
      setIsPressed(true);
      onPress(event);
    };
  
    useEffect(() => {
      if (isPressed) {
        const timer = setTimeout(() => {
          setIsPressed(false);
        }, 500);
  
        return () => clearTimeout(timer);
      }
    }, [isPressed]);
  
    return (
      <Pressable onPress={handlePress}>
        {isPressed ? (
          <MaterialCommunityIcons name={"comment"} size={32} color={"grey"} />
        ) : (
          <MaterialCommunityIcons name={"comment-outline"} size={32} color={"black"} />
        )}
      </Pressable>
    );
  };
  
  export default CommentButton;