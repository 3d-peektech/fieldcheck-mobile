import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { inspectionsAPI } from '../../api/inspections';
import InspectionCard from '../../components/inspections/InspectionCard';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import Button from '../../components/common/Button';
import colors from '../../theme/colors';

const InspectionsScreen = ({ navigation, route }) => {
  const { assetId } = route.params || {};
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadInspections();
  }, [assetId, filter]);

  const loadInspections = async (pageNum = 1, searchQuery = search) => {
    try {
      setError(null);
      const params = {
        page: pageNum,
        limit: 20,
      };

      if (assetId) params.assetId = assetId;
      if (filter !== 'all') params.status = filter;
      if (searchQuery) params.search = searchQuery;

      const response = await inspectionsAPI.getInspections(params);

      if (response.success) {
        if (pageNum === 1) {
          setInspections(response.inspections);
        } else {
          setInspections((prev) => [...prev, ...response.inspections]);
        }
        setHasMore(pageNum < response.totalPages);
        setPage(pageNum);
      }
    } catch (err) {
      setError(err.message || 'Failed to load inspections');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadInspections(1);
  }, [assetId, filter, search]);

  const handleSearch = (text) => {
    setSearch(text);
    setLoading(true);
    loadInspections(1, text);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      loadInspections(page + 1);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search inspections..."
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

      <View style={styles.filters}>
        <FilterButton
          label="All"
          active={filter === 'all'}
          onPress={() => setFilter('all')}
        />
        <FilterButton
          label="Scheduled"
          active={filter === 'scheduled'}
          onPress={() => setFilter('scheduled')}
        />
        <FilterButton
          label="In Progress"
          active={filter === 'in-progress'}
          onPress={() => setFilter('in-progress')}
        />
        <FilterButton
          label="Completed"
          active={filter === 'completed'}
          onPress={() => setFilter('completed')}
        />
      </View>

      <Button
        title="New Inspection"
        onPress={() => navigation.navigate('CreateInspection', { assetId })}
        style={styles.addButton}
      />
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="clipboard-outline" size={64} color={colors.textLight} />
      <Text style={styles.emptyTitle}>No Inspections Found</Text>
      <Text style={styles.emptyText}>
        {search ? 'Try a different search term' : 'Create your first inspection'}
      </Text>
      {!search && (
        <Button
          title="New Inspection"
          onPress={() => navigation.navigate('CreateInspection', { assetId })}
          style={styles.emptyButton}
        />
      )}
    </View>
  );

  if (loading && page === 1) return <Loading />;
  if (error && page === 1) return <ErrorMessage message={error} onRetry={() => loadInspections(1)} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={inspections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <InspectionCard
            inspection={item}
            onPress={() => navigation.navigate('InspectionDetail', { inspectionId: item.id })}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={[
          styles.listContent,
          inspections.length === 0 && styles.emptyListContent,
        ]}
      />
    </View>
  );
};

const FilterButton = ({ label, active, onPress }) => (
  <TouchableOpacity
    style={[styles.filterButton, active && styles.filterButtonActive]}
    onPress={onPress}
  >
    <Text style={[styles.filterText, active && styles.filterTextActive]}>{label}</Text>
  </TouchableOpacity>
);

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
  filters: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: '#fff',
  },
  addButton: {
    marginBottom: 0,
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

export default InspectionsScreen;