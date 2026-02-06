// screens/MainMenuScreen/components/MenuGrid.tsx
import React, { useCallback } from 'react';
import { View } from 'react-native';

import { MenuItemCard } from './MenuItemCard';
import { MenuItem } from '../../../types/menu.types';
import { styles } from '../styles';

interface MenuGridProps {
  items: readonly MenuItem[];
  onItemPress: (screen: string) => void;
}

export const MenuGrid: React.FC<MenuGridProps> = React.memo(({ items, onItemPress }) => {
  const renderItem = useCallback(
    (item: MenuItem) => (
      <MenuItemCard key={item.id} item={item} onPress={onItemPress} />
    ),
    [onItemPress]
  );

  return <View style={styles.menuGrid}>{items.map(renderItem)}</View>;
});

MenuGrid.displayName = 'MenuGrid';