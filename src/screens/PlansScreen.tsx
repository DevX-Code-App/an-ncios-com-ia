import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

export const PlansScreen = ({ navigation }: any) => {
  const { subscription, updateSubscription } = useAuth();
  const [loading, setLoading] = useState(false);
  const isPro = subscription?.planTier === 'pro';

  const handleUpgrade = async () => {
    setLoading(true);

    // Simulação de checkout - em produção, integrar RevenueCat ou Stripe
    setTimeout(() => {
      if (subscription) {
        const updatedSubscription = {
          ...subscription,
          planTier: 'pro' as const,
          status: 'active' as const,
          aiCreditsRemaining: 999999,
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dias
        };

        updateSubscription(updatedSubscription);

        Alert.alert(
          'Sucesso!',
          'Parabéns! Você agora tem acesso ilimitado ao AnunciaLocal AI Pro.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
      setLoading(false);
    }, 1500);
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      'Cancelar Assinatura',
      'Tem certeza que deseja voltar para o plano gratuito?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, cancelar',
          style: 'destructive',
          onPress: () => {
            if (subscription) {
              const updatedSubscription = {
                ...subscription,
                planTier: 'free' as const,
                status: 'inactive' as const,
                aiCreditsRemaining: 5
              };
              updateSubscription(updatedSubscription);
              Alert.alert('Cancelado', 'Você voltou para o plano gratuito.');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#f8fafc" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Planos</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>Escolha o melhor plano para você</Text>
        <Text style={styles.pageSubtitle}>
          Crie anúncios profissionais com Inteligência Artificial
        </Text>

        {/* Free Plan */}
        <View style={[styles.planCard, isPro && styles.planCardInactive]}>
          <View style={styles.planHeader}>
            <View>
              <Text style={styles.planName}>Plano Gratuito</Text>
              <Text style={styles.planPrice}>R$ 0,00</Text>
            </View>
            {!isPro && (
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>Seu Plano</Text>
              </View>
            )}
          </View>

          <View style={styles.featuresContainer}>
            <View style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text style={styles.featureText}>5 créditos de IA inclusos</Text>
            </View>
            <View style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text style={styles.featureText}>Anúncios para Facebook</Text>
            </View>
            <View style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text style={styles.featureText}>Legendas para Instagram</Text>
            </View>
            <View style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text style={styles.featureText}>Roteiros de vídeo</Text>
            </View>
            <View style={styles.featureRow}>
              <Ionicons name="close-circle" size={20} color="#ef4444" />
              <Text style={[styles.featureText, styles.featureTextDisabled]}>
                Créditos ilimitados
              </Text>
            </View>
            <View style={styles.featureRow}>
              <Ionicons name="close-circle" size={20} color="#ef4444" />
              <Text style={[styles.featureText, styles.featureTextDisabled]}>
                Suporte prioritário
              </Text>
            </View>
          </View>
        </View>

        {/* Pro Plan */}
        <View style={[styles.planCard, styles.planCardPro]}>
          <View style={styles.proBadge}>
            <Ionicons name="star" size={16} color="#fff" />
            <Text style={styles.proBadgeText}>MAIS POPULAR</Text>
          </View>

          <View style={styles.planHeader}>
            <View>
              <Text style={styles.planName}>Plano Pro</Text>
              <View style={styles.priceRow}>
                <Text style={styles.planPrice}>R$ 49,90</Text>
                <Text style={styles.pricePeriod}>/mês</Text>
              </View>
            </View>
            {isPro && (
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>Seu Plano</Text>
              </View>
            )}
          </View>

          <View style={styles.featuresContainer}>
            <View style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={20} color="#a78bfa" />
              <Text style={styles.featureText}>
                <Text style={styles.featureTextBold}>Créditos ILIMITADOS</Text> de IA
              </Text>
            </View>
            <View style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={20} color="#a78bfa" />
              <Text style={styles.featureText}>Todos os recursos do plano Free</Text>
            </View>
            <View style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={20} color="#a78bfa" />
              <Text style={styles.featureText}>Gere quantos anúncios quiser</Text>
            </View>
            <View style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={20} color="#a78bfa" />
              <Text style={styles.featureText}>Suporte prioritário</Text>
            </View>
            <View style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={20} color="#a78bfa" />
              <Text style={styles.featureText}>Atualizações em primeira mão</Text>
            </View>
            <View style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={20} color="#a78bfa" />
              <Text style={styles.featureText}>Sem limites de uso</Text>
            </View>
          </View>

          {!isPro ? (
            <TouchableOpacity
              style={[styles.upgradeButton, loading && styles.upgradeButtonDisabled]}
              onPress={handleUpgrade}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="rocket" size={20} color="#fff" />
                  <Text style={styles.upgradeButtonText}>Assinar Plano Pro</Text>
                </>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelSubscription}>
              <Text style={styles.cancelButtonText}>Cancelar Assinatura</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Benefits */}
        <View style={styles.benefitsCard}>
          <Text style={styles.benefitsTitle}>Por que escolher o Pro?</Text>
          <Text style={styles.benefitsText}>
            • Escale seu negócio sem preocupações com créditos{'\n'}
            • Ideal para agências e revendedores{'\n'}
            • Crie campanhas para múltiplos clientes{'\n'}
            • Teste A/B ilimitado de anúncios{'\n'}
            • Suporte dedicado para crescer suas vendas
          </Text>
        </View>

        <Text style={styles.disclaimer}>
          * Pagamento simulado para fins de demonstração. Em produção, será integrado com sistema de
          pagamento seguro via Apple Pay / Google Pay.
        </Text>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 0,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f8fafc',
    textAlign: 'center',
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 32,
  },
  planCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#374151',
  },
  planCardInactive: {
    opacity: 0.7,
  },
  planCardPro: {
    borderColor: '#a78bfa',
    position: 'relative',
  },
  proBadge: {
    position: 'absolute',
    top: -12,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#a78bfa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  proBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#a78bfa',
  },
  pricePeriod: {
    fontSize: 16,
    color: '#94a3b8',
    marginLeft: 4,
  },
  currentBadge: {
    backgroundColor: '#38bdf8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  currentBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  featuresContainer: {
    gap: 12,
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: '#f8fafc',
  },
  featureTextBold: {
    fontWeight: 'bold',
    color: '#a78bfa',
  },
  featureTextDisabled: {
    color: '#64748b',
    textDecorationLine: 'line-through',
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#a78bfa',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  upgradeButtonDisabled: {
    opacity: 0.5,
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#374151',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
  benefitsCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#38bdf8',
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 12,
  },
  benefitsText: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 22,
  },
  disclaimer: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
});
