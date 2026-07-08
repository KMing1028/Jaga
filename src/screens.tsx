import React, { useState } from 'react';
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { BackLink, Badge, LoanCard, LogoMark, PrimaryButton, ProductCard } from './components';
import {
  Account,
  appLogo,
  banks,
  burdenOptions,
  disclaimer,
  EmergencyGoal,
  Loan,
  loans,
  loansDisclaimer,
  Occupation,
  occupations,
  Product,
  products,
  PrsPeriod,
  religions,
  returnsDisclaimer,
  Section,
  sections,
} from './data';
import { colors, radius, spacing } from './theme';

export type LinkedBank = { bankId: string; last4: string };

function isRelevant(product: Product, occupationId: string) {
  return product.relevantTo === 'all' || product.relevantTo.includes(occupationId);
}

function isForYou(product: Product, occupationId: string) {
  return product.relevantTo !== 'all' && product.relevantTo.includes(occupationId);
}

// ── 1. Intro ─────────────────────────────────────────────

export function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <View style={styles.screen}>
      <View style={styles.introCenter}>
        <Image source={appLogo} style={styles.introLogo} resizeMode="contain" />
        <Text style={styles.wordmark}>JAGA</Text>
        <Text style={styles.tagline}>Protection for Malaysia’s gig workers</Text>

        <View style={styles.introPoints}>
          <IntroPoint emoji="🛡️" title="Insurance made simple" body="Accident, health and SOCSO cover — matched to the work you actually do." />
          <IntroPoint emoji="🌱" title="Retirement that fits gig income" body="Save small amounts monthly and collect free government top-ups." />
          <IntroPoint emoji="💸" title="Small monthly payments" body="From about RM10 a month — no big one-time premiums." />
        </View>

        <Text style={styles.introStat}>
          3 million+ Malaysians do gig work.{'\n'}Fewer than 1 in 10 are protected.
        </Text>
      </View>

      <PrimaryButton label="Get started" onPress={onStart} />
      <Text style={styles.introFootnote}>jaga (Malay) — to guard, to protect</Text>
    </View>
  );
}

function IntroPoint({ emoji, title, body }: { emoji: string; title: string; body: string }) {
  return (
    <View style={styles.introPoint}>
      <Text style={styles.introEmoji}>{emoji}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.introPointTitle}>{title}</Text>
        <Text style={styles.introPointBody}>{body}</Text>
      </View>
    </View>
  );
}

// ── 2. Occupation ────────────────────────────────────────

export function OccupationScreen({
  onSelect,
  onBack,
}: {
  onSelect: (o: Occupation) => void;
  onBack: () => void;
}) {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.screen}>
      <BackLink onPress={onBack} />
      <Text style={styles.h1}>What do you do?</Text>
      <Text style={styles.sub}>We’ll match protection to your line of work.</Text>

      <View style={{ marginTop: spacing.lg }}>
        {occupations.map((o) => (
          <Pressable
            key={o.id}
            onPress={() => onSelect(o)}
            style={({ pressed }) => [styles.occRow, pressed && { backgroundColor: colors.surfaceSoft }]}
          >
            <Text style={styles.occEmoji}>{o.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.occLabel}>{o.label}</Text>
              <Text style={styles.occHint}>{o.hint}</Text>
            </View>
            <Text style={styles.chev}>›</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

// ── 3. Dashboard (Home tab) ──────────────────────────────

export function DashboardScreen({
  account,
  occupation,
  activePlanIds,
  linkedBank,
  autoDebit,
  onToggleAutoDebit,
  onOpenBankLink,
  onOpenProduct,
  onBrowse,
  onChangeOccupation,
  onLogout,
}: {
  account: Account;
  occupation: Occupation;
  activePlanIds: string[];
  linkedBank: LinkedBank | null;
  autoDebit: boolean;
  onToggleAutoDebit: () => void;
  onOpenBankLink: () => void;
  onOpenProduct: (p: Product) => void;
  onBrowse: (tab: 'insurance' | 'retirement') => void;
  onChangeOccupation: () => void;
  onLogout: () => void;
}) {
  const active = products.filter((p) => activePlanIds.includes(p.id));
  const totalMonthly = active.reduce((sum, p) => sum + (p.monthlyValue ?? 0), 0);
  const quoteCount = active.filter((p) => p.monthlyValue == null).length;

  const coveredSections = new Set(active.map((p) => p.sectionId));
  // Score counts insurance categories only, so the max matches the "/5" in
  // the app copy; retirement/emergency plans still appear in the totals.
  const insuranceSections = sections.filter((s) => s.group === 'insurance');
  const score = insuranceSections.filter((s) => coveredSections.has(s.id)).length;

  const suggestions = products
    .filter(
      (p) =>
        !activePlanIds.includes(p.id) &&
        isRelevant(p, occupation.id) &&
        !coveredSections.has(p.sectionId) &&
        !p.referenceOnly &&
        (account.religion !== 'Islam' || p.shariah !== false),
    )
    .sort((a, b) => Number(isForYou(b, occupation.id)) - Number(isForYou(a, occupation.id)))
    .slice(0, 3);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.screenTab}>
      <View style={styles.dashHeader}>
        <Image source={appLogo} style={styles.dashLogo} resizeMode="contain" />
        <View style={{ flex: 1 }}>
          <Text style={styles.dashBrand}>Hi, {account.username}</Text>
          <Text style={styles.dashGreeting}>
            {occupation.emoji} {occupation.label}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end', gap: spacing.xs }}>
          <Pressable onPress={onChangeOccupation} hitSlop={8}>
            <Text style={styles.changeLink}>Change</Text>
          </Pressable>
          <Pressable onPress={onLogout} hitSlop={8}>
            <Text style={styles.logoutLink}>Log out</Text>
          </Pressable>
        </View>
      </View>

      {/* protection summary */}
      <View style={styles.summaryCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.summaryLabel}>MY MONTHLY PROTECTION</Text>
          <Text style={styles.summaryAmount}>
            RM{totalMonthly.toFixed(2)}
            <Text style={styles.summaryPerMo}>/mo</Text>
          </Text>
          {quoteCount > 0 && (
            <Text style={styles.summaryQuote}>+ {quoteCount} plan{quoteCount > 1 ? 's' : ''} on quote</Text>
          )}
        </View>
        <View style={styles.scoreWrap}>
          <Text style={styles.scoreNum}>
            {score}/{insuranceSections.length}
          </Text>
          <Text style={styles.scoreLabel}>insurance areas</Text>
        </View>
      </View>

      {/* payment method */}
      {linkedBank ? (
        <Pressable onPress={onOpenBankLink} style={styles.bankCard}>
          <View style={[styles.bankDot, { backgroundColor: banks.find((b) => b.id === linkedBank.bankId)?.color ?? colors.accent }]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.bankName}>
              {banks.find((b) => b.id === linkedBank.bankId)?.name ?? 'Bank'} ••{linkedBank.last4}
            </Text>
            <Text style={styles.bankHint}>
              {autoDebit ? 'Auto-debit on — plans charged monthly' : 'Auto-debit off — pay manually anytime'}
            </Text>
          </View>
          <Pressable onPress={onToggleAutoDebit} hitSlop={8} style={[styles.toggle, autoDebit && styles.toggleOn]}>
            <View style={[styles.toggleKnob, autoDebit && styles.toggleKnobOn]} />
          </Pressable>
        </Pressable>
      ) : (
        <Pressable onPress={onOpenBankLink} style={styles.bankLinkPrompt}>
          <Text style={styles.bankLinkIcon}>🏦</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.bankName}>Link your bank account</Text>
            <Text style={styles.bankHint}>
              Optional — auto-pay plans monthly from your gig income. You can always bank in manually instead.
            </Text>
          </View>
          <Text style={styles.chev}>›</Text>
        </Pressable>
      )}

      {/* active plans */}
      <Text style={styles.groupLabel}>ACTIVE PLANS</Text>
      {active.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyEmoji}>🌂</Text>
          <Text style={styles.emptyTitle}>You’re not protected yet</Text>
          <Text style={styles.emptyBody}>
            Start with one small plan — even RM10 a month puts a safety net under your gig income.
          </Text>
          <View style={styles.emptyButtons}>
            <PrimaryButton label="Browse insurance" onPress={() => onBrowse('insurance')} style={{ flex: 1 }} />
            <PrimaryButton label="Retirement" variant="deep" onPress={() => onBrowse('retirement')} style={{ flex: 1 }} />
          </View>
        </View>
      ) : (
        active.map((p) => (
          <ProductCard key={p.id} product={p} active onPress={() => onOpenProduct(p)} />
        ))
      )}

      {/* suggestions */}
      {suggestions.length > 0 && (
        <>
          <Text style={[styles.groupLabel, { marginTop: spacing.lg }]}>SUGGESTED FOR YOU</Text>
          {suggestions.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              forYou={isForYou(p, occupation.id)}
              onPress={() => onOpenProduct(p)}
            />
          ))}
        </>
      )}

      <Text style={styles.disclaimer}>{disclaimer}</Text>
    </ScrollView>
  );
}

// ── 4. Insurance tab (section list) ──────────────────────

export function InsuranceScreen({
  occupation,
  activePlanIds,
  onOpenSection,
}: {
  occupation: Occupation;
  activePlanIds: string[];
  onOpenSection: (s: Section) => void;
}) {
  const insurance = sections.filter((s) => s.group === 'insurance');
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.screenTab}>
      <Text style={styles.h1}>Insurance</Text>
      <Text style={styles.sub}>Cover for accidents, health and your work.</Text>
      <View style={{ marginTop: spacing.lg }}>
        {insurance.map((s) => (
          <SectionCard
            key={s.id}
            section={s}
            occupationId={occupation.id}
            activePlanIds={activePlanIds}
            onPress={() => onOpenSection(s)}
          />
        ))}
      </View>
      <Text style={styles.disclaimer}>{disclaimer}</Text>
    </ScrollView>
  );
}

// ── 5. Retirement tab (product list) ─────────────────────

export function RetirementScreen({
  occupation,
  religion,
  activePlanIds,
  onOpenProduct,
  onOpenCalculator,
}: {
  occupation: Occupation;
  religion: string;
  activePlanIds: string[];
  onOpenProduct: (p: Product) => void;
  onOpenCalculator: () => void;
}) {
  const isMuslim = religion === 'Islam';
  const allowedByFaith = (p: Product) => !isMuslim || p.shariah !== false;

  const items = products
    .filter((p) => p.sectionId === 'retirement' && isRelevant(p, occupation.id) && allowedByFaith(p))
    .sort((a, b) => Number(isForYou(b, occupation.id)) - Number(isForYou(a, occupation.id)));
  const emergencyItems = products.filter((p) => p.sectionId === 'emergency' && allowedByFaith(p));

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.screenTab}>
      <Text style={styles.h1}>Retirement</Text>
      <Text style={styles.sub}>Small monthly amounts + free government top-ups.</Text>
      {isMuslim && (
        <Text style={styles.faithNote}>
          Showing Shariah-compliant options only, based on your profile.
        </Text>
      )}

      <Pressable
        onPress={onOpenCalculator}
        style={({ pressed }) => [styles.calcEntry, pressed && { opacity: 0.8 }]}
      >
        <Text style={styles.calcEntryEmoji}>🧮</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.calcEntryTitle}>Retirement calculator</Text>
          <Text style={styles.calcEntrySub}>See what RM100/mo grows into by the time you retire</Text>
        </View>
        <Text style={[styles.chev, { color: colors.onDeep }]}>›</Text>
      </Pressable>

      <View style={{ marginTop: spacing.md }}>
        <Text style={styles.groupLabel}>RETIREMENT PLANS · {items.length} OPTIONS</Text>
        {items.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            forYou={isForYou(p, occupation.id)}
            active={activePlanIds.includes(p.id)}
            onPress={() => onOpenProduct(p)}
          />
        ))}

        <Text style={[styles.groupLabel, { marginTop: spacing.lg }]}>EMERGENCY FUND</Text>
        {emergencyItems.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            active={activePlanIds.includes(p.id)}
            onPress={() => onOpenProduct(p)}
          />
        ))}
      </View>
      <Text style={styles.disclaimer}>{disclaimer}</Text>
    </ScrollView>
  );
}

function SectionCard({
  section,
  occupationId,
  activePlanIds,
  onPress,
}: {
  section: Section;
  occupationId: string;
  activePlanIds: string[];
  onPress: () => void;
}) {
  const items = products.filter((p) => p.sectionId === section.id && isRelevant(p, occupationId));
  const forYouCount = items.filter((p) => isForYou(p, occupationId)).length;
  const activeCount = items.filter((p) => activePlanIds.includes(p.id)).length;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.sectionCard, pressed && { backgroundColor: colors.surfaceSoft }]}
    >
      <Text style={styles.sectionEmoji}>{section.emoji}</Text>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' }}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {activeCount > 0 ? <Badge label="✓ Active" tone="ink" /> : forYouCount > 0 && <Badge label="For you" />}
        </View>
        <Text style={styles.sectionSub}>{section.subtitle}</Text>
        <Text style={styles.sectionCount}>
          {items.length} {items.length === 1 ? 'plan' : 'plans'}
        </Text>
      </View>
      <Text style={styles.chev}>›</Text>
    </Pressable>
  );
}

// ── 6. Section (product list) ────────────────────────────

export function SectionScreen({
  section,
  occupation,
  activePlanIds,
  onBack,
  onOpenProduct,
}: {
  section: Section;
  occupation: Occupation;
  activePlanIds: string[];
  onBack: () => void;
  onOpenProduct: (p: Product) => void;
}) {
  const items = products
    .filter((p) => p.sectionId === section.id && isRelevant(p, occupation.id))
    .sort((a, b) => Number(isForYou(b, occupation.id)) - Number(isForYou(a, occupation.id)));

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.screenTab}>
      <BackLink onPress={onBack} />
      <Text style={styles.h1}>
        {section.emoji} {section.title}
      </Text>
      <Text style={styles.sub}>{section.subtitle}</Text>

      <View style={{ marginTop: spacing.lg }}>
        {items.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            forYou={isForYou(p, occupation.id)}
            active={activePlanIds.includes(p.id)}
            onPress={() => onOpenProduct(p)}
          />
        ))}
      </View>

      <Text style={styles.disclaimer}>{disclaimer}</Text>
    </ScrollView>
  );
}

// ── 7. Product detail ────────────────────────────────────

export function ProductScreen({
  product,
  isActive,
  emergencyGoal,
  onAdjustGoal,
  onToggleActive,
  onBack,
}: {
  product: Product;
  isActive: boolean;
  emergencyGoal?: EmergencyGoal | null;
  onAdjustGoal?: () => void;
  onToggleActive: () => void;
  onBack: () => void;
}) {
  const [period, setPeriod] = useState<PrsPeriod>('1Y');
  const isRetirementProduct = product.sectionId === 'retirement';

  const cta = isActive
    ? 'Cancel this plan'
    : product.sectionId === 'emergency'
      ? 'Start saving'
      : product.monthly === 'Get quote'
        ? 'Request a quote'
        : `Get covered · ${product.monthly}`;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.screenTab}>
      <BackLink onPress={onBack} />

      <View style={styles.detailHeader}>
        <LogoMark logo={product.logo} initials={product.initials} color={product.brandColor} size={64} />
        <View style={{ flex: 1 }}>
          <Text style={styles.detailName}>{product.name}</Text>
          <Text style={styles.detailProvider}>{product.provider}</Text>
          <View style={{ flexDirection: 'row', gap: spacing.xs, marginTop: spacing.xs, flexWrap: 'wrap' }}>
            {isActive && <Badge label="✓ Active" tone="ink" />}
            {product.badge ? <Badge label={product.badge} /> : null}
          </View>
        </View>
      </View>

      <View style={styles.priceBox}>
        <Text style={styles.priceBig}>{product.monthly}</Text>
        {product.monthlyNote ? <Text style={styles.priceNote}>{product.monthlyNote}</Text> : null}
        {product.estimated ? <Text style={styles.priceNote}>Estimated — confirmed on quote</Text> : null}
      </View>

      {product.sectionId === 'emergency' && emergencyGoal && (
        <View style={styles.goalCard}>
          <Text style={styles.goalLabel}>YOUR EMERGENCY GOAL</Text>
          <Text style={styles.goalBig}>
            RM{emergencyGoal.goal.toLocaleString('en-MY', { maximumFractionDigits: 0 })}
          </Text>
          <Text style={styles.goalSub}>
            {emergencyGoal.months} months × RM
            {emergencyGoal.expenses.toLocaleString('en-MY', { maximumFractionDigits: 0 })} expenses ·{' '}
            {emergencyGoal.burden}
          </Text>
          {onAdjustGoal && (
            <Pressable onPress={onAdjustGoal} hitSlop={8}>
              <Text style={styles.goalAdjust}>Adjust goal</Text>
            </Pressable>
          )}
        </View>
      )}

      <Text style={styles.detailLabel}>WHO IT’S FOR</Text>
      <Text style={styles.aimedText}>{product.aimedFor}</Text>
      {product.risk ? <Text style={styles.riskText}>Risk profile: {product.risk}</Text> : null}

      {product.returns && (
        <>
          <Text style={styles.detailLabel}>FUND RETURNS</Text>
          <View style={styles.segmentRow}>
            {(['YTD', '1Y', '3Y'] as PrsPeriod[]).map((p) => (
              <Pressable
                key={p}
                onPress={() => setPeriod(p)}
                style={[styles.segment, period === p && styles.segmentOn]}
              >
                <Text style={[styles.segmentText, period === p && styles.segmentTextOn]}>{p}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.fundReturnBox}>
            <Text style={styles.fundReturnBig}>+{product.returns[period].toFixed(2)}%</Text>
            <Text style={styles.fundReturnLabel}>
              {period === 'YTD' ? 'year to date' : period === '1Y' ? 'past 1 year' : 'past 3 years, % p.a.'}
            </Text>
          </View>
          <Text style={styles.fundDisclaimer}>{returnsDisclaimer}</Text>
        </>
      )}

      <Text style={styles.detailLabel}>WHAT YOU GET</Text>
      {product.coverage.map((c) => (
        <View key={c} style={styles.coverageRow}>
          <Text style={styles.coverageTick}>✓</Text>
          <Text style={styles.coverageText}>{c}</Text>
        </View>
      ))}

      {product.note ? (
        <View style={styles.noteBox}>
          <Text style={styles.noteText}>{product.note}</Text>
        </View>
      ) : null}

      {product.referenceOnly ? (
        <View style={styles.refOnlyBox}>
          <Text style={styles.refOnlyText}>{product.referenceOnly}</Text>
          <Text style={styles.refOnlySub}>Shown in JAGA as a price benchmark for comparison.</Text>
        </View>
      ) : (
        <PrimaryButton
          label={cta}
          variant={isActive ? 'ghost' : 'accent'}
          onPress={onToggleActive}
          style={{ marginTop: spacing.lg }}
        />
      )}
      {isActive && !product.referenceOnly && (
        <Text style={styles.activeHint}>
          {isRetirementProduct
            ? 'On your dashboard. Auto-debit is optional — you can also bank in any amount whenever you want.'
            : 'This plan is on your dashboard. Payments are charged monthly.'}
        </Text>
      )}
      <Text style={styles.disclaimer}>{disclaimer}</Text>
    </ScrollView>
  );
}

// ── 8. Micro-loans tab ───────────────────────────────────

export function LoansScreen({
  occupation,
  onOpenLoan,
}: {
  occupation: Occupation;
  onOpenLoan: (l: Loan) => void;
}) {
  const loanForYou = (l: Loan) => l.relevantTo !== 'all' && l.relevantTo.includes(occupation.id);
  const items = [...loans].sort((a, b) => Number(loanForYou(b)) - Number(loanForYou(a)));
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.screenTab}>
      <Text style={styles.h1}>Micro-loans</Text>
      <Text style={styles.sub}>Licensed financing sized for gig income — bridge a slow month or fund your gear.</Text>
      <View style={{ marginTop: spacing.lg }}>
        {items.map((l) => (
          <LoanCard key={l.id} loan={l} forYou={loanForYou(l)} onPress={() => onOpenLoan(l)} />
        ))}
      </View>
      <Text style={styles.disclaimer}>{loansDisclaimer}</Text>
    </ScrollView>
  );
}

export function LoanDetailScreen({ loan, onBack }: { loan: Loan; onBack: () => void }) {
  const [confirming, setConfirming] = useState(false);
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.screenTab}>
      <BackLink onPress={onBack} />

      <View style={styles.detailHeader}>
        <LogoMark logo={loan.logo} initials={loan.initials} color={loan.brandColor} size={64} />
        <View style={{ flex: 1 }}>
          <Text style={styles.detailName}>{loan.name}</Text>
          <Text style={styles.detailProvider}>{loan.provider}</Text>
        </View>
      </View>

      <View style={styles.priceBox}>
        <Text style={styles.priceBig}>{loan.amount}</Text>
        <Text style={styles.priceNote}>
          {loan.rate} · {loan.tenure}
        </Text>
      </View>

      <Text style={styles.detailLabel}>WHO IT’S FOR</Text>
      <Text style={styles.aimedText}>{loan.aimedFor}</Text>

      <Text style={styles.detailLabel}>WHY THIS LENDER</Text>
      {loan.features.map((f) => (
        <View key={f} style={styles.coverageRow}>
          <Text style={styles.coverageTick}>✓</Text>
          <Text style={styles.coverageText}>{f}</Text>
        </View>
      ))}

      {loan.note ? (
        <View style={styles.noteBox}>
          <Text style={styles.noteText}>{loan.note}</Text>
        </View>
      ) : null}

      {!confirming ? (
        <PrimaryButton
          label="Check eligibility"
          onPress={() => setConfirming(true)}
          style={{ marginTop: spacing.lg }}
        />
      ) : (
        <View style={styles.applyBox}>
          <Text style={styles.applyTitle}>
            {loan.applyUrl
              ? `We’ll take you to ${loan.provider} to apply`
              : `Apply directly with ${loan.provider}`}
          </Text>
          <Text style={styles.applySub}>
            JAGA is a prototype — eligibility checks and applications happen on the lender’s own site, not
            in this app.
          </Text>
          {loan.applyUrl ? (
            <PrimaryButton
              label={`Open ${loan.provider} site`}
              onPress={() => Linking.openURL(loan.applyUrl!)}
              style={{ marginTop: spacing.md, alignSelf: 'stretch' }}
            />
          ) : (
            <Text style={styles.applySub}>
              This lender isn’t linked in the prototype yet — search “{loan.provider}” to reach them.
            </Text>
          )}
        </View>
      )}
      <Text style={styles.disclaimer}>{loansDisclaimer}</Text>
    </ScrollView>
  );
}

// ── 9. Bank account linking ──────────────────────────────

export function BankLinkScreen({
  linkedBank,
  onLink,
  onUnlink,
  onBack,
}: {
  linkedBank: LinkedBank | null;
  onLink: (b: LinkedBank) => void;
  onUnlink: () => void;
  onBack: () => void;
}) {
  const [bankId, setBankId] = useState<string | null>(linkedBank?.bankId ?? null);
  const [account, setAccount] = useState('');
  const canLink = bankId && account.replace(/\D/g, '').length >= 6;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.screenTab}>
      <BackLink onPress={onBack} />
      <Text style={styles.h1}>🏦 Link bank account</Text>
      <Text style={styles.sub}>
        Optional. Linking lets JAGA auto-debit your plans monthly — small amounts, right after you get paid.
        You can skip this and bank in manually (e.g. top up PRS) whenever you want.
      </Text>

      {linkedBank && (
        <View style={styles.linkedBox}>
          <Text style={styles.linkedText}>
            Linked: {banks.find((b) => b.id === linkedBank.bankId)?.name} ••{linkedBank.last4}
          </Text>
          <Pressable onPress={onUnlink} hitSlop={8}>
            <Text style={styles.unlinkText}>Unlink</Text>
          </Pressable>
        </View>
      )}

      <Text style={styles.detailLabel}>CHOOSE YOUR BANK</Text>
      {banks.map((b) => (
        <Pressable
          key={b.id}
          onPress={() => setBankId(b.id)}
          style={[styles.bankRow, bankId === b.id && styles.bankRowOn]}
        >
          <View style={[styles.bankDot, { backgroundColor: b.color }]} />
          <Text style={styles.bankRowName}>{b.name}</Text>
          <Text style={[styles.bankRadio, bankId === b.id && { color: colors.accent }]}>
            {bankId === b.id ? '●' : '○'}
          </Text>
        </Pressable>
      ))}

      <Text style={styles.detailLabel}>ACCOUNT NUMBER</Text>
      <TextInput
        value={account}
        onChangeText={(t) => setAccount(t.replace(/[^\d\s-]/g, ''))}
        placeholder="e.g. 1234 5678 9012"
        placeholderTextColor={colors.faint}
        keyboardType="number-pad"
        style={styles.input}
      />

      <PrimaryButton
        label={linkedBank ? 'Update linked account' : 'Link account'}
        onPress={() => {
          if (!canLink || !bankId) return;
          const digits = account.replace(/\D/g, '');
          onLink({ bankId, last4: digits.slice(-4) });
        }}
        style={{ marginTop: spacing.lg, opacity: canLink ? 1 : 0.4 }}
      />
      <Text style={styles.activeHint}>
        Prototype only — no real bank connection is made. In production this would use an FPX / DuitNow
        auto-debit consent.
      </Text>
    </ScrollView>
  );
}

// ── 10. Retirement calculator ────────────────────────────

export function CalculatorScreen({ onBack }: { onBack: () => void }) {
  const [age, setAge] = useState('25');
  const [retireAge, setRetireAge] = useState('60');
  const [monthly, setMonthly] = useState('100');
  const [returnPct, setReturnPct] = useState('5');

  const a = parseInt(age, 10) || 0;
  const r = parseInt(retireAge, 10) || 0;
  const m = parseFloat(monthly) || 0;
  const annual = parseFloat(returnPct) || 0;

  const months = Math.max(0, (r - a) * 12);
  const i = annual / 100 / 12;
  const futureValue = i > 0 ? m * ((Math.pow(1 + i, months) - 1) / i) : m * months;
  const contributed = m * months;
  const growth = futureValue - contributed;
  const fmt = (n: number) =>
    'RM' + n.toLocaleString('en-MY', { maximumFractionDigits: 0 });

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.screenTab}>
      <BackLink onPress={onBack} />
      <Text style={styles.h1}>🧮 Retirement calculator</Text>
      <Text style={styles.sub}>Small monthly amounts compound hard over a long gig career.</Text>

      <View style={styles.calcGrid}>
        <CalcField label="Your age" value={age} onChange={setAge} />
        <CalcField label="Retire at" value={retireAge} onChange={setRetireAge} />
        <CalcField label="Save RM/mo" value={monthly} onChange={setMonthly} />
        <CalcField label="Return %/yr" value={returnPct} onChange={setReturnPct} />
      </View>

      <View style={styles.calcResult}>
        <Text style={styles.calcResultLabel}>PROJECTED AT AGE {r || '—'}</Text>
        <Text style={styles.calcResultBig}>{months > 0 ? fmt(futureValue) : '—'}</Text>
        {months > 0 && (
          <Text style={styles.calcResultSub}>
            {fmt(contributed)} saved by you + {fmt(growth)} growth
          </Text>
        )}
      </View>

      <View style={styles.noteBox}>
        <Text style={styles.noteText}>
          On top of this, i-Saraan adds a 20% government match (up to RM500/yr) and PRS contributions give up
          to RM3,000/yr in tax relief. The default 5% return is roughly EPF’s historical dividend range;
          PRS growth funds may return more, with more risk.
        </Text>
      </View>

      <Text style={styles.disclaimer}>
        Illustration only — actual returns vary and are not guaranteed.
      </Text>
    </ScrollView>
  );
}

function CalcField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={styles.calcField}>
      <Text style={styles.calcFieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={(t) => onChange(t.replace(/[^\d.]/g, ''))}
        keyboardType="number-pad"
        style={styles.calcInput}
      />
    </View>
  );
}

// ── 11. Create account ───────────────────────────────────

export function CreateAccountScreen({
  onCreate,
  onBack,
}: {
  onCreate: (a: Account) => void;
  onBack: () => void;
}) {
  const [viaGoogle, setViaGoogle] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [religion, setReligion] = useState<string | null>(null);
  const [tried, setTried] = useState(false);

  const missing: string[] = [];
  if (username.trim().length < 3) missing.push('Username — at least 3 characters');
  if (!email.includes('@')) missing.push('A valid email address');
  if (!viaGoogle && password.length < 6) missing.push('Password — at least 6 characters');
  if (fullName.trim().length < 2) missing.push('Full name');
  if (phone.replace(/\D/g, '').length < 9) missing.push('Phone number — at least 9 digits');
  if (!(parseInt(age, 10) >= 16)) missing.push('Age — must be 16 or older');
  if (religion === null) missing.push('Religion — tap one of the options');
  const canCreate = missing.length === 0;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.screenTab}>
      <BackLink onPress={onBack} />
      <Text style={styles.h1}>Create your account</Text>
      <Text style={styles.sub}>So JAGA can keep your plans, goals and payments in one place.</Text>

      <Pressable
        onPress={() => {
          setViaGoogle(true);
          if (!email) setEmail('you@gmail.com');
          if (!fullName) setFullName('Google User');
          if (!username) setUsername('you');
        }}
        style={[styles.googleBtn, viaGoogle && styles.googleBtnOn]}
      >
        <Text style={styles.googleG}>G</Text>
        <Text style={styles.googleText}>{viaGoogle ? 'Google account linked ✓' : 'Continue with Google'}</Text>
      </Pressable>
      <Text style={styles.orText}>or fill in manually</Text>

      <Text style={styles.detailLabel}>ACCOUNT</Text>
      <FormField label="Username" value={username} onChange={setUsername} placeholder="e.g. abu_rider" autoComplete="username" />
      <FormField label="Email" value={email} onChange={setEmail} placeholder="you@email.com" autoComplete="email" />
      {!viaGoogle && (
        <>
          {/* The password exists for signup UX only: there is no auth backend, it is
              held in component state and never persisted (Account has no password
              field). Real authentication + eKYC are required before production. */}
          <FormField label="Password" value={password} onChange={setPassword} placeholder="min. 6 characters" secure autoComplete="new-password" />
          <Text style={styles.passwordNote}>Prototype — no real login yet. Your password is not stored.</Text>
        </>
      )}

      <Text style={styles.detailLabel}>PERSONAL DETAILS</Text>
      <FormField label="Full name (as per MyKad)" value={fullName} onChange={setFullName} placeholder="Your legal name" autoComplete="name" />
      <FormField label="Phone number" value={phone} onChange={(t) => setPhone(t.replace(/[^\d+\s-]/g, ''))} placeholder="+60 12-345 6789" autoComplete="tel" />
      <FormField label="Age" value={age} onChange={(t) => setAge(t.replace(/\D/g, ''))} placeholder="e.g. 27" autoComplete="off" />

      <Text style={styles.detailLabel}>RELIGION</Text>
      <Text style={styles.faithAsk}>
        We ask this with respect — it lets JAGA show Shariah-compliant products where your faith requires
        them.
      </Text>
      <View style={styles.chipWrap}>
        {religions.map((r) => (
          <Pressable key={r} onPress={() => setReligion(r)} style={[styles.chip, religion === r && styles.chipOn]}>
            <Text style={[styles.chipText, religion === r && styles.chipTextOn]}>{r}</Text>
          </Pressable>
        ))}
      </View>

      <PrimaryButton
        label="Create account"
        onPress={() => {
          if (!canCreate || !religion) {
            setTried(true);
            return;
          }
          onCreate({ username: username.trim(), email, fullName, phone, age, religion, viaGoogle });
        }}
        style={{ marginTop: spacing.lg, opacity: canCreate ? 1 : 0.6 }}
      />
      {tried && !canCreate && (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Almost there — still needed:</Text>
          {missing.map((m) => (
            <Text key={m} style={styles.errorItem}>
              • {m}
            </Text>
          ))}
          <Text style={styles.errorHintNote}>
            If a field looks filled but is listed here, your browser may have auto-filled it — tap the
            field and type the value yourself.
          </Text>
        </View>
      )}
      <Text style={styles.activeHint}>
        Prototype only — details stay on this device. A production build would verify your MyKad and phone
        via eKYC.
      </Text>
    </ScrollView>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  secure,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  secure?: boolean;
  autoComplete?: 'username' | 'email' | 'new-password' | 'name' | 'tel' | 'off';
}) {
  return (
    <View style={{ marginBottom: spacing.sm + 4 }}>
      <Text style={styles.calcFieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.faint}
        secureTextEntry={secure}
        autoComplete={autoComplete}
        style={styles.input}
      />
    </View>
  );
}

// ── 12. Emergency fund goal ──────────────────────────────

export function EmergencyGoalScreen({
  initial,
  onSet,
  onBack,
}: {
  initial: EmergencyGoal | null;
  onSet: (g: EmergencyGoal) => void;
  onBack: () => void;
}) {
  const [burdenId, setBurdenId] = useState<string | null>(
    initial ? burdenOptions.find((b) => b.label === initial.burden)?.id ?? null : null,
  );
  const [expenses, setExpenses] = useState(initial ? String(initial.expenses) : '2000');

  const burden = burdenOptions.find((b) => b.id === burdenId) ?? null;
  const exp = parseFloat(expenses) || 0;
  const goal = burden ? burden.months * exp : 0;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.screenTab}>
      <BackLink onPress={onBack} />
      <Text style={styles.h1}>🌧️ Your emergency goal</Text>
      <Text style={styles.sub}>
        Before you start saving, let’s work out how much you should keep aside for the months work dries
        up.
      </Text>

      <Text style={styles.detailLabel}>WHO DEPENDS ON YOUR INCOME?</Text>
      {burdenOptions.map((b) => (
        <Pressable
          key={b.id}
          onPress={() => setBurdenId(b.id)}
          style={[styles.bankRow, burdenId === b.id && styles.bankRowOn]}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.bankRowName}>{b.label}</Text>
            <Text style={styles.bankHint}>
              {b.hint} → {b.months} months of expenses
            </Text>
          </View>
          <Text style={[styles.bankRadio, burdenId === b.id && { color: colors.accent }]}>
            {burdenId === b.id ? '●' : '○'}
          </Text>
        </Pressable>
      ))}

      <Text style={styles.detailLabel}>YOUR MONTHLY EXPENSES (RM)</Text>
      <TextInput
        value={expenses}
        onChangeText={(t) => setExpenses(t.replace(/[^\d.]/g, ''))}
        keyboardType="number-pad"
        placeholder="e.g. 2000"
        placeholderTextColor={colors.faint}
        style={styles.input}
      />

      <View style={styles.calcResult}>
        <Text style={styles.calcResultLabel}>YOUR SAFETY-NET GOAL</Text>
        <Text style={styles.calcResultBig}>
          {burden && exp > 0 ? 'RM' + goal.toLocaleString('en-MY', { maximumFractionDigits: 0 }) : '—'}
        </Text>
        {burden && exp > 0 && (
          <Text style={styles.calcResultSub}>
            {burden.months} months × RM{exp.toLocaleString('en-MY', { maximumFractionDigits: 0 })}
          </Text>
        )}
      </View>

      <PrimaryButton
        label="Set my goal"
        onPress={() => {
          if (!burden || exp <= 0) return;
          onSet({ burden: burden.label, months: burden.months, expenses: exp, goal });
        }}
        style={{ marginTop: spacing.lg, opacity: burden && exp > 0 ? 1 : 0.4 }}
      />
    </ScrollView>
  );
}

// ── styles ───────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  screen: {
    flexGrow: 1,
    padding: spacing.lg,
    paddingTop: spacing.xxl + spacing.sm,
    backgroundColor: colors.bg,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  screenTab: {
    flexGrow: 1,
    padding: spacing.lg,
    paddingTop: spacing.xl + spacing.sm,
    backgroundColor: colors.bg,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },

  // intro
  introCenter: {
    flex: 1,
    justifyContent: 'center',
  },
  introLogo: {
    width: 96,
    height: 96,
    marginBottom: spacing.sm,
    marginLeft: -8,
  },
  wordmark: {
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: 4,
    color: colors.ink,
  },
  tagline: {
    fontSize: 17,
    color: colors.muted,
    marginTop: spacing.sm,
  },
  introPoints: {
    marginTop: spacing.xl,
    gap: spacing.lg,
  },
  introPoint: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  introEmoji: {
    fontSize: 24,
    marginTop: 2,
  },
  introPointTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.ink,
  },
  introPointBody: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 2,
    lineHeight: 20,
  },
  introStat: {
    marginTop: spacing.xl,
    fontSize: 14,
    color: colors.faint,
    lineHeight: 21,
  },
  introFootnote: {
    textAlign: 'center',
    color: colors.faint,
    fontSize: 12,
    marginTop: spacing.md,
  },

  // shared
  h1: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.ink,
    marginTop: spacing.sm,
  },
  sub: {
    fontSize: 15,
    color: colors.muted,
    marginTop: spacing.xs,
    lineHeight: 21,
  },
  chev: {
    fontSize: 22,
    color: colors.faint,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.faint,
    marginTop: spacing.xl,
    lineHeight: 17,
    textAlign: 'center',
  },
  groupLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: colors.muted,
    marginBottom: spacing.sm,
  },

  // occupation
  occRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    borderRadius: radius.sm,
  },
  occEmoji: {
    fontSize: 26,
  },
  occLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.ink,
  },
  occHint: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 1,
  },

  // dashboard
  dashHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  dashLogo: {
    width: 40,
    height: 40,
  },
  dashBrand: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
    color: colors.ink,
  },
  dashGreeting: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 1,
  },
  changeLink: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  logoutLink: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.deep,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#C7B299',
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.onDeep,
    marginTop: spacing.xs,
  },
  summaryPerMo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#C7B299',
  },
  summaryQuote: {
    fontSize: 12,
    color: '#C7B299',
    marginTop: 2,
  },
  scoreWrap: {
    alignItems: 'center',
    backgroundColor: 'rgba(253, 251, 212, 0.12)',
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
  },
  scoreNum: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.onDeep,
  },
  scoreLabel: {
    fontSize: 10,
    color: '#C7B299',
    marginTop: 1,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 36,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.ink,
    marginTop: spacing.sm,
  },
  emptyBody: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  emptyButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    alignSelf: 'stretch',
  },

  // section cards
  sectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    marginBottom: spacing.sm + 4,
  },
  sectionEmoji: {
    fontSize: 26,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.ink,
  },
  sectionSub: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 2,
    lineHeight: 18,
  },
  sectionCount: {
    fontSize: 12,
    color: colors.faint,
    marginTop: spacing.xs,
  },

  // product detail
  detailHeader: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  detailName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.ink,
  },
  detailProvider: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 2,
  },
  priceBox: {
    backgroundColor: colors.accentSoft,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  priceBig: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.accent,
  },
  priceNote: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 2,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: colors.muted,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  coverageRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  coverageTick: {
    color: colors.accent,
    fontWeight: '700',
    fontSize: 15,
  },
  coverageText: {
    flex: 1,
    fontSize: 15,
    color: colors.ink,
    lineHeight: 21,
  },
  noteBox: {
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  noteText: {
    fontSize: 13,
    color: colors.muted,
    lineHeight: 19,
  },
  activeHint: {
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },

  // aimed-for text
  aimedText: {
    fontSize: 14,
    color: colors.ink,
    lineHeight: 20,
  },

  // PRS returns
  segmentRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: 3,
    marginBottom: spacing.sm,
  },
  segment: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.sm - 3,
  },
  segmentOn: {
    backgroundColor: colors.accent,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
  },
  segmentTextOn: {
    color: '#FFFFFF',
  },
  fundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  fundName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.ink,
  },
  fundProvider: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 1,
  },
  fundReturn: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.accent,
  },
  fundDisclaimer: {
    fontSize: 11,
    color: colors.faint,
    marginTop: spacing.sm,
    lineHeight: 15,
  },

  // reference-only products
  refOnlyBox: {
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  refOnlyText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.ink,
    textAlign: 'center',
  },
  refOnlySub: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
    textAlign: 'center',
  },

  // bank linking
  bankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  bankLinkPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
    borderWidth: 1,
    borderColor: colors.accent,
    borderStyle: 'dashed',
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  bankLinkIcon: {
    fontSize: 22,
  },
  bankName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.ink,
  },
  bankHint: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 1,
    lineHeight: 16,
  },
  bankDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.border,
    padding: 3,
    justifyContent: 'center',
  },
  toggleOn: {
    backgroundColor: colors.accent,
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  toggleKnobOn: {
    alignSelf: 'flex-end',
  },
  linkedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.accentSoft,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  linkedText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.ink,
  },
  unlinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.accent,
  },
  bankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    marginBottom: spacing.sm,
  },
  bankRowOn: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  bankRowName: {
    flex: 1,
    fontSize: 15,
    color: colors.ink,
    fontWeight: '500',
  },
  bankRadio: {
    fontSize: 16,
    color: colors.faint,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    padding: spacing.md,
    fontSize: 16,
    color: colors.ink,
  },

  // calculator
  calcEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.deep,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  calcEntryEmoji: {
    fontSize: 24,
  },
  calcEntryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.onDeep,
  },
  calcEntrySub: {
    fontSize: 12,
    color: '#C7B299',
    marginTop: 1,
  },
  calcGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  calcField: {
    flexBasis: '47%',
    flexGrow: 1,
  },
  calcFieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.muted,
    marginBottom: spacing.xs,
  },
  calcInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    padding: spacing.md,
    fontSize: 18,
    fontWeight: '700',
    color: colors.ink,
  },
  calcResult: {
    backgroundColor: colors.deep,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  calcResultLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#C7B299',
  },
  calcResultBig: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.onDeep,
    marginTop: spacing.xs,
  },
  calcResultSub: {
    fontSize: 13,
    color: '#C7B299',
    marginTop: spacing.xs,
  },

  // fund returns (single product)
  riskText: {
    fontSize: 13,
    color: colors.muted,
    marginTop: spacing.xs,
  },
  fundReturnBox: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  fundReturnBig: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.accent,
  },
  fundReturnLabel: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },

  // faith filtering
  faithNote: {
    fontSize: 13,
    color: colors.accent,
    marginTop: spacing.sm,
    fontWeight: '600',
  },
  faithAsk: {
    fontSize: 13,
    color: colors.muted,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },

  // emergency goal
  goalCard: {
    backgroundColor: colors.deep,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  goalLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#C7B299',
  },
  goalBig: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.onDeep,
    marginTop: 2,
  },
  goalSub: {
    fontSize: 12,
    color: '#C7B299',
    marginTop: 2,
    textAlign: 'center',
  },
  goalAdjust: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.onDeep,
    textDecorationLine: 'underline',
    marginTop: spacing.sm,
  },

  // account creation
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
  },
  googleBtnOn: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  googleG: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4285F4',
  },
  googleText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.ink,
  },
  orText: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.faint,
    marginTop: spacing.sm,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipOn: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
  },
  chipTextOn: {
    color: '#FFFFFF',
  },
  errorBox: {
    backgroundColor: '#FDF0EC',
    borderWidth: 1,
    borderColor: '#E8B4A0',
    borderRadius: radius.sm,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9A3412',
  },
  errorItem: {
    fontSize: 13,
    color: '#9A3412',
    marginTop: spacing.xs,
    lineHeight: 18,
  },
  errorHintNote: {
    fontSize: 12,
    color: colors.muted,
    marginTop: spacing.sm,
    lineHeight: 16,
  },
  applyBox: {
    backgroundColor: colors.accentSoft,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  applyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
    textAlign: 'center',
  },
  applySub: {
    fontSize: 13,
    color: colors.muted,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  passwordNote: {
    fontSize: 12,
    color: colors.muted,
    marginTop: -spacing.xs,
    marginBottom: spacing.sm,
  },
});
