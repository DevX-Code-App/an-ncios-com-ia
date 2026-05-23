import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { GeneratedAd } from '../types';

export const ResultScreen = ({ navigation, route }: any) => {
  const { ad } = route.params as { ad: GeneratedAd };
  const [activeTab, setActiveTab] = useState<'facebook' | 'instagram' | 'video'>('facebook');

  const copyToClipboard = async (text: string, label: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copiado!', `${label} copiado para a área de transferência`);
  };

  const openWhatsApp = () => {
    Linking.openURL(ad.ctaLink);
  };

  const shareContent = async () => {
    try {
      let content = '';
      if (activeTab === 'facebook') content = ad.fbAdText;
      else if (activeTab === 'instagram') content = ad.igCaption;
      else content = ad.videoScript;

      await Share.share({ message: content });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'facebook':
        return (
          <View style={styles.contentCard}>
            <View style={styles.contentHeader}>
              <Ionicons name="logo-facebook" size={24} color="#38bdf8" />
              <Text style={styles.contentTitle}>Texto para Facebook Ads</Text>
            </View>
            <Text style={styles.contentText}>{ad.fbAdText}</Text>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={() => copyToClipboard(ad.fbAdText, 'Texto do Facebook')}
            >
              <Ionicons name="copy-outline" size={18} color="#fff" />
              <Text style={styles.copyButtonText}>Copiar Texto</Text>
            </TouchableOpacity>
          </View>
        );

      case 'instagram':
        return (
          <View style={styles.contentCard}>
            <View style={styles.contentHeader}>
              <Ionicons name="logo-instagram" size={24} color="#a78bfa" />
              <Text style={styles.contentTitle}>Legenda para Instagram</Text>
            </View>
            <Text style={styles.contentText}>{ad.igCaption}</Text>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={() => copyToClipboard(ad.igCaption, 'Legenda do Instagram')}
            >
              <Ionicons name="copy-outline" size={18} color="#fff" />
              <Text style={styles.copyButtonText}>Copiar Legenda</Text>
            </TouchableOpacity>
          </View>
        );

      case 'video':
        return (
          <View style={styles.contentCard}>
            <View style={styles.contentHeader}>
              <Ionicons name="videocam" size={24} color="#38bdf8" />
              <Text style={styles.contentTitle}>Roteiro de Vídeo (Reels/TikTok)</Text>
            </View>
            <ScrollView style={styles.scriptScroll}>
              <Text style={styles.contentText}>{ad.videoScript}</Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={() => copyToClipboard(ad.videoScript, 'Roteiro de vídeo')}
            >
              <Ionicons name="copy-outline" size={18} color="#fff" />
              <Text style={styles.copyButtonText}>Copiar Roteiro</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#f8fafc" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Seus Anúncios</Text>
        <TouchableOpacity onPress={shareContent}>
          <Ionicons name="share-outline" size={24} color="#f8fafc" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Success Banner */}
        <View style={styles.successBanner}>
          <Ionicons name="checkmark-circle" size={48} color="#10b981" />
          <Text style={styles.successTitle}>Anúncios Gerados!</Text>
          <Text style={styles.successSubtitle}>
            Seus anúncios estão prontos para uso nas redes sociais
          </Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'facebook' && styles.tabActive]}
            onPress={() => setActiveTab('facebook')}
          >
            <Ionicons
              name="logo-facebook"
              size={20}
              color={activeTab === 'facebook' ? '#fff' : '#94a3b8'}
            />
            <Text style={[styles.tabText, activeTab === 'facebook' && styles.tabTextActive]}>
              Facebook
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'instagram' && styles.tabActive]}
            onPress={() => setActiveTab('instagram')}
          >
            <Ionicons
              name="logo-instagram"
              size={20}
              color={activeTab === 'instagram' ? '#fff' : '#94a3b8'}
            />
            <Text style={[styles.tabText, activeTab === 'instagram' && styles.tabTextActive]}>
              Instagram
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'video' && styles.tabActive]}
            onPress={() => setActiveTab('video')}
          >
            <Ionicons
              name="videocam"
              size={20}
              color={activeTab === 'video' ? '#fff' : '#94a3b8'}
            />
            <Text style={[styles.tabText, activeTab === 'video' && styles.tabTextActive]}>
              Vídeo
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {renderContent()}

        {/* CTA Section */}
        <View style={styles.ctaCard}>
          <View style={styles.ctaHeader}>
            <Ionicons name="logo-whatsapp" size={24} color="#10b981" />
            <Text style={styles.ctaTitle}>Link de Contato WhatsApp</Text>
          </View>
          <Text style={styles.ctaLink} numberOfLines={1}>
            {ad.ctaLink}
          </Text>
          <View style={styles.ctaButtons}>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => copyToClipboard(ad.ctaLink, 'Link do WhatsApp')}
            >
              <Ionicons name="copy-outline" size={18} color="#fff" />
              <Text style={styles.ctaButtonText}>Copiar Link</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.ctaButton, styles.ctaButtonPrimary]} onPress={openWhatsApp}>
              <Ionicons name="open-outline" size={18} color="#fff" />
              <Text style={styles.ctaButtonText}>Abrir WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Dicas de Uso</Text>
          <Text style={styles.tipsText}>
            • Teste diferentes versões dos textos{'\n'}
            • Use imagens de alta qualidade{'\n'}
            • Acompanhe os resultados e ajuste conforme necessário{'\n'}
            • Para vídeos, grave com boa iluminação natural
          </Text>
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
  successBanner: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#10b981',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginTop: 12,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 8,
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  tabActive: {
    backgroundColor: '#a78bfa',
  },
  tabText: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#fff',
  },
  contentCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  contentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  contentText: {
    fontSize: 14,
    color: '#f8fafc',
    lineHeight: 22,
    marginBottom: 16,
  },
  scriptScroll: {
    maxHeight: 300,
    marginBottom: 16,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#a78bfa',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  ctaCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  ctaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  ctaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  ctaLink: {
    fontSize: 12,
    color: '#38bdf8',
    backgroundColor: '#1f2937',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  ctaButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#374151',
    borderRadius: 12,
    paddingVertical: 12,
    gap: 6,
  },
  ctaButtonPrimary: {
    backgroundColor: '#10b981',
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tipsCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#38bdf8',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 12,
  },
  tipsText: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 22,
  },
});
