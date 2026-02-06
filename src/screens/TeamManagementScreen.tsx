import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TextInput,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'technician' | 'viewer';
  status: 'active' | 'pending' | 'inactive';
  lastActive: string;
  tasksCompleted: number;
  avatar: string;
}

const TeamManagementScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');

  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@company.com',
      role: 'admin',
      status: 'active',
      lastActive: '2 min ago',
      tasksCompleted: 247,
      avatar: 'JD',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@company.com',
      role: 'manager',
      status: 'active',
      lastActive: '15 min ago',
      tasksCompleted: 189,
      avatar: 'SJ',
    },
    {
      id: '3',
      name: 'Mike Williams',
      email: 'mike.w@company.com',
      role: 'technician',
      status: 'active',
      lastActive: '1 hour ago',
      tasksCompleted: 342,
      avatar: 'MW',
    },
    {
      id: '4',
      name: 'Emily Chen',
      email: 'emily.c@company.com',
      role: 'technician',
      status: 'active',
      lastActive: '3 hours ago',
      tasksCompleted: 298,
      avatar: 'EC',
    },
    {
      id: '5',
      name: 'David Brown',
      email: 'david.b@company.com',
      role: 'viewer',
      status: 'pending',
      lastActive: 'Never',
      tasksCompleted: 0,
      avatar: 'DB',
    },
  ];

  const roles = [
    {
      value: 'admin',
      label: 'Admin',
      description: 'Full access to all features',
      icon: 'shield-crown',
      color: '#DB4437',
    },
    {
      value: 'manager',
      label: 'Manager',
      description: 'Manage team and assets',
      icon: 'account-tie',
      color: '#4285F4',
    },
    {
      value: 'technician',
      label: 'Technician',
      description: 'Field work and inspections',
      icon: 'toolbox',
      color: '#F4B400',
    },
    {
      value: 'viewer',
      label: 'Viewer',
      description: 'Read-only access',
      icon: 'eye',
      color: '#9C27B0',
    },
  ];

  const getRoleColor = (role: string) => {
    const roleData = roles.find(r => r.value === role);
    return roleData?.color || '#999';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#0F9D58';
      case 'pending': return '#F4B400';
      case 'inactive': return '#999';
      default: return '#999';
    }
  };

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#00BCD4" />
      
      {/* Header */}
      <LinearGradient colors={['#00BCD4', '#0097A7']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Team Management</Text>
            <Text style={styles.headerSubtitle}>{teamMembers.length} members</Text>
          </View>
          <TouchableOpacity 
            style={styles.inviteButton}
            onPress={() => setShowInviteModal(true)}
          >
            <Icon name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search team members..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* Team Stats */}
        <View style={styles.statsRow}>
          <StatCard
            icon="account-check"
            value={teamMembers.filter(m => m.status === 'active').length.toString()}
            label="Active"
            color="#0F9D58"
          />
          <StatCard
            icon="clock-outline"
            value={teamMembers.filter(m => m.status === 'pending').length.toString()}
            label="Pending"
            color="#F4B400"
          />
          <StatCard
            icon="chart-line"
            value={Math.floor(teamMembers.reduce((sum, m) => sum + m.tasksCompleted, 0) / teamMembers.length).toString()}
            label="Avg Tasks"
            color="#4285F4"
          />
        </View>

        {/* Role Filter */}
        <View style={styles.roleFilter}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[styles.roleChip, selectedRole === '' && styles.roleChipActive]}
              onPress={() => setSelectedRole('')}
            >
              <Text style={[styles.roleChipText, selectedRole === '' && styles.roleChipTextActive]}>
                All Roles
              </Text>
            </TouchableOpacity>
            {roles.map((role) => (
              <TouchableOpacity
                key={role.value}
                style={[
                  styles.roleChip,
                  selectedRole === role.value && styles.roleChipActive,
                ]}
                onPress={() => setSelectedRole(role.value)}
              >
                <Icon name={role.icon} size={16} color={selectedRole === role.value ? '#fff' : role.color} />
                <Text style={[
                  styles.roleChipText,
                  selectedRole === role.value && styles.roleChipTextActive,
                ]}>
                  {role.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Team Members List */}
        <View style={styles.membersList}>
          {filteredMembers
            .filter(member => !selectedRole || member.role === selectedRole)
            .map((member) => (
            <View key={member.id} style={styles.memberCard}>
              <View style={styles.memberHeader}>
                <LinearGradient
                  colors={[getRoleColor(member.role), getRoleColor(member.role) + 'CC']}
                  style={styles.memberAvatar}
                >
                  <Text style={styles.memberAvatarText}>{member.avatar}</Text>
                </LinearGradient>

                <View style={styles.memberInfo}>
                  <View style={styles.memberNameRow}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(member.status) }]} />
                  </View>
                  <Text style={styles.memberEmail}>{member.email}</Text>
                  <View style={styles.memberMeta}>
                    <View style={[styles.roleBadge, { backgroundColor: getRoleColor(member.role) + '20' }]}>
                      <Text style={[styles.roleText, { color: getRoleColor(member.role) }]}>
                        {member.role.toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.lastActive}>• {member.lastActive}</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.moreButton}>
                  <Icon name="dots-vertical" size={24} color="#999" />
                </TouchableOpacity>
              </View>

              <View style={styles.memberStats}>
                <View style={styles.statItem}>
                  <Icon name="checkbox-marked-circle" size={16} color="#0F9D58" />
                  <Text style={styles.statText}>{member.tasksCompleted} tasks</Text>
                </View>
                <TouchableOpacity style={styles.viewActivityButton}>
                  <Text style={styles.viewActivityText}>View Activity</Text>
                  <Icon name="chevron-right" size={16} color="#4285F4" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Invite Modal */}
      <Modal
        visible={showInviteModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowInviteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Invite Team Member</Text>
              <TouchableOpacity onPress={() => setShowInviteModal(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Email address"
              keyboardType="email-address"
              placeholderTextColor="#999"
            />

            <Text style={styles.inputLabel}>Select Role</Text>
            {roles.map((role) => (
              <TouchableOpacity
                key={role.value}
                style={styles.roleOption}
              >
                <View style={styles.roleOptionLeft}>
                  <View style={[styles.roleIcon, { backgroundColor: role.color + '20' }]}>
                    <Icon name={role.icon} size={24} color={role.color} />
                  </View>
                  <View>
                    <Text style={styles.roleLabel}>{role.label}</Text>
                    <Text style={styles.roleDescription}>{role.description}</Text>
                  </View>
                </View>
                <Icon name="radiobox-blank" size={24} color="#ddd" />
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.sendInviteButton}>
              <LinearGradient
                colors={['#00BCD4', '#0097A7']}
                style={styles.sendInviteGradient}
              >
                <Icon name="send" size={20} color="#fff" />
                <Text style={styles.sendInviteText}>Send Invitation</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const StatCard = ({ icon, value, label, color }: any) => (
  <View style={styles.statCard}>
    <Icon name={icon} size={24} color={color} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
  },
  inviteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 2,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    gap: 10,
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  roleFilter: {
    paddingLeft: 15,
    marginBottom: 15,
  },
  roleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 10,
    gap: 6,
    elevation: 1,
  },
  roleChipActive: {
    backgroundColor: '#00BCD4',
    elevation: 3,
  },
  roleChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  roleChipTextActive: {
    color: '#fff',
  },
  membersList: {
    paddingHorizontal: 15,
  },
  memberCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  memberInfo: {
    flex: 1,
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  memberEmail: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  memberMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  roleText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  lastActive: {
    fontSize: 12,
    color: '#999',
  },
  moreButton: {
    padding: 5,
  },
  memberStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: '#666',
  },
  viewActivityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewActivityText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4285F4',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 25,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 15,
    fontSize: 15,
    color: '#333',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  roleOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 10,
  },
  roleOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  roleIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  roleDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  sendInviteButton: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sendInviteGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    gap: 8,
  },
  sendInviteText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default TeamManagementScreen;
