import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

export const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha na autenticação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Ionicons name="megaphone" size={64} color="#a78bfa" />
          <Text style={styles.logo}>AnunciaLocal AI</Text>
          <Text style={styles.tagline}>
            Crie anúncios profissionais com Inteligência Artificial
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>
            {isLogin ? 'Entrar na conta' : 'Criar conta grátis'}
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Seu e-mail"
              placeholderTextColor="#64748b"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#64748b"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Carregando...' : isLogin ? 'Entrar' : 'Criar conta'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.switchText}>
              {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
            </Text>
          </TouchableOpacity>

          {!isLogin && (
            <View style={styles.benefitsCard}>
              <Text style={styles.benefitsTitle}>✨ 5 créditos grátis ao criar conta</Text>
              <Text style={styles.benefitsText}>
                • Crie anúncios para Facebook, Instagram e TikTok{'\n'}
                • Scripts de vídeo prontos para Reels{'\n'}
                • Upgrade para Pro e tenha créditos ilimitados
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f19',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginTop: 16,
  },
  tagline: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  formCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 52,
    color: '#f8fafc',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#a78bfa',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchText: {
    color: '#38bdf8',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },
  benefitsCard: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#1f2937',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#a78bfa',
  },
  benefitsTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  benefitsText: {
    color: '#94a3b8',
    fontSize: 14,
    lineHeight: 22,
  },
});
