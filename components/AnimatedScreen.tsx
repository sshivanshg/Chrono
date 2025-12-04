import React, { useEffect } from 'react';
import { ViewProps } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

type AnimatedScreenProps = ViewProps & {
  children: React.ReactNode;
};

export function AnimatedScreen({ children, style, ...rest }: AnimatedScreenProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, {
      duration: 320,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      {
        translateY: (1 - progress.value) * 24,
      },
    ],
  }));

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle, style]} {...rest}>
      {children}
    </Animated.View>
  );
}


