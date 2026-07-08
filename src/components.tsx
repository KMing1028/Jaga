import React from 'react';
import { Image, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius, spacing } from './theme';
import { Loan, Product } from './data';

export function LogoMark({
  logo,
  initials,
  color,
  size = 48,
}: {
  logo?: number;
  initials: string;
  color: string;
  size?: number;
}) {
  if (logo) {
    return (
      <View
        style={[
          styles.logoBox,
          { width: size, height: size, borderRadius: size * 0.24 },
        ]}
      >
        <Image
          source={logo}
          resizeMode="contain"
          style={{ width: size - 12, height: size - 12 }}
        />
      </View>
    );
  }
  return (
    <View
      style={[
        styles.logoFallback,
        { width: size, height: size, borderRadius: size * 0.24, backgroundColor: color },
      ]}
    >
      <Text style={[styles.logoText, { fontSize: initials.length > 2 ? size * 0.3 : size * 0.36 }]}>
        {initials}
      </Text>
    </View>
  );
}

export function Badge({ label, tone = 'accent' }: { label: string; tone?: 'accent' | 'ink' }) {
  const dark = tone === 'ink';
  return (
    <View style={[styles.badge, { backgroundColor: dark ? colors.deep : colors.accentSoft }]}>
      <Text style={[styles.badgeText, { color: dark ? colors.onDeep : colors.accent }]}>{label}</Text>
    </View>
  );
}

export function ProductCard({
  product,
  forYou,
  active,
  onPress,
}: {
  product: Product;
  forYou?: boolean;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.7 }]}
    >
      <LogoMark logo={product.logo} initials={product.initials} color={product.brandColor} />
      <View style={styles.cardBody}>
        <Text style={styles.cardName} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.cardProvider}>{product.provider}</Text>
        <Text style={styles.cardAimed} numberOfLines={2}>
          {product.aimedFor}
        </Text>
        {(active || forYou || product.badge) && (
          <View style={styles.cardBadges}>
            {active && <Badge label="✓ Active" tone="ink" />}
            {forYou && !active && <Badge label="For you" />}
            {product.badge ? <Badge label={product.badge} /> : null}
          </View>
        )}
      </View>
      <View style={styles.cardPrice}>
        <Text style={styles.priceText}>{product.monthly}</Text>
        {product.estimated && <Text style={styles.priceEst}>est.</Text>}
      </View>
    </Pressable>
  );
}

export function LoanCard({
  loan,
  forYou,
  onPress,
}: {
  loan: Loan;
  forYou?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.7 }]}
    >
      <LogoMark logo={loan.logo} initials={loan.initials} color={loan.brandColor} />
      <View style={styles.cardBody}>
        <Text style={styles.cardName} numberOfLines={2}>
          {loan.name}
        </Text>
        <Text style={styles.cardProvider}>{loan.provider}</Text>
        <Text style={styles.cardAimed} numberOfLines={2}>
          {loan.aimedFor}
        </Text>
        {forYou && (
          <View style={styles.cardBadges}>
            <Badge label="For you" />
          </View>
        )}
      </View>
      <View style={styles.cardPrice}>
        <Text style={styles.priceText}>{loan.amount}</Text>
        <Text style={styles.priceEst}>{loan.rate}</Text>
      </View>
    </Pressable>
  );
}

export function PrimaryButton({
  label,
  onPress,
  variant = 'accent',
  style,
}: {
  label: string;
  onPress: () => void;
  variant?: 'accent' | 'deep' | 'ghost';
  style?: ViewStyle;
}) {
  const bg = variant === 'accent' ? colors.accent : variant === 'deep' ? colors.deep : 'transparent';
  const fg = variant === 'ghost' ? colors.muted : '#FFFFFF';
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg },
        variant === 'ghost' && { borderWidth: 1, borderColor: colors.border },
        style,
        pressed && { opacity: 0.85 },
      ]}
    >
      <Text style={[styles.buttonText, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

export function BackLink({ onPress, label = 'Back' }: { onPress: () => void; label?: string }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={12}
      style={{ alignSelf: 'flex-start' }}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={styles.backText}>‹ {label}</Text>
    </Pressable>
  );
}

export type TabId = 'home' | 'insurance' | 'retirement' | 'loans';

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: '⌂' },
  { id: 'insurance', label: 'Insurance', icon: '🛡' },
  { id: 'retirement', label: 'Retirement', icon: '🌱' },
  { id: 'loans', label: 'Loans', icon: '💸' },
];

export function TabBar({ current, onChange }: { current: TabId; onChange: (t: TabId) => void }) {
  return (
    <View style={styles.tabBar}>
      {tabs.map((t) => {
        const activeTab = t.id === current;
        return (
          <Pressable
            key={t.id}
            style={styles.tabItem}
            onPress={() => onChange(t.id)}
            accessibilityRole="tab"
            accessibilityLabel={`${t.label} tab`}
            accessibilityState={{ selected: activeTab }}
          >
            <Text style={[styles.tabIcon, { opacity: activeTab ? 1 : 0.45 }]}>{t.icon}</Text>
            <Text style={[styles.tabLabel, activeTab && styles.tabLabelActive]}>{t.label}</Text>
            <View style={[styles.tabDot, { opacity: activeTab ? 1 : 0 }]} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  logoBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginBottom: spacing.sm + 4,
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.ink,
    flexShrink: 1,
  },
  cardProvider: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 2,
  },
  cardAimed: {
    fontSize: 12,
    color: colors.faint,
    marginTop: 2,
    lineHeight: 16,
  },
  cardBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  cardPrice: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.accent,
    maxWidth: 110,
    textAlign: 'right',
  },
  priceEst: {
    fontSize: 11,
    color: colors.faint,
  },
  button: {
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  backText: {
    fontSize: 15,
    color: colors.muted,
    paddingVertical: spacing.sm,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 22,
    paddingTop: spacing.sm,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  tabIcon: {
    fontSize: 20,
    color: colors.ink,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.faint,
  },
  tabLabelActive: {
    color: colors.accent,
  },
  tabDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
    marginTop: 1,
  },
});
