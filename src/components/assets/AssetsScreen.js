import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { assetsAPI } from '../../api/assets';
import AssetCard from '../../components/assets/AssetCard';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import Button from '../../components/common/Button';
import colors from '../../theme/colors';

const AssetsScreen = ({ navigation }) => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async (pageNum = 1, searchQuery = search) => {
    try {
      setError(null);
      const response = await assetsAPI.getAssets({
        page: pageNum,
        limit: 20,
        search: searchQuery,
      });

      if (response.success) {
        if (pageNum === 1) {
          setAssets(response.assets);
        } else {
          setAssets((prev) => [...prev, ...response.assets]);
        }
        setHasMore(pageNum < response.totalPages);
        setPage(pageNum);
      }
    } catch (err) {
      setError(err.message || 'Failed to load assets');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadAssets(1);
  }, [search]);

  const handleSearch = (text) => {
    setSearch(text);
    setLoading(true);
    loadAssets(1, text);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      loadAssets(page + 1);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search assets..."
          value={search}
          onChangeText={handleSearch}
          placeholderTextColor={colors.textLight}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.actionButtons}>
        <Button
          title="Scan Asset"
          onPress={() => navigation.navigate('ScanAsset')}
          variant="outline"
          style={styles.scanButton}
        />
        <Button
          title="Add Asset"
          onPress={() => navigation.navigate('CreateAsset')}
          style={styles.addButton}
        />
      </View>
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cube-outline" size={64} color={colors.textLight} />
      <Text style={styles.emptyTitle}>No Assets Found</Text>
      <Text style={styles.emptyText}>
        {search ? 'Try a different search term' : 'Add your first asset to get started'}
      </Text>
      {!search && (
        <Button
          title="Add Asset"
          onPress={() => navigation.navigate('CreateAsset')}
          style={styles.emptyButton}
        />
      )}
    </View>
  );

  if (loading && page === 1) {
    return <Loading />;
  }

  if (error && page === 1) {
    return <ErrorMessage message={error} onRetry={() => loadAssets(1)} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={assets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AssetCard
            asset={item}
            onPress={() => navigation.navigate('AssetDetail', { assetId: item.id })}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={[
          styles.listContent,
          assets.length === 0 && styles.emptyListContent,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
    color: colors.text,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  scanButton: {
    flex: 1,
  },
  addButton: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  emptyButton: {
    marginTop: 24,
    minWidth: 150,
  },
});

export default AssetsScreen;