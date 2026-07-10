import React, { useRef, useState } from 'react';
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { BackLink, Badge, LoanCard, LogoMark, PrimaryButton, ProductCard, ProgressBar } from './components';
import {
  Account,
  appLogo,
  banks,
  burdenOptions,
  DATA_AS_OF,
  disclaimer,
  EmergencyGoal,
  Loan,
  akpkNote,
  loans,
  loansDisclaimer,
  Occupation,
  occupations,
  Product,
  products,
  PROGRESS_TRACKED_IDS,
  PrsPeriod,
  RetirementGoal,
  returnsDisclaimer,
  RiskCategory,
  riskCategoryInfo,
  riskMatches,
  riskQuestions,
  scoreRisk,
  Section,
  sections,
} from './data';
import { colors, radius, spacing } from './theme';

export type LinkedPaymentMethod =
  | { type: 'bank'; bankId: string; ref: string }
  | { type: 'card'; last4: string; holder: string; ref: string };

function isRelevant(product: Product, occupationId: string) {
  return product.relevantTo === 'all' || product.relevantTo.includes(occupationId);
}

function isForYou(product: Product, occupationId: string) {
  return product.relevantTo !== 'all' && product.relevantTo.includes(occupationId);
}

// ── 1. Intro ─────────────────────────────────────────────

const introSlideCount = 6;

export function IntroScreen({ onStart }: { onStart: () => void }) {
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const goTo = (i: number) => {
    const clamped = Math.max(0, Math.min(introSlideCount - 1, i));
    scrollRef.current?.scrollTo({ x: clamped * width, animated: true });
    setIndex(clamped);
  };

  return (
    <View style={styles.screen}>
      <View style={{ flex: 1 }} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
        {width > 0 && (
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={(e) => {
              const i = Math.round(e.nativeEvent.contentOffset.x / width);
              if (i !== index) setIndex(i);
            }}
            style={{ flex: 1 }}
          >
            {/* Slide 1 — the hook: sourced coverage stat.
                ⚠️ VERIFY BEFORE SHIPPING: figure from ISEAS Perspective 2026/48
                (Lee Hwok Aun) — SESSS participation among gig workers ~26% as of
                May 2025. Re-confirm against the published paper before launch. */}
            <Pressable style={[styles.introSlide, styles.introSlideCentered, { width }]} onPress={() => goTo(index + 1)}>
              <Text style={styles.introStatBig}>
                Only about 1 in 4 gig workers in Malaysia are covered by SOCSO’s self-employed injury
                scheme.
              </Text>
              <Text style={styles.introSource}>Source: ISEAS Perspective 2026/48</Text>
            </Pressable>

            {/* Slide 2 — brand intro */}
            <Pressable style={[styles.introSlide, { width }]} onPress={() => goTo(index + 1)}>
              <Image source={appLogo} style={styles.introLogo} resizeMode="contain" />
              <Text style={styles.wordmark}>JAGA</Text>
              <Text style={styles.tagline}>Protection for Malaysia’s gig workers</Text>
              <Text style={styles.introBrandLine}>
                Insurance, retirement savings, an emergency fund and fair micro-loans — one app built
                around gig income.
              </Text>
              <Text style={[styles.introFootnote, { textAlign: 'left', marginTop: spacing.lg }]}>
                jaga (Malay) — to guard, to protect
              </Text>
            </Pressable>

            {/* Slide 3 — insurance */}
            <Pressable style={[styles.introSlide, styles.introSlideCentered, { width }]} onPress={() => goTo(index + 1)}>
              <Text style={styles.introSlideEmoji}>🛡️</Text>
              <IntroPoint emoji="" title="Insurance made simple" body="Accident, health and SOCSO cover — matched to the work you actually do." />
            </Pressable>

            {/* Slide 4 — retirement */}
            <Pressable style={[styles.introSlide, styles.introSlideCentered, { width }]} onPress={() => goTo(index + 1)}>
              <Text style={styles.introSlideEmoji}>🌱</Text>
              <IntroPoint emoji="" title="Retirement that fits gig income" body="Save small amounts monthly and collect free government top-ups." />
            </Pressable>

            {/* Slide 5 — emergency fund / MMF */}
            <Pressable style={[styles.introSlide, styles.introSlideCentered, { width }]} onPress={() => goTo(index + 1)}>
              <Text style={styles.introSlideEmoji}>🌧️</Text>
              <IntroPoint emoji="" title="An emergency fund for slow months" body="Parked in a Shariah-compliant money market fund — withdraw anytime, no lock-in." />
            </Pressable>

            {/* Slide 6 — micro-loans */}
            <Pressable style={[styles.introSlide, styles.introSlideCentered, { width }]} onPress={onStart}>
              <Text style={styles.introSlideEmoji}>💸</Text>
              <IntroPoint emoji="" title="Small loans when you need them" body="From TEKUN and licensed fintech lenders built for gig income, not bank statements." />
            </Pressable>
          </ScrollView>
        )}
      </View>

      <View style={styles.introDots}>
        {Array.from({ length: introSlideCount }).map((_, i) => (
          <Pressable key={i} onPress={() => goTo(i)} hitSlop={8} accessibilityRole="button" accessibilityLabel={`Slide ${i + 1}`}>
            <View style={[styles.introDot, i === index && styles.introDotOn]} />
          </Pressable>
        ))}
      </View>

      <PrimaryButton label="Get started" onPress={onStart} />
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

// ── 1b. Login (prototype — see password note in CreateAccountScreen) ──

export function LoginScreen({ onLogin, onNewUser }: { onLogin: () => void; onNewUser: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tried, setTried] = useState(false);
  const canLogin = email.trim().length > 0 && password.length > 0;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.screen}>
      <View style={styles.introCenter}>
        <Image source={appLogo} style={styles.introLogo} resizeMode="contain" />
        <Text style={styles.wordmark}>JAGA</Text>
        <Text style={styles.tagline}>Welcome back</Text>

        <View style={{ marginTop: spacing.xl }}>
          <FormField label="Email" value={email} onChange={setEmail} placeholder="you@email.com" autoComplete="email" />
          <FormField label="Password" value={password} onChange={setPassword} placeholder="Your password" secure />
          <Text style={styles.passwordNote}>Prototype — no real login yet. Your password is not stored.</Text>
          {tried && !canLogin && (
            <Text style={styles.loginError}>Enter your email and password to continue.</Text>
          )}
        </View>
      </View>

      <PrimaryButton label="Log in" onPress={() => (canLogin ? onLogin() : setTried(true))} />
      <Pressable onPress={onNewUser} hitSlop={8} accessibilityRole="button" accessibilityLabel="Create a new account">
        <Text style={styles.loginNewUser}>New to JAGA? Create an account</Text>
      </Pressable>
    </ScrollView>
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
  linkedMethod,
  autoDebit,
  onToggleAutoDebit,
  onOpenBankLink,
  onOpenProduct,
  onBrowse,
  onChangeOccupation,
  onOpenComplaints,
  onLogout,
}: {
  account: Account;
  occupation: Occupation;
  activePlanIds: string[];
  linkedMethod: LinkedPaymentMethod | null;
  autoDebit: boolean;
  onToggleAutoDebit: () => void;
  onOpenBankLink: () => void;
  onOpenProduct: (p: Product) => void;
  onBrowse: (tab: 'insurance' | 'retirement') => void;
  onChangeOccupation: () => void;
  onOpenComplaints: () => void;
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
        (!account.isMuslim || p.shariah !== false),
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
          <Pressable onPress={onOpenComplaints} hitSlop={8} accessibilityRole="button" accessibilityLabel="Complaints and help">
            <Text style={styles.logoutLink}>Help</Text>
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
      {linkedMethod ? (
        <Pressable onPress={onOpenBankLink} style={styles.bankCard}>
          <View
            style={[
              styles.bankDot,
              {
                backgroundColor:
                  linkedMethod.type === 'bank'
                    ? banks.find((b) => b.id === linkedMethod.bankId)?.color ?? colors.accent
                    : colors.deep,
              },
            ]}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.bankName}>
              {linkedMethod.type === 'bank'
                ? `DuitNow AutoDebit · ${banks.find((b) => b.id === linkedMethod.bankId)?.name ?? 'Bank'}`
                : `Card ••${linkedMethod.last4}`}{' '}
              · ref ••{linkedMethod.ref}
            </Text>
            <Text style={styles.bankHint}>
              {autoDebit ? 'Auto-debit on — plans charged monthly' : 'Auto-debit off — pay manually anytime'}
            </Text>
          </View>
          <Pressable
            onPress={onToggleAutoDebit}
            hitSlop={8}
            style={[styles.toggle, autoDebit && styles.toggleOn]}
            accessibilityRole="switch"
            accessibilityLabel="Auto-debit monthly payments"
            accessibilityState={{ checked: autoDebit }}
          >
            <View style={[styles.toggleKnob, autoDebit && styles.toggleKnobOn]} />
          </Pressable>
        </Pressable>
      ) : (
        <Pressable onPress={onOpenBankLink} style={styles.bankLinkPrompt}>
          <Text style={styles.bankLinkIcon}>🏦</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.bankName}>Set up payment · DuitNow AutoDebit</Text>
            <Text style={styles.bankHint}>
              Required before insurance plans can activate. Optional for retirement — you can always bank
              in manually instead.
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
  // Hide sections with nothing relevant to this occupation — but never hide a
  // section the user is already paying into (occupation is editable later).
  const insurance = sections.filter(
    (s) =>
      s.group === 'insurance' &&
      (products.some((p) => p.sectionId === s.id && isRelevant(p, occupation.id)) ||
        products.some((p) => p.sectionId === s.id && activePlanIds.includes(p.id))),
  );
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.screenTab}>
      <Text style={styles.h1}>Insurance</Text>
      <Text style={styles.sub}>Cover for accidents, health and your work.</Text>
      <Text style={styles.asOf}>Pricing as of {DATA_AS_OF} — indicative</Text>
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
  isMuslim,
  riskProfile,
  activePlanIds,
  savedAmounts,
  retirementGoal,
  emergencyGoal,
  onOpenProduct,
  onOpenCalculator,
  onRetakeQuiz,
}: {
  occupation: Occupation;
  isMuslim: boolean;
  riskProfile: RiskCategory;
  activePlanIds: string[];
  savedAmounts: Record<string, number>;
  retirementGoal: RetirementGoal | null;
  emergencyGoal: EmergencyGoal | null;
  onOpenProduct: (p: Product) => void;
  onOpenCalculator: () => void;
  onRetakeQuiz: () => void;
}) {
  // Faith and risk filtering are orthogonal: faith removes conventional funds
  // for Muslim users, risk only splits what remains into matched vs other.
  const allowedByFaith = (p: Product) => !isMuslim || p.shariah !== false;
  const info = riskCategoryInfo[riskProfile];

  const items = products
    .filter((p) => p.sectionId === 'retirement' && isRelevant(p, occupation.id) && allowedByFaith(p))
    .sort((a, b) => Number(isForYou(b, occupation.id)) - Number(isForYou(a, occupation.id)));
  const suggested = items.filter((p) => riskMatches(p, riskProfile));
  const remaining = items.filter((p) => !riskMatches(p, riskProfile));
  const emergencyItems = products.filter((p) => p.sectionId === 'emergency' && allowedByFaith(p));

  // self-reported totals (see PROGRESS_TRACKED_IDS — EPF schemes excluded)
  const prsSaved = PROGRESS_TRACKED_IDS.filter((id) => id !== 'aham-mmf').reduce(
    (sum, id) => sum + (savedAmounts[id] ?? 0),
    0,
  );
  const mmfSaved = savedAmounts['aham-mmf'] ?? 0;

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.screenTab}>
      <Text style={styles.h1}>Retirement</Text>
      <Text style={styles.sub}>Small monthly amounts + free government top-ups.</Text>
      <Text style={styles.asOf}>Pricing & returns as of {DATA_AS_OF} — indicative</Text>
      {isMuslim && (
        <Text style={styles.faithNote}>
          Showing Shariah-compliant options only, based on your profile.
        </Text>
      )}

      <View style={styles.riskChipRow}>
        <Text style={styles.riskChipText}>
          {info.emoji} {info.label} investor
        </Text>
        <Pressable onPress={onRetakeQuiz} hitSlop={8} accessibilityRole="button" accessibilityLabel="Retake risk quiz">
          <Text style={styles.riskRetake}>Retake quiz</Text>
        </Pressable>
      </View>

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

      {retirementGoal ? (
        <View style={styles.goalSummary}>
          <Text style={styles.goalSummaryLabel}>
            RETIREMENT GOAL — RM{retirementGoal.targetAmount.toLocaleString('en-MY')} BY AGE {retirementGoal.targetAge}
          </Text>
          <ProgressBar saved={prsSaved} goal={retirementGoal.targetAmount} />
        </View>
      ) : (
        <Pressable onPress={onOpenCalculator} accessibilityRole="button" accessibilityLabel="Set a retirement goal">
          <Text style={styles.setGoalPrompt}>Set a retirement goal in the calculator to track progress</Text>
        </Pressable>
      )}

      <View style={{ marginTop: spacing.md }}>
        <Text style={styles.groupLabel}>EMERGENCY FUND — START HERE</Text>
        {emergencyItems.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            active={activePlanIds.includes(p.id)}
            onPress={() => onOpenProduct(p)}
          />
        ))}
        {emergencyGoal && (
          <View style={styles.goalSummary}>
            <ProgressBar saved={mmfSaved} goal={emergencyGoal.goal} />
          </View>
        )}

        {suggested.length > 0 && (
          <>
            <Text style={[styles.groupLabel, { marginTop: spacing.lg }]}>
              MATCHED TO YOUR {info.label.toUpperCase()} PROFILE
            </Text>
            {suggested.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                forYou={isForYou(p, occupation.id)}
                active={activePlanIds.includes(p.id)}
                onPress={() => onOpenProduct(p)}
              />
            ))}
          </>
        )}

        <Text style={[styles.groupLabel, { marginTop: spacing.lg }]}>
          OTHER RETIREMENT PLANS · {remaining.length} OPTIONS
        </Text>
        {remaining.map((p) => (
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





// ── 11e. App lock (PIN) ──────────────────────────────────
// NOTE: a production build should keep this secret in the device
// keychain/secure enclave and offer biometrics (expo-local-authentication),
// not a plain PIN in AsyncStorage.

function PinPad({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <TextInput
      value={value}
      onChangeText={(t) => onChange(t.replace(/\D/g, '').slice(0, 6))}
      keyboardType="number-pad"
      secureTextEntry
      autoFocus
      placeholder="••••"
      placeholderTextColor={colors.faint}
      style={[styles.input, styles.pinInput]}
      accessibilityLabel="PIN"
    />
  );
}

export function SetPinScreen({ onSet }: { onSet: (pin: string) => void }) {
  const [pin, setPin] = useState('');
  const [confirm, setConfirm] = useState('');
  const [stage, setStage] = useState<'enter' | 'confirm'>('enter');
  const [error, setError] = useState<string | null>(null);

  return (
    <View style={[styles.screen, { justifyContent: 'center' }]}>
      <Text style={styles.h1}>🔒 Set an app PIN</Text>
      <Text style={styles.sub}>
        {stage === 'enter'
          ? 'Choose a 4–6 digit PIN. JAGA will ask for it when you open the app or return after a break.'
          : 'Enter the same PIN again to confirm.'}
      </Text>
      <View style={{ marginTop: spacing.lg }}>
        {stage === 'enter' ? <PinPad value={pin} onChange={setPin} /> : <PinPad value={confirm} onChange={setConfirm} />}
      </View>
      {error && <Text style={styles.loginError}>{error}</Text>}
      <PrimaryButton
        label={stage === 'enter' ? 'Continue' : 'Confirm PIN'}
        onPress={() => {
          if (stage === 'enter') {
            if (pin.length < 4) {
              setError('PIN must be at least 4 digits.');
              return;
            }
            setError(null);
            setStage('confirm');
          } else {
            if (confirm !== pin) {
              setError('PINs don’t match — try again.');
              setConfirm('');
              return;
            }
            onSet(pin);
          }
        }}
        style={{ marginTop: spacing.lg }}
      />
    </View>
  );
}

export function PinLockScreen({ pin, onUnlock }: { pin: string; onUnlock: () => void }) {
  const [entry, setEntry] = useState('');
  const [error, setError] = useState(false);

  return (
    <View style={[styles.screen, { justifyContent: 'center' }]}>
      <Image source={appLogo} style={[styles.introLogo, { alignSelf: 'center', marginLeft: 0 }]} resizeMode="contain" />
      <Text style={[styles.h1, { textAlign: 'center' }]}>Enter your PIN</Text>
      <View style={{ marginTop: spacing.lg }}>
        <PinPad
          value={entry}
          onChange={(v) => {
            setEntry(v);
            setError(false);
          }}
        />
      </View>
      {error && <Text style={[styles.loginError, { textAlign: 'center' }]}>Wrong PIN — try again.</Text>}
      <PrimaryButton
        label="Unlock"
        onPress={() => {
          if (entry === pin) onUnlock();
          else {
            setError(true);
            setEntry('');
          }
        }}
        style={{ marginTop: spacing.lg }}
      />
    </View>
  );
}

// ── 11d. Complaints & redress ────────────────────────────
// TODO: confirm exact redress body per product category before production
// (e.g. OFS for insurance disputes, SC complaints channel for PRS).

export function ComplaintsScreen({ onBack }: { onBack: () => void }) {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.screenTab}>
      <BackLink onPress={onBack} />
      <Text style={styles.h1}>🗣️ Complaints & help</Text>
      <Text style={styles.sub}>Something wrong with a plan, a payment or this app? Start here.</Text>

      <Text style={styles.detailLabel}>CONTACT JAGA</Text>
      <View style={styles.consentCard}>
        <ConsentRow label="Email" value="support@jaga.example (prototype contact)" />
        <ConsentRow label="Phone" value="+60 3-0000 0000 (prototype contact)" />
        <ConsentRow label="Hours" value="Mon–Fri, 9am–6pm MYT" />
      </View>

      <Text style={styles.detailLabel}>IF WE CAN’T RESOLVE IT</Text>
      <View style={styles.disclosureBox}>
        <Text style={styles.disclosureText}>
          You can escalate financial disputes to the independent redress body for that product type — for
          example the Ombudsman for Financial Services (OFS) for insurance/takaful disputes, or the
          Securities Commission Malaysia’s complaints channel for PRS. A production version of JAGA must
          name the confirmed body, eligibility limits and time bars for each product category here.
        </Text>
      </View>

      <Text style={styles.activeHint}>
        Prototype contact details — replace with a staffed channel before launch.
      </Text>
    </ScrollView>
  );
}

// ── 11c. Privacy Policy & Terms (prototype content) ──────

function PolicyParagraph({ heading, body }: { heading: string; body: string }) {
  return (
    <View style={{ marginTop: spacing.md }}>
      <Text style={styles.policyHeading}>{heading}</Text>
      <Text style={styles.policyBody}>{body}</Text>
    </View>
  );
}

export function PrivacyPolicyScreen({ onBack }: { onBack: () => void }) {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.screenTab}>
      <BackLink onPress={onBack} />
      <Text style={styles.h1}>Privacy Policy</Text>
      <Text style={styles.sub}>JAGA prototype · last updated 10 July 2026</Text>
      <PolicyParagraph
        heading="What we collect"
        body="Your name, username, email, phone number, age, whether you are Muslim, photos you provide for identity verification (MyKad and selfie), your occupation, risk-quiz answers, savings goals and amounts you report, and the financial products you select in the app."
      />
      <PolicyParagraph
        heading="Why we collect it"
        body="Identity details support know-your-customer (KYC) requirements for regulated insurance and PRS products. The Muslim yes/no answer is used only to show Shariah-compliant products where relevant. Occupation and risk answers are used to match and rank products for you."
      />
      <PolicyParagraph
        heading="Where your data lives"
        body="This is a prototype: everything is stored locally on this device only (AsyncStorage). Nothing is sent to a server, and JAGA has no backend. Deleting the app or using Log out → new account removes the data. eKYC photos are not uploaded, inspected or retained beyond the verification screen."
      />
      <PolicyParagraph
        heading="Production notice"
        body="A production version of JAGA would need a registered PDPA (Personal Data Protection Act 2010) data protection policy, a named data protection officer with a working contact, defined retention periods, and disclosure of every third party (insurers, fund managers, eKYC vendor, payment networks) that receives your data."
      />
    </ScrollView>
  );
}

export function TermsOfServiceScreen({ onBack }: { onBack: () => void }) {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.screenTab}>
      <BackLink onPress={onBack} />
      <Text style={styles.h1}>Terms of Service</Text>
      <Text style={styles.sub}>JAGA prototype · last updated 10 July 2026</Text>
      <PolicyParagraph
        heading="What JAGA is"
        body="JAGA is a student prototype that helps Malaysian gig workers discover insurance, retirement, emergency-savings and micro-loan products. It does not sell, broker or hold any financial product, and nothing in the app is financial advice."
      />
      <PolicyParagraph
        heading="No real transactions"
        body="Activating a plan, approving a payment consent, verifying identity and reporting saved amounts are demonstrations only. No money moves, no policy is issued, no account is opened, and no eKYC check is really performed."
      />
      <PolicyParagraph
        heading="Data accuracy"
        body="Prices, returns and product terms are a research snapshot with a stated as-of date and may be outdated or estimated. Always confirm directly with the provider before making a financial decision."
      />
      <PolicyParagraph
        heading="Production notice"
        body="Operating JAGA as a real service would require the relevant licences and registrations (e.g. financial adviser or insurance/takaful intermediary approval, Securities Commission requirements for PRS distribution) and regulator-reviewed terms. These terms are placeholders for that work."
      />
    </ScrollView>
  );
}

// ── 11b. Mock eKYC ───────────────────────────────────────
// Real eKYC requires a licensed identity-verification vendor (document OCR +
// facial liveness matched against NRIC/MyKad data) and a backend to hold the
// result securely. This screen demonstrates the UX only — it never inspects
// the images and always resolves to "verified".

export function EkycScreen({ onVerified }: { onVerified: () => void }) {
  const [mykadPicked, setMykadPicked] = useState(false);
  const [selfiePicked, setSelfiePicked] = useState(false);
  const [phase, setPhase] = useState<'capture' | 'verifying' | 'done'>('capture');

  const pick = async (which: 'mykad' | 'selfie') => {
    try {
      const ImagePicker = await import('expo-image-picker');
      const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.5 });
      if (!res.canceled) (which === 'mykad' ? setMykadPicked : setSelfiePicked)(true);
    } catch {
      // picker unavailable (e.g. permissions) — let the user proceed anyway in the prototype
      (which === 'mykad' ? setMykadPicked : setSelfiePicked)(true);
    }
  };

  const startVerify = () => {
    setPhase('verifying');
    // not a real check — fixed delay, always succeeds (prototype)
    setTimeout(() => setPhase('done'), 2500);
  };

  if (phase === 'verifying') {
    return (
      <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.introSlideEmoji}>🪪</Text>
        <Text style={styles.h1}>Verifying…</Text>
        <Text style={[styles.sub, { textAlign: 'center' }]}>
          Checking your MyKad photo and selfie. This usually takes a few seconds.
        </Text>
      </View>
    );
  }

  if (phase === 'done') {
    return (
      <View style={[styles.screen, { justifyContent: 'center' }]}>
        <View style={styles.riskResultCard}>
          <Text style={styles.riskResultEmoji}>✅</Text>
          <Text style={styles.riskResultLabel}>Identity verified</Text>
          <Text style={styles.riskResultBlurb}>
            Verified (prototype — no real check performed). A production build would verify your MyKad
            and selfie with a licensed eKYC vendor.
          </Text>
        </View>
        <PrimaryButton label="Continue" onPress={onVerified} style={{ marginTop: spacing.lg }} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.screenTab}>
      <Text style={styles.h1}>🪪 Verify your identity</Text>
      <Text style={styles.sub}>
        Insurance and PRS products are regulated — providers must verify who you are before a plan can
        activate.
      </Text>

      <Text style={styles.detailLabel}>TWO QUICK CAPTURES</Text>
      <Pressable
        onPress={() => pick('mykad')}
        style={[styles.bankRow, mykadPicked && styles.bankRowOn]}
        accessibilityRole="button"
        accessibilityLabel="Scan MyKad front"
      >
        <Text style={styles.occEmoji}>🪪</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.bankRowName}>Scan MyKad (front)</Text>
          <Text style={styles.bankHint}>Clear photo, all four corners visible</Text>
        </View>
        <Text style={[styles.bankRadio, mykadPicked && { color: colors.accent }]}>{mykadPicked ? '✓' : '○'}</Text>
      </Pressable>
      <Pressable
        onPress={() => pick('selfie')}
        style={[styles.bankRow, selfiePicked && styles.bankRowOn]}
        accessibilityRole="button"
        accessibilityLabel="Take a selfie"
      >
        <Text style={styles.occEmoji}>🤳</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.bankRowName}>Take a selfie</Text>
          <Text style={styles.bankHint}>Good light, no cap or sunglasses</Text>
        </View>
        <Text style={[styles.bankRadio, selfiePicked && { color: colors.accent }]}>{selfiePicked ? '✓' : '○'}</Text>
      </Pressable>

      <PrimaryButton
        label="Verify identity"
        onPress={() => {
          if (mykadPicked && selfiePicked) startVerify();
        }}
        style={{ marginTop: spacing.lg, opacity: mykadPicked && selfiePicked ? 1 : 0.4 }}
      />
      <Text style={styles.activeHint}>
        Prototype only — images are not uploaded, inspected or stored beyond this screen.
      </Text>
    </ScrollView>
  );
}

// ── 5b. Risk profiling quiz (gates the retirement tab) ───

export function RiskQuizScreen({
  onDone,
  onBack,
}: {
  onDone: (c: RiskCategory) => void;
  onBack: () => void;
}) {
  const [step, setStep] = useState(0);
  const [points, setPoints] = useState<number[]>([]);
  const [result, setResult] = useState<RiskCategory | null>(null);

  if (result) {
    const info = riskCategoryInfo[result];
    return (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.screenTab}>
        <Text style={styles.h1}>Your investor profile</Text>
        <View style={styles.riskResultCard}>
          <Text style={styles.riskResultEmoji}>{info.emoji}</Text>
          <Text style={styles.riskResultLabel}>{info.label}</Text>
          <Text style={styles.riskResultBlurb}>{info.blurb}</Text>
        </View>
        <PrimaryButton label="Show my matches" onPress={() => onDone(result)} style={{ marginTop: spacing.lg }} />
        <Text style={styles.activeHint}>You can retake this quiz anytime from the Retirement tab.</Text>
      </ScrollView>
    );
  }

  const q = riskQuestions[step];
  const answer = (pts: number) => {
    const next = [...points, pts];
    if (step + 1 < riskQuestions.length) {
      setPoints(next);
      setStep(step + 1);
    } else {
      setResult(scoreRisk(next.reduce((a, b) => a + b, 0)));
    }
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.screenTab}>
      <BackLink
        onPress={() => {
          if (step > 0) {
            setStep(step - 1);
            setPoints(points.slice(0, -1));
          } else {
            onBack();
          }
        }}
      />
      <Text style={styles.h1}>Before you invest</Text>
      <Text style={styles.sub}>
        Six quick questions so JAGA can match retirement funds to how much risk actually fits your life.
      </Text>

      <Text style={[styles.detailLabel, { marginTop: spacing.lg }]}>
        QUESTION {step + 1} OF {riskQuestions.length}
      </Text>
      <Text style={styles.riskQuestion}>{q.q}</Text>
      {q.options.map((o) => (
        <Pressable
          key={o.label}
          onPress={() => answer(o.points)}
          style={({ pressed }) => [styles.bankRow, pressed && { backgroundColor: colors.accentSoft }]}
          accessibilityRole="button"
          accessibilityLabel={o.label}
        >
          <Text style={styles.bankRowName}>{o.label}</Text>
          <Text style={styles.chev}>›</Text>
        </Pressable>
      ))}
      <View style={styles.quizDots}>
        {riskQuestions.map((_, i) => (
          <View key={i} style={[styles.quizDot, i === step && styles.quizDotOn]} />
        ))}
      </View>
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
  paymentRequired,
  emergencyGoal,
  savedAmount = 0,
  retirementGoal = null,
  onSaveAmount,
  onOpenCalculator,
  onAdjustGoal,
  onToggleActive,
  onBack,
}: {
  product: Product;
  isActive: boolean;
  paymentRequired?: boolean; // insurance products need a DuitNow AutoDebit consent first
  emergencyGoal?: EmergencyGoal | null;
  savedAmount?: number; // self-reported — this prototype has no contribution ledger
  retirementGoal?: RetirementGoal | null;
  onSaveAmount?: (n: number) => void;
  onOpenCalculator?: () => void;
  onAdjustGoal?: () => void;
  onToggleActive: () => void;
  onBack: () => void;
}) {
  const [amountDraft, setAmountDraft] = useState(String(savedAmount || ''));
  const tracked = PROGRESS_TRACKED_IDS.includes(product.id);
  const goalAmount =
    product.sectionId === 'emergency' ? emergencyGoal?.goal ?? null : retirementGoal?.targetAmount ?? null;
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

      {(product.riskDisclosure || product.freeLookPeriod) && (
        <>
          <Text style={styles.detailLabel}>
            {product.riskDisclosure ? 'RISK & COOLING-OFF' : 'YOUR CANCELLATION RIGHTS'}
          </Text>
          <View style={styles.disclosureBox}>
            <Text style={styles.disclosureText}>{product.riskDisclosure ?? product.freeLookPeriod}</Text>
          </View>
        </>
      )}

      {tracked && isActive && (
        <>
          <Text style={styles.detailLabel}>MY PROGRESS</Text>
          <Text style={styles.selfReportNote}>
            Self-reported — enter what you’ve saved so far. JAGA doesn’t hold your money in this
            prototype.
          </Text>
          <View style={styles.savedRow}>
            <TextInput
              value={amountDraft}
              onChangeText={(t) => setAmountDraft(t.replace(/[^\d.]/g, ''))}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={colors.faint}
              style={[styles.input, { flex: 1 }]}
              accessibilityLabel="Amount saved so far in ringgit"
            />
            <PrimaryButton
              label="Update"
              variant="deep"
              onPress={() => onSaveAmount?.(parseFloat(amountDraft) || 0)}
              style={{ paddingHorizontal: spacing.lg }}
            />
          </View>
          {goalAmount ? (
            <ProgressBar saved={savedAmount} goal={goalAmount} />
          ) : (
            <Pressable onPress={onOpenCalculator} accessibilityRole="button" accessibilityLabel="Set a retirement goal">
              <Text style={styles.setGoalPrompt}>
                Set a retirement goal to track progress → open the calculator
              </Text>
            </Pressable>
          )}
        </>
      )}

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
      {paymentRequired && !isActive && !product.referenceOnly && (
        <Text style={styles.activeHint}>
          Insurance payments are collected by DuitNow AutoDebit — you’ll approve a one-time consent first.
        </Text>
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

      <View style={[styles.disclosureBox, { marginTop: spacing.md }]}>
        <Text style={styles.disclosureText}>{akpkNote}</Text>
      </View>

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
  linkedMethod,
  forProductName,
  onLink,
  onUnlink,
  onBack,
}: {
  linkedMethod: LinkedPaymentMethod | null;
  forProductName?: string; // set when consent is required to activate an insurance plan
  onLink: (m: LinkedPaymentMethod) => void;
  onUnlink: () => void;
  onBack: () => void;
}) {
  const [method, setMethod] = useState<'bank' | 'card'>(linkedMethod?.type ?? 'bank');
  const [bankId, setBankId] = useState<string | null>(
    linkedMethod?.type === 'bank' ? linkedMethod.bankId : null,
  );
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const bank = banks.find((b) => b.id === bankId);
  const cardDigits = cardNumber.replace(/\D/g, '');
  const cardReady = cardDigits.length >= 15 && cardExpiry.length >= 4 && cardHolder.trim().length >= 2;
  const canApprove = method === 'bank' ? !!bankId : cardReady;
  const mockRef = () => String(Math.floor(1000 + Math.random() * 9000));

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.screenTab}>
      <BackLink onPress={onBack} />
      <Text style={styles.h1}>💳 Payment consent</Text>
      <Text style={styles.sub}>
        A one-time consent that lets JAGA collect your plan payments automatically — small amounts, right
        after you get paid. Required for insurance plans; optional for retirement, where you can always
        bank in manually.
      </Text>

      {forProductName && (
        <View style={styles.consentRequiredBox}>
          <Text style={styles.consentRequiredText}>
            Payment consent is needed before “{forProductName}” can activate.
          </Text>
        </View>
      )}

      {linkedMethod && (
        <View style={styles.linkedBox}>
          <Text style={styles.linkedText}>
            Active:{' '}
            {linkedMethod.type === 'bank'
              ? `DuitNow AutoDebit · ${banks.find((b) => b.id === linkedMethod.bankId)?.name}`
              : `Card ••${linkedMethod.last4}`}{' '}
            · ref ••{linkedMethod.ref}
          </Text>
          <Pressable onPress={onUnlink} hitSlop={8} accessibilityRole="button" accessibilityLabel="Revoke consent">
            <Text style={styles.unlinkText}>Revoke</Text>
          </Pressable>
        </View>
      )}

      <Text style={styles.detailLabel}>HOW SHOULD JAGA COLLECT PAYMENTS?</Text>
      <View style={styles.segmentRow}>
        {(
          [
            { id: 'bank', label: 'Bank · DuitNow' },
            { id: 'card', label: 'Debit/credit card' },
          ] as const
        ).map((m) => (
          <Pressable
            key={m.id}
            onPress={() => setMethod(m.id)}
            style={[styles.segment, method === m.id && styles.segmentOn]}
            accessibilityRole="button"
            accessibilityLabel={m.label}
          >
            <Text style={[styles.segmentText, method === m.id && styles.segmentTextOn]}>{m.label}</Text>
          </Pressable>
        ))}
      </View>

      {method === 'bank' ? (
        <>
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
        </>
      ) : (
        <>
          <Text style={styles.detailLabel}>CARD DETAILS</Text>
          <FormField
            label="Card number"
            value={cardNumber}
            onChange={(t) => setCardNumber(t.replace(/[^\d\s]/g, '').slice(0, 19))}
            placeholder="1234 5678 9012 3456"
          />
          <FormField
            label="Expiry (MM/YY)"
            value={cardExpiry}
            onChange={(t) => setCardExpiry(t.replace(/[^\d/]/g, '').slice(0, 5))}
            placeholder="12/28"
          />
          <FormField label="Name on card" value={cardHolder} onChange={setCardHolder} placeholder="As printed on the card" />
        </>
      )}

      <Text style={styles.detailLabel}>CONSENT SUMMARY</Text>
      <View style={styles.consentCard}>
        <ConsentRow label="Payee" value="JAGA (prototype)" />
        <ConsentRow
          label="Type"
          value={method === 'bank' ? 'DuitNow AutoDebit — recurring + ad-hoc collections' : 'Card-on-file recurring charge'}
        />
        <ConsentRow label="Frequency" value="Monthly, on your payout day" />
        <ConsentRow label="Monthly cap" value="RM300 — nothing above this can be pulled" />
        <ConsentRow label="Cancel" value="Revoke anytime in JAGA or with your bank/card issuer" />
      </View>

      <PrimaryButton
        label={
          method === 'bank'
            ? bank
              ? `Approve consent with ${bank.name}`
              : 'Choose a bank to continue'
            : cardReady
              ? 'Approve card consent'
              : 'Fill in the card details to continue'
        }
        onPress={() => {
          if (!canApprove) return;
          // mock consent reference — a real flow would round-trip PayNet / the card network here
          if (method === 'bank' && bankId) {
            onLink({ type: 'bank', bankId, ref: mockRef() });
          } else if (method === 'card') {
            // mask immediately: only the last four digits are kept
            onLink({ type: 'card', last4: cardDigits.slice(-4), holder: cardHolder.trim(), ref: mockRef() });
          }
        }}
        style={{ marginTop: spacing.lg, opacity: canApprove ? 1 : 0.4 }}
      />
      <Text style={styles.activeHint}>
        {method === 'bank'
          ? 'Prototype only — no real PayNet/FPX connection is made. In production this button would hand off to your bank to authorise the DuitNow AutoDebit consent.'
          : 'Prototype only — no real card network authorization occurs. The full card number is never stored.'}
      </Text>
    </ScrollView>
  );
}

function ConsentRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.consentRow}>
      <Text style={styles.consentLabel}>{label}</Text>
      <Text style={styles.consentValue}>{value}</Text>
    </View>
  );
}

// ── 10. Retirement calculator ────────────────────────────

export function CalculatorScreen({
  savedGoal,
  onSaveGoal,
  onBack,
}: {
  savedGoal: RetirementGoal | null;
  onSaveGoal: (g: RetirementGoal) => void;
  onBack: () => void;
}) {
  const [goalSaved, setGoalSaved] = useState(false);
  const [age, setAge] = useState('25');
  const [retireAge, setRetireAge] = useState('60');
  const [monthly, setMonthly] = useState('100');
  const [returnPct, setReturnPct] = useState('5');

  const a = parseInt(age, 10) || 0;
  const r = parseInt(retireAge, 10) || 0;
  const m = parseFloat(monthly) || 0;
  // Guard against absurd return rates; 30%/yr is already fantasy territory.
  const annual = Math.min(Math.max(parseFloat(returnPct) || 0, 0), 30);

  let invalidMsg: string | null = null;
  if (a > 0 && r > 0 && r <= a) {
    invalidMsg = 'Retirement age must be higher than your current age.';
  } else if (a > 100 || r > 100) {
    invalidMsg = 'Enter realistic ages (up to 100).';
  } else if (a > 0 && r > 0 && m <= 0) {
    invalidMsg = 'Enter a monthly amount above RM0.';
  }

  const months = Math.max(0, (r - a) * 12);
  const i = annual / 100 / 12;
  const futureValue = i > 0 ? m * ((Math.pow(1 + i, months) - 1) / i) : m * months;
  const contributed = m * months;
  const growth = futureValue - contributed;
  const valid = !invalidMsg && months > 0 && m > 0;
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
        <Text style={styles.calcResultBig}>{valid ? fmt(futureValue) : '—'}</Text>
        {valid && (
          <Text style={styles.calcResultSub}>
            {fmt(contributed)} saved by you + {fmt(growth)} growth
          </Text>
        )}
        {invalidMsg && <Text style={styles.calcInvalid}>{invalidMsg}</Text>}
      </View>

      {valid && (
        <PrimaryButton
          label={goalSaved ? '✓ Saved as your retirement goal' : 'Save this as my retirement goal'}
          variant={goalSaved ? 'ghost' : 'deep'}
          onPress={() => {
            onSaveGoal({ targetAmount: Math.round(futureValue), targetAge: r });
            setGoalSaved(true);
          }}
          style={{ marginTop: spacing.md }}
        />
      )}
      {savedGoal && !goalSaved && (
        <Text style={styles.activeHint}>
          Current goal: RM{savedGoal.targetAmount.toLocaleString('en-MY')} by age {savedGoal.targetAge}
        </Text>
      )}

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
  const [isMuslim, setIsMuslim] = useState<boolean | null>(null);
  const [consented, setConsented] = useState(false);
  const [showDoc, setShowDoc] = useState<null | 'privacy' | 'tos'>(null);
  const [tried, setTried] = useState(false);

  const missing: string[] = [];
  if (username.trim().length < 3) missing.push('Username — at least 3 characters');
  if (!email.includes('@')) missing.push('A valid email address');
  if (!viaGoogle && password.length < 6) missing.push('Password — at least 6 characters');
  if (fullName.trim().length < 2) missing.push('Full name');
  if (phone.replace(/\D/g, '').length < 9) missing.push('Phone number — at least 9 digits');
  if (!(parseInt(age, 10) >= 16)) missing.push('Age — must be 16 or older');
  if (isMuslim === null) missing.push('Are you Muslim? — tap Yes or No');
  if (!consented) missing.push('Agree to the Privacy Policy and Terms of Service');
  const canCreate = missing.length === 0;

  if (showDoc) {
    const Doc = showDoc === 'privacy' ? PrivacyPolicyScreen : TermsOfServiceScreen;
    return <Doc onBack={() => setShowDoc(null)} />;
  }

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

      <Text style={styles.detailLabel}>ARE YOU MUSLIM?</Text>
      <Text style={styles.faithAsk}>
        We ask this with respect — it lets JAGA show only Shariah-compliant products where relevant.
        You’ll still see everything else either way.
      </Text>
      <View style={styles.chipWrap}>
        {[
          { label: 'Yes, I’m Muslim', value: true },
          { label: 'No', value: false },
        ].map((o) => (
          <Pressable
            key={o.label}
            onPress={() => setIsMuslim(o.value)}
            style={[styles.chip, isMuslim === o.value && styles.chipOn]}
            accessibilityRole="button"
            accessibilityLabel={o.label}
          >
            <Text style={[styles.chipText, isMuslim === o.value && styles.chipTextOn]}>{o.label}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={() => setConsented((v) => !v)}
        style={styles.consentCheckRow}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: consented }}
        accessibilityLabel="Agree to the Privacy Policy and Terms of Service"
      >
        <Text style={[styles.consentCheckBox, consented && { color: colors.accent }]}>
          {consented ? '☑' : '☐'}
        </Text>
        <Text style={styles.consentCheckText}>
          I have read and agree to the{' '}
          <Text style={styles.consentLink} onPress={() => setShowDoc('privacy')}>
            Privacy Policy
          </Text>{' '}
          and{' '}
          <Text style={styles.consentLink} onPress={() => setShowDoc('tos')}>
            Terms of Service
          </Text>
          .
        </Text>
      </Pressable>

      <PrimaryButton
        label="Create account"
        onPress={() => {
          if (!canCreate || isMuslim === null) {
            setTried(true);
            return;
          }
          onCreate({
            username: username.trim(),
            email,
            fullName,
            phone,
            age,
            isMuslim,
            viaGoogle,
            ekycStatus: 'unverified',
            privacyConsentedAt: new Date().toISOString(),
          });
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
  introSlide: {
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  introSlideCentered: {
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
  },
  introSlidePoint: {
    marginTop: spacing.xl,
  },
  introSlideEmoji: {
    fontSize: 52,
    marginBottom: spacing.lg,
  },
  introStatBig: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.ink,
    lineHeight: 36,
  },
  introSource: {
    fontSize: 12,
    color: colors.faint,
    marginTop: spacing.md,
  },
  introBrandLine: {
    fontSize: 15,
    color: colors.muted,
    lineHeight: 22,
    marginTop: spacing.lg,
  },
  introDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  introDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  introDotOn: {
    backgroundColor: colors.accent,
    width: 20,
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
  calcInvalid: {
    fontSize: 13,
    color: '#FCD9A8',
    marginTop: spacing.xs,
    textAlign: 'center',
    lineHeight: 18,
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
  asOf: {
    fontSize: 12,
    color: colors.faint,
    marginTop: spacing.xs,
  },
  passwordNote: {
    fontSize: 12,
    color: colors.muted,
    marginTop: -spacing.xs,
    marginBottom: spacing.sm,
  },
  selfReportNote: {
    fontSize: 12,
    color: colors.muted,
    lineHeight: 16,
    marginBottom: spacing.sm,
  },
  savedRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'stretch',
    marginBottom: spacing.sm + 4,
  },
  setGoalPrompt: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.accent,
    marginTop: spacing.sm,
  },
  goalSummary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  goalSummaryLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: colors.muted,
    marginBottom: spacing.sm,
  },
  pinInput: {
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 12,
    fontWeight: '700',
  },
  disclosureBox: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    borderRadius: radius.sm,
    padding: spacing.md,
  },
  disclosureText: {
    fontSize: 13,
    color: colors.ink,
    lineHeight: 19,
  },
  consentCheckRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
    marginTop: spacing.lg,
  },
  consentCheckBox: {
    fontSize: 20,
    color: colors.faint,
    lineHeight: 24,
  },
  consentCheckText: {
    flex: 1,
    fontSize: 13,
    color: colors.ink,
    lineHeight: 19,
  },
  consentLink: {
    color: colors.accent,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  policyHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
  },
  policyBody: {
    fontSize: 14,
    color: colors.muted,
    lineHeight: 21,
    marginTop: spacing.xs,
  },
  loginError: {
    fontSize: 13,
    color: '#9A3412',
    marginTop: spacing.xs,
  },
  loginNewUser: {
    textAlign: 'center',
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
    marginTop: spacing.md,
  },

  // risk profiling
  riskChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    marginTop: spacing.md,
  },
  riskChipText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
  },
  riskRetake: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.accent,
  },
  riskQuestion: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: spacing.md,
    lineHeight: 25,
  },
  riskResultCard: {
    backgroundColor: colors.deep,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  riskResultEmoji: {
    fontSize: 44,
  },
  riskResultLabel: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.onDeep,
    marginTop: spacing.sm,
  },
  riskResultBlurb: {
    fontSize: 14,
    color: '#C7B299',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  quizDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  quizDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  quizDotOn: {
    backgroundColor: colors.accent,
  },

  // DuitNow AutoDebit consent
  consentRequiredBox: {
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  consentRequiredText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.ink,
    lineHeight: 18,
  },
  consentCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  consentRow: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  consentLabel: {
    width: 92,
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
  },
  consentValue: {
    flex: 1,
    fontSize: 13,
    color: colors.ink,
    lineHeight: 18,
  },
});
