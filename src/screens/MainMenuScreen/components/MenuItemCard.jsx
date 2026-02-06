// screens/MainMenuScreen/components/MenuItemCard.tsx
import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { MenuItem } from '../../../types/menu.types';
import { COLORS } from '../../../constants/theme';
import { styles } from '../styles';

interface MenuItemCardProps {
  item: MenuItem;
  onPress: (screen: string) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = React.memo(
  ({ item, onPress }) => {
    const handlePress = useCallback(() => {
      onPress(item.screen);
    }, [item.screen, onPress]);

    return (
      <TouchableOpacity
        style={styles.menuItemWrapper}
        onPress={handlePress}
        activeOpacity={0.7}
        accessibilityLabel={`${item.title}: ${item.subtitle}`}
        accessibilityRole="button"
        accessibilityHint={`Navigate to ${item.title} screen`}
      >
        <LinearGradient
          colors={[...item.gradient]}
          style={styles.menuItem}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.menuItemContent}>
            <Icon name={item.icon} size={36} color={COLORS.white} />
            {item.badge && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.badge}</Text>
              </View>
            )}
          </View>
          <Text style={styles.menuItemTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.menuItemSubtitle} numberOfLines={2}>
            {item.subtitle}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
);

MenuItemCard.displayName = 'MenuItemCard';