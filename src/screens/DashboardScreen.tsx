import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GeneratedAd, Product } from '../types';

export const DashboardScreen = ({ navigation }: any) => {
  const { user, subscription, signOut } = useAuth();
  const [ads, setAds] = useState<GeneratedAd[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = async () => {
    try {
      const stored = await AsyncStorage.getItem('@anuncialocal:ads');
      if (stored) {
        setAds(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading ads:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAds();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: signOut }
      ]
    );
  };

  const isPro = subscription?.planTier === 'pro';
  const creditsText = isPro ? 'Ilimitados' : subscription?.aiCreditsRemaining || 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, {user?.email?.split('@')[0] || 'Usuário'}!</Text>
          <Text style={styles.subtitle}>Pronto para criar anúncios?</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#a78bfa" />}
      >
        {/* Credits Card */}
        <View style={styles.creditsCard}>
          <View style={styles.creditsHeader}>
            <View>
              <Text style={styles.creditsLabel}>Créditos de IA</Text>
              <Text style={styles.creditsValue}>{creditsText}</Text>
            </View>
            <View style={[styles.badge, isPro ? styles.badgePro : styles.badgeFree]}>
              <Text style={styles.badgeText}>{isPro ? 'PRO' : 'FREE'}</Text>
            </View>
          </View>

          {!isPro && (
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={() => navigation.navigate('Plans')}
            >
              <Ionicons name="rocket" size={18} color="#fff" />
              <Text style={styles.upgradeText}>Upgrade para Pro</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Create')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="add-circle" size={32} color="#a78bfa" />
            </View>
            <Text style={styles.actionTitle}>Criar Anúncio</Text>
            <Text style={styles.actionSubtitle}>Gerar com IA</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Plans')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="star" size={32} color="#38bdf8" />
            </View>
            <Text style={styles.actionTitle}>Planos</Text>
            <Text style={styles.actionSubtitle}>Ver opções</Text>
          </TouchableOpacity>
        </View>

        {/* Ads History */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Anúncios Criados</Text>

          {ads.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={64} color="#374151" />
              <Text style={styles.emptyTitle}>Nenhum anúncio ainda</Text>
              <Text style={styles.emptySubtitle}>
                Crie seu primeiro anúncio com IA agora!
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => navigation.navigate('Create')}
              >
                <Text style={styles.emptyButtonText}>Começar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.adsGrid}>
              {ads.map((ad, index) => (
                <TouchableOpacity
                  key={ad.id}
                  style={styles.adCard}
                  onPress={() => navigation.navigate('Result', { ad })}
                >
                  <View style={styles.adCardHeader}>
                    <Ionicons name="megaphone" size={20} color="#a78bfa" />
                    <Text style={styles.adCardDate}>
                      {new Date(ad.createdAt).toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                  <Text style={styles.adCardText} numberOfLines={3}>
                    {ad.fbAdText}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f19',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 0,
  },
  creditsCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#a78bfa',
  },
  creditsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  creditsLabel: {
    fontSize: 14,
    color: '#94a3b8',
  },
  creditsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginTop: 4,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgePro: {
    backgroundColor: '#a78bfa',
  },
  badgeFree: {
    backgroundColor: '#374151',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#a78bfa',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 16,
    gap: 8,
  },
  upgradeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  actionIcon: {
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
  },
  historySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 16,
  },
  emptyState: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 8,
    textAlign: 'center',
  },
  emptyButton: {
    backgroundColor: '#a78bfa',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 20,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  adsGrid: {
    gap: 16,
  },
  adCard: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 16,
  },
  adCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  adCardDate: {
    fontSize: 12,
    color: '#94a3b8',
  },
  adCardText: {
    fontSize: 14,
    color: '#f8fafc',
    lineHeight: 20,
  },
});
